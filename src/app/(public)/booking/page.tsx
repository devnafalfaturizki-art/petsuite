import { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Booking - PetCare Suite",
  description: "Buat janji temu online",
};

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Buat Janji Temu" description="Booking online untuk pemeriksaan pets Anda" />
      <div className="mt-10 rounded-lg border p-6">
        <p className="text-center text-sm text-muted-foreground">
          Form booking online akan diimplementasikan setelah modul ONLINE_BOOKING aktif
        </p>
      </div>
    </div>
  );
}