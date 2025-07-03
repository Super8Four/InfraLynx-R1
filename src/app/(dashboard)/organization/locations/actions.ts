'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  siteId: z.string().min(1, "Site is required"),
  description: z.string().optional(),
})

export async function createLocation(data: unknown) {
  try {
    const validatedData = locationSchema.parse(data);
    const newLocation = await prisma.location.create({
      data: {
        ...validatedData,
        id: `loc-${Date.now()}`,
        description: validatedData.description || "",
      },
      include: {
        site: true,
      }
    });

    revalidatePath('/organization/locations');
    return { success: true, newLocation };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create location." };
  }
}

export async function deleteLocation(id: string) {
  try {
    const racks = await prisma.rack.count({ where: { locationId: id } });
    if (racks > 0) {
      return { success: false, message: "Cannot delete location as it contains racks." };
    }
    
    await prisma.location.delete({ where: { id } });
    revalidatePath('/organization/locations');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete location." };
  }
}
