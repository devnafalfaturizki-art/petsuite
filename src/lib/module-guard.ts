import { prisma } from "./db";
import type { ModuleName } from "@/types";

/**
 * Check if a module is active for a given clinic.
 * Returns true if the module is active, false otherwise.
 */
export async function isModuleActive(
  clinicId: string,
  moduleName: ModuleName
): Promise<boolean> {
  try {
    const clinicModule = await prisma.clinicModule.findUnique({
      where: {
        clinicId_module: {
          clinicId,
          module: moduleName,
        },
      },
    });

    return clinicModule?.isActive ?? false;
  } catch {
    return false;
  }
}

/**
 * Get all active modules for a clinic.
 */
export async function getActiveModules(
  clinicId: string
): Promise<ModuleName[]> {
  try {
    const modules = await prisma.clinicModule.findMany({
      where: {
        clinicId,
        isActive: true,
      },
    });

    return modules.map((m) => m.module as ModuleName);
  } catch {
    return [];
  }
}

/**
 * Get all modules with their active status for a clinic.
 */
export async function getModulesWithStatus(clinicId: string) {
  try {
    const modules = await prisma.clinicModule.findMany({
      where: { clinicId },
    });

    return modules.map((m) => ({
      module: m.module as ModuleName,
      isActive: m.isActive,
    }));
  } catch {
    return [];
  }
}

/**
 * Default modules that are active when a new clinic is created.
 */
export const DEFAULT_ACTIVE_MODULES: ModuleName[] = [
  "APPOINTMENT",
  "MEDICAL_RECORD",
  "POS_BILLING",
];