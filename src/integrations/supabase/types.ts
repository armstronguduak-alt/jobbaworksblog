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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_earnings: {
        Row: {
          comment_id: string
          created_at: string
          earned_amount: number
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          earned_amount?: number
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          earned_amount?: number
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_earnings_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_earnings_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_links: {
        Row: {
          channel_key: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          channel_key: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          channel_key?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      daily_user_counters: {
        Row: {
          comment_count: number
          counter_date: string
          created_at: string
          id: string
          read_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_count?: number
          counter_date?: string
          created_at?: string
          id?: string
          read_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_count?: number
          counter_date?: string
          created_at?: string
          id?: string
          read_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payout_methods: {
        Row: {
          account_name: string | null
          account_number: string | null
          created_at: string
          id: string
          is_default: boolean
          method: string
          minipay_uid: string | null
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          method: string
          minipay_uid?: string | null
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          method?: string
          minipay_uid?: string | null
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reads: {
        Row: {
          created_at: string
          earned_amount: number
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          earned_amount?: number
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          earned_amount?: number
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reads_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          approved_at: string | null
          approved_by_user_id: string | null
          author_user_id: string
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          moderation_flags: Json
          moderation_summary: string | null
          published_at: string | null
          reading_time_seconds: number
          seo_meta_description: string | null
          seo_meta_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
          word_count: number
        }
        Insert: {
          approved_at?: string | null
          approved_by_user_id?: string | null
          author_user_id: string
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          moderation_flags?: Json
          moderation_summary?: string | null
          published_at?: string | null
          reading_time_seconds?: number
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
          word_count?: number
        }
        Update: {
          approved_at?: string | null
          approved_by_user_id?: string | null
          author_user_id?: string
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          moderation_flags?: Json
          moderation_summary?: string | null
          published_at?: string | null
          reading_time_seconds?: number
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          joined_at: string
          name: string
          phone: string | null
          referral_code: string
          referred_by_code: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          joined_at?: string
          name: string
          phone?: string | null
          referral_code: string
          referred_by_code?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          joined_at?: string
          name?: string
          phone?: string | null
          referral_code?: string
          referred_by_code?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string
          created_by_user_id: string
          cta_text: string
          cta_url: string | null
          description: string
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          cta_text?: string
          cta_url?: string | null
          description: string
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          cta_text?: string
          cta_url?: string | null
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_commissions: {
        Row: {
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          plan_id: Database["public"]["Enums"]["plan_id"]
          plan_price: number
          referred_user_id: string
          referrer_user_id: string
        }
        Insert: {
          commission_amount: number
          commission_rate?: number
          created_at?: string
          id?: string
          plan_id: Database["public"]["Enums"]["plan_id"]
          plan_price: number
          referred_user_id: string
          referrer_user_id: string
        }
        Update: {
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          plan_id?: Database["public"]["Enums"]["plan_id"]
          plan_price?: number
          referred_user_id?: string
          referrer_user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code_used: string
          referred_user_id: string
          referrer_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code_used: string
          referred_user_id: string
          referrer_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code_used?: string
          referred_user_id?: string
          referrer_user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          comment_reward: number
          created_at: string
          daily_comment_limit: number
          daily_read_limit: number
          id: Database["public"]["Enums"]["plan_id"]
          is_active: boolean
          name: string
          price: number
          read_reward: number
          updated_at: string
        }
        Insert: {
          comment_reward?: number
          created_at?: string
          daily_comment_limit?: number
          daily_read_limit?: number
          id: Database["public"]["Enums"]["plan_id"]
          is_active?: boolean
          name: string
          price?: number
          read_reward?: number
          updated_at?: string
        }
        Update: {
          comment_reward?: number
          created_at?: string
          daily_comment_limit?: number
          daily_read_limit?: number
          id?: Database["public"]["Enums"]["plan_id"]
          is_active?: boolean
          name?: string
          price?: number
          read_reward?: number
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          updated_by_user_id: string | null
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by_user_id?: string | null
          value: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by_user_id?: string | null
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
      user_subscriptions: {
        Row: {
          id: string
          plan_id: Database["public"]["Enums"]["plan_id"]
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          plan_id?: Database["public"]["Enums"]["plan_id"]
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          plan_id?: Database["public"]["Enums"]["plan_id"]
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          balance: number
          pending_rewards: number
          post_earnings: number
          referral_earnings: number
          total_earnings: number
          updated_at: string
          usdt_balance: number
          user_id: string
        }
        Insert: {
          balance?: number
          pending_rewards?: number
          post_earnings?: number
          referral_earnings?: number
          total_earnings?: number
          updated_at?: string
          usdt_balance?: number
          user_id: string
        }
        Update: {
          balance?: number
          pending_rewards?: number
          post_earnings?: number
          referral_earnings?: number
          total_earnings?: number
          updated_at?: string
          usdt_balance?: number
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          meta: Json
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          meta?: Json
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          meta?: Json
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          amount: number
          created_at: string
          currency: string
          details: Json
          id: string
          method: string
          payout_method_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          details?: Json
          id?: string
          method: string
          payout_method_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          details?: Json
          id?: string
          method?: string
          payout_method_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_payout_method_id_fkey"
            columns: ["payout_method_id"]
            isOneToOne: false
            referencedRelation: "payout_methods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_plan: {
        Args: {
          _plan_id: Database["public"]["Enums"]["plan_id"]
          _user_id: string
        }
        Returns: undefined
      }
      claim_post_read: { Args: { _post_id: string }; Returns: Json }
      credit_wallet: {
        Args: {
          _amount: number
          _description: string
          _meta?: Json
          _type: Database["public"]["Enums"]["transaction_type"]
          _user_id: string
        }
        Returns: undefined
      }
      ensure_daily_counter: {
        Args: { _user_id: string }
        Returns: {
          comment_count: number
          counter_date: string
          created_at: string
          id: string
          read_count: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "daily_user_counters"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initialize_my_account: {
        Args: {
          _avatar_url: string
          _email: string
          _name: string
          _phone: string
          _referred_by_code?: string
        }
        Returns: undefined
      }
      initialize_my_subscription: { Args: never; Returns: undefined }
      initialize_my_wallet: { Args: never; Returns: undefined }
      moderate_post_status: {
        Args: {
          _moderation_summary?: string
          _new_status: Database["public"]["Enums"]["post_status"]
          _post_id: string
        }
        Returns: undefined
      }
      submit_comment_with_reward: {
        Args: { _content: string; _post_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      plan_id:
        | "free"
        | "starter"
        | "pro"
        | "elite"
        | "vip"
        | "executive"
        | "platinum"
      post_status: "draft" | "pending" | "approved" | "rejected"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type:
        | "reading_reward"
        | "comment_reward"
        | "post_approval_reward"
        | "referral_bonus"
        | "subscription_fee"
        | "withdrawal"
      user_status: "active" | "banned" | "suspended"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      plan_id: [
        "free",
        "starter",
        "pro",
        "elite",
        "vip",
        "executive",
        "platinum",
      ],
      post_status: ["draft", "pending", "approved", "rejected"],
      transaction_status: ["pending", "completed", "failed"],
      transaction_type: [
        "reading_reward",
        "comment_reward",
        "post_approval_reward",
        "referral_bonus",
        "subscription_fee",
        "withdrawal",
      ],
      user_status: ["active", "banned", "suspended"],
    },
  },
} as const
