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
      form_config: {
        Row: {
          id: number
          config: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          config: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          config?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      Dzesa: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json | null
          error_message: string
          id: string
          stack_trace: string | null
          timestamp: string | null
          user_info: Json | null
        }
        Insert: {
          context?: Json | null
          error_message: string
          id?: string
          stack_trace?: string | null
          timestamp?: string | null
          user_info?: Json | null
        }
        Update: {
          context?: Json | null
          error_message?: string
          id?: string
          stack_trace?: string | null
          timestamp?: string | null
          user_info?: Json | null
        }
        Relationships: []
      }
      external_submissions: {
        Row: {
          created_at: string | null
          external_service: string
          id: string
          response: Json | null
          status: string
          submission_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          external_service: string
          id?: string
          response?: Json | null
          status: string
          submission_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          external_service?: string
          id?: string
          response?: Json | null
          status?: string
          submission_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_submissions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "foster_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      foster_submissions: {
        Row: {
          calculations: Json | null
          children_data: Json
          created_at: string | null
          id: string
          status: string | null
          synced: boolean | null
          updated_at: string | null
          user_info: Json
        }
        Insert: {
          calculations?: Json | null
          children_data: Json
          created_at?: string | null
          id?: string
          status?: string | null
          synced?: boolean | null
          updated_at?: string | null
          user_info: Json
        }
        Update: {
          calculations?: Json | null
          children_data?: Json
          created_at?: string | null
          id?: string
          status?: string | null
          synced?: boolean | null
          updated_at?: string | null
          user_info?: Json
        }
        Relationships: []
      }
      requests: {
        Row: {
          config: Json
          error: string | null
          id: string
          response: Json | null
          timestamp: number
        }
        Insert: {
          config: Json
          error?: string | null
          id: string
          response?: Json | null
          timestamp: number
        }
        Update: {
          config?: Json
          error?: string | null
          id?: string
          response?: Json | null
          timestamp?: number
        }
        Relationships: []
      }
      theme_configuration: {
        Row: {
          colors: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          mode: Database["public"]["Enums"]["theme_mode"]
          name: string
          updated_at: string | null
        }
        Insert: {
          colors: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mode: Database["public"]["Enums"]["theme_mode"]
          name: string
          updated_at?: string | null
        }
        Update: {
          colors?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mode?: Database["public"]["Enums"]["theme_mode"]
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      whitelabel_settings: {
        Row: {
          company_name: string
          created_at: string | null
          email_template: string | null
          id: string
          logo_url: string | null
          primary_color: string
          tooltip_content: Json | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          email_template?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          tooltip_content?: Json | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          email_template?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          tooltip_content?: Json | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          id: string
          created_at: string
          form_config_id: number
          user_info: Json
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          form_config_id: number
          user_info: Json
          status: string
        }
        Update: {
          id?: string
          created_at?: string
          form_config_id?: number
          user_info?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_config_id_fkey"
            columns: ["form_config_id"]
            referencedRelation: "form_config"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user" | "superadmin"
      theme_mode: "light" | "dark"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
