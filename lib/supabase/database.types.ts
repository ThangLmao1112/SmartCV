export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          phone: string | null;
          desired_role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          phone?: string | null;
          desired_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          phone?: string | null;
          desired_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string | null;
          title: string;
          slug: string | null;
          summary: string | null;
          target_role: string | null;
          accent_color: string;
          font_family: string;
          template_name: string;
          is_default: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id?: string | null;
          title: string;
          slug?: string | null;
          summary?: string | null;
          target_role?: string | null;
          accent_color?: string;
          font_family?: string;
          template_name?: string;
          is_default?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          profile_id?: string | null;
          title?: string;
          slug?: string | null;
          summary?: string | null;
          target_role?: string | null;
          accent_color?: string;
          font_family?: string;
          template_name?: string;
          is_default?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          school_name: string;
          degree: string | null;
          field_of_study: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          location: string | null;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          school_name: string;
          degree?: string | null;
          field_of_study?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          location?: string | null;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          school_name?: string;
          degree?: string | null;
          field_of_study?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          location?: string | null;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          company_name: string;
          job_title: string;
          employment_type: string | null;
          location: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          achievements: Json;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          company_name: string;
          job_title: string;
          employment_type?: string | null;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          achievements?: Json;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          company_name?: string;
          job_title?: string;
          employment_type?: string | null;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          achievements?: Json;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          name: string;
          category: string | null;
          proficiency: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          name: string;
          category?: string | null;
          proficiency?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          name?: string;
          category?: string | null;
          proficiency?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          name: string;
          description: string | null;
          url: string | null;
          github_url: string | null;
          tech_stack: string[];
          start_date: string | null;
          end_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          name: string;
          description?: string | null;
          url?: string | null;
          github_url?: string | null;
          tech_stack?: string[];
          start_date?: string | null;
          end_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          name?: string;
          description?: string | null;
          url?: string | null;
          github_url?: string | null;
          tech_stack?: string[];
          start_date?: string | null;
          end_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string | null;
          generation_type: string;
          prompt: string;
          result: string;
          provider: string;
          model: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id?: string | null;
          generation_type: string;
          prompt: string;
          result: string;
          provider?: string;
          model?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string | null;
          generation_type?: string;
          prompt?: string;
          result?: string;
          provider?: string;
          model?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      uploaded_files: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string | null;
          bucket_name: string;
          file_path: string;
          file_name: string;
          mime_type: string | null;
          file_size: number | null;
          file_kind: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id?: string | null;
          bucket_name?: string;
          file_path: string;
          file_name: string;
          mime_type?: string | null;
          file_size?: number | null;
          file_kind: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string | null;
          bucket_name?: string;
          file_path?: string;
          file_name?: string;
          mime_type?: string | null;
          file_size?: number | null;
          file_kind?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};