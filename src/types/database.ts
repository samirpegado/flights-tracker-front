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
          context_text: string | null
          created_at: string
          depart_date: string | null
          duration_max_days: number | null
          duration_min_days: number | null
          extracted_policy: Json | null
          from: string | null
          id: string
          max_stops: string | null
          monitor_enabled: boolean
          outbound_max_duration_minutes: number | null
          outbound_max_stops: string | null
          passengers: number | null
          preferred_airlines: string[] | null
          return_date: string | null
          return_from: string | null
          return_max_stops: string | null
          return_to: string | null
          title: string | null
          to: string | null
          updated_at: string | null
          user_id: string | null
          window_end: string | null
          window_start: string | null
        }
        Insert: {
          cabin_class?: string | null
          context_text?: string | null
          created_at?: string
          depart_date?: string | null
          duration_max_days?: number | null
          duration_min_days?: number | null
          extracted_policy?: Json | null
          from?: string | null
          id?: string
          max_stops?: string | null
          monitor_enabled?: boolean
          outbound_max_duration_minutes?: number | null
          outbound_max_stops?: string | null
          passengers?: number | null
          preferred_airlines?: string[] | null
          return_date?: string | null
          return_from?: string | null
          return_max_stops?: string | null
          return_to?: string | null
          title?: string | null
          to?: string | null
          updated_at?: string | null
          user_id?: string | null
          window_end?: string | null
          window_start?: string | null
        }
        Update: {
          cabin_class?: string | null
          context_text?: string | null
          created_at?: string
          depart_date?: string | null
          duration_max_days?: number | null
          duration_min_days?: number | null
          extracted_policy?: Json | null
          from?: string | null
          id?: string
          max_stops?: string | null
          monitor_enabled?: boolean
          outbound_max_duration_minutes?: number | null
          outbound_max_stops?: string | null
          passengers?: number | null
          preferred_airlines?: string[] | null
          return_date?: string | null
          return_from?: string | null
          return_max_stops?: string | null
          return_to?: string | null
          title?: string | null
          to?: string | null
          updated_at?: string | null
          user_id?: string | null
          window_end?: string | null
          window_start?: string | null
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
          run_id: string | null
          score: number | null
          score_reasons: Json | null
          searched_at: string
          total_price: number | null
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
          run_id?: string | null
          score?: number | null
          score_reasons?: Json | null
          searched_at?: string
          total_price?: number | null
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
          run_id?: string | null
          score?: number | null
          score_reasons?: Json | null
          searched_at?: string
          total_price?: number | null
          travel_id?: string
        }
        Relationships: []
      }
      flights_search_runs: {
        Row: {
          best_score: number | null
          best_total_price: number | null
          combinations_found: number
          dates_scanned: number
          error: string | null
          id: string
          ran_at: string
          status: string
          travel_id: string
        }
        Insert: {
          best_score?: number | null
          best_total_price?: number | null
          combinations_found?: number
          dates_scanned?: number
          error?: string | null
          id?: string
          ran_at?: string
          status?: string
          travel_id: string
        }
        Update: {
          best_score?: number | null
          best_total_price?: number | null
          combinations_found?: number
          dates_scanned?: number
          error?: string | null
          id?: string
          ran_at?: string
          status?: string
          travel_id?: string
        }
        Relationships: []
      }
      flights_insights: {
        Row: {
          briefing: string
          created_at: string
          current_best_price: number | null
          id: string
          improved: boolean
          previous_best_price: number | null
          run_id: string | null
          travel_id: string
        }
        Insert: {
          briefing: string
          created_at?: string
          current_best_price?: number | null
          id?: string
          improved?: boolean
          previous_best_price?: number | null
          run_id?: string | null
          travel_id: string
        }
        Update: {
          briefing?: string
          created_at?: string
          current_best_price?: number | null
          id?: string
          improved?: boolean
          previous_best_price?: number | null
          run_id?: string | null
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
