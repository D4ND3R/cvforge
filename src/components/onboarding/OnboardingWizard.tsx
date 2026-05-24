"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { completeOnboardingAction } from "@/lib/actions/cv";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const fields = [
  ["full_name", "preferred_name", "professional_title", "city", "country", "preferred_language", "target_market"],
  ["email", "phone", "linkedin_url", "github_url", "portfolio_url", "personal_website_url"],
  ["target_role", "career_objective", "industries", "strongest_areas", "difference", "short_goals", "long_goals"],
  ["education_background", "academic_focus", "coursework", "honors"],
  ["technical_skills", "soft_skills", "tools", "programming_languages", "spoken_languages"],
  ["experience_background", "leadership_background", "volunteer_background", "research_background"],
  ["project_background", "apps_built", "opensource", "research_projects"],
  ["awards", "competitions", "scholarships", "publications", "certifications"],
  ["tone", "template_id", "desired_length", "cv_language"],
  ["target_description"],
];

function labelize(key: string) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function OnboardingWizard({ dictionary, profile }: { dictionary: Dictionary; profile: Record<string, unknown> }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.flat().map((field) => [field, String(profile[field] ?? "")])),
  );
  const progress = useMemo(() => Math.round(((step + 1) / fields.length) * 100), [step]);
  const currentFields = fields[step];
  const setField = (field: string, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  return (
    <Card className="border-white/70 bg-white/85 shadow-2xl shadow-slate-200/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">{dictionary.onboarding.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{dictionary.onboarding.subtitle}</p>
        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-xs"><span>{dictionary.onboarding.steps[step]}</span><span>{progress}%</span></div>
          <Progress value={progress} />
        </div>
      </CardHeader>
      <CardContent>
        <form action={completeOnboardingAction}>
          {fields.flat().filter((field) => !currentFields.includes(field)).map((field) => (
            <input key={field} type="hidden" name={field} value={values[field] ?? ""} />
          ))}
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
            {currentFields.map((field) => (
              <div key={field} className={field.includes("background") || field.includes("description") || field.includes("objective") || field.includes("goals") ? "space-y-2 md:col-span-2" : "space-y-2"}>
                <Label htmlFor={field}>{labelize(field)}</Label>
                {["preferred_language", "cv_language"].includes(field) ? (
                  <Select name={field} value={values[field] || "en"} onValueChange={(value) => setField(field, value ?? "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem></SelectContent></Select>
                ) : field === "template_id" ? (
                  <Select name={field} value={values[field] || "modern"} onValueChange={(value) => setField(field, value ?? "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="modern">{dictionary.templates.modern}</SelectItem><SelectItem value="classic">{dictionary.templates.classic}</SelectItem><SelectItem value="minimal">{dictionary.templates.minimal}</SelectItem></SelectContent></Select>
                ) : field === "tone" ? (
                  <Select name={field} value={values[field] || "professional"} onValueChange={(value) => setField(field, value ?? "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["formal", "concise", "ambitious", "creative", "academic", "technical", "professional"].map((tone) => <SelectItem key={tone} value={tone}>{tone}</SelectItem>)}</SelectContent></Select>
                ) : field === "desired_length" ? (
                  <Select name={field} value={values[field] || "one_page"} onValueChange={(value) => setField(field, value ?? "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="one_page">1 page</SelectItem><SelectItem value="two_pages">2 pages</SelectItem><SelectItem value="flexible">Flexible</SelectItem></SelectContent></Select>
                ) : field.includes("background") || field.includes("description") || field.includes("objective") || field.includes("goals") || field.includes("areas") || field.includes("difference") ? (
                  <Textarea id={field} name={field} value={values[field] ?? ""} onChange={(event) => setField(field, event.target.value)} rows={4} />
                ) : (
                  <Input id={field} name={field} value={values[field] ?? ""} onChange={(event) => setField(field, event.target.value)} />
                )}
              </div>
            ))}
          </motion.div>
          <div className="sticky bottom-0 -mx-6 mt-8 flex justify-between border-t bg-white/90 px-6 py-4 backdrop-blur">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft className="size-4" />{dictionary.onboarding.back}</Button>
            {step < fields.length - 1 ? (
              <Button type="button" onClick={() => setStep((value) => Math.min(fields.length - 1, value + 1))}>{dictionary.onboarding.next}<ArrowRight className="size-4" /></Button>
            ) : (
              <Button type="submit">{dictionary.onboarding.finish}</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
