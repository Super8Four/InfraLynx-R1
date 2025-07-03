'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const reservationSchema = z.object({
  rackId: z.string().min(1, "A rack must be selected"),
  units: z.string().min(1, "At least one unit must be specified")
    .refine(val => val.split(',').every(v => !isNaN(parseInt(v.trim()))), {
        message: "Units must be a comma-separated list of numbers."
    }),
  tenantId: z.string().min(1, "A tenant must be selected"),
  description: z.string().min(1, "Description is required"),
})

export async function createReservation(data: unknown) {
  try {
    const validatedData = reservationSchema.parse(data);
    const units = validatedData.units.split(',').map(v => parseInt(v.trim()));

    const newReservation = await prisma.rackReservation.create({
      data: {
        id: `res-${Date.now()}`,
        rackId: validatedData.rackId,
        tenantId: validatedData.tenantId,
        description: validatedData.description,
        units,
      },
      include: {
        rack: true,
        tenant: true,
      }
    });

    revalidatePath('/racks/reservations');
    return { success: true, newReservation };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create reservation." };
  }
}

export async function deleteReservation(id: string) {
  try {
    await prisma.rackReservation.delete({ where: { id } });
    revalidatePath('/racks/reservations');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete reservation." };
  }
}
