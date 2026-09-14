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

const emptyStops = 'ANY'

export default function TravelModal({ travel, userId, onClose }: Props) {
  const [form, setForm] = useState({
    title: travel?.title ?? '',
    from: travel?.from ?? '',
    to: travel?.to ?? '',
    return_from: travel?.return_from ?? '',
    return_to: travel?.return_to ?? '',
    depart_date: travel?.depart_date ?? '',
    return_date: travel?.return_date ?? '',
    window_start: travel?.window_start ?? '',
    window_end: travel?.window_end ?? '',
    duration_min_days: travel?.duration_min_days ?? 12,
    duration_max_days: travel?.duration_max_days ?? 15,
    cabin_class: travel?.cabin_class ?? 'ECONOMY',
    outbound_max_stops: travel?.outbound_max_stops ?? travel?.max_stops ?? emptyStops,
    return_max_stops: travel?.return_max_stops ?? emptyStops,
    passengers: travel?.passengers ?? 2,
    preferred_airlines: (travel?.preferred_airlines ?? []).join(', '),
    outbound_max_duration_minutes: travel?.outbound_max_duration_minutes ?? 1200,
    context_text: travel?.context_text ?? '',
    monitor_enabled: travel?.monitor_enabled ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string | number | boolean) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.from || !form.to) {
      setError('Origem e destino da ida são obrigatórios.')
      return
    }
    if (!form.depart_date && !form.window_start) {
      setError('Informe uma data de ida ou uma janela de datas.')
      return
    }
    setSaving(true)
    setError('')

    const airlines = form.preferred_airlines
      .split(',')
      .map(code => code.trim().toUpperCase())
      .filter(Boolean)

    const payload = {
      title: form.title || null,
      from: form.from.toUpperCase(),
      to: form.to.toUpperCase(),
      return_from: form.return_from ? form.return_from.toUpperCase() : null,
      return_to: form.return_to ? form.return_to.toUpperCase() : null,
      depart_date: form.depart_date || null,
      return_date: form.return_date || null,
      window_start: form.window_start || null,
      window_end: form.window_end || null,
      duration_min_days: Number(form.duration_min_days) || null,
      duration_max_days: Number(form.duration_max_days) || null,
      cabin_class: form.cabin_class,
      max_stops: form.outbound_max_stops,
      outbound_max_stops: form.outbound_max_stops,
      return_max_stops: form.return_max_stops,
      passengers: Number(form.passengers),
      preferred_airlines: airlines,
      outbound_max_duration_minutes: Number(form.outbound_max_duration_minutes) || null,
      context_text: form.context_text || null,
      monitor_enabled: form.monitor_enabled,
      user_id: userId,
      updated_at: new Date().toISOString(),
    }

    let travelId = travel?.id
    if (travel) {
      const { error: updateError } = await supabase
        .from('flights_travels')
        .update(payload)
        .eq('id', travel.id)
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error: insertError } = await supabase
        .from('flights_travels')
        .insert(payload)
        .select('id')
        .single()
      if (insertError || !data) {
        setError(insertError?.message ?? 'Erro ao salvar viagem.')
        setSaving(false)
        return
      }
      travelId = data.id
    }

    if (form.context_text && travelId) {
      const { data: extracted, error: policyError } = await supabase.functions.invoke(
        'extract-travel-policy',
        { body: { travel_id: travelId } },
      )
      if (policyError) {
        console.error(policyError)
      } else if (extracted?.policy) {
        await supabase
          .from('flights_travels')
          .update({ extracted_policy: extracted.policy })
          .eq('id', travelId)
      }
    }

    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-form-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{travel ? 'Editar Viagem' : 'Nova Viagem'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Ex: Europa março 2027"
            />
          </div>

          <p className="form-section">Ida</p>
          <div className="form-row">
            <AirportInput
              label="Origem da ida"
              value={form.from}
              onChange={iata => set('from', iata)}
              placeholder="Ex: NAT"
            />
            <AirportInput
              label="Destino da ida"
              value={form.to}
              onChange={iata => set('to', iata)}
              placeholder="Ex: GVA"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Escalas na ida</label>
              <select value={form.outbound_max_stops} onChange={e => set('outbound_max_stops', e.target.value)}>
                <option value="ANY">Qualquer</option>
                <option value="0">Direto</option>
                <option value="1">Máx 1</option>
                <option value="2">Máx 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duração máx. ida (min)</label>
              <input
                type="number"
                min={60}
                value={form.outbound_max_duration_minutes}
                onChange={e => set('outbound_max_duration_minutes', e.target.value)}
              />
            </div>
          </div>

          <p className="form-section">Volta (open-jaw, opcional)</p>
          <div className="form-row">
            <AirportInput
              label="Origem da volta"
              value={form.return_from}
              onChange={iata => set('return_from', iata)}
              placeholder="Ex: LIS"
            />
            <AirportInput
              label="Destino da volta"
              value={form.return_to}
              onChange={iata => set('return_to', iata)}
              placeholder="Ex: NAT"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Escalas na volta</label>
              <select value={form.return_max_stops} onChange={e => set('return_max_stops', e.target.value)}>
                <option value="ANY">Qualquer</option>
                <option value="0">Direto</option>
                <option value="1">Máx 1</option>
                <option value="2">Máx 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Companhias preferidas (volta)</label>
              <input
                type="text"
                value={form.preferred_airlines}
                onChange={e => set('preferred_airlines', e.target.value)}
                placeholder="Ex: TP"
              />
            </div>
          </div>

          <p className="form-section">Quando</p>
          <div className="form-row">
            <div className="form-group">
              <label>Início da janela</label>
              <input type="date" value={form.window_start} onChange={e => set('window_start', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fim da janela</label>
              <input type="date" value={form.window_end} onChange={e => set('window_end', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Dias mín.</label>
              <input type="number" min={1} value={form.duration_min_days} onChange={e => set('duration_min_days', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Dias máx.</label>
              <input type="number" min={1} value={form.duration_max_days} onChange={e => set('duration_max_days', e.target.value)} />
            </div>
          </div>
          <p className="form-hint">Datas exatas são opcionais se você preencher a janela.</p>
          <div className="form-row">
            <div className="form-group">
              <label>Data de ida (opcional)</label>
              <input type="date" value={form.depart_date} onChange={e => set('depart_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data de volta (opcional)</label>
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
              <label>Passageiros</label>
              <input type="number" min={1} max={9} value={form.passengers} onChange={e => set('passengers', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Contexto da viagem</label>
            <textarea
              rows={6}
              value={form.context_text}
              onChange={e => set('context_text', e.target.value)}
              placeholder="Cole aqui o contexto: preferências, TAP na volta, evitar self-transfer..."
            />
          </div>

          <label className="form-check">
            <input
              type="checkbox"
              checked={form.monitor_enabled}
              onChange={e => set('monitor_enabled', e.target.checked)}
            />
            Monitorar esta viagem todo dia
          </label>

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
