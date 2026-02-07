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
      bottle_delivery_queue: {
        Row: {
          id: string
          sent_bottle_id: string
          sender_id: string
          recipient_id: string
          scheduled_delivery_at: string
          delivered: boolean | null
          delivered_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          sent_bottle_id: string
          sender_id: string
          recipient_id: string
          scheduled_delivery_at: string
          delivered?: boolean | null
          delivered_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          sent_bottle_id?: string
          sender_id?: string
          recipient_id?: string
          scheduled_delivery_at?: string
          delivered?: boolean | null
          delivered_at?: string | null
          created_at?: string | null
        }
      }
      company_settings: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          title: string | null
          exchanges_count: number | null
          feeling_percent: number | null
          unlock_state: number | null
          last_sender_id: string | null
          created_at: string | null
          updated_at: string | null
          is_anonymous_elite: boolean | null
          fantasy_id: string | null
          mask_a: string | null
          mask_b: string | null
          last_message: string | null
          last_message_time: string | null
          unlocked_milestones: Json | null
          naughty_question_id: number | null
          user1_naughty_answer: string | null
          user2_naughty_answer: string | null
          photo_revealed_by_user1: boolean | null
          photo_revealed_by_user2: boolean | null
          user_a_seen_milestones: number[] | null
          user_b_seen_milestones: number[] | null
        }
        Insert: {
          id?: string
          user_a_id: string
          user_b_id: string
          title?: string | null
          exchanges_count?: number | null
          feeling_percent?: number | null
          unlock_state?: number | null
          last_sender_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_anonymous_elite?: boolean | null
          fantasy_id?: string | null
          mask_a?: string | null
          mask_b?: string | null
          last_message?: string | null
          last_message_time?: string | null
          unlocked_milestones?: Json | null
          naughty_question_id?: number | null
          user1_naughty_answer?: string | null
          user2_naughty_answer?: string | null
          photo_revealed_by_user1?: boolean | null
          photo_revealed_by_user2?: boolean | null
          user_a_seen_milestones?: number[] | null
          user_b_seen_milestones?: number[] | null
        }
        Update: {
          id?: string
          user_a_id?: string
          user_b_id?: string
          title?: string | null
          exchanges_count?: number | null
          feeling_percent?: number | null
          unlock_state?: number | null
          last_sender_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_anonymous_elite?: boolean | null
          fantasy_id?: string | null
          mask_a?: string | null
          mask_b?: string | null
          last_message?: string | null
          last_message_time?: string | null
          unlocked_milestones?: Json | null
          naughty_question_id?: number | null
          user1_naughty_answer?: string | null
          user2_naughty_answer?: string | null
          photo_revealed_by_user1?: boolean | null
          photo_revealed_by_user2?: boolean | null
          user_a_seen_milestones?: number[] | null
          user_b_seen_milestones?: number[] | null
        }
      }
      fantasies: {
        Row: {
          id: string
          user_id: string
          text: string
          is_active: boolean | null
          created_at: string | null
          is_anonymous_submission: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          is_active?: boolean | null
          created_at?: string | null
          is_anonymous_submission?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          is_active?: boolean | null
          created_at?: string | null
          is_anonymous_submission?: boolean | null
        }
      }
      fantasy_reports: {
        Row: {
          id: string
          fantasy_id: string
          reporter_id: string
          reason: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          fantasy_id: string
          reporter_id: string
          reason?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          fantasy_id?: string
          reporter_id?: string
          reason?: string | null
          created_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          type: string | null
          text: string | null
          media_url: string | null
          qa_group_id: string | null
          is_question: boolean | null
          is_answer: boolean | null
          feeling_delta: number | null
          created_at: string | null
          duration: number | null
          is_read: boolean | null
          mood: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          type?: string | null
          text?: string | null
          media_url?: string | null
          qa_group_id?: string | null
          is_question?: boolean | null
          is_answer?: boolean | null
          feeling_delta?: number | null
          created_at?: string | null
          duration?: number | null
          is_read?: boolean | null
          mood?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          type?: string | null
          text?: string | null
          media_url?: string | null
          qa_group_id?: string | null
          is_question?: boolean | null
          is_answer?: boolean | null
          feeling_delta?: number | null
          created_at?: string | null
          duration?: number | null
          is_read?: boolean | null
          mood?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          age: number | null
          city: string | null
          about: string | null
          sexual_orientation: string[] | null
          show_orientation: boolean | null
          expectation: string | null
          interested_in: string | null
          interests: string[] | null
          avatar_url: string | null
          language: string | null
          created_at: string | null
          updated_at: string | null
          last_active: string | null
          bottles_received_today: number | null
          bottles_sent_today: number | null
          total_bottles_received: number | null
          total_bottles_sent: number | null
          is_active: boolean | null
          receive_bottles: boolean | null
          tier: 'free' | 'premium' | 'elite' | null
          gender: 'male' | 'female' | 'nonbinary' | 'other' | null
          birth_year: number | null
          lat: number | null
          lng: number | null
          secret_desire: string | null
          secret_audio_url: string | null
          is_premium: boolean | null
          is_verified: boolean | null
          role: 'admin' | 'manager' | 'inspector' | 'client'
          messages_sent_week: number | null
          last_message_sent_week_start: string | null
          last_bottle_sent_date: string | null
          department: string | null
          secret_quote: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          age?: number | null
          city?: string | null
          about?: string | null
          sexual_orientation?: string[] | null
          show_orientation?: boolean | null
          expectation?: string | null
          interested_in?: string | null
          interests?: string[] | null
          avatar_url?: string | null
          language?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_active?: string | null
          bottles_received_today?: number | null
          bottles_sent_today?: number | null
          total_bottles_received?: number | null
          total_bottles_sent?: number | null
          is_active?: boolean | null
          receive_bottles?: boolean | null
          tier?: 'free' | 'premium' | 'elite' | null
          gender?: 'male' | 'female' | 'nonbinary' | 'other' | null
          birth_year?: number | null
          lat?: number | null
          lng?: number | null
          secret_desire?: string | null
          secret_audio_url?: string | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          role?: 'admin' | 'manager' | 'inspector' | 'client'
          messages_sent_week?: number | null
          last_message_sent_week_start?: string | null
          last_bottle_sent_date?: string | null
          department?: string | null
          secret_quote?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          age?: number | null
          city?: string | null
          about?: string | null
          sexual_orientation?: string[] | null
          show_orientation?: boolean | null
          expectation?: string | null
          interested_in?: string | null
          interests?: string[] | null
          avatar_url?: string | null
          language?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_active?: string | null
          bottles_received_today?: number | null
          bottles_sent_today?: number | null
          total_bottles_received?: number | null
          total_bottles_sent?: number | null
          is_active?: boolean | null
          receive_bottles?: boolean | null
          tier?: 'free' | 'premium' | 'elite' | null
          gender?: 'male' | 'female' | 'nonbinary' | 'other' | null
          birth_year?: number | null
          lat?: number | null
          lng?: number | null
          secret_desire?: string | null
          secret_audio_url?: string | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          role?: 'admin' | 'manager' | 'inspector' | 'client'
          messages_sent_week?: number | null
          last_message_sent_week_start?: string | null
          last_bottle_sent_date?: string | null
          department?: string | null
          secret_quote?: string | null
        }
      }
      sent_bottles: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string | null
          content_type: 'text' | 'voice' | 'photo'
          message: string | null
          audio_url: string | null
          photo_url: string | null
          caption: string | null
          mood: string | null
          is_delivered: boolean | null
          has_reply: boolean | null
          created_at: string | null
          updated_at: string | null
          matched_recipient_id: string | null
          match_score: number | null
          status: 'pending' | 'floating' | 'matched' | 'delivered' | 'read' | null
          delivered_at: string | null
          read_at: string | null
          target_min_age: number | null
          target_max_age: number | null
          target_gender: string[] | null
          target_distance_km: number | null
          target_departments: string[] | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id?: string | null
          content_type: 'text' | 'voice' | 'photo'
          message?: string | null
          audio_url?: string | null
          photo_url?: string | null
          caption?: string | null
          mood?: string | null
          is_delivered?: boolean | null
          has_reply?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          matched_recipient_id?: string | null
          match_score?: number | null
          status?: 'pending' | 'floating' | 'matched' | 'delivered' | 'read' | null
          delivered_at?: string | null
          read_at?: string | null
          target_min_age?: number | null
          target_max_age?: number | null
          target_gender?: string[] | null
          target_distance_km?: number | null
          target_departments?: string[] | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string | null
          content_type?: 'text' | 'voice' | 'photo'
          message?: string | null
          audio_url?: string | null
          photo_url?: string | null
          caption?: string | null
          mood?: string | null
          is_delivered?: boolean | null
          has_reply?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          matched_recipient_id?: string | null
          match_score?: number | null
          status?: 'pending' | 'floating' | 'matched' | 'delivered' | 'read' | null
          delivered_at?: string | null
          read_at?: string | null
          target_min_age?: number | null
          target_max_age?: number | null
          target_gender?: string[] | null
          target_distance_km?: number | null
          target_departments?: string[] | null
        }
      }
      received_bottles: {
        Row: {
          id: string
          receiver_id: string
          sender_id: string | null
          content_type: 'text' | 'voice' | 'photo'
          message: string | null
          audio_url: string | null
          photo_url: string | null
          caption: string | null
          mood: string | null
          is_read: boolean | null
          is_replied: boolean | null
          created_at: string | null
          updated_at: string | null
          match_score: number | null
          matched_at: string | null
          sent_bottle_id: string | null
        }
        Insert: {
          id?: string
          receiver_id: string
          sender_id?: string | null
          content_type: 'text' | 'voice' | 'photo'
          message?: string | null
          audio_url?: string | null
          photo_url?: string | null
          caption?: string | null
          mood?: string | null
          is_read?: boolean | null
          is_replied?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          match_score?: number | null
          matched_at?: string | null
          sent_bottle_id?: string | null
        }
        Update: {
          id?: string
          receiver_id?: string
          sender_id?: string | null
          content_type?: 'text' | 'voice' | 'photo'
          message?: string | null
          audio_url?: string | null
          photo_url?: string | null
          caption?: string | null
          mood?: string | null
          is_read?: boolean | null
          is_replied?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          match_score?: number | null
          matched_at?: string | null
          sent_bottle_id?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
