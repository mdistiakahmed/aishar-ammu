import type { ReactNode } from "react";

type GuestDashCardProps = {
  title: ReactNode;
  headerClassName: string;
  titleClassName?: string;
  icon?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export function GuestDashCard({
  title,
  headerClassName,
  titleClassName = "text-white",
  icon,
  className = "",
  bodyClassName = "",
  children,
}: GuestDashCardProps) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-[1.15rem] bg-white shadow-[0_6px_18px_rgba(59,31,40,0.06)] lg:rounded-[1.5rem] lg:shadow-[0_10px_28px_rgba(59,31,40,0.07)] ${className}`}
    >
      <div
        className={`flex shrink-0 items-start gap-1.5 rounded-[1rem] px-2.5 py-2.5 sm:items-center sm:gap-2 sm:px-3 sm:py-2.5 lg:rounded-[1.2rem] lg:px-4 lg:py-3 ${headerClassName}`}
      >
        {icon ? (
          <span className="mt-0.5 shrink-0 opacity-90 sm:mt-0">{icon}</span>
        ) : null}
        <h2
          className={`min-w-0 flex-1 text-pretty font-bn text-[0.8rem] font-semibold leading-snug tracking-wide sm:text-[0.85rem] lg:text-base lg:leading-snug ${titleClassName}`}
        >
          {title}
        </h2>
      </div>
      <div className={`flex min-h-0 flex-1 flex-col px-2.5 py-2 lg:px-4 lg:py-3 ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}
