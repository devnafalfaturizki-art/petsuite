import { z } from "zod";

export const createInvoiceItemSchema = z.object({
  productId: z.string().optional().or(z.literal("")),
  name: z.string().min(1, "Nama item wajib diisi"),
  quantity: z.number().int().positive("Jumlah harus positif"),
  price: z.number().positive("Harga harus positif"),
  discount: z.number().min(0, "Diskon tidak boleh negatif").default(0),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().optional().or(z.literal("")),
  items: z.array(createInvoiceItemSchema).min(1, "Minimal 1 item"),
  discountTotal: z.number().min(0, "Diskon tidak boleh negatif").default(0),
  paymentMethod: z.enum(["CASH", "TRANSFER", "KARTU", "QRIS"]),
  notes: z.string().optional().or(z.literal("")),
});

export const updateInvoiceSchema = z.object({
  status: z.enum(["UNPAID", "PAID", "PARTIAL", "CANCELLED"]).optional(),
  paymentMethod: z.enum(["CASH", "TRANSFER", "KARTU", "QRIS"]).optional(),
  notes: z.string().optional().or(z.literal("")),
});

export type CreateInvoiceItemInput = z.infer<typeof createInvoiceItemSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;