import { AuthForm } from "@/components/auth/AuthForm";
import { PublicNav } from "@/components/layout/AppChrome";
import { getDictionary } from "@/lib/i18n/server";

export default async function SignupPage() {
  const dictionary = await getDictionary();
  return (
    <>
      <PublicNav dictionary={dictionary} />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
        <AuthForm mode="signup" dictionary={dictionary} />
      </main>
    </>
  );
}
