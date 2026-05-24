import Link from "next/link";
import { CalendarDays, Copy, FilePlus2, Pencil, Trash2 } from "lucide-react";
import { AppNav } from "@/components/layout/AppChrome";
import { CreateCvForm } from "@/components/dashboard/CreateCvForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDictionary } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth";
import { deleteCvAction, duplicateCvAction } from "@/lib/actions/cv";
import type { CVVersion } from "@/lib/cv/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dictionary = await getDictionary();
  const { user, supabase } = await requireUser();
  const [{ data: profile }, { data: cvs }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("cv_versions").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
  ]);

  const profileRecord = (profile ?? {}) as Record<string, unknown>;
  const cvRows = (cvs ?? []) as CVVersion[];
  const completionFields = ["full_name", "professional_title", "email", "phone", "linkedin_url", "target_role"];
  const completion = Math.round((completionFields.filter((field) => profileRecord[field]).length / completionFields.length) * 100);

  return (
    <>
      <AppNav dictionary={dictionary} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge className="mb-3 rounded-full">CVForge</Badge>
            <h1 className="text-3xl font-bold tracking-tight">{dictionary.dashboard.title}</h1>
            <p className="mt-2 text-muted-foreground">{dictionary.dashboard.subtitle}</p>
          </div>
          <Button asChild variant="outline"><Link href="/onboarding">{dictionary.dashboard.continue}</Link></Button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            <Card className="border-white/70 bg-white/85 shadow-xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><FilePlus2 className="size-5" />{dictionary.dashboard.create}</CardTitle></CardHeader>
              <CardContent>
                <CreateCvForm dictionary={dictionary} userId={user.id} />
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {cvRows.length ? cvRows.map((cv) => (
                <Card key={cv.id} className="border-white/70 bg-white/85 shadow-xl">
                  <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="font-semibold">{cv.title}</h2>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />{cv.target_purpose || "General CV"} · {cv.output_language?.toUpperCase()} · {cv.template_id}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm"><Link href={`/builder/${cv.id}`}><Pencil className="size-4" />{dictionary.dashboard.edit}</Link></Button>
                      <Button asChild size="sm" variant="outline"><Link href={`/builder/${cv.id}/preview`}>{dictionary.dashboard.preview}</Link></Button>
                      <form action={duplicateCvAction}><input type="hidden" name="id" value={cv.id} /><Button type="submit" size="sm" variant="outline"><Copy className="size-4" />{dictionary.dashboard.duplicate}</Button></form>
                      <form action={deleteCvAction}><input type="hidden" name="id" value={cv.id} /><Button type="submit" size="sm" variant="destructive"><Trash2 className="size-4" />{dictionary.dashboard.delete}</Button></form>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card className="border-dashed bg-white/70"><CardContent className="p-8 text-center text-muted-foreground">{dictionary.dashboard.empty}</CardContent></Card>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <Card className="border-white/70 bg-white/85 shadow-xl">
              <CardHeader><CardTitle>{String(profileRecord.preferred_name || profileRecord.full_name || user.email)}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><div className="mb-1 flex justify-between text-sm"><span>{dictionary.dashboard.profile}</span><span>{completion}%</span></div><Progress value={completion} /></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-medium">{dictionary.dashboard.missing}</p><ul className="mt-2 space-y-1 text-xs text-muted-foreground">{completionFields.filter((field) => !profileRecord[field]).map((field) => <li key={field}>Add {field.replace("_", " ")}</li>)}</ul></div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}
