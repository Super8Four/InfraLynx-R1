'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export async function createContactGroup(data: unknown) {
  try {
    const validatedData = groupSchema.parse(data);
    const newGroup = await prisma.contactGroup.create({
      data: {
        ...validatedData,
        id: `cg-${Date.now()}`,
        description: validatedData.description || "",
      },
    });

    revalidatePath('/organization/contact-groups');
    return { success: true, newGroup };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create contact group." };
  }
}

export async function deleteContactGroup(id: string) {
  try {
    const contacts = await prisma.contact.count({ where: { groupId: id } });
    if (contacts > 0) {
      return { success: false, message: "Cannot delete group as it has contacts assigned." };
    }
    
    await prisma.contactGroup.delete({ where: { id } });
    revalidatePath('/organization/contact-groups');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete contact group." };
  }
}
