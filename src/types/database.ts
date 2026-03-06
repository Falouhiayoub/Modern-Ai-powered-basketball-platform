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
      players: {
        Row: {
          id: string
          name: string
          position: string
          number: number
          photo: string | null
          height: string | null
          age: number | null
          weight: string | null
          bio: string | null
          nationality: string
          points_per_game: number
          rebounds_per_game: number
          assists_per_game: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          number: number
          photo?: string | null
          height?: string | null
          age?: number | null
          weight?: string | null
          bio?: string | null
          nationality?: string
          points_per_game?: number
          rebounds_per_game?: number
          assists_per_game?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          number?: number
          photo?: string | null
          height?: string | null
          age?: number | null
          weight?: string | null
          bio?: string | null
          nationality?: string
          points_per_game?: number
          rebounds_per_game?: number
          assists_per_game?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          date: string
          opponent: string
          location: string
          score_team: number
          score_opponent: number
          status: 'upcoming' | 'finished' | 'live' | 'cancelled'
          is_home: boolean
          stream_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          opponent: string
          location: string
          score_team?: number
          score_opponent?: number
          status?: 'upcoming' | 'finished' | 'live' | 'cancelled'
          is_home?: boolean
          stream_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          opponent?: string
          location?: string
          score_team?: number
          score_opponent?: number
          status?: 'upcoming' | 'finished' | 'live' | 'cancelled'
          is_home?: boolean
          stream_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          image: string | null
          author_id: string | null
          category: string
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          image?: string | null
          author_id?: string | null
          category?: string
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          image?: string | null
          author_id?: string | null
          category?: string
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      match_stats: {
        Row: {
          id: string
          match_id: string
          player_id: string
          points: number
          rebounds: number
          assists: number
          steals: number
          blocks: number
          minutes_played: number
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          player_id: string
          points?: number
          rebounds?: number
          assists?: number
          steals?: number
          blocks?: number
          minutes_played?: number
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          player_id?: string
          points?: number
          rebounds?: number
          assists?: number
          steals?: number
          blocks?: number
          minutes_played?: number
          created_at?: string
        }
      }
      fans: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          joined_at: string
          preferences: Json
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          joined_at?: string
          preferences?: Json
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          joined_at?: string
          preferences?: Json
        }
      }
      messages: {
        Row: {
          id: string
          sender_name: string
          sender_email: string
          subject: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_name: string
          sender_email: string
          subject?: string | null
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_name?: string
          sender_email?: string
          subject?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      tryouts: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          age: number
          height: string | null
          position: string | null
          experience: string | null
          status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          age: number
          height?: string | null
          position?: string | null
          experience?: string | null
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          age?: number
          height?: string | null
          position?: string | null
          experience?: string | null
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          created_at?: string
        }
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
  }
}
