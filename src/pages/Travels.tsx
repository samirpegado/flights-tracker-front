import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, LogOut, Plane } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { FlightTravel } from '../types'
import TravelModal from '../components/TravelModal'

export default function Travels() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [travels, setTravels] = useState<FlightTravel[]>([])
  const [filtered, setFiltered] = useState<FlightTravel[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTravel, setEditingTravel] = useState<FlightTravel | null>(null)

  const fetchTravels = useCallback(async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('flights_travels')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setTravels(data ?? [])
    setFiltered(data ?? [])
    setLoading(false)
  }, [user?.id])

  useEffect(() => { fetchTravels() }, [fetchTravels])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(travels.filter(t =>
      (t.from ?? '').toLowerCase().includes(q) ||
      (t.to ?? '').toLowerCase().includes(q)
    ))
  }, [search, travels])

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta viagem?')) return
    await supabase.from('flights_results').delete().eq('travel_id', id)
    await supabase.from('flights_travels').delete().eq('id', id)
    fetchTravels()
  }

  const handleEdit = (travel: FlightTravel) => {
    setEditingTravel(travel)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setEditingTravel(null)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTravel(null)
    fetchTravels()
  }

  const formatDate = (d: string | null) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '-'

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <Plane size={24} />
          <h1>Minhas Viagens</h1>
        </div>
        <div className="header-right">
          <button className="btn-icon" onClick={signOut} title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Pesquisar por origem ou destino..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={16} /> Nova Viagem
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">Nenhuma viagem encontrada.</div>
      ) : (
        <div className="travels-grid">
          {filtered.map(travel => (
            <div
              key={travel.id}
              className="travel-card"
              onClick={() => navigate(`/travels/${travel.id}`)}
            >
              <div className="travel-route">
                <span className="airport">{travel.from ?? '-'}</span>
                <Plane size={16} className="route-arrow" />
                <span className="airport">{travel.to ?? '-'}</span>
              </div>
              <div className="travel-dates">
                <span>{formatDate(travel.depart_date)}</span>
                {travel.return_date && <span> → {formatDate(travel.return_date)}</span>}
              </div>
              <div className="travel-meta">
                <span>{travel.cabin_class ?? 'ECONOMY'}</span>
                <span>{travel.passengers ?? 1} pax</span>
                <span>{travel.max_stops === 'ANY' ? 'Qualquer escala' : `Máx ${travel.max_stops} escala(s)`}</span>
              </div>
              <div className="travel-actions" onClick={e => e.stopPropagation()}>
                <button className="btn-icon" onClick={() => handleEdit(travel)} title="Editar">
                  <Pencil size={15} />
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(travel.id)} title="Excluir">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <TravelModal
          travel={editingTravel}
          userId={user!.id}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
