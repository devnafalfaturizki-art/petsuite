import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { updateCustomerSchema } from "@/lib/validations/customer";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const data = await prisma.customer.findFirst({
      where,
      include: { pets: true },
    });

    if (!data) {
      return errorResponse("Customer tidak ditemukan", 404);
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
    const validated = updateCustomerSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.customer.findFirst({ where });
    if (!existing) {
      return errorResponse("Customer tidak ditemukan", 404);
    }

    const data = await prisma.customer.update({
      where: { id: params.id },
      data: validated,
      include: { pets: true },
    });

    return successResponse(data, "Customer berhasil diupdate");
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

    const existing = await prisma.customer.findFirst({ where });
    if (!existing) {
      return errorResponse("Customer tidak ditemukan", 404);
    }

    await prisma.customer.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return successResponse(null, "Customer berhasil dihapus");
  } catch (error) {
    return handleApiError(error);
  }
}