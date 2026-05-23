import { updateProfileAction } from "@/lib/actions/cv";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const fields = ["full_name", "preferred_name", "professional_title", "email", "phone", "city", "country", "linkedin_url", "github_url", "portfolio_url", "personal_website_url", "target_role", "target_market"];

function labelize(field: string) {
  return field.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ProfileSettingsForm({ profile, dictionary }: { profile: Record<string, unknown>; dictionary: Dictionary }) {
  return (
    <Card className="border-white/70 bg-white/85 shadow-xl">
      <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
      <CardContent>
        <form action={updateProfileAction} className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{labelize(field)}</Label>
              <Input id={field} name={field} defaultValue={String(profile[field] ?? "")} />
            </div>
          ))}
          <div className="space-y-2">
            <Label>{dictionary.nav.settings}</Label>
            <Select name="preferred_language" defaultValue={String(profile.preferred_language || "en")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2"><Button>{dictionary.builder.save}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
