'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const assignmentSchema = z.object({
  objectType: z.enum(["Region", "Site", "Location"]),
  objectId: z.string().min(1, "An object must be selected"),
  contactId: z.string().min(1, "A contact must be selected"),
  roleId: z.string().min(1, "A role must be selected"),
})

export async function createContactAssignment(data: unknown) {
  try {
    const validatedData = assignmentSchema.parse(data);
    const newAssignment = await prisma.contactAssignment.create({
      data: {
        ...validatedData,
        id: `assign-${Date.now()}`,
      },
      include: {
        contact: true,
        role: true,
        region: true,
        site: true,
        location: true,
      }
    });

    revalidatePath('/organization/contact-assignments');
    return { success: true, newAssignment };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create assignment." };
  }
}

export async function deleteContactAssignment(id: string) {
  try {
    await prisma.contactAssignment.delete({ where: { id } });
    revalidatePath('/organization/contact-assignments');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete assignment." };
  }
}
