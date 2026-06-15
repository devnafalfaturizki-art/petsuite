"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birthDate: string | null;
};

const columns: ColumnDef<Pet>[] = [
  { accessorKey: "name", header: "Nama Pet" },
  { accessorKey: "species", header: "Spesies" },
  { accessorKey: "breed", header: "Ras", cell: ({ row }) => row.original.breed || "-" },
  { accessorKey: "gender", header: "Gender", cell: ({ row }) => row.original.gender || "-" },
  { accessorKey: "birthDate", header: "Tanggal Lahir", cell: ({ row }) => row.original.birthDate ? new Date(row.original.birthDate).toLocaleDateString("id-ID") : "-" },
];

export default function PortalPetsPage() {
  const [data, setData] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/pets");
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
      <PageHeader title="Pets Saya" description="Daftar hewan peliharaan" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}