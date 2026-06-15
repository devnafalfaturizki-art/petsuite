import prisma from "@/lib/db";
import type { QueueStatus, Prisma } from "@prisma/client";

export interface QueueItem {
  clinicId: string;
  userId?: string;
  channel: "WHATSAPP" | "EMAIL";
  recipient: string;
  template?: string;
  payload?: Record<string, unknown>;
  scheduledAt?: Date;
}

function toJsonValue(val: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
  if (!val) return undefined;
  return JSON.parse(JSON.stringify(val)) as Prisma.InputJsonValue;
}

export async function enqueueNotification(item: QueueItem) {
  return prisma.notificationQueue.create({
    data: {
      clinicId: item.clinicId,
      userId: item.userId || null,
      channel: item.channel,
      recipient: item.recipient,
      template: item.template || null,
      payload: toJsonValue(item.payload),
      status: "PENDING",
      scheduledAt: item.scheduledAt || null,
    },
  });
}

export async function processQueue(batchSize = 10) {
  const items = await prisma.notificationQueue.findMany({
    where: {
      status: { in: ["PENDING" as QueueStatus, "RETRYING" as QueueStatus] },
      scheduledAt: { lte: new Date() },
    },
    take: batchSize,
    orderBy: { createdAt: "asc" },
  });

  for (const item of items) {
    try {
      await prisma.notificationQueue.update({
        where: { id: item.id },
        data: { status: "PROCESSING" },
      });

      // Simulate sending (replace with actual Fonnte/Resend integration)
      const success = Math.random() > 0.1;

      if (success) {
        await prisma.notificationQueue.update({
          where: { id: item.id },
          data: { status: "SUCCESS", sentAt: new Date() },
        });
        await prisma.notificationLog.create({
          data: {
            queueId: item.id,
            response: "Sent successfully",
            status: "SUCCESS",
          },
        });
      } else {
        throw new Error("Send failed");
      }
    } catch {
      const newRetryCount = item.retryCount + 1;
      const newStatus = newRetryCount >= item.maxRetries ? "FAILED" : "RETRYING";

      await prisma.notificationQueue.update({
        where: { id: item.id },
        data: { status: newStatus, retryCount: newRetryCount },
      });
      await prisma.notificationLog.create({
        data: {
          queueId: item.id,
          response: `Retry ${newRetryCount}/${item.maxRetries}`,
          status: newStatus,
        },
      });
    }
  }

  return items.length;
}

export async function getQueueStats(clinicId?: string) {
  const where: Record<string, unknown> = {};
  if (clinicId) where.clinicId = clinicId;

  const [pending, processing, success, failed, retrying] = await Promise.all([
    prisma.notificationQueue.count({ where: { ...where, status: "PENDING" } }),
    prisma.notificationQueue.count({ where: { ...where, status: "PROCESSING" } }),
    prisma.notificationQueue.count({ where: { ...where, status: "SUCCESS" } }),
    prisma.notificationQueue.count({ where: { ...where, status: "FAILED" } }),
    prisma.notificationQueue.count({ where: { ...where, status: "RETRYING" } }),
  ]);

  return { pending, processing, success, failed, retrying, total: pending + processing + success + failed + retrying };
}