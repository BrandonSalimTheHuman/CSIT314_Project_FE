"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { type UserRole, useAuth } from "@/lib/auth/auth-context";

/**
 * Client-side route guard. Redirects unauthenticated users to /auth/login
 * and optionally enforces a required role.
 */
export function AuthGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { session, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/auth/login");
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.replace("/unauthorized");
    }
  }, [session, role, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;
  if (requiredRole && role !== requiredRole) return null;

  return <>{children}</>;
}
