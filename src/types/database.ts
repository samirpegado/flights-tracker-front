export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          celular: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          profile_pic: string | null
          status: boolean | null
        }
        Insert: {
          celular?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          profile_pic?: string | null
          status?: boolean | null
        }
        Update: {
          celular?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          profile_pic?: string | null
          status?: boolean | null
        }
        Relationships: []
      }
      flights_travels: {
        Row: {
          cabin_class: string | null
          created_at: string
          depart_date: string | null
          from: string | null
          id: string
          max_stops: string | null
          passengers: number | null
          return_date: string | null
          to: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cabin_class?: string | null
          created_at?: string
          depart_date?: string | null
          from?: string | null
          id?: string
          max_stops?: string | null
          passengers?: number | null
          return_date?: string | null
          to?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cabin_class?: string | null
          created_at?: string
          depart_date?: string | null
          from?: string | null
          id?: string
          max_stops?: string | null
          passengers?: number | null
          return_date?: string | null
          to?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      flights_results: {
        Row: {
          id: string
          outbound_currency: string
          outbound_date: string
          outbound_duration_minutes: number
          outbound_legs: Json
          outbound_price: number
          outbound_stops: number
          return_currency: string | null
          return_date: string | null
          return_duration_minutes: number | null
          return_legs: Json | null
          return_price: number | null
          return_stops: number | null
          searched_at: string
          travel_id: string
        }
        Insert: {
          id?: string
          outbound_currency?: string
          outbound_date: string
          outbound_duration_minutes: number
          outbound_legs?: Json
          outbound_price: number
          outbound_stops: number
          return_currency?: string | null
          return_date?: string | null
          return_duration_minutes?: number | null
          return_legs?: Json | null
          return_price?: number | null
          return_stops?: number | null
          searched_at?: string
          travel_id: string
        }
        Update: {
          id?: string
          outbound_currency?: string
          outbound_date?: string
          outbound_duration_minutes?: number
          outbound_legs?: Json
          outbound_price?: number
          outbound_stops?: number
          return_currency?: string | null
          return_date?: string | null
          return_duration_minutes?: number | null
          return_legs?: Json | null
          return_price?: number | null
          return_stops?: number | null
          searched_at?: string
          travel_id?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
