import { PageHeader } from "@/components/shared/PageHeader";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Dokter"
        description="Ringkasan aktivitas medis hari ini"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Appointment Hari Ini</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Pasien Diperiksa</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Rawat Inap Aktif</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Vaksinasi Hari Ini</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}