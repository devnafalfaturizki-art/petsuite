import { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Kontak - PetCare Suite",
  description: "Hubungi PetCare Suite",
};

export default function KontakPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Hubungi Kami" description="Silakan hubungi kami untuk informasi lebih lanjut" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Alamat</h3>
          <p className="mt-2 text-sm text-muted-foreground">Jl. Contoh No. 123, Jakarta</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Telepon</h3>
          <p className="mt-2 text-sm text-muted-foreground">(021) 1234-5678</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="mt-2 text-sm text-muted-foreground">info@petsuite.com</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Jam Operasional</h3>
          <p className="mt-2 text-sm text-muted-foreground">Senin - Sabtu: 08:00 - 20:00</p>
        </div>
      </div>
    </div>
  );
}