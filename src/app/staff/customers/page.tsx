"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  pets: { id: string; name: string }[];
};

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "phone",
    header: "Telepon",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "pets",
    header: "Jumlah Pets",
    cell: ({ row }) => <span>{row.original.pets.length}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("id-ID"),
  },
];

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/customers");
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

  if (error) {
    return <ErrorAlert message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Customer" description="Daftar customer klinik" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}