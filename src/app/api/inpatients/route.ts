import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, paginatedSuccessResponse, handleApiError } from "@/lib/api-utils";
import { createInpatientSchema } from "@/lib/validations/inpatient";
import { parsePaginationParams, parseFilterParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const { status, sortBy, sortDirection } = parseFilterParams(searchParams);

    const where: Record<string, unknown> = {};
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.inpatient.findMany({
        where,
        include: {
          pet: { include: { customer: true } },
          cage: true,
          doctor: { select: { id: true, name: true } },
          observations: { orderBy: { observedAt: "desc" }, take: 1 },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
      }),
      prisma.inpatient.count({ where }),
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
    const validated = createInpatientSchema.parse(body);

    const data = await prisma.$transaction(async (tx) => {
      // Update cage status to OCCUPIED
      await tx.cage.update({
        where: { id: validated.cageId },
        data: { status: "OCCUPIED" },
      });

      // Create inpatient record
      return tx.inpatient.create({
        data: {
          ...validated,
          clinicId: user.clinicId!,
          doctorId: user.id,
        },
        include: {
          pet: { include: { customer: true } },
          cage: true,
          doctor: { select: { id: true, name: true } },
        },
      });
    });

    return successResponse(data, "Pasien rawat inap berhasil didaftarkan", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}