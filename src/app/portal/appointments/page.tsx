"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  queueNumber: number | null;
  pet: { name: string };
  doctor: { name: string };
};

const columns: ColumnDef<Appointment>[] = [
  { accessorKey: "queueNumber", header: "Antrian" },
  { id: "pet", header: "Pet", cell: ({ row }) => <span>{row.original.pet.name}</span> },
  { id: "doctor", header: "Dokter", cell: ({ row }) => <span>{row.original.doctor.name}</span> },
  { accessorKey: "date", header: "Tanggal", cell: ({ row }) => new Date(row.original.date).toLocaleDateString("id-ID") },
  { accessorKey: "time", header: "Waktu" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
];

export default function PortalAppointmentsPage() {
  const [data, setData] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/appointments");
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
      <PageHeader title="Appointment Saya" description="Daftar appointment" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}