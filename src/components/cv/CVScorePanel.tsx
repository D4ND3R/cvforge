import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { scoreCV } from "@/lib/cv/optimization";
import type { CVData } from "@/lib/cv/types";

export function CVScorePanel({ data, dictionary }: { data: CVData; dictionary: Dictionary }) {
  const score = scoreCV(data);
  const rows = [
    [dictionary.score.completeness, score.completeness],
    [dictionary.score.clarity, score.clarity],
    [dictionary.score.impact, score.impact],
    [dictionary.score.ats, score.ats],
    [dictionary.score.contact, score.contact],
    [dictionary.score.achievement, score.achievement],
    [dictionary.score.skills, score.skills],
    [dictionary.score.formatting, score.formatting],
  ] as const;

  return (
    <Card className="border-white/70 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          {dictionary.builder.score}
          <span className="text-2xl font-bold">{score.overall}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map(([label, value]) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-xs"><span>{label}</span><span>{value}</span></div>
            <Progress value={value} />
          </div>
        ))}
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium"><AlertCircle className="size-4" />{dictionary.score.suggestions}</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {(score.suggestions.length ? score.suggestions : ["Strong foundation. Tailor wording to the exact opportunity before exporting."]).map((suggestion) => (
              <li key={suggestion} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-600" />{suggestion}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
