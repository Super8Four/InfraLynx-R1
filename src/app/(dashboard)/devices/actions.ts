
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const deviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  deviceRoleId: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
  deviceTypeId: z.string().min(1, "Device Type is required"),
  airflow: z.enum(["front_to_rear", "rear_to_front", "side_to_rear", "passive"]).optional(),
  serial: z.string().optional(),
  assetTag: z.string().optional(),
  siteId: z.string().min(1, "Site is required"),
  locationId: z.string().optional().nullable(),
  rackId: z.string().optional().nullable(),
  rackFace: z.enum(["front", "rear"]).optional().nullable(),
  position: z.coerce.number().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  status: z.enum(["active", "offline", "provisioning", "staged", "decommissioning"]),
  platformId: z.string().optional().nullable(),
  configTemplate: z.string().optional().nullable(),
  ip: z.string().ip({ message: "Invalid IP address" }).optional().or(z.literal('')),
  clusterId: z.string().optional().nullable(),
  tenantGroupId: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
  virtualChassisId: z.string().optional().nullable(),
  vcPosition: z.coerce.number().optional().nullable(),
  vcPriority: z.coerce.number().optional().nullable(),
})

export async function createDevice(data: unknown) {
  try {
    const validatedData = deviceSchema.parse(data);
    const { ip, ...restOfData } = validatedData;
    
    const deviceData = {
        ...restOfData,
        ip: ip || null,
        tags: validatedData.tags ? validatedData.tags.split(",").map((t) => t.trim()) : [],
    }

    const newDevice = await prisma.device.create({
        data: {
          ...deviceData,
          id: `dev-${Date.now()}`, // Generate an ID
        },
        include: {
            deviceRole: true,
            site: true,
        }
    });

    revalidatePath('/devices');
    return { success: true, newDevice };

  } catch (e) {
      console.error(e);
      if (e instanceof z.ZodError) {
        return { success: false, message: "Invalid data provided.", errors: e.errors };
      }
      return { success: false, message: "Failed to create device." };
  }
}

export async function deleteDevice(deviceId: string) {
    try {
        await prisma.device.delete({
            where: { id: deviceId },
        });
        revalidatePath('/devices');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to delete device." };
    }
}

export async function uploadConfigBackup(data: unknown) {
  const uploadSchema = z.object({
    id: z.string(),
    config: z.string(),
  })

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
