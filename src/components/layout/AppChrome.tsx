import Link from "next/link";
import { FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { signOutAction } from "@/lib/actions/auth";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-blue-500/20">
        <FileText className="size-4" />
      </span>
      <span>CVForge</span>
    </Link>
  );
}

export function PublicNav({ dictionary }: { dictionary: Dictionary }) {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Brand />
        <nav className="hidden items-center gap-2 md:flex">
          <Link className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground" href="/#features">{dictionary.nav.product}</Link>
          <Link className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground" href="/demo">{dictionary.nav.demo}</Link>
          <LanguageSwitcher />
          <Button variant="ghost" asChild><Link href="/login">{dictionary.nav.login}</Link></Button>
          <Button asChild><Link href="/signup">{dictionary.nav.signup}</Link></Button>
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="size-5" /></Button></SheetTrigger>
            <SheetContent>
              <div className="mt-8 grid gap-3">
                <Link href="/demo">{dictionary.nav.demo}</Link>
                <Link href="/login">{dictionary.nav.login}</Link>
                <Button asChild><Link href="/signup">{dictionary.nav.signup}</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function AppNav({ dictionary }: { dictionary: Dictionary }) {
  const links = [
    ["/dashboard", dictionary.nav.dashboard],
    ["/settings", dictionary.nav.settings],
    ["/account", dictionary.nav.account],
  ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Brand />
        <nav className="hidden items-center gap-2 md:flex">
          {links.map(([href, label]) => (
            <Button key={href} variant="ghost" asChild><Link href={href}>{label}</Link></Button>
          ))}
          <LanguageSwitcher />
          <form action={signOutAction}><Button variant="outline">{dictionary.nav.logout}</Button></form>
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="size-5" /></Button></SheetTrigger>
            <SheetContent>
              <div className="mt-8 grid gap-3">
                {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
                <form action={signOutAction}><Button variant="outline">{dictionary.nav.logout}</Button></form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
