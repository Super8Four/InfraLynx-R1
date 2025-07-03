'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, { message: "Please provide a valid hex color." }).optional(),
})

export async function createRackRole(data: unknown) {
  try {
    const validatedData = roleSchema.parse(data);
    const newRole = await prisma.rackRole.create({
      data: {
        ...validatedData,
        id: `rr-${Date.now()}`,
        description: validatedData.description || "",
        color: validatedData.color || "#cccccc",
      },
    });

    revalidatePath('/racks/roles');
    return { success: true, newRole };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create rack role." };
  }
}

export async function deleteRackRole(id: string) {
  try {
    const racks = await prisma.rack.count({ where: { roleId: id } });
    if (racks > 0) {
        return { success: false, message: "Cannot delete role as it is in use by racks." };
    }

    await prisma.rackRole.delete({ where: { id } });
    revalidatePath('/racks/roles');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete rack role." };
  }
}