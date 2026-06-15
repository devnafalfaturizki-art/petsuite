import prisma from "@/lib/db";
import type { AuditAction, Prisma } from "@prisma/client";

export interface AuditEntry {
  clinicId?: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

function toJsonValue(val: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
  if (!val) return undefined;
  return JSON.parse(JSON.stringify(val)) as Prisma.InputJsonValue;
}

export async function createAuditLog(entry: AuditEntry) {
  try {
    await prisma.auditLog.create({
      data: {
        clinicId: entry.clinicId || null,
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId || null,
        oldValue: toJsonValue(entry.oldValue),
        newValue: toJsonValue(entry.newValue),
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function getAuditLogs(params: {
  clinicId?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  page?: number;
  limit?: number;
}) {
  const { clinicId, userId, action, entityType, page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (clinicId) where.clinicId = clinicId;
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (entityType) where.entityType = entityType;

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}