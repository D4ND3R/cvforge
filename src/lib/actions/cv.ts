"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

const cvSchema = z.object({
  title: z.string().min(1).default("Untitled CV"),
  target_purpose: z.string().optional(),
  output_language: z.enum(["en", "es"]).default("en"),
  template_id: z.enum(["modern", "classic", "minimal"]).default("modern"),
});

export async function createCvAction(formData: FormData) {
  const { user, supabase } = await requireUser();
  const parsed = cvSchema.parse({
    title: formData.get("title") || "My CV",
    target_purpose: formData.get("target_purpose") || "",
    output_language: formData.get("output_language") || "en",
    template_id: formData.get("template_id") || "modern",
  });
  const { data, error } = await supabase
    .from("cv_versions")
    .insert({ ...parsed, user_id: user.id })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  redirect(`/builder/${data.id}`);
}

export async function duplicateCvAction(formData: FormData) {
  const { user, supabase } = await requireUser();
  const id = String(formData.get("id"));
  const { data: source, error } = await supabase
    .from("cv_versions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (error) throw new Error(error.message);
  const sourceCv = source as Record<string, unknown>;
  const copy = { ...sourceCv };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  const { data } = await supabase
    .from("cv_versions")
    .insert({ ...copy, title: `${String(sourceCv.title ?? "CV")} Copy`, user_id: user.id })
    .select("id")
    .single();
  revalidatePath("/dashboard");
  if ((data as { id?: string } | null)?.id) redirect(`/builder/${(data as { id: string }).id}`);
}

export async function deleteCvAction(formData: FormData) {
  const { user, supabase } = await requireUser();
  await supabase
    .from("cv_versions")
    .delete()
    .eq("id", String(formData.get("id")))
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function completeOnboardingAction(formData: FormData) {
  const { user, supabase } = await requireUser();
  const profile = {
    id: user.id,
    full_name: String(formData.get("full_name") || ""),
    preferred_name: String(formData.get("preferred_name") || ""),
    professional_title: String(formData.get("professional_title") || ""),
    city: String(formData.get("city") || ""),
    country: String(formData.get("country") || ""),
    email: String(formData.get("email") || user.email || ""),
    phone: String(formData.get("phone") || ""),
    linkedin_url: String(formData.get("linkedin_url") || ""),
    github_url: String(formData.get("github_url") || ""),
    portfolio_url: String(formData.get("portfolio_url") || ""),
    personal_website_url: String(formData.get("personal_website_url") || ""),
    preferred_language: String(formData.get("preferred_language") || "en"),
    target_market: String(formData.get("target_market") || ""),
    target_role: String(formData.get("target_role") || ""),
    onboarding_completed: true,
  };
  await supabase.from("profiles").upsert(profile);

  const { data: cv } = await supabase
    .from("cv_versions")
    .insert({
      user_id: user.id,
      title: `${profile.target_role || profile.professional_title || "Primary"} CV`,
      target_purpose: String(formData.get("career_objective") || profile.target_role || ""),
      target_description: String(formData.get("target_description") || ""),
      template_id: String(formData.get("template_id") || "modern"),
      output_language: String(formData.get("cv_language") || profile.preferred_language || "en"),
      tone: String(formData.get("tone") || "professional"),
      desired_length: String(formData.get("desired_length") || "one_page"),
    })
    .select("id")
    .single();

  revalidatePath("/", "layout");
  redirect(cv?.id ? `/builder/${cv.id}` : "/dashboard");
}

export async function updateProfileAction(formData: FormData) {
  const { user, supabase } = await requireUser();
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: String(formData.get("full_name") || ""),
    preferred_name: String(formData.get("preferred_name") || ""),
    professional_title: String(formData.get("professional_title") || ""),
    city: String(formData.get("city") || ""),
    country: String(formData.get("country") || ""),
    email: String(formData.get("email") || user.email || ""),
    phone: String(formData.get("phone") || ""),
    linkedin_url: String(formData.get("linkedin_url") || ""),
    github_url: String(formData.get("github_url") || ""),
    portfolio_url: String(formData.get("portfolio_url") || ""),
    personal_website_url: String(formData.get("personal_website_url") || ""),
    preferred_language: String(formData.get("preferred_language") || "en"),
    target_role: String(formData.get("target_role") || ""),
    target_market: String(formData.get("target_market") || ""),
  });
  revalidatePath("/", "layout");
}

export async function deleteAccountDataAction() {
  const { user, supabase } = await requireUser();
  await supabase.from("generated_sections").delete().eq("user_id", user.id);
  await supabase.from("certification_entries").delete().eq("user_id", user.id);
  await supabase.from("language_entries").delete().eq("user_id", user.id);
  await supabase.from("skill_entries").delete().eq("user_id", user.id);
  await supabase.from("achievement_entries").delete().eq("user_id", user.id);
  await supabase.from("project_entries").delete().eq("user_id", user.id);
  await supabase.from("experience_entries").delete().eq("user_id", user.id);
  await supabase.from("education_entries").delete().eq("user_id", user.id);
  await supabase.from("cv_versions").delete().eq("user_id", user.id);
  await supabase.from("profiles").update({
    full_name: null,
    preferred_name: null,
    professional_title: null,
    city: null,
    country: null,
    phone: null,
    linkedin_url: null,
    github_url: null,
    portfolio_url: null,
    personal_website_url: null,
    avatar_url: null,
    target_market: null,
    target_role: null,
    onboarding_completed: false,
  }).eq("id", user.id);
  const { data: files } = await supabase.storage.from("profile-photos").list(user.id);
  if (files?.length) {
    await supabase.storage.from("profile-photos").remove(files.map((file) => `${user.id}/${file.name}`));
  }
  revalidatePath("/", "layout");
  redirect("/onboarding");
}
