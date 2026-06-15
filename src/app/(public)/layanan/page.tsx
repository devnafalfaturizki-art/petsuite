import { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Layanan - PetCare Suite",
  description: "Layanan kesehatan hewan PetCare Suite",
};

export default function LayananPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Layanan Kami" description="Layanan kesehatan lengkap untuk hewan kesayangan" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Pemeriksaan Umum</h3>
          <p className="mt-2 text-sm text-muted-foreground">Pemeriksaan kesehatan lengkap oleh dokter hewan profesional</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Vaksinasi</h3>
          <p className="mt-2 text-sm text-muted-foreground">Vaksinasi rutin untuk mencegah berbagai penyakit</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Rawat Inap</h3>
          <p className="mt-2 text-sm text-muted-foreground">Fasilitas rawat inap dengan pengawasan 24 jam</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Grooming</h3>
          <p className="mt-2 text-sm text-muted-foreground">Layanan perawatan dan grooming untuk pets</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Laboratorium</h3>
          <p className="mt-2 text-sm text-muted-foreground">Pemeriksaan laboratorium untuk diagnosis akurat</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Konsultasi</h3>
          <p className="mt-2 text-sm text-muted-foreground">Konsultasi dengan dokter hewan berpengalaman</p>
        </div>
      </div>
    </div>
  );
}