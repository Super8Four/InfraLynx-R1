'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const regionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.string().optional().nullable(),
  description: z.string().optional(),
  tags: z.string().optional(),
})

export async function createRegion(data: unknown) {
  try {
    const validatedData = regionSchema.parse(data);
    const newRegion = await prisma.region.create({
      data: {
        ...validatedData,
        id: `region-${Date.now()}`,
        description: validatedData.description || "",
        tags: validatedData.tags ? validatedData.tags.split(",").map((t) => t.trim()) : [],
      },
    });

    revalidatePath('/organization/regions');
    return { success: true, newRegion };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create region." };
  }
}

export async function deleteRegion(id: string) {
  try {
    // Prevent deleting regions that are parents
    const childRegions = await prisma.region.count({ where: { parentId: id } });
    if (childRegions > 0) {
        return { success: false, message: "Cannot delete a region that is a parent to others." };
    }
    const sites = await prisma.site.count({ where: { regionId: id } });
    if (sites > 0) {
        return { success: false, message: "Cannot delete a region that contains sites." };
    }

    await prisma.region.delete({ where: { id } });
    revalidatePath('/organization/regions');
    return { success: true };
  } catch (e) {
      console.error(e);
      return { success: false, message: "Failed to delete region." };
  }
}
