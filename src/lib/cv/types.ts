export type CVLanguage = "en" | "es";
export type CVTemplate = "modern" | "classic" | "minimal";

export type Profile = {
  id?: string;
  full_name?: string | null;
  preferred_name?: string | null;
  professional_title?: string | null;
  city?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  personal_website_url?: string | null;
  avatar_url?: string | null;
  preferred_language?: CVLanguage | null;
  target_market?: string | null;
  target_role?: string | null;
  onboarding_completed?: boolean | null;
};

export type CVVersion = {
  id: string;
  user_id?: string;
  title: string;
  target_purpose?: string | null;
  target_description?: string | null;
  template_id?: CVTemplate | string | null;
  output_language?: CVLanguage | string | null;
  tone?: string | null;
  desired_length?: string | null;
  include_photo?: boolean | null;
  section_order?: unknown;
  updated_at?: string | null;
};

export type Entry = Record<string, unknown> & {
  id?: string;
  user_id?: string;
  cv_id?: string;
  include_in_cv?: boolean;
  sort_order?: number;
};

export type CVData = {
  profile: Profile;
  cv: CVVersion;
  education: Entry[];
  experience: Entry[];
  projects: Entry[];
  achievements: Entry[];
  skills: Entry[];
  languages: Entry[];
  certifications: Entry[];
  summary?: string;
};
