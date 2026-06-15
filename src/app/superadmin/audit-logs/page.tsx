"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
  user: { name: string; email: string };
  ipAddress: string | null;
};

const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: "action", header: "Aksi" },
  { id: "user", header: "User", cell: ({ row }) => <span>{row.original.user.name}</span> },
  { accessorKey: "entityType", header: "Tipe Entitas" },
  { accessorKey: "entityId", header: "ID Entitas", cell: ({ row }) => row.original.entityId?.slice(0, 8) + "..." || "-" },
  { accessorKey: "ipAddress", header: "IP", cell: ({ row }) => row.original.ipAddress || "-" },
  { accessorKey: "createdAt", header: "Waktu", cell: ({ row }) => new Date(row.original.createdAt).toLocaleString("id-ID") },
];

export default function AuditLogsPage() {
  const [data, setData] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/audit-logs");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json.data?.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) return <ErrorAlert message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Riwayat aktivitas sistem" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}