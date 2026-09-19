import type { ReactNode } from "react";

export function PanelCard({
  eyebrow,
  title,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      className={`rounded-[2rem] border border-rose-100 bg-white p-5 sm:p-6 ${wide ? "sm:col-span-2" : ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">{eyebrow}</p>
      <h2 className="mt-2 text-lg font-semibold text-rose-950">{title}</h2>
      {children}
    </section>
  );
}

export function ChartBox({ children }: { children: ReactNode }) {
  return <div className="mt-4 h-44 w-full min-w-0">{children}</div>;
}
