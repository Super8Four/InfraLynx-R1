'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const typeSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  u_height: z.coerce.number().int().min(1, "U Height must be a positive number"),
  width: z.enum(["nineteen_in", "twentythree_in"]),
})

export async function createRackType(data: unknown) {
  try {
    const validatedData = typeSchema.parse(data);
    const newType = await prisma.rackType.create({
      data: {
        ...validatedData,
        id: `rt-${Date.now()}`,
      },
    });

    revalidatePath('/racks/types');
    return { success: true, newType };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create rack type." };
  }
}

export async function deleteRackType(id: string) {
  try {
    const racks = await prisma.rack.count({ where: { typeId: id } });
    if (racks > 0) {
      return { success: false, message: "Cannot delete type as it is in use by racks." };
    }

    await prisma.rackType.delete({ where: { id } });
    revalidatePath('/racks/types');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete rack type." };
  }
}