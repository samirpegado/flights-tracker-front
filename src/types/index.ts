import type { Database } from './database'

export type FlightTravel = Database['public']['Tables']['flights_travels']['Row']
export type FlightTravelInsert = Database['public']['Tables']['flights_travels']['Insert']
export type FlightResult = Database['public']['Tables']['flights_results']['Row']

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
  cabinClass: 'ECONOMY' | 'BUSINESS' | 'FIRST'
  maxStops: 'ANY' | '0' | '1' | '2'
  passengers: number
}

export interface SearchFlightsResponse {
  outbound_flights: { date: string; flights: FlightOption[] }[]
  return_flights: { date: string; flights: FlightOption[] }[]
  search_params: SearchFlightsPayload
  total_results: number
}
