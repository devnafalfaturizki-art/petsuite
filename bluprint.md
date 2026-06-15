# PetCare Suite — Blueprint

## Tentang Platform
Platform manajemen klinik hewan untuk jaringan klinik
dengan satu pemilik dan banyak cabang (multi-clinic).
Setiap klinik dapat mengaktifkan atau menonaktifkan
modul sesuai kebutuhan operasional masing-masing.

---

## Bisnis Model
- Satu SUPERADMIN memiliki dan mengelola semua klinik
- Setiap klinik adalah cabang dari jaringan yang sama
- Setiap klinik bisa aktifkan/nonaktifkan modul sendiri
- Customer bisa terhubung ke semua klinik dalam jaringan
- Semua data terisolasi per clinic_id
- Tidak ada payment gateway, semua dicatat manual

---

## Role & Akses

SUPERADMIN
- Kelola semua klinik
- Kelola semua user (doctor, staff)
- Aktifkan/nonaktifkan modul per klinik
- Lihat laporan semua klinik
- Konfigurasi platform

DOCTOR
- Akses modul medis di klinik yang di-assign
- Buat dan kelola medical record
- Kelola appointment pasien
- Lihat riwayat pasien

STAFF
- Akses modul operasional di klinik yang di-assign
- Registrasi customer dan pet
- Kelola appointment
- Operasikan kasir dan invoice
- Kelola inventory dan grooming

CUSTOMER
- Register dan login di public site
- Booking online (jika modul aktif)
- Lihat riwayat kesehatan pet
- Lihat invoice
- Terima notifikasi

---

## Login & Akses URL

Public Site
- petcare.com              → landing page
- petcare.com/login        → login customer
- petcare.com/register     → register customer
- petcare.com/booking      → booking online (jika aktif)
- petcare.com/layanan      → halaman layanan
- petcare.com/dokter       → halaman dokter
- petcare.com/artikel      → halaman artikel
- petcare.com/kontak       → halaman kontak

Sistem Klinik
- app.petcare.com/login    → login superadmin, doctor, staff
- app.petcare.com/superadmin/dashboard → SUPERADMIN
- app.petcare.com/doctor/dashboard     → DOCTOR
- app.petcare.com/staff/dashboard      → STAFF

Customer Portal
- petcare.com/portal/dashboard         → CUSTOMER

---

## Modul

Setiap modul bisa diaktifkan atau dinonaktifkan per klinik.
Modul nonaktif:
- Menu hilang dari sidebar
- API route terblokir (return 403)
- Fitur tidak muncul di public site

PUBLIC
- ONLINE_BOOKING     → form booking di public site
- CUSTOMER_PORTAL    → login dan portal customer

MEDICAL
- APPOINTMENT        → manajemen appointment internal
- MEDICAL_RECORD     → rekam medis format SOAP
- VACCINATION        → vaksinasi dan reminder otomatis

OPERATIONAL
- INPATIENT          → rawat inap dan manajemen kandang
- GROOMING           → layanan grooming
- INVENTORY          → stok produk dan obat

FINANCE
- POS_BILLING        → kasir dan invoice manual
- ACCOUNTING         → laporan keuangan

COMMUNICATION
- NOTIFICATION_WA    → notifikasi WhatsApp via Fonnte
- NOTIFICATION_EMAIL → notifikasi email via Resend

Default modul aktif saat klinik baru dibuat:
- APPOINTMENT
- MEDICAL_RECORD
- POS_BILLING

---

## Payment & Invoice
- Tidak menggunakan payment gateway
- Pembayaran dicatat manual oleh staff
- Metode pembayaran: cash, transfer, kartu, qris
- Semua metode hanya dicatat, tidak diproses otomatis
- Status invoice: UNPAID, PAID, PARTIAL, CANCELLED
- Invoice tidak bisa diedit jika sudah PAID
- Setiap perubahan invoice tercatat di audit log

---

## Modul Detail

### ONLINE_BOOKING
- Customer pilih layanan di public site
- Customer pilih dokter
- Customer pilih tanggal dan waktu
- Customer isi data diri dan data pet
- Sistem buat appointment otomatis
- Customer terima konfirmasi

### APPOINTMENT
Status: SCHEDULED → CONFIRMED → COMPLETED
        CANCELLED | NO_SHOW
- Booking oleh staff atau online
- Jadwal dokter
- Kalender appointment
- Nomor antrian otomatis
- Notifikasi ke customer

### MEDICAL_RECORD
Format SOAP:
- Subjective : keluhan pemilik
- Objective  : hasil pemeriksaan
- Assessment : diagnosis
- Plan       : tindakan dan rencana
Menyimpan:
- Diagnosis
- Tindakan
- Resep (terhubung ke inventory)
- File pendukung (foto, dokumen lab)
- Riwayat lengkap pasien

### VACCINATION
- Catat vaksin dan tanggal
- Hitung tanggal vaksin berikutnya
- Sertifikat vaksin
- Reminder otomatis: H-30, H-14, H-7, H-1
- Kirim via WhatsApp atau email

### INPATIENT
Status kandang: AVAILABLE | OCCUPIED | MAINTENANCE
Status pasien: ADMITTED → OBSERVED → DISCHARGED
- Daftar kandang per klinik
- Admission pasien
- Observasi harian (suhu, berat, kondisi, nafsu makan, obat)
- Customer bisa lihat perkembangan
- Discharge otomatis buat invoice

### GROOMING
Status: BOOKED → PROCESSING → COMPLETED
- Layanan grooming dan harga
- Jadwal grooming
- Foto sebelum dan sesudah
- Notifikasi selesai ke customer

### INVENTORY
- Produk dan obat
- Stok masuk dan keluar
- Supplier
- Batch dan expiry date
- Kategori produk
- Alert stok minimum
- Alert expiry date
- Stok berkurang otomatis saat resep dibuat
- Stok berkurang otomatis saat POS transaksi

### POS_BILLING
- Pilih customer
- Tambah produk atau layanan ke cart
- Diskon per item atau total
- Hitung total otomatis
- Catat metode pembayaran manual
- Buat invoice otomatis
- Stok berkurang otomatis
- Loyalty point bertambah otomatis

### ACCOUNTING
- Catat pemasukan dan pengeluaran
- Laporan per periode
- Laporan per klinik
- Dashboard revenue, expense, profit
- Export laporan

### NOTIFICATION_WA
Trigger otomatis:
- Konfirmasi booking
- Reminder appointment H-1
- Reminder vaksin H-30, H-14, H-7, H-1
- Update kondisi inpatient
- Invoice siap
Fitur:
- Template pesan per jenis notifikasi
- Log pengiriman
- Status delivered atau failed
- Retry jika gagal

### NOTIFICATION_EMAIL
Trigger otomatis:
- Konfirmasi registrasi customer
- Konfirmasi booking
- Invoice PDF
- Laporan bulanan ke SUPERADMIN
Fitur:
- Template email per jenis notifikasi
- Log pengiriman
- Status delivered atau failed

### CUSTOMER_PORTAL
Dashboard:
- Appointment aktif dan riwayat
- Reminder vaksin
- Invoice belum dibayar
Pet:
- Profil pet lengkap
- Medical record
- Riwayat vaksin
- Dokumen dan sertifikat

---

## Workflow Utama

### Workflow Kunjungan Klinik
Customer datang atau booking online
→ Customer dan pet terdaftar
→ Appointment dibuat
→ Nomor antrian dibuat
→ Dokter periksa
→ Medical record SOAP dibuat
→ Diagnosis, tindakan, resep dicatat
→ Jika perlu rawat inap: admission dibuat
→ Invoice otomatis terbentuk
→ Staff catat pembayaran manual
→ Invoice status berubah PAID
→ Notifikasi invoice ke customer
→ Riwayat pasien tersimpan

### Workflow Booking Online
Customer buka petcare.com/booking
→ Pilih layanan
→ Pilih dokter
→ Pilih tanggal dan waktu
→ Isi data diri dan pet
→ Appointment dibuat (status SCHEDULED)
→ Customer terima konfirmasi WA atau email
→ Staff konfirmasi (status CONFIRMED)
→ Reminder H-1 terkirim otomatis

### Workflow Rawat Inap
Doctor buat admission dari medical record
→ Pilih kandang tersedia
→ Status kandang berubah OCCUPIED
→ Staff input observasi harian
→ Customer terima update kondisi
→ Doctor buat discharge
→ Status kandang berubah AVAILABLE
→ Invoice dibuat otomatis

### Workflow POS
Staff buka kasir
→ Pilih customer
→ Tambah produk atau layanan
→ Input diskon jika ada
→ Total dihitung otomatis
→ Catat metode pembayaran
→ Invoice dibuat (status PAID)
→ Stok berkurang otomatis
→ Loyalty point bertambah
→ Notifikasi invoice ke customer

### Workflow Vaksin Reminder
Vaksin selesai dicatat
→ Sistem simpan tanggal vaksin berikutnya
→ Scheduler berjalan setiap hari
→ Cari vaksin mendekati jatuh tempo
→ Kirim WA atau email ke customer
→ Log pengiriman disimpan

### Workflow Onboarding Klinik Baru
SUPERADMIN login
→ Buat klinik baru (nama, alamat, kontak)
→ Tambah user doctor dan staff
→ Assign doctor dan staff ke klinik
→ Aktifkan modul yang dibutuhkan
→ Klinik siap beroperasi

---

## Stack Teknologi
- Next.js 14 (App Router, TypeScript strict mode)
- Supabase (Auth + PostgreSQL + Storage + Realtime)
- Prisma ORM
- shadcn/ui + Tailwind CSS
- Zustand (state management)
- React Hook Form + Zod (form & validasi)
- TanStack Table (tabel data)
- Recharts (chart & grafik)
- Resend (email)
- Fonnte (WhatsApp notification)
- Vercel (deployment)
- Jest + Testing Library (unit & integration test)
- Playwright (end-to-end test)
- MSW (mock API di test)
- ESLint + Prettier (code quality)
- Husky + lint-staged (pre-commit)
- Sentry (error monitoring)

---

## Struktur Folder
app/
  (public)/
    page.tsx
    login/page.tsx
    register/page.tsx
    booking/page.tsx
    layanan/page.tsx
    dokter/page.tsx
    artikel/page.tsx
    kontak/page.tsx
    portal/
      layout.tsx
      dashboard/page.tsx
      pets/page.tsx
      appointments/page.tsx
      medical-records/page.tsx
      vaccinations/page.tsx
      invoices/page.tsx
  (auth)/
    login/page.tsx
  (superadmin)/
    layout.tsx
    dashboard/page.tsx
    clinics/
      page.tsx
      [id]/page.tsx
      [id]/modules/page.tsx
    users/page.tsx
    doctors/page.tsx
    staff/page.tsx
    reports/page.tsx
    settings/page.tsx
  (doctor)/
    layout.tsx
    dashboard/page.tsx
    appointments/page.tsx
    medical-records/page.tsx
    vaccinations/page.tsx
    inpatients/page.tsx
  (staff)/
    layout.tsx
    dashboard/page.tsx
    appointments/page.tsx
    customers/page.tsx
    pets/page.tsx
    grooming/page.tsx
    inpatients/page.tsx
    inventory/page.tsx
    pos/page.tsx
    invoices/page.tsx
  api/
    auth/
    clinics/
    modules/
    users/
    customers/
    pets/
    appointments/
    medical-records/
    vaccinations/
    inpatients/
    grooming/
    inventory/
    pos/
    invoices/
    accounting/
    notifications/
components/
  ui/
  shared/
    PageHeader.tsx
    DataTable.tsx
    FormModal.tsx
    DeleteDialog.tsx
    LoadingSkeleton.tsx
    ErrorAlert.tsx
    StatusBadge.tsx
    ModuleGuard.tsx
lib/
  auth.ts
  db.ts
  utils.ts
  module-guard.ts
  validations/
    customer.ts
    pet.ts
    appointment.ts
    medical-record.ts
    vaccination.ts
    inpatient.ts
    grooming.ts
    inventory.ts
    invoice.ts
prisma/
  schema.prisma
  seed.ts
types/
  index.ts
__tests__/
  unit/
    components/
    lib/
    validations/
  integration/
    api/
    db/
  e2e/
    auth.spec.ts
    appointment.spec.ts
    medical-record.spec.ts
    pos.spec.ts
    modules.spec.ts

---

## Konvensi Kode
- Server component by default
- Tambahkan "use client" hanya jika komponen interaktif
- Hindari any di TypeScript, selalu definisikan type
- Semua form pakai React Hook Form + Zod
- Semua tabel pakai TanStack Table
- Komponen UI pakai shadcn/ui
- Penamaan file       : kebab-case
- Penamaan komponen  : PascalCase
- Penamaan fungsi    : camelCase
- Penamaan variabel  : camelCase
- Penamaan tabel DB  : snake_case
- Selalu handle error dan loading state
- Jangan hardcode nilai, gunakan konstanta atau env

## Konvensi API Route
- GET    /api/[module]      → list data
- POST   /api/[module]      → create data
- GET    /api/[module]/[id] → detail data
- PUT    /api/[module]/[id] → update data
- DELETE /api/[module]/[id] → delete data
- Selalu return { data, error, message }
- Selalu validasi clinic_id dari session
- Selalu validasi modul aktif sebelum proses request
- Selalu validasi input dengan Zod
- Selalu gunakan try/catch di setiap handler
- Gunakan HTTP status code yang tepat

## Module Guard Rules
- Setiap route cek modul aktif via middleware
- Setiap API route cek modul aktif sebelum proses
- Sidebar render dinamis sesuai modul aktif klinik
- Modul nonaktif return 403 di API
- Modul nonaktif redirect ke /dashboard di UI
- Gunakan komponen ModuleGuard sebagai wrapper

## Konvensi Komponen
- Setiap halaman wajib punya PageHeader
- Semua list data pakai DataTable (TanStack Table)
- Semua form tampil dalam Modal atau Sheet (shadcn)
- Loading state pakai Skeleton (shadcn)
- Error state pakai Alert (shadcn)
- Konfirmasi hapus pakai AlertDialog (shadcn)
- Notifikasi aksi pakai Toast (shadcn)

## Database Rules
- Setiap tabel wajib punya clinic_id kecuali User dan Clinic
- Setiap query wajib difilter berdasarkan clinic_id
- SUPERADMIN bisa query tanpa filter clinic_id
- Gunakan Prisma transaction untuk operasi multi-tabel
- Selalu soft delete menggunakan deletedAt
- Selalu ada createdAt dan updatedAt di setiap tabel
- Selalu gunakan index pada kolom yang sering difilter
- Hindari N+1 query, selalu gunakan include atau select

---

## Testing

Stack
- Jest + Testing Library → unit dan integration test
- Playwright            → end-to-end test
- MSW                   → mock API di test

Rules
- Setiap komponen UI wajib punya unit test
- Setiap API route wajib punya integration test
- Setiap workflow utama wajib punya e2e test
- Minimum coverage 70%
- Nama file test : [nama].test.ts atau [nama].spec.ts
- Jalankan test sebelum commit

---

## CI/CD Pipeline (GitHub Actions)
Push atau Pull Request ke main
1. Lint        → ESLint + Prettier
2. Type Check  → tsc --noEmit
3. Unit Test   → Jest
4. Integration → Jest
5. Build Check → next build
6. E2E Test    → Playwright (main branch only)
7. Deploy      → Vercel (main branch only)

---

## Code Quality
- ESLint      → linting
- Prettier    → formatting
- Husky       → pre-commit hooks
- lint-staged → lint file yang berubah saja
- commitlint  → validasi pesan commit

## Commit Convention
- feat     : fitur baru
- fix      : bug fix
- refactor : refactor kode
- test     : tambah atau update test
- docs     : update dokumentasi
- chore    : update config atau dependency

---

## Error Handling Rules
- Gunakan custom error class per domain
- API error selalu return status code yang tepat
- Client error tampilkan toast atau Alert
- Jangan expose stack trace ke client production
- Gunakan Sentry untuk error monitoring di production

---

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
FONNTE_TOKEN=
RESEND_API_KEY=
SENTRY_DSN=

---

## Fase Pengembangan

Fase 1 - Foundation
- Setup project dan Codespaces
- Auth dan role
- Clinic management
- Module management
- Layout per role
- Public site dasar

Fase 2 - Core Medical 
- Customer dan pet management
- Appointment system
- Medical record SOAP
- Vaccination system

Fase 3 - Operations 
- Inpatient system
- Grooming system
- Inventory management
- POS dan billing

Fase 4 - Business
- Accounting
- Dashboard dan laporan
- Notification WA dan email
- Customer portal

Fase 5 - Polish 
- Public website lengkap
- Testing dan bug fix
- Performance optimization
- Deployment dan monitoring
