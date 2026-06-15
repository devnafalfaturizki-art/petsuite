import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, paginatedSuccessResponse, handleApiError } from "@/lib/api-utils";
import { createMedicalRecordSchema } from "@/lib/validations/medical-record";
import { parsePaginationParams, parseFilterParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const { search, sortBy, sortDirection } = parseFilterParams(searchParams);

    const where: Record<string, unknown> = {};
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }
    if (user.role === "DOCTOR") {
      where.doctorId = user.id;
    }
    if (search) {
      where.pet = { name: { contains: search, mode: "insensitive" } };
    }

    const [data, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        include: {
          pet: { include: { customer: true } },
          doctor: { select: { id: true, name: true } },
          attachments: true,
          prescriptions: { include: { product: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
      }),
      prisma.medicalRecord.count({ where }),
    ]);

    return paginatedSuccessResponse(data, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR"]);
    const body = await request.json();
    const validated = createMedicalRecordSchema.parse(body);

    const data = await prisma.medicalRecord.create({
      data: {
        ...validated,
        clinicId: user.clinicId!,
        doctorId: user.id,
      },
      include: {
        pet: { include: { customer: true } },
        doctor: { select: { id: true, name: true } },
      },
    });

    return successResponse(data, "Rekam medis berhasil dibuat", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}