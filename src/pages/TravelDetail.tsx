import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Clock, Users, Plane } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { FlightTravel, FlightResult, SearchFlightsResponse, FlightOption } from '../types'
import FlightResultCard from '../components/FlightResultCard'
import SearchResultsModal from '../components/SearchResultsModal'

export default function TravelDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [travel, setTravel] = useState<FlightTravel | null>(null)
  const [results, setResults] = useState<FlightResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchData, setSearchData] = useState<SearchFlightsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!id) return
    const [{ data: t }, { data: r }] = await Promise.all([
      supabase.from('flights_travels').select('*').eq('id', id).single(),
      supabase.from('flights_results').select('*').eq('travel_id', id).order('searched_at', { ascending: false })
    ])
    setTravel(t)
    setResults(r ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  const handleSearch = async () => {
    if (!travel) return
    setSearching(true)
    try {
      const { data, error } = await supabase.functions.invoke('search-flights', {
        body: {
          from: travel.from,
          to: travel.to,
          departDate: travel.depart_date,
          returnDate: travel.return_date ?? undefined,
          cabinClass: travel.cabin_class ?? 'ECONOMY',
          maxStops: travel.max_stops ?? 'ANY',
          passengers: travel.passengers ?? 1,
        }
      })
      if (error) throw error
      setSearchData(data as SearchFlightsResponse)
    } catch (err) {
      alert('Erro ao buscar voos. Tente novamente.')
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const handleSaveResult = async (outbound: FlightOption, ret?: FlightOption) => {
    if (!travel || !id) return
    await supabase.from('flights_results').insert({
      travel_id: id,
      outbound_date: outbound.legs[0]?.departure_datetime?.split('T')[0] ?? travel.depart_date!,
      outbound_price: outbound.price,
      outbound_currency: outbound.currency,
      outbound_duration_minutes: outbound.duration_minutes,
      outbound_stops: outbound.stops,
      outbound_legs: outbound.legs as unknown as import('../types/database').Json,
      return_date: ret ? ret.legs[0]?.departure_datetime?.split('T')[0] ?? travel.return_date : null,
      return_price: ret?.price ?? null,
      return_currency: ret?.currency ?? null,
      return_duration_minutes: ret?.duration_minutes ?? null,
      return_stops: ret?.stops ?? null,
      return_legs: ret ? ret.legs as unknown as import('../types/database').Json : null,
    })
    setSearchData(null)
    fetchData()
  }

  const formatDate = (d: string | null) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '-'
  const formatDuration = (min: number) => `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}m` : ''}`

  if (loading) return <div className="loading">Carregando...</div>
  if (!travel) return <div className="loading">Viagem não encontrada.</div>

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/travels')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{travel.from} → {travel.to}</h1>
            <p className="subtitle">
              {formatDate(travel.depart_date)}
              {travel.return_date && ` · Volta ${formatDate(travel.return_date)}`}
            </p>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSearch} disabled={searching}>
          <Search size={16} />
          {searching ? 'Buscando...' : 'Pesquisar Voos'}
        </button>
      </header>

      <div className="travel-info-bar">
        <span><Plane size={14} /> {travel.cabin_class ?? 'ECONOMY'}</span>
        <span><Users size={14} /> {travel.passengers ?? 1} passageiro(s)</span>
        <span><Clock size={14} /> {travel.max_stops === 'ANY' ? 'Qualquer escala' : `Máx ${travel.max_stops} escala(s)`}</span>
      </div>

      <section className="results-section">
        <h2>Pesquisas Salvas ({results.length})</h2>
        {results.length === 0 ? (
          <div className="empty">Nenhuma pesquisa salva. Clique em "Pesquisar Voos" para buscar.</div>
        ) : (
          <div className="results-list">
            {results.map(r => (
              <FlightResultCard key={r.id} result={r} formatDuration={formatDuration} />
            ))}
          </div>
        )}
      </section>

      {searchData && (
        <SearchResultsModal
          data={searchData}
          onSave={handleSaveResult}
          onClose={() => setSearchData(null)}
          formatDuration={formatDuration}
        />
      )}
    </div>
  )
}
