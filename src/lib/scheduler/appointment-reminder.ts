import prisma from "@/lib/db";
import { enqueueNotification } from "@/lib/queue/queue-service";

export async function processAppointmentReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: tomorrow, lte: tomorrowEnd },
      status: { in: ["SCHEDULED", "CONFIRMED"] },
      deletedAt: null,
    },
    include: {
      pet: { include: { customer: true } },
      clinic: true,
    },
  });

  for (const apt of appointments) {
    const customerPhone = apt.pet.customer.phone;
    if (!customerPhone) continue;

    await enqueueNotification({
      clinicId: apt.clinicId,
      channel: "WHATSAPP",
      recipient: customerPhone,
      template: "APPOINTMENT_REMINDER",
      payload: {
        petName: apt.pet.name,
        date: apt.date.toISOString(),
        time: apt.time,
        queueNumber: apt.queueNumber,
      },
      scheduledAt: new Date(),
    });
  }

  return { processed: appointments.length };
}