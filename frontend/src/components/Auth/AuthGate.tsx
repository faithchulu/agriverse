"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";
import type { Role } from "../../lib/api/types";

export default function AuthGate({
  requiredRole,
  children,
}: {
  requiredRole: Role;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== requiredRole) {
      // Authenticated, just in the wrong section — send them to their
      // own dashboard rather than bouncing to login.
      router.replace(`/${user.role.toLowerCase()}/dashboard`);
    }
  }, [isLoading, user, requiredRole, router]);

  const isAuthorized = !isLoading && user && user.role === requiredRole;

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7EE]">
        <p className="text-sm text-[#3B2F22]/50">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}