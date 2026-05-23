import { Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { bulletsForEntry, generateSummary } from "@/lib/cv/optimization";
import type { CVData } from "@/lib/cv/types";
import { cn } from "@/lib/utils";

function value(item: Record<string, unknown>, key: string) {
  return String(item[key] ?? "").trim();
}

function DateRange({ item }: { item: Record<string, unknown> }) {
  const start = value(item, "start_date") || value(item, "date");
  const end = item.current ? "Present" : value(item, "end_date");
  return start || end ? <span>{[start, end].filter(Boolean).join(" — ")}</span> : null;
}

function CVSection({ title, template, children }: { title: string; template: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid space-y-2">
      <h2 className={cn("text-xs font-bold uppercase tracking-[0.2em]", template === "modern" ? "text-blue-700" : "text-slate-900")}>{title}</h2>
      {children}
    </section>
  );
}

export function CVPreview({ data, dictionary, className }: { data: CVData; dictionary: Dictionary; className?: string }) {
  const template = data.cv.template_id || "modern";
  const accent = template === "classic" ? "border-slate-900" : template === "minimal" ? "border-slate-200" : "border-blue-500";
  const summary = data.summary || generateSummary(data);
  const includePhoto = data.cv.include_photo && data.profile.avatar_url;

  return (
    <article className={cn("print-page mx-auto min-h-[900px] w-full max-w-[850px] bg-white p-7 text-slate-900 shadow-2xl shadow-slate-300/50 sm:p-10", className)}>
      <header className={cn("flex gap-5 border-b pb-6", accent, template === "classic" && "justify-center text-center", template === "minimal" && "border-b")}>
        {includePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.profile.avatar_url ?? ""} alt="" className="size-20 rounded-2xl object-cover" />
        ) : null}
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{data.profile.full_name || "Your Name"}</h1>
          <p className="mt-1 text-sm font-medium text-slate-600">{data.profile.professional_title || data.profile.target_role || data.cv.target_purpose || "Target role"}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            {data.profile.email ? <span className="inline-flex items-center gap-1"><Mail className="size-3" />{data.profile.email}</span> : null}
            {data.profile.phone ? <span className="inline-flex items-center gap-1"><Phone className="size-3" />{data.profile.phone}</span> : null}
            {data.profile.city || data.profile.country ? <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{[data.profile.city, data.profile.country].filter(Boolean).join(", ")}</span> : null}
            {[data.profile.linkedin_url, data.profile.github_url, data.profile.portfolio_url, data.profile.personal_website_url].filter(Boolean).map((link) => <span key={link}>{link}</span>)}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6">
        <CVSection title={dictionary.sections.summary} template={template}><p className="text-sm leading-6 text-slate-700">{summary}</p></CVSection>

        {data.experience.some((entry) => entry.include_in_cv !== false) ? (
          <CVSection title={dictionary.sections.experience} template={template}>
            <div className="space-y-4">
              {data.experience.filter((entry) => entry.include_in_cv !== false).map((entry) => (
                <div key={entry.id}>
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="font-semibold">{value(entry, "role_title")} · {value(entry, "organization")}</h3>
                    <p className="text-xs text-slate-500"><DateRange item={entry} /></p>
                  </div>
                  <p className="text-xs text-slate-500">{[value(entry, "location"), value(entry, "work_mode")].filter(Boolean).join(" · ")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {bulletsForEntry(entry, "experience").map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </CVSection>
        ) : null}

        {data.projects.some((entry) => entry.include_in_cv !== false) ? (
          <CVSection title={dictionary.sections.projects} template={template}>
            <div className="space-y-4">
              {data.projects.filter((entry) => entry.include_in_cv !== false).map((entry) => (
                <div key={entry.id}>
                  <h3 className="font-semibold">{value(entry, "name")}</h3>
                  <p className="text-xs text-slate-500">{[value(entry, "technologies"), value(entry, "github_url"), value(entry, "demo_url")].filter(Boolean).join(" · ")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {bulletsForEntry(entry, "project").map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </CVSection>
        ) : null}

        {data.education.some((entry) => entry.include_in_cv !== false) ? (
          <CVSection title={dictionary.sections.education} template={template}>
            <div className="space-y-3">
              {data.education.filter((entry) => entry.include_in_cv !== false).map((entry) => (
                <div key={entry.id} className="flex flex-wrap justify-between gap-2 text-sm">
                  <div>
                    <h3 className="font-semibold">{value(entry, "degree") || value(entry, "field_of_study")}</h3>
                    <p className="text-slate-600">{[value(entry, "institution"), value(entry, "location")].filter(Boolean).join(" · ")}</p>
                    <p className="text-slate-600">{[value(entry, "honors"), value(entry, "coursework")].filter(Boolean).join(" · ")}</p>
                  </div>
                  <p className="text-xs text-slate-500"><DateRange item={entry} /></p>
                </div>
              ))}
            </div>
          </CVSection>
        ) : null}

        {data.achievements.some((entry) => entry.include_in_cv !== false) ? (
          <CVSection title={dictionary.sections.achievements} template={template}>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {data.achievements.filter((entry) => entry.include_in_cv !== false).flatMap((entry) => bulletsForEntry(entry, "achievement")).map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </CVSection>
        ) : null}

        {data.skills.length ? <CVSection title={dictionary.sections.skills} template={template}><div className="flex flex-wrap gap-2">{data.skills.filter((entry) => entry.include_in_cv !== false).map((skill) => <Badge key={skill.id} variant="secondary">{value(skill, "name")} {value(skill, "level") ? `· ${value(skill, "level")}` : ""}</Badge>)}</div></CVSection> : null}
        {data.languages.length ? <CVSection title={dictionary.sections.languages} template={template}><p className="text-sm text-slate-700">{data.languages.filter((entry) => entry.include_in_cv !== false).map((language) => [value(language, "language"), value(language, "proficiency"), value(language, "certification")].filter(Boolean).join(" · ")).join(" | ")}</p></CVSection> : null}
        {data.certifications.length ? <CVSection title={dictionary.sections.certifications} template={template}><p className="text-sm text-slate-700">{data.certifications.filter((entry) => entry.include_in_cv !== false).map((cert) => [value(cert, "name"), value(cert, "issuer"), value(cert, "issue_date")].filter(Boolean).join(" · ")).join(" | ")}</p></CVSection> : null}
      </div>
    </article>
  );
}
