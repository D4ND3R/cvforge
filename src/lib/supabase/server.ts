import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { assertSupabaseEnv, getSupabaseEnv } from "./env";
import type { Database } from "./types";

export async function createClient() {
  const { url, anonKey } = assertSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies. Middleware refreshes sessions.
        }
      },
    },
  });
}

export async function createOptionalClient() {
  if (!getSupabaseEnv().isConfigured) return null;
  return createClient();
}
