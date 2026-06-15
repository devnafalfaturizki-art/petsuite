import { PageHeader } from "@/components/shared/PageHeader";

export default function SuperadminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Superadmin"
        description="Ringkasan semua klinik dalam jaringan"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total Klinik</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total Dokter</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total Staff</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total Pasien</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}