import { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Artikel - PetCare Suite",
  description: "Artikel kesehatan hewan PetCare Suite",
};

export default function ArtikelPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Artikel" description="Informasi dan tips kesehatan hewan" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Tips Merawat Anjing di Rumah</h3>
          <p className="mt-2 text-sm text-muted-foreground">Panduan lengkap merawat anjing agar tetap sehat dan bahagia.</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Pentingnya Vaksinasi Rutin</h3>
          <p className="mt-2 text-sm text-muted-foreground">Kenapa vaksinasi rutin penting untuk kesehatan pets Anda.</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Mengenal Gejala Penyakit pada Kucing</h3>
          <p className="mt-2 text-sm text-muted-foreground">Kenali gejala awal penyakit pada kucing kesayangan Anda.</p>
        </div>
      </div>
    </div>
  );
}