"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Invoice = {
  id: string;
  invoiceNumber: string;
  total: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string;
  customer: { name: string; phone: string | null } | null;
  user: { name: string };
};

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "invoiceNumber", header: "No. Invoice" },
  { id: "customer", header: "Customer", cell: ({ row }) => row.original.customer?.name || "-" },
  { accessorKey: "total", header: "Total", cell: ({ row }) => `Rp ${row.original.total.toLocaleString("id-ID")}` },
  { accessorKey: "paymentMethod", header: "Pembayaran", cell: ({ row }) => row.original.paymentMethod || "-" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { accessorKey: "createdAt", header: "Tanggal", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("id-ID") },
];

export default function InvoicesPage() {
  const [data, setData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/invoices");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json.data || []);
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
      <PageHeader title="Invoice" description="Daftar invoice" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}