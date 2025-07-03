'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  title: z.string().min(1, "Title is required"),
  groupId: z.string().optional().nullable(),
})

export async function createContact(data: unknown) {
  try {
    const validatedData = contactSchema.parse(data);
    const newContact = await prisma.contact.create({
      data: {
        ...validatedData,
        id: `contact-${Date.now()}`,
      },
      include: {
        group: true,
      }
    });

    revalidatePath('/organization/contacts');
    return { success: true, newContact };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create contact." };
  }
}

export async function deleteContact(id: string) {
  try {
    const assignments = await prisma.contactAssignment.count({ where: { contactId: id } });
    if (assignments > 0) {
      return { success: false, message: "Cannot delete contact as they are assigned to an object." };
    }
    
    await prisma.contact.delete({ where: { id } });
    revalidatePath('/organization/contacts');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete contact." };
  }
}
