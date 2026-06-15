import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, paginatedSuccessResponse, handleApiError } from "@/lib/api-utils";
import { createVaccinationSchema } from "@/lib/validations/vaccination";
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
    if (search) {
      where.pet = { name: { contains: search, mode: "insensitive" } };
    }

    const [data, total] = await Promise.all([
      prisma.vaccination.findMany({
        where,
        include: { pet: { include: { customer: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
      }),
      prisma.vaccination.count({ where }),
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
    const validated = createVaccinationSchema.parse(body);

    const data = await prisma.vaccination.create({
      data: {
        ...validated,
        dateAdministered: new Date(validated.dateAdministered),
        nextDueDate: validated.nextDueDate ? new Date(validated.nextDueDate) : null,
        clinicId: user.clinicId!,
      },
      include: { pet: { include: { customer: true } } },
    });

    return successResponse(data, "Vaksinasi berhasil dicatat", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}