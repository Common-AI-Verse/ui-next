export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      last_session_dev: {
        Row: {
          created_at: string
          last_session: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          last_session: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          last_session?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      room_state_dev: {
        Row: {
          actual_state: string | null
          number_interactions: number | null
          state: string
        }
        Insert: {
          actual_state?: string | null
          number_interactions?: number | null
          state?: string
        }
        Update: {
          actual_state?: string | null
          number_interactions?: number | null
          state?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}