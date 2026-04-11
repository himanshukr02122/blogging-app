"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { UserRole } from "@/app/types/blog";
import { useAppContext } from "@/contexts/AppProvider";

type ProtectedRouteProps = {
  children: ReactNode;
  roles?: UserRole[];
};

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAppContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (roles && currentUser && !roles.includes(currentUser.role)) {
      router.replace("/");
    }
  }, [currentUser, isAuthenticated, roles, router]);

  if (!isAuthenticated || (roles && currentUser && !roles.includes(currentUser.role))) {
    return null;
  }

  return <>{children}</>;
}
