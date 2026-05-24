import { cn } from "@/lib/utils";

export function CVForgeLogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid size-10 place-items-center rounded-[1.1rem] bg-[linear-gradient(135deg,#172554,#2563eb_52%,#60a5fa)] text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/40", className)}>
      <svg viewBox="0 0 42 42" aria-hidden="true" className="size-7">
        <path d="M12 12.5h8.5c3.6 0 6.5 2.9 6.5 6.5v10.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M12 12.5v17h10.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M29.5 11.5l-6 18" fill="none" stroke="#bfdbfe" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M31 10.5l2.2-4.2 2.2 4.2 4.2 2.2-4.2 2.2-2.2 4.2-2.2-4.2-4.2-2.2 4.2-2.2Z" fill="#eff6ff" />
      </svg>
    </span>
  );
}
