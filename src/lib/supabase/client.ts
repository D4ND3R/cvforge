"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseEnv } from "./env";
import type { Database } from "./types";

export function createClient() {
  const { url, anonKey } = assertSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
