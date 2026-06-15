import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { updateProductSchema, createStockMovementSchema } from "@/lib/validations/inventory";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const data = await prisma.product.findFirst({
      where,
      include: { supplier: true, stockMovements: { orderBy: { createdAt: "desc" } } },
    });

    if (!data) {
      return errorResponse("Produk tidak ditemukan", 404);
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
    const validated = updateProductSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.product.findFirst({ where });
    if (!existing) {
      return errorResponse("Produk tidak ditemukan", 404);
    }

    const data = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...validated,
        expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : undefined,
      },
      include: { supplier: true },
    });

    return successResponse(data, "Produk berhasil diupdate");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}

// POST stock movement
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const body = await request.json();
    const validated = createStockMovementSchema.parse(body);

    const where: Record<string, unknown> = { id: params.id };
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }

    const existing = await prisma.product.findFirst({ where });
    if (!existing) {
      return errorResponse("Produk tidak ditemukan", 404);
    }

    const data = await prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({
        data: {
          productId: params.id,
          type: validated.type,
          quantity: validated.quantity,
          notes: validated.notes,
        },
      });

      const stockChange = validated.type === "IN" ? validated.quantity : -validated.quantity;

      return tx.product.update({
        where: { id: params.id },
        data: { stock: { increment: stockChange } },
        include: { supplier: true },
      });
    });

    return successResponse(data, "Stok berhasil diupdate", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}