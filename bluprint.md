# PetCare Suite — Blueprint

## Tentang Platform

PetCare Suite adalah platform manajemen klinik hewan berbasis **multi-klinik** yang dirancang untuk jaringan klinik dengan satu pemilik dan banyak cabang. Setiap klinik dapat mengaktifkan atau menonaktifkan modul secara mandiri sesuai kebutuhan operasionalnya.

---

## Model Bisnis

- Satu **SUPERADMIN** memiliki dan mengelola semua klinik dalam jaringan
- Setiap klinik adalah cabang dari jaringan yang sama
- Setiap klinik dapat mengaktifkan/menonaktifkan modulnya secara mandiri
- Customer dapat terhubung ke semua klinik dalam satu jaringan
- Semua data diisolasi berdasarkan `clinic_id`
- Tidak ada payment gateway — semua pembayaran dicatat manual

---

## Role & Hak Akses

### SUPERADMIN
- Mengelola semua klinik dalam jaringan
- Mengelola semua user (doctor dan staff)
- Mengaktifkan/menonaktifkan modul per klinik
- Melihat laporan dari semua klinik
- Mengonfigurasi platform secara keseluruhan

### DOCTOR
- Mengakses modul medis di klinik yang di-assign
- Membuat dan mengelola medical record pasien
- Mengelola appointment pasien
- Melihat riwayat lengkap pasien

### STAFF
- Mengakses modul operasional di klinik yang di-assign
- Mendaftarkan customer dan pet baru
- Mengelola appointment
- Mengoperasikan kasir dan membuat invoice
- Mengelola inventory dan layanan grooming

### CUSTOMER
- Mendaftar dan login melalui public site
- Melakukan booking online (jika modul aktif)
- Melihat riwayat kesehatan pet
- Melihat dan mengunduh invoice
- Menerima notifikasi otomatis

---

## URL & Akses

### Public Site
| URL | Fungsi |
|---|---|
| `petcare.com` | Landing page |
| `petcare.com/login` | Login customer |
| `petcare.com/register` | Register customer |
| `petcare.com/booking` | Booking online _(jika modul aktif)_ |
| `petcare.com/layanan` | Halaman layanan |
| `petcare.com/dokter` | Halaman dokter |
| `petcare.com/artikel` | Halaman artikel |
| `petcare.com/kontak` | Halaman kontak |
| `petcare.com/portal/dashboard` | Customer portal |

### Sistem Klinik (Internal)
| URL | Role |
|---|---|
| `app.petcare.com/login` | Login untuk semua role internal |
| `app.petcare.com/superadmin/dashboard` | SUPERADMIN |
| `app.petcare.com/doctor/dashboard` | DOCTOR |
| `app.petcare.com/staff/dashboard` | STAFF |

---

## Daftar Modul

Setiap modul dapat diaktifkan atau dinonaktifkan per klinik. Jika sebuah modul dinonaktifkan:
- Menu hilang dari sidebar
- API route diblokir dan mengembalikan `403 Forbidden`
- Fitur tidak muncul di public site

### 🌐 Public
| Modul | Fungsi |
|---|---|
| `ONLINE_BOOKING` | Form booking di public site |
| `CUSTOMER_PORTAL` | Login dan portal customer |

### 🏥 Medical
| Modul | Fungsi |
|---|---|
| `APPOINTMENT` | Manajemen appointment internal |
| `MEDICAL_RECORD` | Rekam medis format SOAP |
| `VACCINATION` | Vaksinasi dan reminder otomatis |

### ⚙️ Operational
| Modul | Fungsi |
|---|---|
| `INPATIENT` | Rawat inap dan manajemen kandang |
| `GROOMING` | Layanan grooming |
| `INVENTORY` | Stok produk dan obat |

### 💰 Finance
| Modul | Fungsi |
|---|---|
| `POS_BILLING` | Kasir dan invoice manual |
| `ACCOUNTING` | Laporan keuangan |

### 📣 Communication
| Modul | Fungsi |
|---|---|
| `NOTIFICATION_WA` | Notifikasi WhatsApp via Fonnte |
| `NOTIFICATION_EMAIL` | Notifikasi email via Resend |

> **Default modul aktif saat klinik baru dibuat:** `APPOINTMENT`, `MEDICAL_RECORD`, `POS_BILLING`

---

## Sistem Pembayaran & Invoice

- Tidak menggunakan payment gateway
- Pembayaran dicatat secara manual oleh staff
- Metode yang tersedia: Cash, Transfer, Kartu, QRIS _(semua hanya dicatat, tidak diproses otomatis)_
- Status invoice: `UNPAID` | `PAID` | `PARTIAL` | `CANCELLED`
- Invoice tidak dapat diedit jika statusnya sudah `PAID`
- Setiap perubahan invoice tercatat di **audit log**

---

## Detail Modul

### ONLINE_BOOKING
Alur booking oleh customer melalui public site:
1. Pilih layanan
2. Pilih dokter
3. Pilih tanggal dan waktu
4. Isi data diri dan data pet
5. Sistem membuat appointment secara otomatis
6. Customer menerima konfirmasi via WA atau email

---

### APPOINTMENT
**Status:** `SCHEDULED` → `CONFIRMED` → `COMPLETED` | `CANCELLED` | `NO_SHOW`

Fitur:
- Booking oleh staff atau melalui online booking
- Manajemen jadwal dokter
- Tampilan kalender appointment
- Nomor antrian otomatis
- Notifikasi otomatis ke customer

---

### MEDICAL_RECORD
Format rekam medis menggunakan **SOAP**:

| Komponen | Isi |
|---|---|
| **Subjective** | Keluhan yang disampaikan pemilik |
| **Objective** | Hasil pemeriksaan fisik |
| **Assessment** | Diagnosis dokter |
| **Plan** | Tindakan dan rencana perawatan |

Data yang tersimpan:
- Diagnosis dan tindakan
- Resep _(terhubung ke inventori)_
- File pendukung: foto, dokumen lab
- Riwayat lengkap pasien

---

### VACCINATION
- Pencatatan vaksin dan tanggal pemberian
- Perhitungan otomatis tanggal vaksin berikutnya
- Pembuatan sertifikat vaksin
- Reminder otomatis: **H-30, H-14, H-7, H-1**
- Pengiriman via WhatsApp atau email

---

### INPATIENT
**Status Kandang:** `AVAILABLE` | `OCCUPIED` | `MAINTENANCE`

**Status Pasien:** `ADMITTED` → `OBSERVED` → `DISCHARGED`

Fitur:
- Manajemen daftar kandang per klinik
- Admission (penerimaan) pasien
- Input observasi harian: suhu, berat badan, kondisi umum, nafsu makan, pemberian obat
- Customer dapat memantau perkembangan kondisi pet
- Discharge otomatis membuatkan invoice

---

### GROOMING
**Status:** `BOOKED` → `PROCESSING` → `COMPLETED`

Fitur:
- Manajemen layanan grooming dan harga
- Penjadwalan sesi grooming
- Upload foto sebelum dan sesudah grooming
- Notifikasi otomatis ke customer saat selesai

---

### INVENTORY
- Manajemen produk dan obat
- Pencatatan stok masuk dan keluar
- Manajemen supplier
- Informasi batch dan tanggal kedaluwarsa
- Kategorisasi produk
- Alert otomatis: stok di bawah minimum
- Alert otomatis: produk mendekati kedaluwarsa
- Stok berkurang otomatis saat resep dibuat
- Stok berkurang otomatis saat transaksi POS

---

### POS_BILLING
Alur transaksi kasir:
1. Pilih customer
2. Tambahkan produk atau layanan ke keranjang
3. Terapkan diskon per item atau total (opsional)
4. Total dihitung otomatis
5. Catat metode pembayaran
6. Invoice dibuat otomatis dengan status `PAID`
7. Stok berkurang otomatis
8. Loyalty point customer bertambah otomatis

---

### ACCOUNTING
- Pencatatan pemasukan dan pengeluaran
- Laporan keuangan per periode
- Laporan per klinik
- Dashboard: revenue, expense, profit
- Export laporan ke file

---

### NOTIFICATION_WA

**Trigger otomatis:**
- Konfirmasi booking
- Reminder appointment H-1
- Reminder vaksin: H-30, H-14, H-7, H-1
- Update kondisi pasien inpatient
- Invoice siap

**Fitur pendukung:**
- Template pesan per jenis notifikasi
- Log pengiriman lengkap
- Status delivered / failed
- Retry otomatis jika pengiriman gagal

---

### NOTIFICATION_EMAIL

**Trigger otomatis:**
- Konfirmasi registrasi customer baru
- Konfirmasi booking
- Invoice dalam format PDF
- Laporan bulanan ke SUPERADMIN

**Fitur pendukung:**
- Template email per jenis notifikasi
- Log pengiriman lengkap
- Status delivered / failed

---

### CUSTOMER_PORTAL

**Dashboard menampilkan:**
- Appointment aktif dan riwayat kunjungan
- Reminder vaksin mendatang
- Invoice yang belum dibayar

**Halaman Pet:**
- Profil lengkap pet
- Medical record
- Riwayat vaksinasi
- Dokumen dan sertifikat

---

## Alur Kerja Utama (Workflow)

### 1. Workflow Kunjungan Klinik

```
Customer datang / booking online
        │
        ▼
Customer & pet terdaftar di sistem
        │
        ▼
Appointment dibuat → Nomor antrian dibuat
        │
        ▼
Dokter memeriksa pasien
        │
        ▼
Medical record SOAP dibuat
(Diagnosis, tindakan, resep dicatat)
        │
        ▼
[Perlu rawat inap?] → Ya → Admission inpatient dibuat
        │
        ▼
Invoice otomatis terbentuk
        │
        ▼
Staff mencatat pembayaran manual
        │
        ▼
Status invoice berubah menjadi PAID
        │
        ▼
Notifikasi invoice dikirim ke customer
        │
        ▼
Riwayat pasien tersimpan permanen
```

---

### 2. Workflow Booking Online

```
Customer membuka petcare.com/booking
        │
        ▼
Pilih layanan → Pilih dokter → Pilih tanggal & waktu
        │
        ▼
Isi data diri dan data pet
        │
        ▼
Appointment dibuat (status: SCHEDULED)
        │
        ▼
Customer menerima konfirmasi WA / email
        │
        ▼
Staff mengonfirmasi (status: CONFIRMED)
        │
        ▼
Reminder H-1 terkirim otomatis ke customer
```

---

### 3. Workflow Rawat Inap

```
Dokter membuat admission dari medical record
        │
        ▼
Pilih kandang yang tersedia
        │
        ▼
Status kandang → OCCUPIED
        │
        ▼
Staff menginput observasi harian
(Suhu, berat, kondisi, nafsu makan, obat)
        │
        ▼
Update kondisi dikirim ke customer
        │
        ▼
Dokter membuat discharge
        │
        ▼
Status kandang → AVAILABLE
        │
        ▼
Invoice dibuat otomatis
```

---

### 4. Workflow POS Kasir

```
Staff membuka modul kasir
        │
        ▼
Pilih customer
        │
        ▼
Tambahkan produk / layanan ke keranjang
        │
        ▼
Input diskon (jika ada)
        │
        ▼
Total dihitung otomatis
        │
        ▼
Catat metode pembayaran
        │
        ▼
Invoice dibuat (status: PAID)
Stok berkurang otomatis
Loyalty point bertambah otomatis
        │
        ▼
Notifikasi invoice dikirim ke customer
```

---

### 5. Workflow Reminder Vaksin

```
Vaksinasi selesai dicatat
        │
        ▼
Sistem menyimpan tanggal vaksin berikutnya
        │
        ▼
Scheduler berjalan setiap hari
        │
        ▼
Sistem mencari vaksin yang mendekati jatuh tempo
        │
        ▼
Kirim notifikasi WA / email ke customer
(H-30, H-14, H-7, H-1)
        │
        ▼
Log pengiriman disimpan
```

---

### 6. Workflow Onboarding Klinik Baru

```
SUPERADMIN login ke sistem
        │
        ▼
Buat klinik baru (nama, alamat, kontak)
        │
        ▼
Tambahkan user: doctor dan staff
        │
        ▼
Assign doctor & staff ke klinik
        │
        ▼
Aktifkan modul yang dibutuhkan
        │
        ▼
Klinik siap beroperasi
```

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript strict mode) |
| Backend & Auth | Supabase (Auth + PostgreSQL + Storage + Realtime) |
| ORM | Prisma |
| UI | shadcn/ui + Tailwind CSS |
| State Management | Zustand |
| Form & Validasi | React Hook Form + Zod |
| Tabel Data | TanStack Table |
| Chart & Grafik | Recharts |
| Email | Resend |
| WhatsApp | Fonnte |
| Deployment | Vercel |
| Unit & Integration Test | Jest + Testing Library |
| E2E Test | Playwright |
| Mock API | MSW |
| Code Quality | ESLint + Prettier |
| Pre-commit | Husky + lint-staged |
| Error Monitoring | Sentry |

---

## Struktur Folder

```
app/
├── (public)/
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── booking/page.tsx
│   ├── layanan/page.tsx
│   ├── dokter/page.tsx
│   ├── artikel/page.tsx
│   ├── kontak/page.tsx
│   └── portal/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── pets/page.tsx
│       ├── appointments/page.tsx
│       ├── medical-records/page.tsx
│       ├── vaccinations/page.tsx
│       └── invoices/page.tsx
├── (auth)/
│   └── login/page.tsx
├── (superadmin)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── clinics/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── [id]/modules/page.tsx
│   ├── users/page.tsx
│   ├── doctors/page.tsx
│   ├── staff/page.tsx
│   ├── reports/page.tsx
│   └── settings/page.tsx
├── (doctor)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── appointments/page.tsx
│   ├── medical-records/page.tsx
│   ├── vaccinations/page.tsx
│   └── inpatients/page.tsx
├── (staff)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── appointments/page.tsx
│   ├── customers/page.tsx
│   ├── pets/page.tsx
│   ├── grooming/page.tsx
│   ├── inpatients/page.tsx
│   ├── inventory/page.tsx
│   ├── pos/page.tsx
│   └── invoices/page.tsx
└── api/
    ├── auth/
    ├── clinics/
    ├── modules/
    ├── users/
    ├── customers/
    ├── pets/
    ├── appointments/
    ├── medical-records/
    ├── vaccinations/
    ├── inpatients/
    ├── grooming/
    ├── inventory/
    ├── pos/
    ├── invoices/
    ├── accounting/
    └── notifications/

components/
├── ui/                             → shadcn components
└── shared/
    ├── PageHeader.tsx
    ├── DataTable.tsx
    ├── FormModal.tsx
    ├── DeleteDialog.tsx
    ├── LoadingSkeleton.tsx
    ├── ErrorAlert.tsx
    ├── StatusBadge.tsx
    └── ModuleGuard.tsx

lib/
├── auth.ts
├── db.ts
├── utils.ts
├── module-guard.ts
└── validations/
    ├── customer.ts
    ├── pet.ts
    ├── appointment.ts
    ├── medical-record.ts
    ├── vaccination.ts
    ├── inpatient.ts
    ├── grooming.ts
    ├── inventory.ts
    └── invoice.ts

prisma/
├── schema.prisma
└── seed.ts

types/
└── index.ts

__tests__/
├── unit/
│   ├── components/
│   ├── lib/
│   └── validations/
├── integration/
│   ├── api/
│   └── db/
└── e2e/
    ├── auth.spec.ts
    ├── appointment.spec.ts
    ├── medical-record.spec.ts
    ├── pos.spec.ts
    └── modules.spec.ts
```

---

## Konvensi Kode

### Umum
- Gunakan **Server Component** sebagai default; tambahkan `"use client"` hanya jika komponen bersifat interaktif
- Hindari `any` di TypeScript — selalu definisikan type secara eksplisit
- Jangan _hardcode_ nilai; gunakan konstanta atau environment variable
- Selalu tangani **error state** dan **loading state**

### Penamaan
| Jenis | Konvensi |
|---|---|
| File | `kebab-case` |
| Komponen | `PascalCase` |
| Fungsi | `camelCase` |
| Variabel | `camelCase` |
| Tabel DB | `snake_case` |

---

## Konvensi API Route

```
GET    /api/[module]       → List data
POST   /api/[module]       → Create data
GET    /api/[module]/[id]  → Detail data
PUT    /api/[module]/[id]  → Update data
DELETE /api/[module]/[id]  → Delete data
```

### Aturan Wajib
- Selalu return `{ data, error, message }`
- Validasi `clinic_id` dari session
- Validasi modul aktif sebelum memproses request
- Validasi input menggunakan Zod
- Gunakan `try/catch` di setiap handler
- Gunakan HTTP status code yang tepat

---

## Module Guard Rules

| Konteks | Aturan |
|---|---|
| Middleware | Setiap route wajib mengecek modul aktif |
| API Route | Cek modul aktif sebelum memproses request |
| Sidebar | Render dinamis sesuai modul aktif klinik |
| API (nonaktif) | Return `403 Forbidden` |
| UI (nonaktif) | Redirect ke `/dashboard` |
| Komponen | Gunakan `<ModuleGuard>` sebagai wrapper |

---

## Konvensi Komponen

| Kebutuhan | Komponen |
|---|---|
| Header halaman | `PageHeader` (wajib di setiap halaman) |
| List data | `DataTable` (TanStack Table) |
| Form | Modal atau Sheet (shadcn) |
| Loading state | `Skeleton` (shadcn) |
| Error state | `Alert` (shadcn) |
| Konfirmasi hapus | `AlertDialog` (shadcn) |
| Notifikasi aksi | `Toast` (shadcn) |

---

## Database Rules

- Setiap tabel **wajib** memiliki `clinic_id`, kecuali tabel `User` dan `Clinic`
- Setiap query **wajib** difilter berdasarkan `clinic_id`
- SUPERADMIN dapat melakukan query tanpa filter `clinic_id`
- Gunakan **Prisma transaction** untuk operasi multi-tabel
- Selalu gunakan **soft delete** dengan field `deletedAt`
- Setiap tabel wajib memiliki `createdAt` dan `updatedAt`
- Buat **index** pada kolom yang sering difilter
- Hindari **N+1 query** — selalu gunakan `include` atau `select`

---

## Testing

### Stack
| Tool | Kegunaan |
|---|---|
| Jest + Testing Library | Unit test dan integration test |
| Playwright | End-to-end (E2E) test |
| MSW | Mock API dalam test |

### Aturan
- Setiap komponen UI wajib memiliki unit test
- Setiap API route wajib memiliki integration test
- Setiap workflow utama wajib memiliki E2E test
- Minimum code coverage: **70%**
- Penamaan file test: `[nama].test.ts` atau `[nama].spec.ts`
- Jalankan test sebelum melakukan commit

---

## CI/CD Pipeline (GitHub Actions)

```
Push / Pull Request ke main
         │
         ▼
  1. Lint          → ESLint + Prettier
         │
         ▼
  2. Type Check    → tsc --noEmit
         │
         ▼
  3. Unit Test     → Jest
         │
         ▼
  4. Integration   → Jest
         │
         ▼
  5. Build Check   → next build
         │
         ▼
  6. E2E Test      → Playwright  (main branch only)
         │
         ▼
  7. Deploy        → Vercel      (main branch only)
```

---

## Code Quality

| Tool | Fungsi |
|---|---|
| ESLint | Linting |
| Prettier | Formatting |
| Husky | Pre-commit hooks |
| lint-staged | Lint hanya file yang berubah |
| commitlint | Validasi pesan commit |

---

## Commit Convention

| Prefix | Kegunaan |
|---|---|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `refactor` | Refactor kode |
| `test` | Tambah atau update test |
| `docs` | Update dokumentasi |
| `chore` | Update konfigurasi atau dependency |

---

## Error Handling Rules

- Gunakan **custom error class** per domain
- API error selalu mengembalikan status code yang tepat
- Client error ditampilkan melalui `Toast` atau `Alert`
- Jangan expose **stack trace** ke client di production
- Gunakan **Sentry** untuk error monitoring di production

---

## Environment Variables

```env
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

---

## Fase Pengembangan

### Fase 1 — Foundation
- Setup project dan Codespaces
- Sistem autentikasi dan role
- Manajemen klinik
- Manajemen modul
- Layout per role
- Public site dasar

### Fase 2 — Core Medical
- Manajemen customer dan pet
- Sistem appointment
- Medical record format SOAP
- Sistem vaksinasi

### Fase 3 — Operations
- Sistem rawat inap (inpatient)
- Sistem grooming
- Manajemen inventory
- POS dan billing

### Fase 4 — Business
- Akuntansi dan laporan keuangan
- Dashboard dan laporan per klinik
- Notifikasi WhatsApp dan email
- Customer portal

### Fase 5 — Polish
- Public website lengkap
- Testing menyeluruh dan bug fix
- Optimasi performa
- Deployment dan monitoring
