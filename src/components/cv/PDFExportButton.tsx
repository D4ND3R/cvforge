"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function PDFExportButton({ dictionary }: { dictionary: Dictionary }) {
  const print = () => window.print();

  return (
    <div className="flex gap-2">
      <Button onClick={print} className="gap-2"><Download className="size-4" />{dictionary.builder.export}</Button>
      <Button onClick={print} variant="outline" className="gap-2"><Printer className="size-4" />{dictionary.builder.print}</Button>
    </div>
  );
}
