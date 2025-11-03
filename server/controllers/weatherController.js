const GEOCODE_BASE_URL = process.env.GEOCODE_BASE_URL || 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = process.env.FORECAST_BASE_URL || 'https://api.open-meteo.com/v1/forecast';

async function fetchJson(url) {
  const response = await fetch(encodeURI(url));
  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`Request failed (${response.status}): ${text}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function mapWeatherCodeToCondition(code) {
  // Simple mapping per Open-Meteo weather codes
  // 0: Clear sky, 1-3: Mainly clear/partly cloudy/overcast, 45/48: Fog, 51-67: Drizzle/Rain, 71-77: Snow, 80-82: Rain showers, 95-99: Thunderstorm
  if (code === 0) return 'clear';
  if ([1, 2, 3].includes(code)) return 'clouds';
  if ([45, 48].includes(code)) return 'fog';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 95 && code <= 99) return 'thunder';
  return 'unknown';
}

exports.getWeatherByCity = async (req, res, next) => {
  try {
    const city = (req.query.city || '').trim();
    if (!city) {
      return res.status(400).json({ error: 'Missing required query parameter: city' });
    }

    // Geocode city name to coordinates
    const geocodeUrl = `${GEOCODE_BASE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geocode = await fetchJson(geocodeUrl);

    if (!geocode || !geocode.results || geocode.results.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const place = geocode.results[0];
    const { latitude, longitude, name, country } = place;

    // Fetch forecast with current_weather and hourly humidity to derive current humidity
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current_weather: 'true',
      hourly: 'relativehumidity_2m',
      timezone: 'auto'
    });
    const forecastUrl = `${FORECAST_BASE_URL}?${params.toString()}`;
    const forecast = await fetchJson(forecastUrl);

    if (!forecast || !forecast.current_weather) {
      return res.status(502).json({ error: 'Weather data unavailable' });
    }

    const { temperature, windspeed, weathercode, time } = forecast.current_weather;

    // Derive current humidity from hourly series at the timestamp equal to current_weather.time
    let humidity = null;
    if (forecast.hourly && Array.isArray(forecast.hourly.time) && Array.isArray(forecast.hourly.relativehumidity_2m)) {
      const idx = forecast.hourly.time.indexOf(time);
      if (idx !== -1) {
        humidity = forecast.hourly.relativehumidity_2m[idx];
      }
    }

    const condition = mapWeatherCodeToCondition(Number(weathercode));

    return res.json({
      city: name,
      country,
      latitude,
      longitude,
      temperature,
      windspeed,
      humidity,
      weathercode,
      condition,
      time
    });
  } catch (err) {
    // Normalize common error cases
    if (err.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    if (err.name === 'FetchError') {
      err.status = 502;
      err.message = 'Upstream service unavailable';
    }
    return next(err);
  }
};


