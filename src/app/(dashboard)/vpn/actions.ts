'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const tunnelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "disabled", "planned"]),
  type: z.enum(['IPsec', 'OpenVPN', 'WireGuard']),
  localPeer: z.string().min(1, "Local peer is required"),
  remotePeer: z.string().min(1, "Remote peer is required"),
  description: z.string().optional(),
})

export async function createVpnTunnel(data: unknown) {
  try {
    const validatedData = tunnelSchema.parse(data);
    const newTunnel = await prisma.vpnTunnel.create({
      data: {
        ...validatedData,
        id: `vpn-${Date.now()}`,
        description: validatedData.description || "",
      },
    });

    revalidatePath('/vpn');
    return { success: true, newTunnel };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { success: false, message: "Invalid data provided.", errors: e.errors };
    }
    return { success: false, message: "Failed to create VPN tunnel." };
  }
}

export async function deleteVpnTunnel(id: string) {
  try {
    await prisma.vpnTunnel.delete({ where: { id } });
    revalidatePath('/vpn');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete VPN tunnel." };
  }
}
