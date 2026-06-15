"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

type DashboardStats = {
  totalAppointments: number;
  appointmentsToday: number;
  totalPatients: number;
  totalRevenue: number;
  revenueToday: number;
  totalInpatients: number;
};

export default function SuperadminReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/reports?type=dashboard");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setStats(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) return <ErrorAlert message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan" description="Ringkasan dan laporan semua klinik" />
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Total Appointment</p>
            <p className="text-3xl font-bold">{stats?.totalAppointments || 0}</p>
          </div>
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Appointment Hari Ini</p>
            <p className="text-3xl font-bold">{stats?.appointmentsToday || 0}</p>
          </div>
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Total Pasien</p>
            <p className="text-3xl font-bold">{stats?.totalPatients || 0}</p>
          </div>
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold">Rp {(stats?.totalRevenue || 0).toLocaleString("id-ID")}</p>
          </div>
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Revenue Hari Ini</p>
            <p className="text-3xl font-bold">Rp {(stats?.revenueToday || 0).toLocaleString("id-ID")}</p>
          </div>
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Rawat Inap Aktif</p>
            <p className="text-3xl font-bold">{stats?.totalInpatients || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}