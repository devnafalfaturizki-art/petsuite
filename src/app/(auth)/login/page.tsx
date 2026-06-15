import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - PetCare Suite",
  description: "Login untuk SUPERADMIN, DOCTOR, dan STAFF",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">PetCare Suite</h1>
          <p className="text-sm text-muted-foreground">
            Masuk ke sistem klinik
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-center text-sm text-muted-foreground">
            Halaman login akan diimplementasikan setelah integrasi Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}