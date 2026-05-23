import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Sparkles, Target, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicNav } from "@/components/layout/AppChrome";
import { CVPreview } from "@/components/cv/CVPreview";
import { getDictionary } from "@/lib/i18n/server";
import type { CVData } from "@/lib/cv/types";

const demoData: CVData = {
  profile: { full_name: "Sofia Rivera", professional_title: "Product-minded Software Engineer", city: "Mérida", country: "Mexico", email: "sofia@email.com", phone: "+52 999 000 0000", linkedin_url: "linkedin.com/in/sofiarivera", github_url: "github.com/sofiarivera", target_role: "Frontend Engineer" },
  cv: { id: "demo", title: "Frontend Internship", template_id: "modern", output_language: "en", include_photo: false },
  education: [{ id: "edu", institution: "Universidad Modelo", degree: "B.S. Computer Science", start_date: "2022", end_date: "2026", honors: "Merit scholarship", include_in_cv: true }],
  experience: [{ id: "exp", role_title: "Web Development Intern", organization: "Local Startup", start_date: "2025", end_date: "2026", achievements: "Built reusable React components; improved onboarding page conversion by 18%; coordinated QA with a 4-person team", tools_used: "React, TypeScript, Supabase", include_in_cv: true }],
  projects: [{ id: "project", name: "Scholarship Matcher", technologies: "Next.js, Supabase, Tailwind", features_built: "Search, saved lists, bilingual UI", results: "Helped students compare 120+ opportunities", include_in_cv: true }],
  achievements: [{ id: "achievement", description: "Won 2nd place in a national hackathon with 80 participating teams", include_in_cv: true }],
  skills: [{ id: "s1", name: "React", level: "Advanced", include_in_cv: true }, { id: "s2", name: "TypeScript", level: "Advanced", include_in_cv: true }, { id: "s3", name: "UX Writing", level: "Intermediate", include_in_cv: true }],
  languages: [{ id: "l1", language: "Spanish", proficiency: "Native", include_in_cv: true }, { id: "l2", language: "English", proficiency: "C1", include_in_cv: true }],
  certifications: [{ id: "c1", name: "Responsive Web Design", issuer: "freeCodeCamp", issue_date: "2025", include_in_cv: true }],
};

export default async function LandingPage() {
  const dictionary = await getDictionary();
  const features = [
    { Icon: Sparkles, title: "AI-ready optimization", body: "Improve summaries and bullets using AI when configured, or deterministic rules when not." },
    { Icon: Target, title: "Targeted versions", body: "Create multiple CVs for jobs, scholarships, internships, research programs, and founder profiles." },
    { Icon: FileText, title: "Beautiful templates", body: "Modern, classic, and minimal templates with clean PDF print behavior." },
    { Icon: Wand2, title: "Useful scoring", body: "Completeness, clarity, impact, ATS, contact, skills, and achievement feedback." },
  ];

  return (
    <>
      <PublicNav dictionary={dictionary} />
      <main>
        <section className="relative overflow-hidden px-4 py-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_28rem),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.15),transparent_24rem)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <Badge className="mb-5 rounded-full px-4 py-1">{dictionary.landing.heroEyebrow}</Badge>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">{dictionary.landing.heroTitle}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{dictionary.landing.heroText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild><Link href="/signup">{dictionary.landing.primaryCta}<ArrowRight className="size-4" /></Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/demo">{dictionary.landing.secondaryCta}</Link></Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {dictionary.landing.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="size-4 text-emerald-600" />{benefit}</div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/70 bg-white/50 p-3 shadow-2xl shadow-blue-200/60 backdrop-blur">
              <CVPreview data={demoData} dictionary={dictionary} className="max-h-[720px] overflow-hidden rounded-[1.5rem]" />
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">{dictionary.landing.sections.howItWorks}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">{dictionary.landing.how}</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {features.map(({ Icon, title, body }) => (
                <Card key={title} className="border-white/70 bg-white/80 shadow-xl shadow-slate-200/60">
                  <CardContent className="p-6">
                    <Icon className="mb-5 size-8 text-blue-700" />
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white/70 px-4 py-8 text-center text-sm text-muted-foreground">CVForge · Built for serious candidates.</footer>
    </>
  );
}
