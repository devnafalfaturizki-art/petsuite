import { PageHeader } from "@/components/shared/PageHeader";

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Staff"
        description="Ringkasan operasional klinik hari ini"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Appointment Hari Ini</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Customer Baru</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Transaksi Hari Ini</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Pendapatan Hari Ini</p>
          <p className="text-3xl font-bold">Rp 0</p>
        </div>
      </div>
    </div>
  );
}