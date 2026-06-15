"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function SuperadminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manajemen user platform" />
      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        <p>Halaman manajemen user akan diimplementasikan setelah integrasi Supabase Auth</p>
      </div>
    </div>
  );
}