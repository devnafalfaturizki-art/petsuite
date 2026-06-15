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
    const { dateFrom, dateTo, sortBy, sortDirection } = parseFilterParams(searchParams);
    const type = searchParams.get("type") || undefined;

    const where: Record<string, unknown> = {};
    if (user.role !== "SUPERADMIN" && user.clinicId) {
      where.clinicId = user.clinicId;
    }
    if (type) {
      where.type = type;
    }
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      prisma.accountingTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
      }),
      prisma.accountingTransaction.count({ where }),
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

    const data = await prisma.accountingTransaction.create({
      data: {
        clinicId: user.clinicId!,
        type: body.type,
        category: body.category,
        amount: body.amount,
        description: body.description,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return successResponse(data, "Transaksi berhasil dicatat", 201);
  } catch (error) {
    return handleApiError(error);
  }
}