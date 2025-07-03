'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  groupId: z.string().optional().nullable(),
})

export async function createTenant(data: unknown) {
  try {
    const validatedData = tenantSchema.parse(data);
    const newTenant = await prisma.tenant.create({
      data: {
        ...validatedData,
        id: `t-${Date.now()}`,
        description: validatedData.description || "",
      },
      include: {
        group: true,
      }
    });

    revalidatePath('/organization/tenants');
    return { success: true, newTenant };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create tenant." };
  }
}

export async function deleteTenant(id: string) {
  try {
    const sites = await prisma.site.count({ where: { tenantId: id } });
    if (sites > 0) {
      return { success: false, message: "Cannot delete tenant as it is associated with sites." };
    }
    
    await prisma.tenant.delete({ where: { id } });
    revalidatePath('/organization/tenants');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete tenant." };
  }
}
