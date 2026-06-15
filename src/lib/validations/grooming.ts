import { z } from "zod";

export const createGroomingSchema = z.object({
  petId: z.string().min(1, "Pet wajib dipilih"),
  serviceName: z.string().min(1, "Nama layanan wajib diisi"),
  price: z.number().positive("Harga harus positif"),
  scheduledAt: z.string().min(1, "Jadwal wajib diisi"),
  notes: z.string().optional().or(z.literal("")),
});

export const updateGroomingSchema = z.object({
  status: z.enum(["BOOKED", "PROCESSING", "COMPLETED"]).optional(),
  notes: z.string().optional().or(z.literal("")),
  photoBefore: z.string().optional().or(z.literal("")),
  photoAfter: z.string().optional().or(z.literal("")),
});

export type CreateGroomingInput = z.infer<typeof createGroomingSchema>;
export type UpdateGroomingInput = z.infer<typeof updateGroomingSchema>;