import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api-utils";
import { getAuditLogs } from "@/lib/audit/audit-service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN"]);
    const { searchParams } = new URL(request.url);

    const result = await getAuditLogs({
      clinicId: searchParams.get("clinicId") || undefined,
      userId: searchParams.get("userId") || undefined,
      action: searchParams.get("action") || undefined,
      entityType: searchParams.get("entityType") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "50"),
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}