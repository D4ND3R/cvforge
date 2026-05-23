"use client";

import { useMemo, useState, useTransition } from "react";
import { Copy, Loader2, Plus, Sparkles, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVScorePanel } from "@/components/cv/CVScorePanel";
import { PDFExportButton } from "@/components/cv/PDFExportButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";
import { generateSummary } from "@/lib/cv/optimization";
import type { CVData, Entry } from "@/lib/cv/types";

type TableName =
  | "education_entries"
  | "experience_entries"
  | "project_entries"
  | "achievement_entries"
  | "skill_entries"
  | "language_entries"
  | "certification_entries";

const sectionConfig: Record<string, { table: TableName; key: keyof CVData; fields: string[] }> = {
  education: { table: "education_entries", key: "education", fields: ["institution", "degree", "field_of_study", "location", "start_date", "end_date", "gpa", "coursework", "honors", "description"] },
  experience: { table: "experience_entries", key: "experience", fields: ["role_title", "organization", "location", "work_mode", "start_date", "end_date", "responsibilities", "achievements", "tools_used", "metrics", "team_size", "leadership", "problem_solved", "impact"] },
  projects: { table: "project_entries", key: "projects", fields: ["name", "short_description", "problem_solved", "technologies", "user_role", "features_built", "results", "impact", "github_url", "demo_url"] },
  achievements: { table: "achievement_entries", key: "achievements", fields: ["title", "organization", "date", "level", "placement", "participants", "selection_rate", "prize_amount", "description", "difficulty", "skills_demonstrated", "impact", "proof_url"] },
  skills: { table: "skill_entries", key: "skills", fields: ["name", "category", "level"] },
  languages: { table: "language_entries", key: "languages", fields: ["language", "proficiency", "certification"] },
  certifications: { table: "certification_entries", key: "certifications", fields: ["name", "issuer", "issue_date", "expiration_date", "credential_url", "description"] },
};

const longFields = new Set(["responsibilities", "achievements", "description", "impact", "features_built", "results", "problem_solved", "leadership", "difficulty"]);

function fieldLabel(field: string) {
  return field.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function BuilderClient({ initialData, dictionary, userId }: { initialData: CVData; dictionary: Dictionary; userId: string }) {
  const [data, setData] = useState<CVData>(initialData);
  const [isPending, startTransition] = useTransition();
  const supabase = useMemo(() => createClient(), []);

  const saveCv = () => startTransition(async () => {
    const { error } = await supabase.from("cv_versions").update({
      title: data.cv.title,
      target_purpose: data.cv.target_purpose,
      target_description: data.cv.target_description,
      template_id: data.cv.template_id,
      output_language: data.cv.output_language,
      tone: data.cv.tone,
      desired_length: data.cv.desired_length,
      include_photo: data.cv.include_photo,
    }).eq("id", data.cv.id).eq("user_id", userId);
    toast(error ? error.message : dictionary.common.saveSuccess);
  });

  const saveProfile = () => startTransition(async () => {
    const { error } = await supabase.from("profiles").upsert({ ...data.profile, id: userId });
    toast(error ? error.message : dictionary.common.saveSuccess);
  });

  const optimizeSummary = () => startTransition(async () => {
    const fallback = generateSummary(data);
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "summary", data }),
      });
      const json = await response.json();
      const content = json.content || fallback;
      setData((current) => ({ ...current, summary: content }));
      await supabase.from("generated_sections").upsert({
        user_id: userId,
        cv_id: data.cv.id,
        section_type: "summary",
        language: data.cv.output_language,
        content,
      });
      toast(dictionary.common.saveSuccess);
    } catch {
      setData((current) => ({ ...current, summary: fallback }));
    }
  });

  const uploadPhoto = async (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      toast("Use a JPG, PNG, or WebP under 2MB.");
      return;
    }
    const extension = file.type.split("/")[1];
    const path = `${userId}/avatar.${extension}`;
    const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true, contentType: file.type });
    if (error) return toast(error.message);
    const { data: publicUrl } = supabase.storage.from("profile-photos").getPublicUrl(path);
    setData((current) => ({ ...current, profile: { ...current.profile, avatar_url: publicUrl.publicUrl } }));
    await supabase.from("profiles").update({ avatar_url: publicUrl.publicUrl }).eq("id", userId);
    toast(dictionary.common.saveSuccess);
  };

  return (
    <main className="mx-auto grid w-full max-w-[1600px] gap-5 px-4 py-6 xl:grid-cols-[420px_1fr_340px]">
      <Toaster />
      <section className="no-print space-y-4">
        <Card className="border-white/70 bg-white/85 shadow-xl">
          <CardHeader><CardTitle>{dictionary.builder.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input value={data.cv.title} onChange={(event) => setData((current) => ({ ...current, cv: { ...current.cv, title: event.target.value } }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>{dictionary.builder.template}</Label><Select value={String(data.cv.template_id || "modern")} onValueChange={(value) => setData((current) => ({ ...current, cv: { ...current.cv, template_id: value ?? "modern" } }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="modern">{dictionary.templates.modern}</SelectItem><SelectItem value="classic">{dictionary.templates.classic}</SelectItem><SelectItem value="minimal">{dictionary.templates.minimal}</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>{dictionary.builder.language}</Label><Select value={String(data.cv.output_language || "en")} onValueChange={(value) => setData((current) => ({ ...current, cv: { ...current.cv, output_language: value ?? "en" } }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>{dictionary.builder.purpose}</Label><Input value={String(data.cv.target_purpose || "")} onChange={(event) => setData((current) => ({ ...current, cv: { ...current.cv, target_purpose: event.target.value } }))} /></div>
            <div className="space-y-2"><Label>{dictionary.builder.target}</Label><Textarea rows={4} value={String(data.cv.target_description || "")} onChange={(event) => setData((current) => ({ ...current, cv: { ...current.cv, target_description: event.target.value } }))} /></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><Label>{dictionary.builder.includePhoto}</Label><Switch checked={Boolean(data.cv.include_photo)} onCheckedChange={(checked) => setData((current) => ({ ...current, cv: { ...current.cv, include_photo: checked } }))} /></div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveCv} disabled={isPending}>{isPending ? <Loader2 className="size-4 animate-spin" /> : dictionary.builder.save}</Button>
              <Button variant="outline" onClick={optimizeSummary}><Sparkles className="size-4" />{dictionary.builder.optimize}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85 shadow-xl">
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["full_name", "professional_title", "email", "phone", "city", "country", "linkedin_url", "github_url", "portfolio_url", "personal_website_url"].map((field) => (
              <div key={field} className="space-y-1"><Label>{fieldLabel(field)}</Label><Input value={String(data.profile[field as keyof typeof data.profile] || "")} onChange={(event) => setData((current) => ({ ...current, profile: { ...current.profile, [field]: event.target.value } }))} /></div>
            ))}
            <Label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-sm"><Upload className="size-4" />{dictionary.builder.photo}<Input className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadPhoto(event.target.files?.[0])} /></Label>
            <Button variant="outline" onClick={saveProfile}>{dictionary.builder.save}</Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="no-print flex justify-end"><PDFExportButton dictionary={dictionary} /></div>
        <CVPreview data={data} dictionary={dictionary} />
      </section>

      <aside className="no-print space-y-4">
        <CVScorePanel data={data} dictionary={dictionary} />
        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid h-auto grid-cols-2">
            {Object.keys(sectionConfig).map((key) => <TabsTrigger key={key} value={key}>{dictionary.sections[key as keyof typeof dictionary.sections]}</TabsTrigger>)}
          </TabsList>
          {Object.entries(sectionConfig).map(([section, config]) => (
            <TabsContent key={section} value={section}>
              <SectionEditor data={data} setData={setData} userId={userId} cvId={data.cv.id} dictionary={dictionary} section={section} config={config} supabase={supabase} />
            </TabsContent>
          ))}
        </Tabs>
      </aside>
    </main>
  );
}

function SectionEditor({ data, setData, userId, cvId, dictionary, section, config, supabase }: {
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
  userId: string;
  cvId: string;
  dictionary: Dictionary;
  section: string;
  config: { table: TableName; key: keyof CVData; fields: string[] };
  supabase: ReturnType<typeof createClient>;
}) {
  const entries = (data[config.key] as Entry[]) ?? [];

  const updateEntry = (index: number, patch: Entry) =>
    setData((current) => {
      const nextEntries = [...((current[config.key] as Entry[]) ?? [])];
      nextEntries[index] = { ...nextEntries[index], ...patch };
      return { ...current, [config.key]: nextEntries };
    });

  const addEntry = async () => {
    const entry = { user_id: userId, cv_id: cvId, include_in_cv: true, sort_order: entries.length };
    const { data: created, error } = await supabase.from(config.table).insert(entry).select("*").single();
    if (error) return toast(error.message);
    setData((current) => ({ ...current, [config.key]: [...((current[config.key] as Entry[]) ?? []), created] }));
  };

  const saveEntry = async (entry: Entry) => {
    const { error } = await supabase.from(config.table).upsert({ ...entry, user_id: userId, cv_id: cvId });
    toast(error ? error.message : dictionary.common.saveSuccess);
  };

  const deleteEntry = async (entry: Entry) => {
    if (entry.id) await supabase.from(config.table).delete().eq("id", entry.id).eq("user_id", userId);
    setData((current) => ({ ...current, [config.key]: ((current[config.key] as Entry[]) ?? []).filter((item) => item.id !== entry.id) }));
  };

  return (
    <Card className="border-white/70 bg-white/85 shadow-xl">
      <CardHeader className="flex-row items-center justify-between"><CardTitle className="text-base">{dictionary.sections[section as keyof typeof dictionary.sections]}</CardTitle><Button size="sm" onClick={addEntry}><Plus className="size-4" />{dictionary.builder.add}</Button></CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry, index) => (
          <div key={entry.id ?? index} className="rounded-2xl border bg-white p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Label>{dictionary.forms.include}</Label>
              <Switch checked={entry.include_in_cv !== false} onCheckedChange={(checked) => updateEntry(index, { include_in_cv: checked })} />
            </div>
            <div className="space-y-3">
              {config.fields.map((field) => (
                <div key={field} className="space-y-1">
                  <Label>{fieldLabel(field)}</Label>
                  {longFields.has(field) ? (
                    <Textarea rows={3} value={String(entry[field] ?? "")} onChange={(event) => updateEntry(index, { [field]: event.target.value })} />
                  ) : (
                    <Input value={String(entry[field] ?? "")} onChange={(event) => updateEntry(index, { [field]: event.target.value })} />
                  )}
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => saveEntry(entry)}>{dictionary.builder.save}</Button>
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(entry, null, 2))}><Copy className="size-4" />{dictionary.builder.copy}</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteEntry(entry)}><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
