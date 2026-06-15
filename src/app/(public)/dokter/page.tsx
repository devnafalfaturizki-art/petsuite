import { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Dokter - PetCare Suite",
  description: "Tim dokter hewan PetCare Suite",
};

export default function DokterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Tim Dokter" description="Dokter hewan profesional dan berpengalaman" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted" />
          <h3 className="text-lg font-semibold">Dr. Andi</h3>
          <p className="text-sm text-muted-foreground">Dokter Hewan Umum</p>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted" />
          <h3 className="text-lg font-semibold">Dr. Sari</h3>
          <p className="text-sm text-muted-foreground">Dokter Hewan Spesialis</p>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted" />
          <h3 className="text-lg font-semibold">Dr. Budi</h3>
          <p className="text-sm text-muted-foreground">Dokter Hewan Bedah</p>
        </div>
      </div>
    </div>
  );
}