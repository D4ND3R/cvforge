import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

const protectedPrefixes = [
  "/dashboard",
  "/onboarding",
  "/builder",
  "/settings",
  "/account",
];

const authPages = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv();
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  if (!env.isConfigured) return response;

  const supabase = createServerClient(env.url!, env.anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthPage = authPages.includes(pathname);

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = profile?.onboarding_completed
      ? "/dashboard"
      : "/onboarding";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
