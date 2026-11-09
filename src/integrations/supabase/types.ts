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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: number
          record_id: string | null
          summary: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: number
          record_id?: string | null
          summary?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: number
          record_id?: string | null
          summary?: string | null
          table_name?: string
        }
        Relationships: []
      }
      biography_sections: {
        Row: {
          body: string
          created_at: string
          id: string
          image_url: string | null
          slug: string
          sort_order: number
          sources: Json
          status: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          slug: string
          sort_order?: number
          sources?: Json
          status?: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          slug?: string
          sort_order?: number
          sources?: Json
          status?: Database["public"]["Enums"]["pub_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_enquiries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          ip_hash: string | null
          message: string
          resolved: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          ip_hash?: string | null
          message: string
          resolved?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          ip_hash?: string | null
          message?: string
          resolved?: boolean
          subject?: string
        }
        Relationships: []
      }
      financial_disclosures: {
        Row: {
          amount_ghs: number | null
          category: string
          created_at: string
          document_url: string | null
          id: string
          published_on: string | null
          reporting_period: string
          status: Database["public"]["Enums"]["pub_status"]
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          amount_ghs?: number | null
          category?: string
          created_at?: string
          document_url?: string | null
          id?: string
          published_on?: string | null
          reporting_period?: string
          status?: Database["public"]["Enums"]["pub_status"]
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount_ghs?: number | null
          category?: string
          created_at?: string
          document_url?: string | null
          id?: string
          published_on?: string | null
          reporting_period?: string
          status?: Database["public"]["Enums"]["pub_status"]
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadership_timeline: {
        Row: {
          created_at: string
          description: string
          documents: Json
          id: string
          image_url: string | null
          period: string
          sort_order: number
          sources: Json
          start_date: string | null
          status: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          documents?: Json
          id?: string
          image_url?: string | null
          period?: string
          sort_order?: number
          sources?: Json
          start_date?: string | null
          status?: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          documents?: Json
          id?: string
          image_url?: string | null
          period?: string
          sort_order?: number
          sources?: Json
          start_date?: string | null
          status?: Database["public"]["Enums"]["pub_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          caption: string
          category: string
          created_at: string
          credit: string
          id: string
          kind: string
          status: Database["public"]["Enums"]["pub_status"]
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          caption?: string
          category?: string
          created_at?: string
          credit?: string
          id?: string
          kind?: string
          status?: Database["public"]["Enums"]["pub_status"]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          caption?: string
          category?: string
          created_at?: string
          credit?: string
          id?: string
          kind?: string
          status?: Database["public"]["Enums"]["pub_status"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author: string
          body: string
          category: string
          citations: Json
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          image_url: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          body?: string
          category?: string
          citations?: Json
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          body?: string
          category?: string
          citations?: Json
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["pub_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      public_engagements: {
        Row: {
          category: string
          created_at: string
          description: string
          event_date: string
          id: string
          image_url: string | null
          media_url: string | null
          related_links: Json
          status: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image_url?: string | null
          media_url?: string | null
          related_links?: Json
          status?: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at?: string
          venue?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image_url?: string | null
          media_url?: string | null
          related_links?: Json
          status?: Database["public"]["Enums"]["pub_status"]
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "content_admin" | "media_manager" | "editor"
      pub_status: "draft" | "published" | "archived"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "content_admin", "media_manager", "editor"],
      pub_status: ["draft", "published", "archived"],
    },
  },
} as const
