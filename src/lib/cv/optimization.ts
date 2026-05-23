import type { CVData, Entry } from "./types";

const actionVerbs = ["Built", "Led", "Organized", "Improved", "Designed", "Launched", "Coordinated", "Delivered"];
const weakWords = ["helped", "worked on", "responsible for", "hard-working", "passionate"];

export function splitLines(value?: unknown) {
  return String(value ?? "")
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function strengthenBullet(input: string, context?: string) {
  const cleaned = input
    .replace(/\bhelped with\b/gi, "Supported")
    .replace(/\bhelped\b/gi, "Contributed to")
    .replace(/\bworked on\b/gi, "Developed")
    .trim();

  const startsWithVerb = actionVerbs.some((verb) =>
    cleaned.toLowerCase().startsWith(verb.toLowerCase()),
  );

  const sentence = startsWithVerb ? cleaned : `${context ? "Delivered" : "Improved"} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

export function bulletsForEntry(entry: Entry, kind: "experience" | "project" | "achievement") {
  if (Array.isArray(entry.generated_bullets)) return entry.generated_bullets.map(String);
  if (typeof entry.generated_bullet === "string" && entry.generated_bullet) return [entry.generated_bullet];

  const raw =
    kind === "experience"
      ? [...splitLines(entry.achievements), ...splitLines(entry.responsibilities), ...splitLines(entry.impact)]
      : kind === "project"
        ? [...splitLines(entry.results), ...splitLines(entry.features_built), ...splitLines(entry.impact)]
        : [...splitLines(entry.description), ...splitLines(entry.impact)];

  return raw.slice(0, 3).map((line) => strengthenBullet(line, kind));
}

export function generateSummary(data: CVData) {
  const profile = data.profile;
  const role = profile.target_role || profile.professional_title || data.cv.target_purpose || "candidate";
  const strengths = [
    data.skills.slice(0, 5).map((skill) => skill.name).filter(Boolean).join(", "),
    data.projects[0]?.technologies,
    data.experience[0]?.tools_used,
  ].filter(Boolean);

  if ((data.cv.output_language ?? "en") === "es") {
    return `${profile.preferred_name || profile.full_name || "Profesional"} es un/a ${role} con experiencia demostrable en ${strengths.join(", ") || "proyectos, aprendizaje rápido y ejecución estructurada"}. Destaca por convertir retos reales en resultados claros y comunicarlos con precisión.`;
  }

  return `${profile.preferred_name || profile.full_name || "Professional"} is a ${role} with demonstrated strengths in ${strengths.join(", ") || "projects, rapid learning, and structured execution"}. Known for turning real challenges into clear results and communicating impact with precision.`;
}

export function scoreCV(data: CVData) {
  const contactFields = [data.profile.email, data.profile.phone, data.profile.linkedin_url || data.profile.portfolio_url || data.profile.github_url];
  const sections = [data.education, data.experience, data.projects, data.achievements, data.skills, data.languages, data.certifications];
  const filledSections = sections.filter((section) => section.some((item) => item.include_in_cv !== false)).length;
  const allText = JSON.stringify(data).toLowerCase();
  const hasMetrics = /\d|%|\$|users|people|students|participants|hours|revenue|growth|metrics/.test(allText);
  const weakCount = weakWords.filter((word) => allText.includes(word)).length;
  const hasTarget = Boolean(data.cv.target_description || data.cv.target_purpose || data.profile.target_role);
  const hasDates = [...data.education, ...data.experience].some((entry) => entry.start_date || entry.date);

  const completeness = Math.min(100, Math.round((filledSections / 7) * 70 + contactFields.filter(Boolean).length * 10));
  const clarity = Math.max(45, 90 - weakCount * 12 + (hasTarget ? 8 : 0));
  const impact = hasMetrics ? 84 : 58;
  const ats = Math.min(100, 60 + (data.skills.length ? 14 : 0) + (hasDates ? 12 : 0) + (hasTarget ? 10 : 0));
  const overall = Math.round((completeness + clarity + impact + ats) / 4);

  const suggestions = [
    !data.profile.email && "Add an email address.",
    !data.profile.phone && "Add a phone number.",
    !hasTarget && "Add a target role or opportunity description.",
    !hasMetrics && "Add measurable results: users, participants, money, hours, ranking, or percentages.",
    weakCount > 0 && "Replace vague phrases with action verbs and evidence.",
    !data.projects.length && "Add projects if your target role is technical, academic, creative, or product-focused.",
    !data.achievements.length && "Add achievements, awards, scholarships, publications, or recognitions.",
  ].filter(Boolean) as string[];

  return {
    overall,
    completeness,
    clarity,
    impact,
    ats,
    contact: Math.round((contactFields.filter(Boolean).length / contactFields.length) * 100),
    achievement: data.achievements.length ? (hasMetrics ? 82 : 66) : 35,
    skills: data.skills.length >= 6 ? 88 : Math.max(35, data.skills.length * 12),
    formatting: 92,
    suggestions,
  };
}

export const aiPrompts = {
  summary: "Rewrite the provided facts into a concise professional CV summary. Never invent facts, dates, schools, companies, metrics, awards, or skills.",
  bullet: "Rewrite this raw input as one strong CV bullet. Preserve truthfulness. Do not invent numbers. Ask for missing metrics separately if needed.",
  achievement: "Strengthen the achievement description using only supplied evidence. Emphasize level, selectivity, difficulty, and impact without exaggeration.",
  project: "Optimize the project for a CV. Highlight problem, role, technologies, features, and results. Never add unsupported claims.",
  experience: "Optimize work experience bullets using action verbs, tools, scope, and impact. Never invent employers, dates, metrics, or titles.",
  translation: "Translate the CV content between English and Spanish while preserving facts, tone, dates, names, institutions, and URLs exactly.",
  tailoring: "Tailor CV wording to the target opportunity using only user-provided facts. Suggest missing information instead of hallucinating.",
  feedback: "Generate concise CV feedback across completeness, clarity, impact, ATS friendliness, and formatting. Do not fabricate data.",
};
