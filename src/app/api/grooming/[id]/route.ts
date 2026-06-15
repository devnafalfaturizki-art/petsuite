import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { updateGroomingSchema } from "@/lib/validations/grooming";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const data = await prisma.grooming.findFirst({
      where,
      include: { pet: { include: { customer: true } } },
    });

    if (!data) {
      return errorResponse("Grooming tidak ditemukan", 404);
    }

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const body = await request.json();
    const validated = updateGroomingSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.grooming.findFirst({ where });
    if (!existing) {
      return errorResponse("Grooming tidak ditemukan", 404);
    }

    const data = await prisma.grooming.update({
      where: { id: params.id },
      data: {
        ...validated,
        completedAt: validated.status === "COMPLETED" ? new Date() : undefined,
      },
      include: { pet: { include: { customer: true } } },
    });

    return successResponse(data, "Grooming berhasil diupdate");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}