import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { FlightTravel } from '../types'
import AirportInput from './AirportInput'

interface Props {
  travel: FlightTravel | null
  userId: string
  onClose: () => void
}

export default function TravelModal({ travel, userId, onClose }: Props) {
  const [form, setForm] = useState({
    from: travel?.from ?? '',
    to: travel?.to ?? '',
    depart_date: travel?.depart_date ?? '',
    return_date: travel?.return_date ?? '',
    cabin_class: travel?.cabin_class ?? 'ECONOMY',
    max_stops: travel?.max_stops ?? 'ANY',
    passengers: travel?.passengers ?? 1,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.from || !form.to || !form.depart_date) {
      setError('Origem, destino e data de ida são obrigatórios.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      from: form.from.toUpperCase(),
      to: form.to.toUpperCase(),
      depart_date: form.depart_date,
      return_date: form.return_date || null,
      cabin_class: form.cabin_class,
      max_stops: form.max_stops,
      passengers: Number(form.passengers),
      user_id: userId,
      updated_at: new Date().toISOString(),
    }
    if (travel) {
      await supabase.from('flights_travels').update(payload).eq('id', travel.id)
    } else {
      await supabase.from('flights_travels').insert(payload)
    }
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{travel ? 'Editar Viagem' : 'Nova Viagem'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <AirportInput
              label="Origem"
              value={form.from ? `${form.from}` : ''}
              onChange={iata => set('from', iata)}
              placeholder="Ex: NAT, Natal..."
            />
            <AirportInput
              label="Destino"
              value={form.to ? `${form.to}` : ''}
              onChange={iata => set('to', iata)}
              placeholder="Ex: GRU, São Paulo..."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Ida</label>
              <input type="date" value={form.depart_date} onChange={e => set('depart_date', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Data de Volta</label>
              <input type="date" value={form.return_date} onChange={e => set('return_date', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Classe</label>
              <select value={form.cabin_class} onChange={e => set('cabin_class', e.target.value)}>
                <option value="ECONOMY">Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>
            </div>
            <div className="form-group">
              <label>Escalas</label>
              <select value={form.max_stops} onChange={e => set('max_stops', e.target.value)}>
                <option value="ANY">Qualquer</option>
                <option value="0">Direto</option>
                <option value="1">Máx 1</option>
                <option value="2">Máx 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Passageiros</label>
              <input type="number" min={1} max={9} value={form.passengers} onChange={e => set('passengers', e.target.value)} />
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
