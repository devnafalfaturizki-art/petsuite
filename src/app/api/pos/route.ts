import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { createInvoiceSchema } from "@/lib/validations/invoice";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["SUPERADMIN", "STAFF"]);
    const body = await request.json();
    const validated = createInvoiceSchema.parse(body);

    const data = await prisma.$transaction(async (tx) => {
      // Calculate totals
      const itemsWithSubtotal = validated.items.map((item) => ({
        ...item,
        subtotal: item.price * item.quantity - item.discount,
      }));

      const subtotal = itemsWithSubtotal.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0) - validated.discountTotal;

      // Generate invoice number
      const clinic = await tx.clinic.findUnique({ where: { id: user.clinicId! } });
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      const invoiceNumber = `INV/${clinic?.slug?.toUpperCase() || "CLINIC"}/${dateStr}/${random}`;

      // Create invoice
      const invoice = await tx.invoice.create({
        data: {
          clinicId: user.clinicId!,
          customerId: validated.customerId || null,
          userId: user.id,
          invoiceNumber,
          subtotal,
          discountTotal: validated.discountTotal,
          total,
          status: "PAID",
          paymentMethod: validated.paymentMethod,
          notes: validated.notes,
          items: {
            create: itemsWithSubtotal.map((item) => ({
              productId: item.productId || null,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              subtotal: item.subtotal,
            })),
          },
        },
        include: { items: true },
      });

      // Reduce stock for each product item
      for (const item of itemsWithSubtotal) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              type: "OUT",
              quantity: item.quantity,
              notes: `POS Transaction: ${invoiceNumber}`,
            },
          });
        }
      }

      return invoice;
    });

    return successResponse(data, "Transaksi berhasil", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validasi gagal: " + JSON.stringify(error), 400);
    }
    return handleApiError(error);
  }
}