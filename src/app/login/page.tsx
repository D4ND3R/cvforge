import { AuthForm } from "@/components/auth/AuthForm";
import { PublicNav } from "@/components/layout/AppChrome";
import { getDictionary } from "@/lib/i18n/server";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const dictionary = await getDictionary();
  const { notice } = await searchParams;
  return (
    <>
      <PublicNav dictionary={dictionary} />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
        {notice === "confirm-email" ? (
          <div className="fixed top-20 z-10 mx-4 max-w-md rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 shadow-lg">
            Check your email to confirm your account, then log in to continue.
          </div>
        ) : null}
        <AuthForm mode="login" dictionary={dictionary} />
      </main>
    </>
  );
}
