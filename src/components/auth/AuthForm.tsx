"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { signInAction, signUpAction } from "@/lib/actions/auth";

type State = { error?: string } | undefined;

export function AuthForm({ mode, dictionary }: { mode: "login" | "signup"; dictionary: Dictionary }) {
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [state, action, pending] = useActionState<State, FormData>(
    mode === "login" ? signInAction : signUpAction,
    undefined,
  );
  const googleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH === "true";

  const handleGoogle = async () => {
    setOauthError(null);
    if (!googleEnabled) {
      setOauthError("Google sign-in is not enabled for this deployment yet. Use email and password for now.");
      return;
    }
    const env = getSupabaseEnv();
    if (!env.isConfigured) {
      setOauthError(dictionary.common.configured);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setOauthError(error.message);
  };

  return (
    <Card className="mx-auto w-full max-w-md border-white/60 bg-white/80 shadow-2xl shadow-slate-200/70 backdrop-blur">
      <CardHeader>
        <CardTitle>{mode === "login" ? dictionary.auth.welcome : dictionary.auth.create}</CardTitle>
        <CardDescription>CVForge</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{dictionary.auth.email}</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{dictionary.auth.password}</Label>
            <Input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required />
          </div>
          {state?.error || oauthError ? (
            <p className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive" aria-live="polite">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {state?.error || oauthError}
            </p>
          ) : null}
          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : mode === "login" ? dictionary.auth.login : dictionary.auth.signup}
          </Button>
        </form>
        <Button type="button" variant="outline" className="mt-3 h-11 w-full" onClick={handleGoogle}>
          {googleEnabled ? dictionary.auth.google : `${dictionary.auth.google} · setup required`}
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? dictionary.auth.noAccount : dictionary.auth.hasAccount}{" "}
          <Link className="font-medium text-foreground underline" href={mode === "login" ? "/signup" : "/login"}>
            {mode === "login" ? dictionary.auth.signup : dictionary.auth.login}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
