import prisma from "@/lib/db";
import { enqueueNotification } from "@/lib/queue/queue-service";

export async function processVaccinationReminders() {
  const now = new Date();
  const reminders = [30, 14, 7, 1];

  for (const daysBefore of reminders) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + daysBefore);

    const targetStart = new Date(targetDate);
    targetStart.setHours(0, 0, 0, 0);
    const targetEnd = new Date(targetDate);
    targetEnd.setHours(23, 59, 59, 999);

    const vaccinations = await prisma.vaccination.findMany({
      where: {
        nextDueDate: { gte: targetStart, lte: targetEnd },
        deletedAt: null,
      },
      include: {
        pet: { include: { customer: true } },
        clinic: true,
      },
    });

    for (const vax of vaccinations) {
      const customerPhone = vax.pet.customer.phone;
      if (!customerPhone) continue;

      await enqueueNotification({
        clinicId: vax.clinicId,
        channel: "WHATSAPP",
        recipient: customerPhone,
        template: "VACCINATION_REMINDER",
        payload: {
          petName: vax.pet.name,
          vaccineName: vax.vaccineName,
          dueDate: vax.nextDueDate?.toISOString(),
          daysLeft: daysBefore,
        },
        scheduledAt: now,
      });
    }
  }

  return { processed: true };
}