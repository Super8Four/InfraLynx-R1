'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const siteGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export async function createSiteGroup(data: unknown) {
  try {
    const validatedData = siteGroupSchema.parse(data);
    const newGroup = await prisma.siteGroup.create({
      data: {
        ...validatedData,
        id: `sg-${Date.now()}`,
        description: validatedData.description || "",
      },
    });

    revalidatePath('/organization/site-groups');
    return { success: true, newGroup };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create site group." };
  }
}

export async function deleteSiteGroup(id: string) {
  try {
    const sites = await prisma.site.count({ where: { groupId: id } });
    if (sites > 0) {
      return { success: false, message: "Cannot delete group as it has sites assigned." };
    }
    
    await prisma.siteGroup.delete({ where: { id } });
    revalidatePath('/organization/site-groups');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete site group." };
  }
}
