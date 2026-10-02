"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { IconType } from "react-icons";
import {
  LuCircleDot,
  LuDiamond,
  LuCalendar,
  LuHeart,
  LuHouse,
  LuMoon,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuScale,
  LuSquare,
  LuX,
} from "react-icons/lu";
import { brand, brandBn } from "@/lib/constants";

const groups: { title: string; items: { href: string; label: string; icon: IconType }[] }[] = [
  {
    title: "আমার গর্ভাবস্থা",
    items: [
      { href: "/", label: "হোম", icon: LuHouse },
      { href: "/baby-movement", label: "বেবি মুভমেন্ট", icon: LuCircleDot },
      { href: "/mother-weight", label: "মায়ের ওজন", icon: LuScale },
    ],
  },
  {
    title: "গর্ভাবস্থা সম্পর্কে জানুন",
    items: [
      { href: "/pregnancy-weeks", label: "সপ্তাহ অনুযায়ী গর্ভাবস্থা", icon: LuSquare },
      { href: "/pregnancy-due-date", label: "সম্ভাব্য প্রসবের তারিখ", icon: LuCalendar },
      { href: "/common-concerns", label: "সাধারণ সমস্যা ও সমাধান", icon: LuHeart },
    ],
  },
  {
    title: "আরও",
    items: [
      { href: "/baby-names", label: "শিশুর নাম", icon: LuDiamond },
      { href: "/duas", label: "ইসলামিক দোয়া", icon: LuMoon },
    ],
  },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapsed,
}: {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/35 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] flex-col border-r border-[#d5ebe8] bg-white shadow-xl transition-[transform,width] duration-200 ease-out lg:z-30 lg:w-(--sidebar-offset) lg:translate-x-0 lg:overflow-hidden lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#d5ebe8] px-4 py-4 lg:hidden">
          <p className="min-w-0 truncate font-[family-name:var(--font-hind)] font-semibold text-ink">
            {brand} · {brandBn}
          </p>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-ink"
            onClick={onClose}
            aria-label="Close menu"
          >
            <LuX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden shrink-0 border-b border-[#d5ebe8] p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex h-11 items-center rounded-full text-sm font-medium text-[#5f7c82] hover:bg-[#e7f6f5] hover:text-ink ${
              collapsed ? "mx-auto w-11 justify-center" : "w-full gap-3 px-3"
            }`}
          >
            {collapsed ? (
              <LuPanelLeftOpen className="h-5 w-5" aria-hidden="true" />
            ) : (
              <>
                <LuPanelLeftClose className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        <div
          className={`sidebar-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden py-5 ${
            collapsed ? "px-3 lg:px-2" : "px-3"
          }`}
        >
          <nav className="space-y-5">
            {groups.map((group, index) => (
              <div key={group.title} className={index > 0 ? "border-t border-[#d5ebe8] pt-4" : ""}>
                <p className={`font-bn px-3 text-xs text-[#6d8388] ${collapsed ? "lg:sr-only" : ""}`}>
                  {group.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const current = isCurrent(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          title={collapsed ? item.label : undefined}
                          aria-current={current ? "page" : undefined}
                          className={`font-bn flex min-h-12 items-center gap-3 rounded-full px-3 text-[15px] font-medium leading-snug ${
                            collapsed ? "lg:mx-auto lg:w-12 lg:justify-center lg:gap-0 lg:px-0" : ""
                          } ${
                            current
                              ? "bg-lagoon text-white"
                              : "text-ink hover:bg-[#e7f6f5]"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 shrink-0 ${current ? "text-white" : "text-[#5f7c82]"}`}
                            aria-hidden="true"
                          />
                          <span className={collapsed ? "lg:sr-only" : undefined}>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
