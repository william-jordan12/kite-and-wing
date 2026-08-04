import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ onSearch }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    navigate(`/search?q=${encodeURIComponent(term)}`)
    setQ('')
    onSearch?.()
  }

  return (
    <form className="search-form" role="search" onSubmit={submit}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        autoComplete="off"
      />
      <button type="submit" aria-label="Search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      </button>
    </form>
  )
}
