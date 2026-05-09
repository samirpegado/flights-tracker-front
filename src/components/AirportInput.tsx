import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Airport {
  iata_code: string
  name: string
  iso_country: string
  type: string
}

interface Props {
  label: string
  value: string
  onChange: (iata: string) => void
  placeholder?: string
}

export default function AirportInput({ label, value, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<Airport[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync external value reset (e.g. form reset)
  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current)
    if (query.length < 2) { setResults([]); setOpen(false); return }

    debounce.current = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase.rpc('search_airports', { q: query })
      setResults((data as Airport[]) ?? [])
      setOpen(true)
      setLoading(false)
    }, 250)

    return () => { if (debounce.current) clearTimeout(debounce.current) }
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (airport: Airport) => {
    onChange(airport.iata_code)
    setQuery(`${airport.iata_code} — ${airport.name}`)
    setOpen(false)
    setResults([])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (!e.target.value) onChange('')
  }

  return (
    <div className="form-group airport-input-wrap" ref={containerRef}>
      <label>{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder ?? 'Digite o aeroporto ou código IATA'}
        autoComplete="off"
      />
      {loading && <span className="airport-loading">...</span>}
      {open && results.length > 0 && (
        <ul className="airport-dropdown">
          {results.map(a => (
            <li key={a.iata_code} onMouseDown={() => select(a)}>
              <span className="airport-iata">{a.iata_code}</span>
              <span className="airport-name">{a.name}</span>
              <span className="airport-country">{a.iso_country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
