import { useState } from 'react'
import { Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { FlightResult, FlightLeg } from '../types'

interface Props {
  result: FlightResult
  formatDuration: (min: number) => string
}

function FlightSection({
  label,
  date,
  price,
  currency,
  duration,
  stops,
  legs,
  formatDuration,
}: {
  label: string
  date: string
  price: number
  currency: string
  duration: number
  stops: number
  legs: FlightLeg[]
  formatDuration: (min: number) => string
}) {
  const [open, setOpen] = useState(false)
  const formatDT = (dt: string) =>
    new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')

  return (
    <div className="flight-section">
      <button className="flight-section-toggle" onClick={() => setOpen(o => !o)}>
        <div className="flight-section-left">
          <span className="result-label">{label} · {formatDate(date)}</span>
          <span className="result-meta-inline">
            <Clock size={12} /> {formatDuration(duration)} · {stops} escala(s)
          </span>
        </div>
        <div className="flight-section-right">
          <span className="result-price">
            {price.toLocaleString('pt-BR', { style: 'currency', currency })}
          </span>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {open && (
        <div className="legs">
          {legs.map((leg, i) => (
            <div key={i} className="leg">
              <span className="leg-airline">{leg.airline} {leg.flight_number}</span>
              <div className="leg-route">
                <span>{leg.departure_airport.split(' ')[0]}</span>
                <ArrowRight size={12} />
                <span>{leg.arrival_airport.split(' ')[0]}</span>
              </div>
              <span className="leg-time">
                {formatDT(leg.departure_datetime)} → {formatDT(leg.arrival_datetime)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FlightResultCard({ result, formatDuration }: Props) {
  const outLegs = result.outbound_legs as unknown as FlightLeg[]
  const retLegs = result.return_legs as unknown as FlightLeg[] | null

  const totalPrice = (result.outbound_price ?? 0) + (result.return_price ?? 0)
  const currency = result.outbound_currency ?? 'BRL'

  return (
    <div className="result-card">
      <div className="result-card-header">
        <span className="result-searched">
          Pesquisado em {new Date(result.searched_at).toLocaleString('pt-BR')}
        </span>
        <span className="result-total">
          Total: {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency })}
        </span>
      </div>

      <FlightSection
        label="Ida"
        date={result.outbound_date}
        price={result.outbound_price}
        currency={result.outbound_currency}
        duration={result.outbound_duration_minutes}
        stops={result.outbound_stops}
        legs={outLegs}
        formatDuration={formatDuration}
      />

      {retLegs && result.return_date && (
        <FlightSection
          label="Volta"
          date={result.return_date}
          price={result.return_price ?? 0}
          currency={result.return_currency ?? 'BRL'}
          duration={result.return_duration_minutes ?? 0}
          stops={result.return_stops ?? 0}
          legs={retLegs}
          formatDuration={formatDuration}
        />
      )}
    </div>
  )
}
