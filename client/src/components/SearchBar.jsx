import React, { useState } from 'react'

export default function SearchBar({ onSearch, disabled }) {
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const q = value.trim()
    if (q) onSearch(q)
  }

  return (
    <form onSubmit={submit} className="row" style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Enter city (e.g., London)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        aria-label="City name"
      />
      <button type="submit" disabled={disabled}>Search</button>
    </form>
  )
}


