"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const setLocale = (locale: "en" | "es") => {
    document.cookie = `cvforge-locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="size-4" />
          EN/ES
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("es")}>Español</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
