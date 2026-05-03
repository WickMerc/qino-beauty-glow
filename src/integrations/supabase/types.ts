export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analysis_reports: {
        Row: {
          completed_at: string | null
          created_at: string
          current_phase: Json | null
          headline: string | null
          id: string
          insight: string | null
          opportunities: Json
          priorities: Json
          scan_session_id: string
          scores: Json
          status: string
          strengths: Json
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_phase?: Json | null
          headline?: string | null
          id?: string
          insight?: string | null
          opportunities?: Json
          priorities?: Json
          scan_session_id: string
          scores?: Json
          status?: string
          strengths?: Json
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_phase?: Json | null
          headline?: string | null
          id?: string
          insight?: string | null
          opportunities?: Json
          priorities?: Json
          scan_session_id?: string
          scores?: Json
          status?: string
          strengths?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_reports_scan_session_id_fkey"
            columns: ["scan_session_id"]
            isOneToOne: false
            referencedRelation: "scan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      feature_findings: {
        Row: {
          accent_key: string
          analysis_report_id: string
          created_at: string
          detail: Json
          findings: Json
          group_id: string
          icon_key: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          accent_key: string
          analysis_report_id: string
          created_at?: string
          detail?: Json
          findings?: Json
          group_id: string
          icon_key: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          accent_key?: string
          analysis_report_id?: string
          created_at?: string
          detail?: Json
          findings?: Json
          group_id?: string
          icon_key?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_findings_analysis_report_id_fkey"
            columns: ["analysis_report_id"]
            isOneToOne: false
            referencedRelation: "analysis_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_answers: {
        Row: {
          body: Json | null
          budget: string | null
          comfort: Json
          completed_at: string | null
          created_at: string
          goals: Json
          hair: Json
          id: string
          personalization: Json
          routine: string | null
          skin: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: Json | null
          budget?: string | null
          comfort?: Json
          completed_at?: string | null
          created_at?: string
          goals?: Json
          hair?: Json
          id?: string
          personalization?: Json
          routine?: string | null
          skin?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: Json | null
          budget?: string | null
          comfort?: Json
          completed_at?: string | null
          created_at?: string
          goals?: Json
          hair?: Json
          id?: string
          personalization?: Json
          routine?: string | null
          skin?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      priority_items: {
        Row: {
          analysis_report_id: string
          created_at: string
          id: string
          priority_level: string
          sort_order: number
          title: string
        }
        Insert: {
          analysis_report_id: string
          created_at?: string
          id?: string
          priority_level: string
          sort_order?: number
          title: string
        }
        Update: {
          analysis_report_id?: string
          created_at?: string
          id?: string
          priority_level?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "priority_items_analysis_report_id_fkey"
            columns: ["analysis_report_id"]
            isOneToOne: false
            referencedRelation: "analysis_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scan_photos: {
        Row: {
          angle_type: string
          created_at: string
          id: string
          quality_status: string | null
          scan_session_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          angle_type: string
          created_at?: string
          id?: string
          quality_status?: string | null
          scan_session_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          angle_type?: string
          created_at?: string
          id?: string
          quality_status?: string | null
          scan_session_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_photos_scan_session_id_fkey"
            columns: ["scan_session_id"]
            isOneToOne: false
            referencedRelation: "scan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_plan: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_plan?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_plan?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          event_id: string
          processed_at: string
        }
        Insert: {
          event_id: string
          processed_at?: string
        }
        Update: {
          event_id?: string
          processed_at?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
