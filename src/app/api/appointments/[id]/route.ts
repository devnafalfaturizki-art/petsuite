import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { updateAppointmentSchema } from "@/lib/validations/appointment";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const data = await prisma.appointment.findFirst({
      where,
      include: {
        pet: { include: { customer: true } },
        doctor: { select: { id: true, name: true } },
      },
    });

    if (!data) {
      return errorResponse("Appointment tidak ditemukan", 404);
    }

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const body = await request.json();
    const validated = updateAppointmentSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.appointment.findFirst({ where });
    if (!existing) {
      return errorResponse("Appointment tidak ditemukan", 404);
    }

    const data = await prisma.appointment.update({
      where: { id: params.id },
      data: validated,
      include: {
        pet: { include: { customer: true } },
        doctor: { select: { id: true, name: true } },
      },
    });

    return successResponse(data, "Appointment berhasil diupdate");
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

    const existing = await prisma.appointment.findFirst({ where });
    if (!existing) {
      return errorResponse("Appointment tidak ditemukan", 404);
    }

    await prisma.appointment.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return successResponse(null, "Appointment berhasil dihapus");
  } catch (error) {
    return handleApiError(error);
  }
}