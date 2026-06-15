import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { updateMedicalRecordSchema } from "@/lib/validations/medical-record";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const data = await prisma.medicalRecord.findFirst({
      where,
      include: {
        pet: { include: { customer: true } },
        doctor: { select: { id: true, name: true } },
        attachments: true,
        prescriptions: { include: { product: true } },
      },
    });

    if (!data) {
      return errorResponse("Rekam medis tidak ditemukan", 404);
    }

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR"]);
    const body = await request.json();
    const validated = updateMedicalRecordSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.medicalRecord.findFirst({ where });
    if (!existing) {
      return errorResponse("Rekam medis tidak ditemukan", 404);
    }

    const data = await prisma.medicalRecord.update({
      where: { id: params.id },
      data: validated,
      include: {
        pet: { include: { customer: true } },
        doctor: { select: { id: true, name: true } },
      },
    });

    return successResponse(data, "Rekam medis berhasil diupdate");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.medicalRecord.findFirst({ where });
    if (!existing) {
      return errorResponse("Rekam medis tidak ditemukan", 404);
    }

    await prisma.medicalRecord.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return successResponse(null, "Rekam medis berhasil dihapus");
  } catch (error) {
    return handleApiError(error);
  }
}