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
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'founder' | 'talent'
          status: 'active' | 'pending' | 'suspended'
          avatar_url: string | null
          company: string | null
          phone: string | null
          address: string | null
          wallet_balance: number
          bio: string | null
          portfolio: Json
          rate_level: number
          skills: Json
          social_media: Json
          total_earnings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'founder' | 'talent'
          status?: 'active' | 'pending' | 'suspended'
          avatar_url?: string | null
          company?: string | null
          phone?: string | null
          address?: string | null
          wallet_balance?: number
          bio?: string | null
          portfolio?: Json
          rate_level?: number
          skills?: Json
          social_media?: Json
          total_earnings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'founder' | 'talent'
          status?: 'active' | 'pending' | 'suspended'
          avatar_url?: string | null
          company?: string | null
          phone?: string | null
          address?: string | null
          wallet_balance?: number
          bio?: string | null
          portfolio?: Json
          rate_level?: number
          skills?: Json
          social_media?: Json
          total_earnings?: number
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          founder_id: string
          title: string
          description: string
          product_name: string
          category: string
          duration: '30sec' | '1min' | '3min'
          product_images: Json
          rate_level: number
          media_type: 'image' | 'video' | 'both'
          budget: number
          price: number
          status: 'draft' | 'active' | 'paused' | 'completed' | 'rejected'
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          founder_id: string
          title: string
          description: string
          product_name: string
          category: string
          duration: '30sec' | '1min' | '3min'
          product_images?: Json
          rate_level: number
          media_type: 'image' | 'video' | 'both'
          budget?: number
          price: number
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'rejected'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          founder_id?: string
          title?: string
          description?: string
          product_name?: string
          category?: string
          duration?: '30sec' | '1min' | '3min'
          product_images?: Json
          rate_level?: number
          media_type?: 'image' | 'video' | 'both'
          budget?: number
          price?: number
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'rejected'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_applications: {
        Row: {
          id: string
          campaign_id: string
          talent_id: string
          status: string
          applied_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          talent_id: string
          status?: string
          applied_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          talent_id?: string
          status?: string
          applied_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          campaign_id: string
          talent_id: string
          founder_id: string
          status: 'pending_shipment' | 'shipped' | 'delivered' | 'review_submitted' | 'completed'
          payout: number
          delivery_address: string | null
          tracking_number: string | null
          courier: string | null
          review_media_url: string | null
          review_media_type: 'image' | 'video' | 'both' | null
          review_submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          talent_id: string
          founder_id: string
          status?: 'pending_shipment' | 'shipped' | 'delivered' | 'review_submitted' | 'completed'
          payout: number
          delivery_address?: string | null
          tracking_number?: string | null
          courier?: string | null
          review_media_url?: string | null
          review_media_type?: 'image' | 'video' | 'both' | null
          review_submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          talent_id?: string
          founder_id?: string
          status?: 'pending_shipment' | 'shipped' | 'delivered' | 'review_submitted' | 'completed'
          payout?: number
          delivery_address?: string | null
          tracking_number?: string | null
          courier?: string | null
          review_media_url?: string | null
          review_media_type?: 'image' | 'video' | 'both' | null
          review_submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'credit' | 'debit'
          amount: number
          description: string
          related_order_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'credit' | 'debit'
          amount: number
          description: string
          related_order_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'credit' | 'debit'
          amount?: number
          description?: string
          related_order_id?: string | null
          created_at?: string
        }
      }
      earnings: {
        Row: {
          id: string
          talent_id: string
          order_id: string
          campaign_title: string
          amount: number
          status: 'pending' | 'paid' | 'cancelled'
          earned_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          talent_id: string
          order_id: string
          campaign_title: string
          amount: number
          status?: 'pending' | 'paid' | 'cancelled'
          earned_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          talent_id?: string
          order_id?: string
          campaign_title?: string
          amount?: number
          status?: 'pending' | 'paid' | 'cancelled'
          earned_at?: string
          paid_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          order_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_campaign_price: {
        Args: {
          rate_level: number
          duration: '30sec' | '1min' | '3min'
        }
        Returns: number
      }
    }
    Enums: {
      user_role: 'admin' | 'founder' | 'talent'
      user_status: 'active' | 'pending' | 'suspended'
      campaign_status: 'draft' | 'active' | 'paused' | 'completed' | 'rejected'
      order_status: 'pending_shipment' | 'shipped' | 'delivered' | 'review_submitted' | 'completed'
      transaction_type: 'credit' | 'debit'
      earning_status: 'pending' | 'paid' | 'cancelled'
      media_type: 'image' | 'video' | 'both'
      duration_type: '30sec' | '1min' | '3min'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}