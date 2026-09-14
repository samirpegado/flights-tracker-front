import { useState } from 'react'
import { X, Save, Clock, ArrowRight } from 'lucide-react'
import type { SearchFlightsResponse, FlightOption, FlightLeg } from '../types'
import { airportLabel } from '../lib/airportLabel'

interface Props {
  data: SearchFlightsResponse
  onSave: (outbound: FlightOption, ret?: FlightOption) => void
  onClose: () => void
  formatDuration: (min: number) => string
}

export default function SearchResultsModal({ data, onSave, onClose, formatDuration }: Props) {
  const [selectedOut, setSelectedOut] = useState<FlightOption | null>(null)
  const [selectedRet, setSelectedRet] = useState<FlightOption | null>(null)

  const outFlights = data.outbound_flights.flatMap(d => d.flights).filter(f => f.price > 0 && f.currency)
  const retFlights = data.return_flights.flatMap(d => d.flights).filter(f => f.price > 0 && f.currency)

  const formatDT = (dt: string) => new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

  const FlightCard = ({ flight, selected, onSelect }: { flight: FlightOption; selected: boolean; onSelect: () => void }) => (
    <div className={`search-flight-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="sfc-header">
        <span className="sfc-price">
          {flight.price.toLocaleString('pt-BR', { style: 'currency', currency: flight.currency ?? 'BRL' })}
        </span>
        <span className="sfc-meta">
          <Clock size={12} /> {formatDuration(flight.duration_minutes)} · {flight.stops} escala(s)
        </span>
      </div>
      {(flight.legs as FlightLeg[]).map((leg, i) => (
        <div key={i} className="sfc-leg">
          <span className="leg-airline">{leg.airline} {leg.flight_number}</span>
          <div className="leg-route">
            <span>{airportLabel(leg.departure_airport)}</span>
            <ArrowRight size={11} />
            <span>{airportLabel(leg.arrival_airport)}</span>
          </div>
          <span className="leg-time">{formatDT(leg.departure_datetime)} → {formatDT(leg.arrival_datetime)}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Resultados da Pesquisa ({data.total_results} voos)</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="search-results-body">
          <div className="search-col">
            <h3>Voos de Ida</h3>
            {outFlights.length === 0 ? (
              <p className="empty">Nenhum voo de ida encontrado.</p>
            ) : outFlights.map((f, i) => (
              <FlightCard
                key={i}
                flight={f}
                selected={selectedOut === f}
                onSelect={() => setSelectedOut(selectedOut === f ? null : f)}
              />
            ))}
          </div>

          {retFlights.length > 0 && (
            <div className="search-col">
              <h3>Voos de Volta</h3>
              {retFlights.map((f, i) => (
                <FlightCard
                  key={i}
                  flight={f}
                  selected={selectedRet === f}
                  onSelect={() => setSelectedRet(selectedRet === f ? null : f)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Fechar</button>
          <button
            className="btn-primary"
            disabled={!selectedOut}
            onClick={() => selectedOut && onSave(selectedOut, selectedRet ?? undefined)}
          >
            <Save size={15} /> Salvar Seleção
          </button>
        </div>
      </div>
    </div>
  )
}
