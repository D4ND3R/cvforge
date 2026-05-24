import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Gauge, Globe2, LockKeyhole, Quote, Sparkles, Target, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicNav } from "@/components/layout/AppChrome";
import { CVForgeLogoMark } from "@/components/shared/CVForgeLogo";
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
  const isSpanish = dictionary.nav.login === "Entrar";
  const features = [
    { Icon: Sparkles, title: isSpanish ? "Optimización lista para IA" : "AI-ready optimization", body: isSpanish ? "Mejora resúmenes y bullets con IA si está configurada, o con reglas determinísticas si no." : "Improve summaries and bullets using AI when configured, or deterministic rules when not." },
    { Icon: Target, title: isSpanish ? "Versiones dirigidas" : "Targeted versions", body: isSpanish ? "Crea CVs para empleo, becas, prácticas, investigación y perfiles founder." : "Create multiple CVs for jobs, scholarships, internships, research programs, and founder profiles." },
    { Icon: FileText, title: isSpanish ? "Plantillas premium" : "Beautiful templates", body: isSpanish ? "Plantillas modernas, clásicas y minimalistas con exportación limpia a PDF." : "Modern, classic, and minimal templates with clean PDF print behavior." },
    { Icon: Wand2, title: isSpanish ? "Puntuación útil" : "Useful scoring", body: isSpanish ? "Feedback de completitud, claridad, impacto, ATS, contacto, habilidades y logros." : "Completeness, clarity, impact, ATS, contact, skills, and achievement feedback." },
  ];
  const steps = isSpanish
    ? ["Cuéntale tu historia completa", "Agrega evidencia, métricas y enlaces", "Optimiza el CV para cada oportunidad", "Previsualiza y exporta en PDF"]
    : ["Tell the complete story", "Add evidence, metrics, and links", "Optimize for each opportunity", "Preview and export as PDF"];
  const testimonials = isSpanish
    ? [
        ["“Por fin pude explicar mis proyectos sin sonar genérico.”", "Valeria, beca internacional"],
        ["“La puntuación me mostró exactamente qué faltaba antes de enviar.”", "Andrés, prácticas de ingeniería"],
        ["“Se siente como un coach de CV, no como un formulario.”", "Camila, primer empleo"],
      ]
    : [
        ["“I finally explained my projects without sounding generic.”", "Valeria, international scholarship"],
        ["“The score showed me exactly what was missing before I applied.”", "Andrés, engineering internship"],
        ["“It feels like a CV coach, not another form.”", "Camila, first full-time role"],
      ];
  const useCases = isSpanish
    ? ["Estudiantes", "Becas", "Prácticas", "Investigación", "Tech", "Emprendedores"]
    : ["Students", "Scholarships", "Internships", "Research", "Tech", "Founders"];
  const trustCards = [
    { Icon: Gauge, title: isSpanish ? "Score accionable" : "Actionable score", body: isSpanish ? "Detecta datos faltantes, bullets débiles, métricas ausentes y riesgos ATS." : "Spot missing details, weak bullets, absent metrics, and ATS risks." },
    { Icon: Globe2, title: isSpanish ? "Bilingüe real" : "Truly bilingual", body: isSpanish ? "Usa la app en inglés o español y exporta el CV en el idioma que necesites." : "Use the app in English or Spanish and export the CV in the language you need." },
    { Icon: LockKeyhole, title: isSpanish ? "Privacidad por diseño" : "Privacy by design", body: isSpanish ? "Supabase Auth, cookies SSR, RLS y almacenamiento separado por usuario." : "Supabase Auth, SSR cookies, RLS, and user-scoped storage." },
  ];

  return (
    <>
      <PublicNav dictionary={dictionary} />
      <main>
        <section className="relative overflow-hidden px-4 py-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.26),transparent_28rem),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.16),transparent_24rem),linear-gradient(180deg,#fff,rgba(239,246,255,.75))]" />
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
              <div className="mt-8 flex flex-wrap gap-2">
                {useCases.map((useCase) => <Badge key={useCase} variant="secondary" className="rounded-full px-3 py-1">{useCase}</Badge>)}
              </div>
            </div>
            <div className="relative rounded-[2rem] border border-white/70 bg-white/50 p-3 shadow-2xl shadow-blue-200/60 backdrop-blur">
              <div className="absolute -left-4 top-8 z-10 hidden rounded-2xl border bg-white/90 p-4 shadow-xl md:block">
                <p className="text-xs text-muted-foreground">{isSpanish ? "Puntuación CV" : "CV score"}</p>
                <p className="text-3xl font-bold text-blue-700">91</p>
              </div>
              <div className="absolute -right-4 bottom-10 z-10 hidden rounded-2xl border bg-white/90 p-4 shadow-xl md:block">
                <p className="text-xs text-muted-foreground">{isSpanish ? "Listo para PDF" : "PDF ready"}</p>
                <p className="font-semibold">{isSpanish ? "Moderno · ATS" : "Modern · ATS"}</p>
              </div>
              <CVPreview data={demoData} dictionary={dictionary} className="max-h-[720px] overflow-hidden rounded-[1.5rem]" />
            </div>
          </div>
        </section>

        <section className="px-4 pb-8">
          <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
            {[
              ["10+", isSpanish ? "secciones profundas" : "deep CV sections"],
              ["3", isSpanish ? "plantillas profesionales" : "professional templates"],
              ["2", isSpanish ? "idiomas de interfaz y CV" : "UI and CV languages"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60">
                <p className="text-3xl font-bold text-slate-950">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
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

        <section className="px-4 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">{isSpanish ? "Flujo guiado" : "Guided workflow"}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">{isSpanish ? "De información cruda a CV serio." : "From raw details to a serious CV."}</h2>
              <p className="mt-4 text-muted-foreground">{isSpanish ? "CVForge pregunta lo que un buen mentor preguntaría: alcance, dificultad, métricas, herramientas, evidencia e impacto." : "CVForge asks what a good mentor would ask: scope, difficulty, metrics, tools, evidence, and impact."}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {steps.map((step, index) => (
                <Card key={step} className="border-white/70 bg-white/85 shadow-xl shadow-slate-200/60">
                  <CardContent className="p-6">
                    <span className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-sm font-bold text-white">{index + 1}</span>
                    <p className="mt-4 font-semibold">{step}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-100 bg-slate-950 p-6 text-white shadow-2xl shadow-blue-200/50 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-3">
              {trustCards.map(({ Icon, title, body }) => (
                <div key={title}>
                  <Icon className="mb-4 size-8 text-blue-300" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100/80">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">{isSpanish ? "Reseñas" : "Reviews"}</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">{isSpanish ? "Hecho para candidatos exigentes." : "Built for ambitious candidates."}</h2>
              </div>
              <Button variant="outline" asChild><Link href="/demo">{dictionary.landing.secondaryCta}</Link></Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map(([quote, author]) => (
                <Card key={author} className="border-white/70 bg-white/85 shadow-xl shadow-slate-200/60">
                  <CardContent className="p-6">
                    <Quote className="mb-4 size-6 text-blue-700" />
                    <p className="text-lg font-medium leading-8 text-slate-900">{quote}</p>
                    <p className="mt-5 text-sm text-muted-foreground">{author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-2xl shadow-slate-200/70 sm:p-12">
            <CVForgeLogoMark className="mb-5 size-12" />
            <h2 className="text-3xl font-bold tracking-tight">{isSpanish ? "Construye un CV que defienda tu historia." : "Build a CV that argues for your story."}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{isSpanish ? "Empieza con la demo o crea tu cuenta para guardar versiones, fotos, secciones y exportaciones." : "Start with the demo or create an account to save versions, photos, sections, and exports."}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild><Link href="/signup">{dictionary.landing.primaryCta}<ArrowRight className="size-4" /></Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/demo">{dictionary.landing.secondaryCta}</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white/80 px-4 py-10 text-sm text-muted-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2 font-semibold text-foreground"><CVForgeLogoMark className="size-9" />CVForge</div>
            <p className="max-w-sm">{isSpanish ? "Constructor premium de CVs para estudiantes, profesionales jóvenes y candidatos internacionales." : "Premium CV builder for students, young professionals, and international candidates."}</p>
          </div>
          <div className="grid gap-2">
            <p className="font-medium text-foreground">{isSpanish ? "Producto" : "Product"}</p>
            <Link href="/demo" className="hover:text-foreground">{dictionary.nav.demo}</Link>
            <Link href="/signup" className="hover:text-foreground">{dictionary.nav.signup}</Link>
            <Link href="/login" className="hover:text-foreground">{dictionary.nav.login}</Link>
          </div>
          <div className="grid gap-2">
            <p className="font-medium text-foreground">{isSpanish ? "Legal" : "Legal"}</p>
            <span>{isSpanish ? "Sin pagos en el MVP" : "No payments in the MVP"}</span>
            <span>{isSpanish ? "Datos protegidos con RLS" : "Data protected with RLS"}</span>
            <span>© 2026 CVForge. {isSpanish ? "Todos los derechos reservados." : "All rights reserved."}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
