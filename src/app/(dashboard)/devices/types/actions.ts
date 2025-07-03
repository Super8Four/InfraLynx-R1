'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const typeSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  u_height: z.coerce.number().int().min(1, "U Height must be a positive number"),
})

export async function createDeviceType(data: unknown) {
  try {
    const validatedData = typeSchema.parse(data);
    const newType = await prisma.deviceType.create({
      data: {
        ...validatedData,
        id: `dt-${Date.now()}`,
      },
    });

    revalidatePath('/devices/types');
    return { success: true, newType };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create device type." };
  }
}

export async function deleteDeviceType(id: string) {
  try {
    const devices = await prisma.device.count({ where: { deviceTypeId: id } });
    if (devices > 0) {
      return { success: false, message: "Cannot delete type as it is in use by devices." };
    }

    await prisma.deviceType.delete({ where: { id } });
    revalidatePath('/devices/types');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete device type." };
  }
}