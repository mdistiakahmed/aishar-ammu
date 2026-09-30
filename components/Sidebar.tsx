"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { IconType } from "react-icons";
import {
  LuCircleDot,
  LuDiamond,
  LuHeart,
  LuHouse,
  LuMoon,
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
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
          className="fixed inset-0 z-40 bg-rose-950/35 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] flex-col border-r border-rose-100 bg-white shadow-xl transition-transform duration-200 lg:top-[4.25rem] lg:z-30 lg:h-[calc(100vh-4.25rem)] lg:w-72 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rose-100 px-4 py-4 lg:hidden">
          <p className="min-w-0 truncate font-[family-name:var(--font-hind)] font-semibold text-rose-950">
            {brand} · {brandBn}
          </p>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-rose-800"
            onClick={onClose}
            aria-label="Close menu"
          >
            <LuX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="sidebar-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          <nav className="space-y-5">
            {groups.map((group, index) => (
              <div key={group.title} className={index > 0 ? "border-t border-rose-100 pt-4" : ""}>
                <p className="font-bn px-3 text-xs text-rose-900/45">{group.title}</p>
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const current = isCurrent(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          aria-current={current ? "page" : undefined}
                          className={`font-bn flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-medium leading-snug ${
                            current
                              ? "bg-rose-100 text-rose-950"
                              : "text-rose-950 hover:bg-rose-50"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-rose-900" aria-hidden="true" />
                          {item.label}
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
