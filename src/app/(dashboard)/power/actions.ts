'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const panelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  siteId: z.string().min(1, "A site must be selected"),
  locationId: z.string().optional().nullable(),
  voltage: z.coerce.number().int().min(1, "Voltage is required"),
  phase: z.enum(["single_phase", "three_phase"]),
  capacityAmps: z.coerce.number().int().min(1, "Capacity is required"),
})

export async function createPowerPanel(data: unknown) {
    try {
        const validatedData = panelSchema.parse(data);
        const newPanel = await prisma.powerPanel.create({
            data: {
                ...validatedData,
                id: `pp-${Date.now()}`
            },
            include: {
                site: true,
                location: true,
            }
        });
        revalidatePath('/power');
        return { success: true, newPanel };
    } catch (e) {
        console.error(e);
        if (e instanceof z.ZodError) {
            return { success: false, message: "Invalid data provided.", errors: e.errors };
        }
        return { success: false, message: "Failed to create power panel." };
    }
}
