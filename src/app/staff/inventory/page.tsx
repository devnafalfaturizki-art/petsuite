"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  minStock: number;
  unit: string | null;
  supplier: { name: string } | null;
};

const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "Produk" },
  { accessorKey: "category", header: "Kategori", cell: ({ row }) => row.original.category || "-" },
  { accessorKey: "price", header: "Harga", cell: ({ row }) => `Rp ${row.original.price.toLocaleString("id-ID")}` },
  { accessorKey: "stock", header: "Stok" },
  { accessorKey: "minStock", header: "Min Stok" },
  { accessorKey: "unit", header: "Satuan", cell: ({ row }) => row.original.unit || "-" },
  { id: "supplier", header: "Supplier", cell: ({ row }) => row.original.supplier?.name || "-" },
];

export default function InventoryPage() {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inventory");
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
      <PageHeader title="Inventory" description="Daftar produk dan obat" />
      {isLoading ? <LoadingSkeleton count={5} /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}