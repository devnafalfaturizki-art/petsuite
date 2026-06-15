import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar - PetCare Suite",
  description: "Daftar akun customer PetCare Suite",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Daftar Akun</h1>
          <p className="text-sm text-muted-foreground">
            Buat akun untuk mengakses portal customer
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-center text-sm text-muted-foreground">
            Halaman registrasi akan diimplementasikan setelah integrasi Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}