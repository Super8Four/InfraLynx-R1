'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Must be a valid hex color").optional(),
})

export async function createDeviceRole(data: unknown) {
  try {
    const validatedData = roleSchema.parse(data);
    const newRole = await prisma.deviceRole.create({
      data: {
        ...validatedData,
        id: `dr-${Date.now()}`,
        description: validatedData.description || "",
        color: validatedData.color || "#cccccc",
      },
    });

    revalidatePath('/devices/roles');
    return { success: true, newRole };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create device role." };
  }
}

export async function deleteDeviceRole(id: string) {
  try {
    const devices = await prisma.device.count({ where: { deviceRoleId: id } });
    if (devices > 0) {
      return { success: false, message: "Cannot delete role as it is in use by devices." };
    }
    
    await prisma.deviceRole.delete({ where: { id } });
    revalidatePath('/devices/roles');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete device role." };
  }
}