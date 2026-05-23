import { AppNav } from "@/components/layout/AppChrome";
import { ProfileSettingsForm } from "@/components/account/ProfileSettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { getDictionary } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const dictionary = await getDictionary();
  const { user, supabase } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (
    <>
      <AppNav dictionary={dictionary} />
      <main className="mx-auto grid w-full max-w-5xl gap-5 px-4 py-8">
        <Card className="border-white/70 bg-white/85 shadow-xl">
          <CardHeader><CardTitle>{dictionary.nav.account}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>{user.email}</span>
            <form action={signOutAction}><Button variant="outline">{dictionary.nav.logout}</Button></form>
          </CardContent>
        </Card>
        <ProfileSettingsForm profile={profile ?? { email: user.email }} dictionary={dictionary} />
      </main>
    </>
  );
}
