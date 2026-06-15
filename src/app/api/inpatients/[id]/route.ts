import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { updateInpatientSchema, createObservationSchema } from "@/lib/validations/inpatient";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const data = await prisma.inpatient.findFirst({
      where,
      include: {
        pet: { include: { customer: true } },
        cage: true,
        doctor: { select: { id: true, name: true } },
        observations: { orderBy: { observedAt: "desc" } },
      },
    });

    if (!data) {
      return errorResponse("Rawat inap tidak ditemukan", 404);
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
    const validated = updateInpatientSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.inpatient.findFirst({ where });
    if (!existing) {
      return errorResponse("Rawat inap tidak ditemukan", 404);
    }

    const data = await prisma.$transaction(async (tx) => {
      // If discharging, free the cage
      if (validated.status === "DISCHARGED" && existing.status !== "DISCHARGED") {
        await tx.cage.update({
          where: { id: existing.cageId },
          data: { status: "AVAILABLE" },
        });
      }

      return tx.inpatient.update({
        where: { id: params.id },
        data: {
          ...validated,
          dischargedAt: validated.status === "DISCHARGED" ? new Date() : undefined,
        },
        include: {
          pet: { include: { customer: true } },
          cage: true,
          doctor: { select: { id: true, name: true } },
        },
      });
    });

    return successResponse(data, "Rawat inap berhasil diupdate");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}

// POST observation for an inpatient
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "DOCTOR", "STAFF"]);
    const body = await request.json();
    const validated = createObservationSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.inpatient.findFirst({ where });
    if (!existing) {
      return errorResponse("Rawat inap tidak ditemukan", 404);
    }

    const observation = await prisma.inpatientObservation.create({
      data: {
        ...validated,
        inpatientId: params.id,
      },
    });

    return successResponse(observation, "Observasi berhasil dicatat", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}