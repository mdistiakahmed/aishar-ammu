"use client";

import { useLayoutEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

const SIDEBAR_KEY = "aa-sidebar-collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useLayoutEffect(() => {
    setCollapsed(window.localStorage.getItem(SIDEBAR_KEY) === "1");
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="min-h-full bg-petal text-ink" data-sidebar={collapsed ? "collapsed" : "open"}>
      <Topbar user={user} onOpenMenu={() => setOpen(true)} onLogout={() => void logout()} />
      <Sidebar
        open={open}
        collapsed={collapsed}
        onClose={() => setOpen(false)}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex min-h-[calc(100vh-4.25rem)] flex-col transition-[padding-left] duration-200 ease-out lg:pl-(--sidebar-offset)">
        <main
          className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 ${
            collapsed ? "max-w-5xl lg:max-w-7xl" : "max-w-5xl"
          }`}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
