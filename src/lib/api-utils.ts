import { NextResponse } from "next/server";
import type { ApiResponse, PaginatedResponse } from "@/types";

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { data, error: null, message },
    { status }
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  status = 400,
  message = "Error"
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { data: null, error, message },
    { status }
  );
}

/**
 * Paginated success response helper
 */
export function paginatedSuccessResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = "Success"
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json(
    {
      data,
      error: null,
      message,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    { status: 200 }
  );
}

/**
 * Parse pagination params from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Parse search and filter params from URL search params
 */
export function parseFilterParams(searchParams: URLSearchParams) {
  return {
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortDirection: (searchParams.get("sortDirection") || "desc") as
      | "asc"
      | "desc",
  };
}

/**
 * Handle API route errors consistently
 */
export function handleApiError(
  error: unknown,
  defaultMessage = "Internal server error"
): NextResponse<ApiResponse<null>> {
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    if (error.message === "Forbidden") {
      return errorResponse("Forbidden", 403);
    }
    return errorResponse(error.message, 500);
  }

  console.error("Unexpected API error:", error);
  return errorResponse(defaultMessage, 500);
}