import { cookies } from "next/headers";
import { dictionaries, type Locale } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("cvforge-locale")?.value;
  return value === "es" ? "es" : "en";
}

export async function getDictionary() {
  const locale = await getLocale();
  return dictionaries[locale];
}
