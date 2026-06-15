"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Grooming = {
  id: string;
  serviceName: string;
  price: number;
  status: string;
  scheduledAt: string;
  pet: { name: string; customer: { name: string } };
};

const columns: ColumnDef<Grooming>[] = [
  { id: "pet", header: "Pet", cell: ({ row }) => <span>{row.original.pet.name}</span> },
  { id: "customer", header: "Pemilik", cell: ({ row }) => <span>{row.original.pet.customer.name}</span> },
  { accessorKey: "serviceName", header: "Layanan" },
  { accessorKey: "price", header: "Harga", cell: ({ row }) => `Rp ${row.original.price.toLocaleString("id-ID")}` },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { accessorKey: "scheduledAt", header: "Jadwal", cell: ({ row }) => new Date(row.original.scheduledAt).toLocaleDateString("id-ID") },
];

export default function GroomingPage() {
  const [data, setData] = useState<Grooming[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/grooming");
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
      <PageHeader title="Grooming" description="Daftar layanan grooming" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}