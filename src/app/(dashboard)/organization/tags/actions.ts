'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export async function createTag(data: unknown) {
  try {
    const validatedData = tagSchema.parse(data);
    
    // Check for uniqueness (case-insensitive)
    const existingTag = await prisma.tag.findFirst({
      where: { name: { equals: validatedData.name, mode: 'insensitive' } },
    });
    if (existingTag) {
        return { success: false, message: "A tag with this name already exists." };
    }

    const newTag = await prisma.tag.create({
      data: {
        ...validatedData,
        id: `tag-${Date.now()}`,
        description: validatedData.description || "",
      },
    });

    revalidatePath('/organization/tags');
    return { success: true, newTag };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create tag." };
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({ where: { id } });
    revalidatePath('/organization/tags');
    return { success: true };
  } catch (e) {
    console.error(e);
    // This could fail if the tag is still in use, though the UI prevents this for discovered tags.
    // A more robust solution would check all related tables.
    return { success: false, message: "Failed to delete tag. It might still be in use." };
  }
}
