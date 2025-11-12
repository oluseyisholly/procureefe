import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col justify-center gap-10 px-6 py-16 md:flex-row md:items-center md:px-12">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <span className="inline-flex items-center rounded-full bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 shadow-sm">
            Procuree Collective
          </span>
          <h1 className="text-4xl font-bold text-emerald-950 md:text-5xl">{title}</h1>
          <p className="text-base text-emerald-700 md:text-lg">{subtitle}</p>
          <div className="hidden rounded-3xl border border-emerald-100/60 bg-white/70 p-6 text-sm text-emerald-600 shadow-lg backdrop-blur md:block">
            Procuree helps buying groups coordinate bulk purchases and delight their patrons with transparent communication.
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-xl backdrop-blur">
            {children}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-emerald-200 opacity-50 blur-3xl" />
        <div className="absolute bottom-20 -right-10 h-64 w-64 rounded-full bg-emerald-300 opacity-40 blur-3xl" />
      </div>
    </div>
  );
}
