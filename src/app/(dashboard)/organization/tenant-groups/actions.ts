'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export async function createTenantGroup(data: unknown) {
  try {
    const validatedData = groupSchema.parse(data);
    const newGroup = await prisma.tenantGroup.create({
      data: {
        ...validatedData,
        id: `tg-${Date.now()}`,
        description: validatedData.description || "",
      },
    });

    revalidatePath('/organization/tenant-groups');
    return { success: true, newGroup };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create tenant group." };
  }
}

export async function deleteTenantGroup(id: string) {
  try {
    const tenants = await prisma.tenant.count({ where: { groupId: id } });
    if (tenants > 0) {
      return { success: false, message: "Cannot delete group as it has tenants assigned." };
    }
    
    await prisma.tenantGroup.delete({ where: { id } });
    revalidatePath('/organization/tenant-groups');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete tenant group." };
  }
}
