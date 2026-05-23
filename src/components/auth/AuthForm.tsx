"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
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
  const [state, action, pending] = useActionState<State, FormData>(
    mode === "login" ? signInAction : signUpAction,
    undefined,
  );

  const handleGoogle = async () => {
    const env = getSupabaseEnv();
    if (!env.isConfigured) return;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
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
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <Button className="w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : mode === "login" ? dictionary.auth.login : dictionary.auth.signup}
          </Button>
        </form>
        <Button variant="outline" className="mt-3 w-full" onClick={handleGoogle}>
          {dictionary.auth.google}
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
