import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { updatePetSchema } from "@/lib/validations/pet";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF", "DOCTOR"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const data = await prisma.pet.findFirst({
      where,
      include: { customer: true, medicalRecords: true, vaccinations: true },
    });

    if (!data) {
      return errorResponse("Pet tidak ditemukan", 404);
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
    const validated = updatePetSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.pet.findFirst({ where });
    if (!existing) {
      return errorResponse("Pet tidak ditemukan", 404);
    }

    const data = await prisma.pet.update({
      where: { id: params.id },
      data: {
        ...validated,
        birthDate: validated.birthDate ? new Date(validated.birthDate) : undefined,
      },
      include: { customer: true },
    });

    return successResponse(data, "Pet berhasil diupdate");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.pet.findFirst({ where });
    if (!existing) {
      return errorResponse("Pet tidak ditemukan", 404);
    }

    await prisma.pet.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return successResponse(null, "Pet berhasil dihapus");
  } catch (error) {
    return handleApiError(error);
  }
}