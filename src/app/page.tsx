"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";

export default function RootPage() {
  const { session, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (session) {
      if (role === "candidate") {
        router.replace("/candidate/jobs");
        return;
      }
      if (role === "employer") {
        router.replace("/employer/jobs");
        return;
      }
    }
    router.replace("/homepage");
  }, [loading, session, role, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
