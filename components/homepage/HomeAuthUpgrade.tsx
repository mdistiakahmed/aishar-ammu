"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { HomePageForLoggedInUser } from "@/components/homepage/HomePageForLoggedInUser";

export function HomeAuthUpgrade({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <HomePageForLoggedInUser user={user} />;
  return children;
}
