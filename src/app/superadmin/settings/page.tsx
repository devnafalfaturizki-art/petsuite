"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function SuperadminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" description="Konfigurasi platform" />
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Pengaturan Platform</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman pengaturan akan diimplementasikan setelah integrasi Supabase Auth
        </p>
      </div>
    </div>
  );
}