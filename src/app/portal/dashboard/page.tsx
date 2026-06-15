import { PageHeader } from "@/components/shared/PageHeader";

export default function CustomerPortalDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Portal Customer"
        description="Ringkasan aktivitas dan informasi pet Anda"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Appointment Aktif</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total Pets</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Invoice Belum Dibayar</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}