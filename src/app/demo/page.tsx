import { PublicNav } from "@/components/layout/AppChrome";
import { InteractiveDemo } from "@/components/demo/InteractiveDemo";
import { getDictionary } from "@/lib/i18n/server";

export default async function DemoPage() {
  const dictionary = await getDictionary();
  return (
    <>
      <PublicNav dictionary={dictionary} />
      <InteractiveDemo dictionary={dictionary} />
    </>
  );
}
