import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  category: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  price: z.number().positive("Harga harus positif"),
  cost: z.number().positive("Modal harus positif").optional().nullable(),
  stock: z.number().int().min(0, "Stok tidak boleh negatif").default(0),
  minStock: z.number().int().min(0, "Min stok tidak boleh negatif").default(0),
  unit: z.string().optional().or(z.literal("")),
  batchNumber: z.string().optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
  supplierId: z.string().optional().or(z.literal("")),
});

export const updateProductSchema = createProductSchema.partial();

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Nama supplier wajib diisi"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export const createStockMovementSchema = z.object({
  productId: z.string().min(1, "Produk wajib dipilih"),
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().int().positive("Jumlah harus positif"),
  notes: z.string().optional().or(z.literal("")),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;