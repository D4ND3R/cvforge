"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function PDFExportButton({ dictionary }: { dictionary: Dictionary }) {
  const print = () => window.print();

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <Button type="button" onClick={print} className="w-full gap-2 sm:w-auto"><Download className="size-4" />{dictionary.builder.export}</Button>
      <Button type="button" onClick={print} variant="outline" className="w-full gap-2 sm:w-auto"><Printer className="size-4" />{dictionary.builder.print}</Button>
    </div>
  );
}
