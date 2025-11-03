import React from 'react'

export default function WeatherCard({ data, icon, gradient }) {
  if (!data) return null
  const { city, country, temperature, windspeed, humidity, condition } = data

  return (
    <div className="card" style={{ backgroundImage: gradient }}>
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: '0 0 4px' }}>{city}{country ? `, ${country}` : ''}</h2>
          <div className="muted" style={{ textTransform: 'capitalize' }}>{condition}</div>
        </div>
        <div style={{ fontSize: 48 }} aria-hidden> {icon} </div>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="label">Temperature</div>
          <div className="value">{Math.round(temperature)}°C</div>
        </div>
        <div className="metric">
          <div className="label">Wind</div>
          <div className="value">{Math.round(windspeed)} km/h</div>
        </div>
        <div className="metric">
          <div className="label">Humidity</div>
          <div className="value">{humidity != null ? `${Math.round(humidity)}%` : '—'}</div>
        </div>
      </div>
    </div>
  )
}


