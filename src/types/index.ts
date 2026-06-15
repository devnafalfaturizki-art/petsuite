import type { User, Clinic, ClinicUser, ClinicModule } from "@prisma/client";

// ========================
// AUTH TYPES
// ========================

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "SUPERADMIN" | "DOCTOR" | "STAFF" | "CUSTOMER";
  clinicId?: string;
  clinicSlug?: string;
};

export type AuthResponse = {
  data: SessionUser | null;
  error: string | null;
  message: string;
};

// ========================
// API RESPONSE TYPES
// ========================

export type ApiResponse<T = unknown> = {
  data: T | null;
  error: string | null;
  message: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ========================
// MODULE TYPES
// ========================

export type ModuleName =
  | "ONLINE_BOOKING"
  | "CUSTOMER_PORTAL"
  | "APPOINTMENT"
  | "MEDICAL_RECORD"
  | "VACCINATION"
  | "INPATIENT"
  | "GROOMING"
  | "INVENTORY"
  | "POS_BILLING"
  | "ACCOUNTING"
  | "NOTIFICATION_WA"
  | "NOTIFICATION_EMAIL";

export type ModuleWithStatus = {
  module: ModuleName;
  isActive: boolean;
};

// ========================
// CLINIC TYPES
// ========================

export type ClinicWithModules = Clinic & {
  modules: ClinicModule[];
  users: (ClinicUser & { user: Pick<User, "id" | "name" | "email" | "role"> })[];
};

// ========================
// DASHBOARD TYPES
// ========================

export type DashboardStats = {
  totalAppointments: number;
  totalPatients: number;
  totalRevenue: number;
  totalInpatients: number;
  appointmentsToday: number;
  revenueToday: number;
};

// ========================
// SOAP MEDICAL RECORD
// ========================

export type SOAPRecord = {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

// ========================
// INVOICE TYPES
// ========================

export type InvoiceWithItems = {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  status: "UNPAID" | "PAID" | "PARTIAL" | "CANCELLED";
  paymentMethod: "CASH" | "TRANSFER" | "KARTU" | "QRIS" | null;
  createdAt: Date;
  customer: { name: string; phone: string | null } | null;
  user: { name: string };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    subtotal: number;
  }[];
};

// ========================
// NOTIFICATION TYPES
// ========================

export type NotificationTemplate = {
  type: string;
  channel: "WHATSAPP" | "EMAIL";
  subject?: string;
  message: string;
};

// ========================
// FILTER & SORT TYPES
// ========================

export type SortDirection = "asc" | "desc";

export type TableFilters = {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
};