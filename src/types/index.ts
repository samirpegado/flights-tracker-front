import type { Database } from './database'

export type FlightTravel = Database['public']['Tables']['flights_travels']['Row']
export type FlightTravelInsert = Database['public']['Tables']['flights_travels']['Insert']
export type FlightResult = Database['public']['Tables']['flights_results']['Row']
export type FlightInsight = Database['public']['Tables']['flights_insights']['Row']
export type FlightSearchRun = Database['public']['Tables']['flights_search_runs']['Row']

export interface FlightLeg {
  airline: string
  flight_number: string
  departure_airport: string
  arrival_airport: string
  departure_datetime: string
  arrival_datetime: string
  duration_minutes: number
}

export interface FlightOption {
  price: number
  currency: string
  duration_minutes: number
  stops: number
  legs: FlightLeg[]
}

export interface SearchFlightsPayload {
  from: string
  to: string
  departDate: string
  returnDate?: string
  returnFrom?: string
  returnTo?: string
  cabinClass: 'ECONOMY' | 'BUSINESS' | 'FIRST'
  maxStops: 'ANY' | '0' | '1' | '2'
  returnMaxStops?: 'ANY' | '0' | '1' | '2'
  passengers: number
}

export interface TravelPolicy {
  outbound_max_duration_minutes?: number
  outbound_hard_max_duration_minutes?: number
  return_must_be_direct?: boolean
  preferred_airlines_return?: string[]
  avoid_self_transfer?: boolean
  avoid_airport_change?: boolean
  min_connection_minutes?: number
  duration_min_days?: number | null
  duration_max_days?: number | null
  passengers?: number
  score_style?: string
  notes?: string
}

export interface SearchFlightsResponse {
  outbound_flights: { date: string; flights: FlightOption[] }[]
  return_flights: { date: string; flights: FlightOption[] }[]
  search_params: SearchFlightsPayload
  total_results: number
}
