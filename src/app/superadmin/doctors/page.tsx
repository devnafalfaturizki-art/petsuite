"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function SuperadminDoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dokter" description="Manajemen dokter semua klinik" />
      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        <p>Halaman manajemen dokter akan diimplementasikan setelah integrasi Supabase Auth</p>
      </div>
    </div>
  );
}