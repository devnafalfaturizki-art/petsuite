import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, paginatedSuccessResponse, handleApiError } from "@/lib/api-utils";
import { parsePaginationParams, parseFilterParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const { status, dateFrom, dateTo, sortBy, sortDirection } = parseFilterParams(searchParams);

    const where: Record<string, unknown> = {};
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }
    if (status) {
      where.status = status;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: { select: { name: true, phone: true } },
          user: { select: { name: true } },
          items: true,
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
      }),
      prisma.invoice.count({ where }),
    ]);

    return paginatedSuccessResponse(data, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}