import { AppWindow, CheckCircle2 } from "lucide-react";
import { PublicNav } from "@/components/layout/AppChrome";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVScorePanel } from "@/components/cv/CVScorePanel";
import { PDFExportButton } from "@/components/cv/PDFExportButton";
import { getDictionary } from "@/lib/i18n/server";
import type { CVData } from "@/lib/cv/types";

const demoData: CVData = {
  profile: { full_name: "Mateo Chen", professional_title: "Data Analyst & Scholarship Applicant", email: "mateo@email.com", phone: "+1 555 0100", city: "Austin", country: "United States", linkedin_url: "linkedin.com/in/mateochen", target_role: "Research Internship" },
  cv: { id: "demo", title: "Research CV", template_id: "minimal", output_language: "en", target_purpose: "Research Internship", target_description: "Data-heavy research program", include_photo: false },
  education: [{ id: "edu", institution: "UT Austin", degree: "B.S. Statistics", start_date: "2023", end_date: "2027", coursework: "Regression, experimental design, machine learning", include_in_cv: true }],
  experience: [{ id: "exp", role_title: "Research Assistant", organization: "Social Data Lab", start_date: "2025", current: true, achievements: "Cleaned 45k survey records; automated weekly analysis reports; presented findings to faculty research group", tools_used: "Python, SQL, R", include_in_cv: true }],
  projects: [{ id: "proj", name: "Public Transit Equity Map", technologies: "Python, GeoPandas, Next.js", results: "Visualized commute gaps across 30 neighborhoods", include_in_cv: true }],
  achievements: [{ id: "ach", description: "Selected for a merit scholarship awarded to the top 5% of applicants", include_in_cv: true }],
  skills: [{ id: "sk1", name: "Python", include_in_cv: true }, { id: "sk2", name: "SQL", include_in_cv: true }, { id: "sk3", name: "Data Visualization", include_in_cv: true }],
  languages: [{ id: "lang", language: "English", proficiency: "Native", include_in_cv: true }],
  certifications: [],
};

export default async function DemoPage() {
  const dictionary = await getDictionary();
  return (
    <>
      <PublicNav dictionary={dictionary} />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[360px_1fr]">
        <aside className="no-print space-y-4">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl">
            <h1 className="flex items-center gap-2 text-xl font-bold"><AppWindow className="size-5" />Interactive demo</h1>
            <p className="mt-2 text-sm text-muted-foreground">Explore the scoring, preview, and export experience before signing up.</p>
          </div>
          <CVScorePanel data={demoData} dictionary={dictionary} />
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl">
            <PDFExportButton dictionary={dictionary} />
            <p className="mt-3 flex gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-emerald-600" />Print CSS hides controls and keeps the CV clean.</p>
          </div>
        </aside>
        <CVPreview data={demoData} dictionary={dictionary} />
      </main>
    </>
  );
}
