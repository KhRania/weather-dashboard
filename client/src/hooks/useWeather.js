import { useCallback, useMemo, useState } from 'react'

export function useWeather() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (city) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const base = (process.env && process.env.REACT_APP_API_BASE_URL) ? process.env.REACT_APP_API_BASE_URL : '/api'
      const url = `${base.replace(/\/$/, '')}/weather?city=${encodeURIComponent(city)}`
      const res = await fetch(url)

      const contentType = res.headers.get('content-type') || ''

      if (!res.ok) {
        // Try to parse JSON error first; if not JSON, read text
        let message = `Request failed (${res.status})`
        if (contentType.includes('application/json')) {
          const payload = await res.json().catch(() => ({}))
          if (payload && payload.error) message = payload.error
        } else {
          const text = await res.text().catch(() => '')
          if (text) message = text.slice(0, 200)
        }
        throw new Error(message)
      }

      if (!contentType.includes('application/json')) {
        await res.text().catch(() => '')
        throw new Error('Unexpected response from server. Ensure client API base URL points to the backend.')
      }

      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  const state = useMemo(() => ({ data, loading, error }), [data, loading, error])
  return { ...state, fetchWeather }
}

export default useWeather


