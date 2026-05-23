import { AppNav } from "@/components/layout/AppChrome";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { getDictionary } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const dictionary = await getDictionary();
  const { user, supabase } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (
    <>
      <AppNav dictionary={dictionary} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <OnboardingWizard dictionary={dictionary} profile={profile ?? { email: user.email }} />
      </main>
    </>
  );
}
