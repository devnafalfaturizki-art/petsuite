import { z } from "zod";

export const createPetSchema = z.object({
  customerId: z.string().min(1, "Customer wajib dipilih"),
  name: z.string().min(1, "Nama pet wajib diisi"),
  species: z.string().min(1, "Spesies wajib diisi"),
  breed: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  weight: z.number().positive("Berat harus positif").optional().nullable(),
  color: z.string().optional().or(z.literal("")),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;