# PetCare Suite — Copilot Instructions

## Gambaran Proyek

PetCare Suite adalah platform manajemen klinik hewan berbasis multi-klinik (multi-clinic) yang dirancang untuk jaringan klinik dengan satu pemilik dan banyak cabang. Setiap klinik dapat mengaktifkan atau menonaktifkan modul secara mandiri sesuai kebutuhan operasionalnya.

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

---

## Model Bisnis

- **SUPERADMIN** memiliki dan mengelola semua klinik dalam jaringan
- Setiap klinik merupakan cabang dari jaringan yang sama
- Setiap klinik dapat mengaktifkan atau menonaktifkan modul secara mandiri
- Customer dapat terhubung ke semua klinik dalam satu jaringan
- Semua data diisolasi berdasarkan `clinic_id`

---

## Role & Hak Akses

| Role | Deskripsi |
|---|---|
| **SUPERADMIN** | Mengelola semua klinik, modul, user, dan laporan secara keseluruhan |
| **DOCTOR** | Mengakses modul medis di klinik yang telah di-assign |
| **STAFF** | Mengakses modul operasional di klinik yang telah di-assign |
| **CUSTOMER** | Mengakses customer portal melalui public site |

---

## URL Login & Akses

```
petcare.com/login         → Login CUSTOMER (public site)
app.petcare.com/login     → Login SUPERADMIN, DOCTOR, STAFF
  ├── SUPERADMIN          → /superadmin/dashboard
  ├── DOCTOR              → /doctor/dashboard
  └── STAFF               → /staff/dashboard
```

---

## Daftar Modul

Setiap modul dapat diaktifkan atau dinonaktifkan per klinik. Jika sebuah modul dinonaktifkan:
- Menu hilang dari sidebar
- API route diblokir (return `403`)
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

## Sistem Pembayaran

- **Tidak menggunakan payment gateway**
- Pembayaran dicatat secara manual oleh staff
- Metode yang diterima: Cash, Transfer, Kartu, QRIS _(semua dicatat manual)_
- Platform hanya digunakan untuk pembuatan invoice dan pencatatan transaksi
- Status invoice: `UNPAID` | `PAID` | `PARTIAL` | `CANCELLED`

---

## Struktur Folder

```
app/
├── (public)/
│   ├── page.tsx                    → Landing page
│   ├── login/page.tsx              → Login customer
│   ├── register/page.tsx           → Register customer
│   ├── layanan/page.tsx
│   ├── dokter/page.tsx
│   ├── artikel/page.tsx
│   ├── kontak/page.tsx
│   └── booking/page.tsx            → Aktif jika ONLINE_BOOKING on
├── (auth)/
│   └── login/page.tsx              → Login superadmin, doctor, staff
├── (superadmin)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx          → Ringkasan semua klinik
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
├── (customer)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── pets/page.tsx
│   ├── appointments/page.tsx
│   ├── medical-records/page.tsx
│   ├── vaccinations/page.tsx
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
    └── ModuleGuard.tsx             → Wrapper cek modul aktif

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
- Hindari penggunaan `any` di TypeScript — selalu definisikan type secara eksplisit
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

### Library Wajib
| Kebutuhan | Library |
|---|---|
| Form | React Hook Form + Zod |
| Tabel | TanStack Table |
| Komponen UI | shadcn/ui |

---

## Konvensi API Route

```
GET    /api/[module]       → List data
POST   /api/[module]       → Create data
GET    /api/[module]/[id]  → Detail data
PUT    /api/[module]/[id]  → Update data
DELETE /api/[module]/[id]  → Delete data
```

### Aturan Wajib di Setiap Handler
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
