import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Clock, Users, Plane, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { FlightTravel, FlightResult, FlightInsight, SearchFlightsResponse, FlightOption, TravelPolicy } from '../types'
import FlightResultCard from '../components/FlightResultCard'
import SearchResultsModal from '../components/SearchResultsModal'

export default function TravelDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [travel, setTravel] = useState<FlightTravel | null>(null)
  const [results, setResults] = useState<FlightResult[]>([])
  const [insight, setInsight] = useState<FlightInsight | null>(null)
  const [searching, setSearching] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [searchData, setSearchData] = useState<SearchFlightsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!id) return
    const [{ data: t }, { data: r }, { data: insights }] = await Promise.all([
      supabase.from('flights_travels').select('*').eq('id', id).single(),
      supabase.from('flights_results').select('*').eq('travel_id', id).order('searched_at', { ascending: false }),
      supabase.from('flights_insights').select('*').eq('travel_id', id).order('created_at', { ascending: false }).limit(1),
    ])
    setTravel(t)
    setResults(r ?? [])
    setInsight(insights?.[0] ?? null)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  const handleSearch = async () => {
    if (!travel?.from || !travel.to || !travel.depart_date) {
      alert('Para busca manual, cadastre origem, destino e data de ida.')
      return
    }
    setSearching(true)
    try {
      const { data, error } = await supabase.functions.invoke('search-flights', {
        body: {
          from: travel.from,
          to: travel.to,
          departDate: travel.depart_date,
          returnDate: travel.return_date ?? undefined,
          returnFrom: travel.return_from ?? undefined,
          returnTo: travel.return_to ?? undefined,
          cabinClass: travel.cabin_class ?? 'ECONOMY',
          maxStops: travel.outbound_max_stops ?? travel.max_stops ?? 'ANY',
          returnMaxStops: travel.return_max_stops ?? undefined,
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

  const handleScan = async () => {
    if (!id) return
    setScanning(true)
    try {
      const { data, error } = await supabase.functions.invoke('scan-travel', {
        body: { travel_id: id },
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      await fetchData()
    } catch (err) {
      alert('Erro ao rodar o agente. Confira se a API e a chave do Gemini estão configuradas.')
      console.error(err)
    } finally {
      setScanning(false)
    }
  }

  const handleSaveResult = async (outbound: FlightOption, ret?: FlightOption) => {
    if (!travel || !id) return
    const total = outbound.price + (ret?.price ?? 0)
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
      total_price: total,
    })
    setSearchData(null)
    fetchData()
  }

  const formatDate = (d: string | null) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '-'
  const formatDuration = (min: number) => `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}m` : ''}`
  const policy = (travel?.extracted_policy ?? null) as TravelPolicy | null
  const isOpenJaw = Boolean(travel?.return_from || travel?.return_to)

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
            <h1>
              {travel.from} → {travel.to}
              {isOpenJaw && ` · ${travel.return_from ?? travel.to} → ${travel.return_to ?? travel.from}`}
            </h1>
            <p className="subtitle">
              {travel.title ? `${travel.title} · ` : ''}
              {travel.window_start
                ? `${formatDate(travel.window_start)} – ${formatDate(travel.window_end)}`
                : formatDate(travel.depart_date)}
              {travel.duration_min_days && ` · ${travel.duration_min_days}–${travel.duration_max_days} dias`}
            </p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-secondary" onClick={handleSearch} disabled={searching || !travel.depart_date}>
            <Search size={16} />
            {searching ? 'Buscando...' : 'Busca manual'}
          </button>
          <button className="btn-primary" onClick={handleScan} disabled={scanning}>
            <Sparkles size={16} />
            {scanning ? 'Analisando...' : 'Rodar agente'}
          </button>
        </div>
      </header>

      <div className="travel-info-bar">
        <span><Plane size={14} /> {travel.cabin_class ?? 'ECONOMY'}</span>
        <span><Users size={14} /> {travel.passengers ?? 1} passageiro(s)</span>
        <span><Clock size={14} /> Ida: {travel.outbound_max_stops === 'ANY' || !travel.outbound_max_stops ? 'qualquer escala' : `máx ${travel.outbound_max_stops}`}</span>
        {isOpenJaw && (
          <span>Volta: {travel.return_max_stops === '0' ? 'direto' : (travel.return_max_stops ?? 'qualquer')}</span>
        )}
      </div>

      {insight && (
        <section className="insight-card">
          <h2>Briefing do agente</h2>
          <p className="insight-meta">
            {new Date(insight.created_at).toLocaleString('pt-BR')}
            {insight.improved && <span className="insight-badge">Melhorou</span>}
            {insight.current_best_price != null && (
              <span> · Melhor hoje: {Number(insight.current_best_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            )}
          </p>
          <p className="insight-text">{insight.briefing}</p>
        </section>
      )}

      {policy?.notes && (
        <section className="policy-card">
          <h2>Regras extraídas</h2>
          <p>{policy.notes}</p>
        </section>
      )}

      <section className="results-section">
        <h2>Pesquisas salvas ({results.length})</h2>
        {results.length === 0 ? (
          <div className="empty">Nenhuma pesquisa salva. Use "Rodar agente" para varrer a janela ou "Busca manual" se tiver data exata.</div>
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
