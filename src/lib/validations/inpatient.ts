import { z } from "zod";

export const createCageSchema = z.object({
  name: z.string().min(1, "Nama kandang wajib diisi"),
  type: z.string().optional().or(z.literal("")),
});

export const updateCageSchema = createCageSchema.partial();

export const createInpatientSchema = z.object({
  petId: z.string().min(1, "Pet wajib dipilih"),
  cageId: z.string().min(1, "Kandang wajib dipilih"),
  medicalRecordId: z.string().optional().or(z.literal("")),
  diagnosis: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const updateInpatientSchema = z.object({
  status: z.enum(["ADMITTED", "OBSERVED", "DISCHARGED"]).optional(),
  notes: z.string().optional().or(z.literal("")),
});

export const createObservationSchema = z.object({
  temperature: z.number().optional().nullable(),
  weight: z.number().optional().nullable(),
  generalCondition: z.string().optional().or(z.literal("")),
  appetite: z.string().optional().or(z.literal("")),
  medication: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type CreateCageInput = z.infer<typeof createCageSchema>;
export type UpdateCageInput = z.infer<typeof updateCageSchema>;
export type CreateInpatientInput = z.infer<typeof createInpatientSchema>;
export type UpdateInpatientInput = z.infer<typeof updateInpatientSchema>;
export type CreateObservationInput = z.infer<typeof createObservationSchema>;