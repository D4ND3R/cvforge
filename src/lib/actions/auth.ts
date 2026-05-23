"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signInAction(_: unknown, formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Use a valid email and 6+ character password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(_: unknown, formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Use a valid email and 6+ character password." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) return { error: error.message };

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email,
      preferred_language: "en",
    });
  }

  revalidatePath("/", "layout");
  if (!data.session) redirect("/login?notice=confirm-email");
  redirect("/onboarding");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
