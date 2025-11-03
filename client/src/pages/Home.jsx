import React, { useMemo } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import Loader from '../components/Loader'
import { useWeather } from '../hooks/useWeather'
import { gradientForTemperature, iconForCondition } from '../utils/weatherUtils'

export default function Home() {
  const { data, loading, error, fetchWeather } = useWeather()

  const gradient = useMemo(() => gradientForTemperature(data?.temperature), [data])
  const icon = useMemo(() => iconForCondition(data?.condition), [data])

  return (
    <div className="app-container" style={{ backgroundImage: gradient }}>
      <div className="card" style={{ width: '100%', maxWidth: 640 }}>
        <h1 className="center" style={{ marginTop: 0 }}>Weather Dashboard</h1>
        <SearchBar onSearch={fetchWeather} disabled={loading} />

        {loading && <Loader />}
        {error && <div className="error" role="alert">{error}</div>}
        {!loading && !error && data && (
          <WeatherCard data={data} icon={icon} gradient={gradient} />
        )}

        {!loading && !error && !data && (
          <p className="center muted" style={{ marginBottom: 0 }}>Search a city to see current weather.</p>
        )}
      </div>
    </div>
  )
}


