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
      activity_logs: {
        Row: {
          action_type: string | null
          description: string | null
          device_info: string | null
          id: string
          ip_address: string | null
          performed_at: string | null
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          description?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          performed_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          description?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          performed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          confidence_score: number | null
          id: number
          matched_patterns: Json | null
          reasoning: string | null
          recommendation_type: string | null
          suggested_entry: number | null
          suggested_exit: number | null
          timeframe: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          id?: number
          matched_patterns?: Json | null
          reasoning?: string | null
          recommendation_type?: string | null
          suggested_entry?: number | null
          suggested_exit?: number | null
          timeframe?: string | null
          timestamp: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          id?: number
          matched_patterns?: Json | null
          reasoning?: string | null
          recommendation_type?: string | null
          suggested_entry?: number | null
          suggested_exit?: number | null
          timeframe?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          condition: Json | null
          id: number
          triggered_at: string | null
          triggered_price: number | null
          user_id: string | null
          was_notified: boolean | null
        }
        Insert: {
          condition?: Json | null
          id?: number
          triggered_at?: string | null
          triggered_price?: number | null
          user_id?: string | null
          was_notified?: boolean | null
        }
        Update: {
          condition?: Json | null
          id?: number
          triggered_at?: string | null
          triggered_price?: number | null
          user_id?: string | null
          was_notified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analyses: {
        Row: {
          analysis_type: string
          created_at: string | null
          data: Json
          id: string
          user_id: string | null
        }
        Insert: {
          analysis_type: string
          created_at?: string | null
          data: Json
          id?: string
          user_id?: string | null
        }
        Update: {
          analysis_type?: string
          created_at?: string | null
          data?: Json
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      backtesting_results: {
        Row: {
          avg_risk_reward: number | null
          id: number
          settings: Json | null
          strategy_name: string | null
          tested_on_range: unknown | null
          total_trades: number | null
          user_id: string | null
          win_rate: number | null
        }
        Insert: {
          avg_risk_reward?: number | null
          id?: number
          settings?: Json | null
          strategy_name?: string | null
          tested_on_range?: unknown | null
          total_trades?: number | null
          user_id?: string | null
          win_rate?: number | null
        }
        Update: {
          avg_risk_reward?: number | null
          id?: number
          settings?: Json | null
          strategy_name?: string | null
          tested_on_range?: unknown | null
          total_trades?: number | null
          user_id?: string | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "backtesting_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      btc_market_data: {
        Row: {
          dominance: number | null
          fear_greed_index: number | null
          id: number
          liquidity_zones: Json | null
          order_book_snapshot: Json | null
          price: number | null
          timestamp: string
          volume: number | null
        }
        Insert: {
          dominance?: number | null
          fear_greed_index?: number | null
          id?: number
          liquidity_zones?: Json | null
          order_book_snapshot?: Json | null
          price?: number | null
          timestamp: string
          volume?: number | null
        }
        Update: {
          dominance?: number | null
          fear_greed_index?: number | null
          id?: number
          liquidity_zones?: Json | null
          order_book_snapshot?: Json | null
          price?: number | null
          timestamp?: string
          volume?: number | null
        }
        Relationships: []
      }
      education_modules: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          tags: string[] | null
          title: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          tags?: string[] | null
          title?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          tags?: string[] | null
          title?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      fear_greed_index: {
        Row: {
          classification: string | null
          created_at: string | null
          id: string
          index_value: number | null
          source: string | null
        }
        Insert: {
          classification?: string | null
          created_at?: string | null
          id?: string
          index_value?: number | null
          source?: string | null
        }
        Update: {
          classification?: string | null
          created_at?: string | null
          id?: string
          index_value?: number | null
          source?: string | null
        }
        Relationships: []
      }
      liquidity_analysis: {
        Row: {
          created_at: string | null
          id: string
          liquidity_zone: string | null
          order_flow: string | null
          timeframe: string
          user_id: string | null
          volume_analysis: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          liquidity_zone?: string | null
          order_flow?: string | null
          timeframe: string
          user_id?: string | null
          volume_analysis?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          liquidity_zone?: string | null
          order_flow?: string | null
          timeframe?: string
          user_id?: string | null
          volume_analysis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liquidity_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      news_sentiments: {
        Row: {
          content: string | null
          created_at: string | null
          headline: string
          id: string
          published_at: string | null
          sentiment_score: number | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          headline: string
          id?: string
          published_at?: string | null
          sentiment_score?: number | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          headline?: string
          id?: string
          published_at?: string | null
          sentiment_score?: number | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_sentiments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      preferences: {
        Row: {
          alert_conditions: Json | null
          created_at: string | null
          id: number
          indicators: Json | null
          timeframe: string | null
          user_id: string | null
        }
        Insert: {
          alert_conditions?: Json | null
          created_at?: string | null
          id?: number
          indicators?: Json | null
          timeframe?: string | null
          user_id?: string | null
        }
        Update: {
          alert_conditions?: Json | null
          created_at?: string | null
          id?: number
          indicators?: Json | null
          timeframe?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          rating: number | null
          recommendation_id: string | null
          user_id: string | null
          was_accurate: boolean | null
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          recommendation_id?: string | null
          user_id?: string | null
          was_accurate?: boolean | null
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          recommendation_id?: string | null
          user_id?: string | null
          was_accurate?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_feedback_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "smart_recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations_feedback: {
        Row: {
          created_at: string | null
          feedback_notes: string | null
          id: number
          outcome: string | null
          recommendation_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_notes?: string | null
          id?: number
          outcome?: string | null
          recommendation_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_notes?: string | null
          id?: number
          outcome?: string | null
          recommendation_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_feedback_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "ai_recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_analysis: {
        Row: {
          created_at: string | null
          id: string
          keywords: string[] | null
          sentiment_score: number | null
          source: string | null
          summary: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          sentiment_score?: number | null
          source?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          sentiment_score?: number | null
          source?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_data: {
        Row: {
          content: string | null
          id: number
          keywords: string[] | null
          sentiment_score: number | null
          source: string | null
          timestamp: string
        }
        Insert: {
          content?: string | null
          id?: number
          keywords?: string[] | null
          sentiment_score?: number | null
          source?: string | null
          timestamp: string
        }
        Update: {
          content?: string | null
          id?: number
          keywords?: string[] | null
          sentiment_score?: number | null
          source?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      smart_alerts: {
        Row: {
          condition_description: string | null
          id: string
          linked_analysis_id: string | null
          notes: string | null
          status: string | null
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          condition_description?: string | null
          id?: string
          linked_analysis_id?: string | null
          notes?: string | null
          status?: string | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          condition_description?: string | null
          id?: string
          linked_analysis_id?: string | null
          notes?: string | null
          status?: string | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_recommendations: {
        Row: {
          confidence_level: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          reason: string | null
          recommendation_type: string | null
          stop_loss: number | null
          take_profit: number | null
          timeframe: string | null
          user_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          recommendation_type?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          timeframe?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          recommendation_type?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          timeframe?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      technical_patterns: {
        Row: {
          confidence_level: number | null
          context_analysis: string | null
          created_at: string | null
          entry_point: number | null
          exit_point: number | null
          id: string
          pattern_name: string | null
          timeframe: string | null
          user_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          context_analysis?: string | null
          created_at?: string | null
          entry_point?: number | null
          exit_point?: number | null
          id?: string
          pattern_name?: string | null
          timeframe?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          context_analysis?: string | null
          created_at?: string | null
          entry_point?: number | null
          exit_point?: number | null
          id?: string
          pattern_name?: string | null
          timeframe?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_patterns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_journal: {
        Row: {
          closed_at: string | null
          direction: string | null
          entry_price: number | null
          exit_price: number | null
          id: number
          notes: string | null
          opened_at: string | null
          pair: string | null
          stop_loss: number | null
          take_profit: number | null
          user_id: string | null
        }
        Insert: {
          closed_at?: string | null
          direction?: string | null
          entry_price?: number | null
          exit_price?: number | null
          id?: number
          notes?: string | null
          opened_at?: string | null
          pair?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          user_id?: string | null
        }
        Update: {
          closed_at?: string | null
          direction?: string | null
          entry_price?: number | null
          exit_price?: number | null
          id?: number
          notes?: string | null
          opened_at?: string | null
          pair?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_journal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          created_at: string | null
          entry_price: number
          entry_time: string
          exit_price: number | null
          exit_time: string | null
          id: string
          notes: string | null
          stop_loss: number | null
          take_profit: number | null
          trade_type: string
          user_id: string | null
          volume: number
        }
        Insert: {
          created_at?: string | null
          entry_price: number
          entry_time: string
          exit_price?: number | null
          exit_time?: string | null
          id?: string
          notes?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          trade_type: string
          user_id?: string | null
          volume: number
        }
        Update: {
          created_at?: string | null
          entry_price?: number
          entry_time?: string
          exit_price?: number | null
          exit_time?: string | null
          id?: string
          notes?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          trade_type?: string
          user_id?: string | null
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_journal: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          related_analysis_id: string | null
          screenshot_url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          related_analysis_id?: string | null
          screenshot_url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          related_analysis_id?: string | null
          screenshot_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_journal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          dark_mode: boolean | null
          default_language: string | null
          id: string
          notification_preferences: Json | null
          preferred_timeframes: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dark_mode?: boolean | null
          default_language?: string | null
          id?: string
          notification_preferences?: Json | null
          preferred_timeframes?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dark_mode?: boolean | null
          default_language?: string | null
          id?: string
          notification_preferences?: Json | null
          preferred_timeframes?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          preferred_language: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          preferred_language?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          preferred_language?: string | null
          username?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
