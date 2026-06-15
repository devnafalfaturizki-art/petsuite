"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function SuperadminClinicsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Klinik" description="Manajemen semua klinik dalam jaringan" />
      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        <p>Halaman manajemen klinik akan diimplementasikan setelah integrasi Supabase Auth</p>
      </div>
    </div>
  );
}