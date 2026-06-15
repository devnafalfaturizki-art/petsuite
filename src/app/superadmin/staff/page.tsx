"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function SuperadminStaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Staff" description="Manajemen staff semua klinik" />
      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        <p>Halaman manajemen staff akan diimplementasikan setelah integrasi Supabase Auth</p>
      </div>
    </div>
  );
}