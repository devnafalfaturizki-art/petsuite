import { z } from "zod";

export const createVaccinationSchema = z.object({
  petId: z.string().min(1, "Pet wajib dipilih"),
  vaccineName: z.string().min(1, "Nama vaksin wajib diisi"),
  dateAdministered: z.string().min(1, "Tanggal pemberian wajib diisi"),
  nextDueDate: z.string().optional().or(z.literal("")),
  batchNumber: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const updateVaccinationSchema = createVaccinationSchema.partial();

export type CreateVaccinationInput = z.infer<typeof createVaccinationSchema>;
export type UpdateVaccinationInput = z.infer<typeof updateVaccinationSchema>;