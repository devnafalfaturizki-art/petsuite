"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Transaction = {
  id: string;
  type: string;
  category: string | null;
  amount: number;
  description: string | null;
  date: string;
};

const columns: ColumnDef<Transaction>[] = [
  { accessorKey: "type", header: "Tipe", cell: ({ row }) => <span className={row.original.type === "INCOME" ? "text-green-600" : "text-red-600"}>{row.original.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}</span> },
  { accessorKey: "category", header: "Kategori", cell: ({ row }) => row.original.category || "-" },
  { accessorKey: "amount", header: "Jumlah", cell: ({ row }) => `Rp ${row.original.amount.toLocaleString("id-ID")}` },
  { accessorKey: "description", header: "Keterangan", cell: ({ row }) => row.original.description || "-" },
  { accessorKey: "date", header: "Tanggal", cell: ({ row }) => new Date(row.original.date).toLocaleDateString("id-ID") },
];

export default function AccountingPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/accounting");
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
      <PageHeader title="Akuntansi" description="Pencatatan pemasukan dan pengeluaran" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}