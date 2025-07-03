'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export async function createContactRole(data: unknown) {
  try {
    const validatedData = roleSchema.parse(data);
    const newRole = await prisma.contactRole.create({
      data: {
        ...validatedData,
        id: `role-${Date.now()}`,
        description: validatedData.description || "",
      },
    });

    revalidatePath('/organization/contact-roles');
    return { success: true, newRole };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create contact role." };
  }
}

export async function deleteContactRole(id: string) {
  try {
    const assignments = await prisma.contactAssignment.count({ where: { roleId: id } });
    if (assignments > 0) {
      return { success: false, message: "Cannot delete role as it is assigned to contacts." };
    }
    
    await prisma.contactRole.delete({ where: { id } });
    revalidatePath('/organization/contact-roles');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete contact role." };
  }
}
