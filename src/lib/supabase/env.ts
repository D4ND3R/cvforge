export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

export function assertSupabaseEnv() {
  const env = getSupabaseEnv();

  if (!env.isConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return env as { url: string; anonKey: string; isConfigured: true };
}
