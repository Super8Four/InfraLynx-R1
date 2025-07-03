'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const platformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  description: z.string().optional(),
})

export async function createPlatform(data: unknown) {
  try {
    const validatedData = platformSchema.parse(data);
    const newPlatform = await prisma.platform.create({
      data: {
        ...validatedData,
        id: `p-${Date.now()}`,
        description: validatedData.description || "",
      },
    });

    revalidatePath('/devices/platforms');
    return { success: true, newPlatform };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create platform." };
  }
}

export async function deletePlatform(id: string) {
  try {
    // Check if any devices are using this platform
    const devices = await prisma.device.count({ where: { platformId: id } });
    if (devices > 0) {
      return { success: false, message: "Cannot delete platform as it is in use by devices." };
    }

    await prisma.platform.delete({ where: { id } });
    revalidatePath('/devices/platforms');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete platform." };
  }
}