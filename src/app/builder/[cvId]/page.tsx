import { notFound } from "next/navigation";
import { AppNav } from "@/components/layout/AppChrome";
import { BuilderClient } from "@/components/builder/BuilderClient";
import { getDictionary } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth";
import type { CVData, CVVersion, Entry, Profile } from "@/lib/cv/types";

export const dynamic = "force-dynamic";

export default async function BuilderPage({ params }: { params: Promise<{ cvId: string }> }) {
  const { cvId } = await params;
  const dictionary = await getDictionary();
  const { user, supabase } = await requireUser();
  const [{ data: profile }, { data: cv }, education, experience, projects, achievements, skills, languages, certifications, generated] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("cv_versions").select("*").eq("id", cvId).eq("user_id", user.id).maybeSingle(),
    supabase.from("education_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id).order("sort_order"),
    supabase.from("experience_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id).order("sort_order"),
    supabase.from("project_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id).order("sort_order"),
    supabase.from("achievement_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id).order("sort_order"),
    supabase.from("skill_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id).order("sort_order"),
    supabase.from("language_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id).order("created_at"),
    supabase.from("certification_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id).order("created_at"),
    supabase.from("generated_sections").select("*").eq("cv_id", cvId).eq("user_id", user.id).eq("section_type", "summary").order("updated_at", { ascending: false }).limit(1),
  ]);

  if (!cv) notFound();

  const data: CVData = {
    profile: (profile ?? { id: user.id, email: user.email }) as Profile,
    cv: cv as CVVersion,
    education: (education.data ?? []) as Entry[],
    experience: (experience.data ?? []) as Entry[],
    projects: (projects.data ?? []) as Entry[],
    achievements: (achievements.data ?? []) as Entry[],
    skills: (skills.data ?? []) as Entry[],
    languages: (languages.data ?? []) as Entry[],
    certifications: (certifications.data ?? []) as Entry[],
    summary: String(((generated.data?.[0] as { content?: string } | undefined)?.content) ?? ""),
  };

  return (
    <>
      <AppNav dictionary={dictionary} />
      <BuilderClient initialData={data} dictionary={dictionary} userId={user.id} />
    </>
  );
}
