
# PetCare Suite — Copilot Instructions

## Project
Platform manajemen klinik hewan untuk jaringan klinik
dengan satu pemilik dan banyak cabang (multi-clinic).
Setiap klinik dapat mengaktifkan atau menonaktifkan
modul sesuai kebutuhan operasional masing-masing.

## Stack
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

## Bisnis Model
- SUPERADMIN memiliki dan mengelola semua klinik
- Setiap klinik adalah cabang jaringan yang sama
- Setiap klinik bisa aktifkan/nonaktifkan modul sendiri
- Customer terhubung ke semua klinik dalam jaringan
- Semua data terisolasi per clinic_id

## Role & Akses
- SUPERADMIN : kelola semua klinik, modul, user, laporan
- DOCTOR     : akses modul medis di klinik yang di-assign
- STAFF      : akses modul operasional di klinik yang di-assign
- CUSTOMER   : akses customer portal via public site

## Login
- petcare.com/login     → CUSTOMER (public site)
- app.petcare.com/login → SUPERADMIN, DOCTOR, STAFF
  - SUPERADMIN → /superadmin/dashboard
  - DOCTOR     → /doctor/dashboard
  - STAFF      → /staff/dashboard

## Modul
Setiap modul bisa diaktifkan atau dinonaktifkan per klinik.
Modul nonaktif: menu hilang dari sidebar, API terblokir,
fitur tidak muncul di public site.

PUBLIC
- ONLINE_BOOKING    → form booking di public site
- CUSTOMER_PORTAL   → login dan portal customer

MEDICAL
- APPOINTMENT       → manajemen appointment internal
- MEDICAL_RECORD    → rekam medis format SOAP
- VACCINATION       → vaksinasi dan reminder otomatis

OPERATIONAL
- INPATIENT         → rawat inap dan manajemen kandang
- GROOMING          → layanan grooming
- INVENTORY         → stok produk dan obat

FINANCE
- POS_BILLING       → kasir dan invoice manual
- ACCOUNTING        → laporan keuangan

COMMUNICATION
- NOTIFICATION_WA   → notifikasi WhatsApp via Fonnte
- NOTIFICATION_EMAIL → notifikasi email via Resend

Default modul aktif saat klinik baru dibuat:
- APPOINTMENT, MEDICAL_RECORD, POS_BILLING

## Payment
- Tidak menggunakan payment gateway
- Pembayaran dicatat manual oleh staff
- Metode: cash, transfer, kartu, qris (dicatat manual)
- Platform hanya untuk invoice dan pencatatan transaksi
- Status invoice: UNPAID, PAID, PARTIAL, CANCELLED

## Struktur Folder
```
app/
  (public)/
    page.tsx                   → landing page
    login/page.tsx             → login customer
    register/page.tsx          → register customer
    layanan/page.tsx
    dokter/page.tsx
    artikel/page.tsx
    kontak/page.tsx
    booking/page.tsx           → aktif jika ONLINE_BOOKING on
  (auth)/
    login/page.tsx             → login superadmin, doctor, staff
  (superadmin)/
    layout.tsx
    dashboard/page.tsx         → ringkasan semua klinik
    clinics/
      page.tsx                 → daftar klinik
      [id]/page.tsx            → detail klinik
      [id]/modules/page.tsx    → kelola modul klinik
    users/page.tsx             → kelola semua user
    doctors/page.tsx           → kelola semua doctor
    staff/page.tsx             → kelola semua staff
    reports/page.tsx           → laporan semua klinik
    settings/page.tsx          → pengaturan platform
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
  (customer)/
    layout.tsx
    dashboard/page.tsx
    pets/page.tsx
    appointments/page.tsx
    medical-records/page.tsx
    vaccinations/page.tsx
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
  ui/                          → shadcn components
  shared/
    PageHeader.tsx
    DataTable.tsx
    FormModal.tsx
    DeleteDialog.tsx
    LoadingSkeleton.tsx
    ErrorAlert.tsx
    StatusBadge.tsx
    ModuleGuard.tsx            → wrapper cek modul aktif
lib/
  auth.ts                      → auth helper
  db.ts                        → prisma client
  utils.ts                     → utilities
  module-guard.ts              → cek modul aktif per klinik
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
```

## Konvensi Kode
- Server component by default
- Tambahkan "use client" hanya jika komponen interaktif
- Hindari any di TypeScript, selalu definisikan type
- Semua form pakai React Hook Form + Zod
- Semua tabel pakai TanStack Table
- Komponen UI pakai shadcn/ui
- Penamaan file        : kebab-case
- Penamaan komponen   : PascalCase
- Penamaan fungsi     : camelCase
- Penamaan variabel   : camelCase
- Penamaan tabel DB   : snake_case
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

## Testing Stack
- Jest + Testing Library → unit dan integration test
- Playwright            → end-to-end test
- MSW                   → mock API di test

## Testing Rules
- Setiap komponen UI wajib punya unit test
- Setiap API route wajib punya integration test
- Setiap workflow utama wajib punya e2e test
- Minimum coverage 70%
- Nama file test: [nama].test.ts atau [nama].spec.ts
- Jalankan test sebelum commit

## CI/CD Pipeline (GitHub Actions)
```
Push atau Pull Request ke main
↓
1. Lint          → ESLint + Prettier
↓
2. Type Check    → tsc --noEmit
↓
3. Unit Test     → Jest
↓
4. Integration   → Jest
↓
5. Build Check   → next build
↓
6. E2E Test      → Playwright (main branch only)
↓
7. Deploy        → Vercel (main branch only)
```

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

## Error Handling Rules
- Gunakan custom error class per domain
- API error selalu return status code yang tepat
- Client error tampilkan toast atau Alert
- Jangan expose stack trace ke client production
- Gunakan Sentry untuk error monitoring di production

## Environment Variables
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Notification
FONNTE_TOKEN=
RESEND_API_KEY=

# Error Monitoring
SENTRY_DSN=
```
```

---

