"use client";

import { useMemo, useState } from "react";
import { Activity, AppWindow, CheckCircle2, Eye, Gauge, Languages, Sparkles } from "lucide-react";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVScorePanel } from "@/components/cv/CVScorePanel";
import { PDFExportButton } from "@/components/cv/PDFExportButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CVData, CVLanguage, CVTemplate } from "@/lib/cv/types";
import { scoreCV } from "@/lib/cv/optimization";

type DemoTarget = "research" | "product" | "engineering";

const targetCopy: Record<DemoTarget, { title: string; role: string; purpose: string; description: string; achievement: string; project: string }> = {
  research: {
    title: "Research CV",
    role: "Data Analyst & Scholarship Applicant",
    purpose: "Research Internship",
    description: "Data-heavy research program seeking evidence of analytical rigor, communication, and reproducible methods.",
    achievement: "Selected for a merit scholarship awarded to the top 5% of applicants",
    project: "Public Transit Equity Map",
  },
  product: {
    title: "Product Internship CV",
    role: "Product-minded Software Engineer",
    purpose: "Product Internship",
    description: "Early-stage product role focused on user research, onboarding, and measurable activation improvements.",
    achievement: "Finalist in a university innovation challenge with 46 teams",
    project: "Scholarship Matcher",
  },
  engineering: {
    title: "Frontend Engineer CV",
    role: "Frontend Engineer",
    purpose: "Frontend Engineering Role",
    description: "Frontend team hiring for TypeScript, accessibility, performance, and polished product execution.",
    achievement: "Won 2nd place in a national hackathon with 80 participating teams",
    project: "Accessible Component Kit",
  },
};

function makeDemoData(target: DemoTarget, quantified: boolean, outputLanguage: CVLanguage, template: CVTemplate, includeProject: boolean): CVData {
  const copy = targetCopy[target];
  return {
    profile: {
      full_name: "Mateo Chen",
      professional_title: copy.role,
      email: "mateo@email.com",
      phone: "+1 555 0100",
      city: "Austin",
      country: "United States",
      linkedin_url: "linkedin.com/in/mateochen",
      github_url: target === "engineering" ? "github.com/mateochen" : undefined,
      target_role: copy.purpose,
    },
    cv: {
      id: "demo",
      title: copy.title,
      template_id: template,
      output_language: outputLanguage,
      target_purpose: copy.purpose,
      target_description: copy.description,
      include_photo: false,
    },
    education: [{ id: "edu", institution: "UT Austin", degree: "B.S. Statistics", start_date: "2023", end_date: "2027", coursework: "Regression, experimental design, machine learning", honors: "Merit scholarship", include_in_cv: true }],
    experience: [{
      id: "exp",
      role_title: target === "research" ? "Research Assistant" : target === "product" ? "Product Engineering Intern" : "Frontend Developer Intern",
      organization: target === "research" ? "Social Data Lab" : "Local Startup",
      start_date: "2025",
      current: true,
      achievements: quantified
        ? target === "product"
          ? "Redesigned onboarding flow; improved activation by 18%; interviewed 12 users; coordinated QA with a 4-person team"
          : target === "engineering"
            ? "Built reusable React components; reduced page load by 31%; fixed 22 accessibility issues across core flows"
            : "Cleaned 45k survey records; automated weekly analysis reports; presented findings to 8 faculty researchers"
        : "Helped with onboarding pages; worked on reports; supported the team with analysis and design tasks",
      tools_used: target === "research" ? "Python, SQL, R" : "React, TypeScript, Supabase",
      include_in_cv: true,
    }],
    projects: includeProject ? [{
      id: "proj",
      name: copy.project,
      technologies: target === "research" ? "Python, GeoPandas, Next.js" : "Next.js, Supabase, Tailwind",
      features_built: quantified ? "Search, saved lists, bilingual UI, analytics dashboard" : "Search and pages",
      results: quantified ? "Helped students compare 120+ opportunities and reduced manual research time by 6 hours per week" : "Helped users compare opportunities",
      include_in_cv: true,
    }] : [],
    achievements: [{ id: "ach", description: copy.achievement, include_in_cv: true }],
    skills: [
      { id: "sk1", name: target === "research" ? "Python" : "React", level: "Advanced", include_in_cv: true },
      { id: "sk2", name: "SQL", level: "Advanced", include_in_cv: true },
      { id: "sk3", name: target === "engineering" ? "Accessibility" : "Data Visualization", level: "Intermediate", include_in_cv: true },
      { id: "sk4", name: "Communication", level: "Advanced", include_in_cv: true },
    ],
    languages: [{ id: "lang", language: "English", proficiency: "Native", include_in_cv: true }, { id: "lang2", language: "Spanish", proficiency: "B2", include_in_cv: true }],
    certifications: quantified ? [{ id: "cert", name: "Responsive Web Design", issuer: "freeCodeCamp", issue_date: "2025", include_in_cv: true }] : [],
  };
}

export function InteractiveDemo({ dictionary }: { dictionary: Dictionary }) {
  const [target, setTarget] = useState<DemoTarget>("research");
  const [quantified, setQuantified] = useState(true);
  const [includeProject, setIncludeProject] = useState(true);
  const [template, setTemplate] = useState<CVTemplate>("minimal");
  const [outputLanguage, setOutputLanguage] = useState<CVLanguage>("en");
  const data = useMemo(() => makeDemoData(target, quantified, outputLanguage, template, includeProject), [target, quantified, outputLanguage, template, includeProject]);
  const score = scoreCV(data);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="no-print space-y-4">
        <Card className="border-white/70 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
          <CardHeader>
            <Badge className="mb-2 w-fit rounded-full"><Activity className="mr-1 size-3" />Live demo</Badge>
            <CardTitle className="flex items-center gap-2 text-xl"><AppWindow className="size-5" />Interactive CV lab</CardTitle>
            <p className="text-sm text-muted-foreground">Change the target, evidence, template, or language and watch the score + preview react instantly.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Target opportunity</Label>
              <Select value={target} onValueChange={(value) => setTarget(value as DemoTarget)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Research internship</SelectItem>
                  <SelectItem value="product">Product internship</SelectItem>
                  <SelectItem value="engineering">Frontend engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>{dictionary.builder.template}</Label>
                <Select value={template} onValueChange={(value) => setTemplate(value as CVTemplate)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="modern">{dictionary.templates.modern}</SelectItem><SelectItem value="classic">{dictionary.templates.classic}</SelectItem><SelectItem value="minimal">{dictionary.templates.minimal}</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{dictionary.builder.language}</Label>
                <Select value={outputLanguage} onValueChange={(value) => setOutputLanguage(value as CVLanguage)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4"><Label>Use measurable impact</Label><Switch checked={quantified} onCheckedChange={setQuantified} /></div>
              <div className="flex items-center justify-between gap-4"><Label>Include project proof</Label><Switch checked={includeProject} onCheckedChange={setIncludeProject} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-blue-50 p-3"><Gauge className="mx-auto mb-1 size-4 text-blue-700" /><p className="text-lg font-bold">{score.overall}</p><p className="text-[11px] text-muted-foreground">Score</p></div>
              <div className="rounded-2xl bg-emerald-50 p-3"><Sparkles className="mx-auto mb-1 size-4 text-emerald-700" /><p className="text-lg font-bold">3</p><p className="text-[11px] text-muted-foreground">Templates</p></div>
              <div className="rounded-2xl bg-violet-50 p-3"><Languages className="mx-auto mb-1 size-4 text-violet-700" /><p className="text-lg font-bold">2</p><p className="text-[11px] text-muted-foreground">Languages</p></div>
            </div>
          </CardContent>
        </Card>
        <CVScorePanel data={data} dictionary={dictionary} />
        <Card className="border-white/70 bg-white/85 shadow-xl">
          <CardContent className="space-y-3 p-5">
            <PDFExportButton dictionary={dictionary} />
            <p className="flex gap-2 text-xs text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />Print CSS hides controls and keeps the CV frame clean on mobile and desktop.</p>
          </CardContent>
        </Card>
      </aside>
      <section className="min-w-0">
        <div className="no-print mb-3 flex items-center gap-2 text-sm text-muted-foreground"><Eye className="size-4" />Live CV preview</div>
        <div className="overflow-x-auto rounded-[2rem] bg-slate-200/40 p-2 sm:p-4">
          <CVPreview data={data} dictionary={dictionary} />
        </div>
      </section>
    </main>
  );
}
