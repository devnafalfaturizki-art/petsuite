import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, paginatedSuccessResponse, handleApiError } from "@/lib/api-utils";
import { createAppointmentSchema } from "@/lib/validations/appointment";
import { parsePaginationParams, parseFilterParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const { search, status, dateFrom, dateTo, sortBy, sortDirection } = parseFilterParams(searchParams);

    const where: Record<string, unknown> = {};
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }
    if (user.role === "DOCTOR") {
      where.doctorId = user.id;
    }
    if (status) {
      where.status = status;
    }
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
    }
    if (search) {
      where.pet = { name: { contains: search, mode: "insensitive" } };
    }

    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          pet: { include: { customer: true } },
          doctor: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
      }),
      prisma.appointment.count({ where }),
    ]);

    return paginatedSuccessResponse(data, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const body = await request.json();
    const validated = createAppointmentSchema.parse(body);

    // Generate queue number
    const todayStart = new Date(validated.date);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(validated.date);
    todayEnd.setHours(23, 59, 59, 999);

    const todayCount = await prisma.appointment.count({
      where: {
        clinicId: user.clinicId!,
        date: { gte: todayStart, lte: todayEnd },
      },
    });

    const data = await prisma.appointment.create({
      data: {
        ...validated,
        date: new Date(validated.date),
        clinicId: user.clinicId!,
        queueNumber: todayCount + 1,
      },
      include: {
        pet: { include: { customer: true } },
        doctor: { select: { id: true, name: true } },
      },
    });

    return successResponse(data, "Appointment berhasil dibuat", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}