'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const circuitSchema = z.object({
  cid: z.string().min(1, "Circuit ID is required"),
  providerId: z.string().min(1, "Provider is required"),
  typeId: z.string().min(1, "Type is required"),
  status: z.enum(["active", "provisioning", "offline", "decommissioned"]),
  installDate: z.string().optional(),
  commitRate: z.coerce.number().optional(),
  description: z.string().optional(),
  termA_siteId: z.string().min(1, "Termination A is required"),
  termZ_siteId: z.string().min(1, "Termination Z is required"),
})

export async function createCircuit(data: unknown) {
  try {
    const validatedData = circuitSchema.parse(data);
    
    const newCircuit = await prisma.circuit.create({
      data: {
        ...validatedData,
        id: `circ-${Date.now()}`,
        installDate: validatedData.installDate ? new Date(validatedData.installDate) : new Date(),
        commitRate: validatedData.commitRate || 0,
        description: validatedData.description || "",
      },
      include: {
        provider: true,
        type: true,
        termA_site: true,
        termZ_site: true,
      }
    });

    revalidatePath('/circuits');
    return { success: true, newCircuit };

  } catch (e) {
      console.error(e);
      if (e instanceof z.ZodError) {
        return { success: false, message: "Invalid data provided.", errors: e.errors };
      }
      return { success: false, message: "Failed to create circuit." };
  }
}

export async function deleteCircuit(id: string) {
    try {
        await prisma.circuit.delete({ where: { id } });
        revalidatePath('/circuits');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to delete circuit." };
    }
}
