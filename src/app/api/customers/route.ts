import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, paginatedSuccessResponse, handleApiError } from "@/lib/api-utils";
import { createCustomerSchema } from "@/lib/validations/customer";
import { parsePaginationParams, parseFilterParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const { search, sortBy, sortDirection } = parseFilterParams(searchParams);

    const where: Record<string, unknown> = {};
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: { pets: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
      }),
      prisma.customer.count({ where }),
    ]);

    return paginatedSuccessResponse(data, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const body = await request.json();
    const validated = createCustomerSchema.parse(body);

    const data = await prisma.customer.create({
      data: {
        ...validated,
        clinicId: user.clinicId!,
      },
      include: { pets: true },
    });

    return successResponse(data, "Customer berhasil dibuat", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}