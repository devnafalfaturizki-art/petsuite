"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Vaccination = {
  id: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate: string | null;
  pet: { name: string };
};

const columns: ColumnDef<Vaccination>[] = [
  { id: "pet", header: "Pet", cell: ({ row }) => <span>{row.original.pet.name}</span> },
  { accessorKey: "vaccineName", header: "Vaksin" },
  { accessorKey: "dateAdministered", header: "Tanggal Vaksin", cell: ({ row }) => new Date(row.original.dateAdministered).toLocaleDateString("id-ID") },
  { accessorKey: "nextDueDate", header: "Vaksin Berikutnya", cell: ({ row }) => row.original.nextDueDate ? new Date(row.original.nextDueDate).toLocaleDateString("id-ID") : "-" },
];

export default function PortalVaccinationsPage() {
  const [data, setData] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/vaccinations");
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
      <PageHeader title="Vaksinasi" description="Riwayat vaksinasi pet" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}