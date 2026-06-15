"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Inpatient = {
  id: string;
  status: string;
  admittedAt: string;
  pet: { name: string; customer: { name: string } };
  cage: { name: string };
  doctor: { name: string };
};

const columns: ColumnDef<Inpatient>[] = [
  { id: "pet", header: "Pet", cell: ({ row }) => <span>{row.original.pet.name}</span> },
  { id: "customer", header: "Pemilik", cell: ({ row }) => <span>{row.original.pet.customer.name}</span> },
  { id: "cage", header: "Kandang", cell: ({ row }) => <span>{row.original.cage.name}</span> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { accessorKey: "admittedAt", header: "Masuk", cell: ({ row }) => new Date(row.original.admittedAt).toLocaleDateString("id-ID") },
];

export default function DoctorInpatientsPage() {
  const [data, setData] = useState<Inpatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inpatients");
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
      <PageHeader title="Rawat Inap" description="Daftar pasien rawat inap" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}