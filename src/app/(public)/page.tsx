import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">PetCare Suite</Link>
          <nav className="flex items-center gap-6">
            <Link href="/layanan" className="text-sm font-medium hover:text-primary">Layanan</Link>
            <Link href="/dokter" className="text-sm font-medium hover:text-primary">Dokter</Link>
            <Link href="/artikel" className="text-sm font-medium hover:text-primary">Artikel</Link>
            <Link href="/kontak" className="text-sm font-medium hover:text-primary">Kontak</Link>
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">Masuk</Link>
            <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Daftar</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight">Klinik Hewan Terpercaya untuk Pets Kesayangan</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            PetCare Suite menyediakan layanan kesehatan lengkap untuk hewan kesayangan Anda. 
            Dikelola oleh dokter hewan profesional dan berpengalaman.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/booking" className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Buat Janji Temu
            </Link>
            <Link href="/layanan" className="rounded-md border px-8 py-3 text-sm font-medium hover:bg-muted">
              Lihat Layanan
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold">Layanan Kami</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border bg-background p-6 text-center">
                <h3 className="text-lg font-semibold">Pemeriksaan Umum</h3>
                <p className="mt-2 text-sm text-muted-foreground">Pemeriksaan kesehatan lengkap untuk pets Anda</p>
              </div>
              <div className="rounded-lg border bg-background p-6 text-center">
                <h3 className="text-lg font-semibold">Vaksinasi</h3>
                <p className="mt-2 text-sm text-muted-foreground">Vaksinasi rutin untuk mencegah penyakit</p>
              </div>
              <div className="rounded-lg border bg-background p-6 text-center">
                <h3 className="text-lg font-semibold">Rawat Inap</h3>
                <p className="mt-2 text-sm text-muted-foreground">Fasilitas rawat inap dengan pengawasan 24 jam</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2024 PetCare Suite. All rights reserved.
        </div>
      </footer>
    </div>
  );
}