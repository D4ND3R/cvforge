import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppNav } from "@/components/layout/AppChrome";
import { CVPreview } from "@/components/cv/CVPreview";
import { PDFExportButton } from "@/components/cv/PDFExportButton";
import { getDictionary } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth";
import type { CVData, CVVersion, Entry, Profile } from "@/lib/cv/types";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: Promise<{ cvId: string }> }) {
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
    supabase.from("language_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id),
    supabase.from("certification_entries").select("*").eq("cv_id", cvId).eq("user_id", user.id),
    supabase.from("generated_sections").select("*").eq("cv_id", cvId).eq("user_id", user.id).eq("section_type", "summary").order("updated_at", { ascending: false }).limit(1),
  ]);
  if (!cv) notFound();
  const data: CVData = {
    profile: (profile ?? {}) as Profile,
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
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" asChild><Link href={`/builder/${cvId}`}>Back to builder</Link></Button>
          <PDFExportButton dictionary={dictionary} />
        </div>
        <CVPreview data={data} dictionary={dictionary} />
      </main>
    </>
  );
}
