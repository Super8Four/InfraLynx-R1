'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const clusterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  typeId: z.string().min(1, "Type is required"),
  groupId: z.string().min(1, "Group is required"),
  siteId: z.string().optional().nullable(),
  comments: z.string().optional(),
})

export async function createCluster(data: unknown) {
  try {
    const validatedData = clusterSchema.parse(data);
    const newCluster = await prisma.cluster.create({
      data: {
        ...validatedData,
        id: `cluster-${Date.now()}`,
        comments: validatedData.comments || "",
      },
      include: {
          type: true,
          group: true,
          site: true,
          _count: {
            select: { virtualMachines: true }
          }
      }
    });

    revalidatePath('/virtualization');
    return { success: true, newCluster };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create cluster." };
  }
}

export async function deleteCluster(id: string) {
  try {
    const vms = await prisma.virtualMachine.count({ where: { clusterId: id } });
    if (vms > 0) {
      return { success: false, message: "Cannot delete cluster as it contains virtual machines." };
    }
    
    await prisma.cluster.delete({ where: { id } });
    revalidatePath('/virtualization');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete cluster." };
  }
}
