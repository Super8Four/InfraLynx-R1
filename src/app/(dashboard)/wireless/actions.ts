'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const wlanSchema = z.object({
  ssid: z.string().min(1, "SSID is required"),
  vlan: z.string().optional(),
  description: z.string().optional(),
  authType: z.enum(['Open', 'WEP', 'WPA_Personal', 'WPA_Enterprise']),
})

export async function createWirelessLan(data: unknown) {
  try {
    const validatedData = wlanSchema.parse(data);
    const newWlan = await prisma.wirelessLan.create({
      data: {
        ...validatedData,
        id: `wlan-${Date.now()}`,
        description: validatedData.description || "",
        vlan: validatedData.vlan || null,
      },
    });

    revalidatePath('/wireless');
    return { success: true, newWlan };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create wireless LAN." };
  }
}

export async function deleteWirelessLan(id: string) {
  try {
    await prisma.wirelessLan.delete({ where: { id } });
    revalidatePath('/wireless');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete wireless LAN." };
  }
}
