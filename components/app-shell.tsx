"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";
import { utcToday } from "@/lib/pregnancy";
import { weightOnDate } from "@/lib/weights";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logs, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const weightTodayKg = weightOnDate(logs, utcToday());

  return (
    <div className="min-h-full bg-petal text-ink">
      <Topbar user={user} onOpenMenu={() => setOpen(true)} onLogout={() => void logout()} />
      <Sidebar user={user} open={open} onClose={() => setOpen(false)} weightTodayKg={weightTodayKg} />

      <div className="flex min-h-[calc(100vh-4.25rem)] flex-col lg:pl-72">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
