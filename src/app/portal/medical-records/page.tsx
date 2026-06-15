"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type MedicalRecord = {
  id: string;
  diagnosis: string | null;
  subjective: string | null;
  createdAt: string;
  pet: { name: string };
  doctor: { name: string };
};

const columns: ColumnDef<MedicalRecord>[] = [
  { id: "pet", header: "Pet", cell: ({ row }) => <span>{row.original.pet.name}</span> },
  { id: "doctor", header: "Dokter", cell: ({ row }) => <span>{row.original.doctor.name}</span> },
  { accessorKey: "diagnosis", header: "Diagnosis", cell: ({ row }) => row.original.diagnosis || "-" },
  { accessorKey: "createdAt", header: "Tanggal", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("id-ID") },
];

export default function PortalMedicalRecordsPage() {
  const [data, setData] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/medical-records");
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
      <PageHeader title="Rekam Medis" description="Riwayat rekam medis pet" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}