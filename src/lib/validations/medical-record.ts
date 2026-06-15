import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  petId: z.string().min(1, "Pet wajib dipilih"),
  appointmentId: z.string().optional().or(z.literal("")),
  subjective: z.string().optional().or(z.literal("")),
  objective: z.string().optional().or(z.literal("")),
  assessment: z.string().optional().or(z.literal("")),
  plan: z.string().optional().or(z.literal("")),
  diagnosis: z.string().optional().or(z.literal("")),
  action: z.string().optional().or(z.literal("")),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial();

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;