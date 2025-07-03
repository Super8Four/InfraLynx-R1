
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const siteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "offline", "planned", "decommissioning"]),
  regionId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  facility: z.string().optional().nullable(),
  asns: z.string().optional().nullable(),
  timeZone: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  tenantGroupId: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
  physicalAddress: z.string().optional().nullable(),
  shippingAddress: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  comments: z.string().optional().nullable(),
  id: z.string().optional(), // for updates
})


export async function createSite(data: unknown) {
    const validatedData = siteSchema.parse(data);
    
    const siteData = {
        ...validatedData,
        tags: validatedData.tags ? validatedData.tags.split(",").map((t) => t.trim()) : [],
    }

    try {
        await prisma.site.create({
            data: {
                ...siteData,
                id: `site-${Date.now()}` // Generate an ID
            }
        });

        revalidatePath('/organization/sites');

    } catch (e) {
        console.error(e);
        throw new Error('Failed to create site');
    }
}
