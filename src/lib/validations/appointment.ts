import { z } from "zod";

export const createAppointmentSchema = z.object({
  petId: z.string().min(1, "Pet wajib dipilih"),
  doctorId: z.string().min(1, "Dokter wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  time: z.string().min(1, "Waktu wajib diisi"),
  notes: z.string().optional().or(z.literal("")),
  serviceType: z.string().optional().or(z.literal("")),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  notes: z.string().optional().or(z.literal("")),
  serviceType: z.string().optional().or(z.literal("")),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;