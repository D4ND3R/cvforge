import { redirect } from "next/navigation";
import { createClient, createOptionalClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createOptionalClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      preferred_language: "en",
    },
    { onConflict: "id", ignoreDuplicates: true },
  );

  return { user, supabase };
}
