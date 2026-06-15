"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "./LoadingSkeleton";
import type { ModuleName } from "@/types";

interface ModuleGuardProps {
  moduleName: ModuleName;
  clinicId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ModuleGuard({
  moduleName,
  clinicId,
  children,
  fallback,
}: ModuleGuardProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkModule() {
      try {
        const response = await fetch(
          `/api/modules/check?clinicId=${clinicId}&module=${moduleName}`
        );
        const data = await response.json();
        setIsActive(data.data?.isActive ?? false);
      } catch {
        setIsActive(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkModule();
  }, [clinicId, moduleName]);

  useEffect(() => {
    if (!isLoading && !isActive && !fallback) {
      router.push("/dashboard");
    }
  }, [isLoading, isActive, fallback, router]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isActive) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <LoadingSkeleton />;
  }

  return <>{children}</>;
}