"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function POSPage() {
  const [isLoading] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="POS / Kasir"
        description="Transaksi penjualan dan pembayaran"
      />
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        {isLoading ? (
          <p>Memuat...</p>
        ) : (
          <div>
            <p className="text-lg font-medium">Modul POS Kasir</p>
            <p className="mt-2 text-sm">
              Antarmuka POS interaktif akan diimplementasikan dengan:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✅ Pilih customer</li>
              <li>✅ Tambahkan produk/layanan ke keranjang</li>
              <li>✅ Input diskon per item atau total</li>
              <li>✅ Total dihitung otomatis</li>
              <li>✅ Catat metode pembayaran (Cash/Transfer/Kartu/QRIS)</li>
              <li>✅ Invoice dibuat otomatis dengan status PAID</li>
              <li>✅ Stok berkurang otomatis</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}