import { AppNav } from "@/components/layout/AppChrome";
import { ProfileSettingsForm } from "@/components/account/ProfileSettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const dictionary = await getDictionary();
  const { user, supabase } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (
    <>
      <AppNav dictionary={dictionary} />
      <main className="mx-auto grid w-full max-w-5xl gap-5 px-4 py-8">
        <Card className="border-white/70 bg-white/85 shadow-xl"><CardHeader><CardTitle>{dictionary.nav.settings}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Set app language, default CV language, template preferences, and core profile data.</CardContent></Card>
        <ProfileSettingsForm profile={profile ?? { email: user.email }} dictionary={dictionary} />
      </main>
    </>
  );
}
