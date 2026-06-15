import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "dashboard";

    const clinicFilter = user.role !== "SUPERADMIN" && user.clinicId
      ? { clinicId: user.clinicId }
      : {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    if (type === "dashboard") {
      const [
        totalAppointments,
        appointmentsToday,
        totalPatients,
        totalRevenue,
        revenueToday,
        totalInpatients,
      ] = await Promise.all([
        prisma.appointment.count({ where: { ...clinicFilter, deletedAt: null } }),
        prisma.appointment.count({
          where: { ...clinicFilter, date: { gte: today, lte: todayEnd }, deletedAt: null },
        }),
        prisma.pet.count({ where: { ...clinicFilter, deletedAt: null } }),
        prisma.invoice.aggregate({
          where: { ...clinicFilter, status: "PAID", deletedAt: null },
          _sum: { total: true },
        }),
        prisma.invoice.aggregate({
          where: {
            ...clinicFilter,
            status: "PAID",
            createdAt: { gte: today, lte: todayEnd },
            deletedAt: null,
          },
          _sum: { total: true },
        }),
        prisma.inpatient.count({
          where: { ...clinicFilter, status: { in: ["ADMITTED", "OBSERVED"] }, deletedAt: null },
        }),
      ]);

      return successResponse({
        totalAppointments,
        appointmentsToday,
        totalPatients,
        totalRevenue: totalRevenue._sum.total || 0,
        revenueToday: revenueToday._sum.total || 0,
        totalInpatients,
      });
    }

    if (type === "revenue") {
      const dateFrom = searchParams.get("dateFrom");
      const dateTo = searchParams.get("dateTo");

      const where: Record<string, unknown> = {
        ...clinicFilter,
        status: "PAID",
        deletedAt: null,
      };
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
        if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
      }

      const [totalRevenue, invoiceCount, invoices] = await Promise.all([
        prisma.invoice.aggregate({ where, _sum: { total: true } }),
        prisma.invoice.count({ where }),
        prisma.invoice.findMany({
          where,
          select: { total: true, createdAt: true, invoiceNumber: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return successResponse({
        totalRevenue: totalRevenue._sum.total || 0,
        invoiceCount,
        invoices,
      });
    }

    if (type === "clinic-summary" && user.role === "SUPERADMIN") {
      const clinics = await prisma.clinic.findMany({
        where: { isActive: true, deletedAt: null },
        include: {
          _count: { select: { appointments: true, pets: true, invoices: true } },
        },
      });

      return successResponse(clinics);
    }

    return successResponse(null);
  } catch (error) {
    return handleApiError(error);
  }
}