"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full bg-petal text-ink">
      <Topbar user={user} onOpenMenu={() => setOpen(true)} onLogout={() => void logout()} />
      <Sidebar user={user} open={open} onClose={() => setOpen(false)} />

      <div className="flex min-h-[calc(100vh-4.25rem)] flex-col lg:pl-72">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
