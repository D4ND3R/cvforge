"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";

const createCvSchema = z.object({
  title: z.string().min(2, "Give this CV a clear title."),
  target_purpose: z.string().optional(),
  output_language: z.enum(["en", "es"]),
  template_id: z.enum(["modern", "classic", "minimal"]),
});

type CreateCvValues = z.infer<typeof createCvSchema>;

export function CreateCvForm({ dictionary, userId }: { dictionary: Dictionary; userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const form = useForm<CreateCvValues>({
    resolver: zodResolver(createCvSchema),
    defaultValues: {
      title: "",
      target_purpose: "",
      output_language: "en",
      template_id: "modern",
    },
  });
  const outputLanguage = useWatch({ control: form.control, name: "output_language" });
  const templateId = useWatch({ control: form.control, name: "template_id" });

  const submit = form.handleSubmit(async (values) => {
    const { data, error } = await supabase
      .from("cv_versions")
      .insert({ ...values, user_id: userId })
      .select("id")
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push(`/builder/${(data as { id: string }).id}`);
    router.refresh();
  });

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
      <div className="space-y-2 md:col-span-2">
        <Label>CV title</Label>
        <Input {...form.register("title")} placeholder="Scholarship CV" />
        {form.formState.errors.title ? <p className="text-xs text-destructive">{form.formState.errors.title.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label>{dictionary.builder.language}</Label>
        <Select value={outputLanguage} onValueChange={(value) => form.setValue("output_language", value as CreateCvValues["output_language"], { shouldValidate: true })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{dictionary.builder.template}</Label>
        <Select value={templateId} onValueChange={(value) => form.setValue("template_id", value as CreateCvValues["template_id"], { shouldValidate: true })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="modern">{dictionary.templates.modern}</SelectItem><SelectItem value="classic">{dictionary.templates.classic}</SelectItem><SelectItem value="minimal">{dictionary.templates.minimal}</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-3">
        <Label>{dictionary.builder.purpose}</Label>
        <Input {...form.register("target_purpose")} placeholder="Frontend internship, scholarship, research role..." />
      </div>
      <Button type="submit" className="self-end" disabled={form.formState.isSubmitting}>{dictionary.dashboard.create}</Button>
    </form>
  );
}
