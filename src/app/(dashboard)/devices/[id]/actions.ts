
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const uploadSchema = z.object({
  id: z.string(),
  config: z.string(),
})

export async function uploadConfigBackup(data: unknown) {
  const validatedData = uploadSchema.parse(data);

  try {
    await prisma.device.update({
      where: { id: validatedData.id },
      data: { configBackup: validatedData.config },
    });
    revalidatePath(`/devices/${validatedData.id}`);
    return { success: true, message: "Configuration backup uploaded successfully." }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to upload configuration." }
  }
}
