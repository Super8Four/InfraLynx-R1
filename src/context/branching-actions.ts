
'use server'

import prisma from "@/lib/prisma"
import type { Device, Site, DeviceRole, Platform, Location, Rack, Cluster, Tenant, TenantGroup, VirtualChassis } from "@prisma/client"
import { AppState } from "./branching-context"

export async function getInitialBranchingData(): Promise<AppState> {
    const [devices, sites, deviceTypes, deviceRoles, platforms, locations, racks, clusters, tenants, tenantGroups, virtualChassis] = await Promise.all([
        prisma.device.findMany({ include: { deviceRole: true, site: true, platform: true } }),
        prisma.site.findMany(),
        prisma.deviceType.findMany(),
        prisma.deviceRole.findMany(),
        prisma.platform.findMany(),
        prisma.location.findMany(),
        prisma.rack.findMany(),
        prisma.cluster.findMany(),
        prisma.tenant.findMany(),
        prisma.tenantGroup.findMany(),
        prisma.virtualChassis.findMany()
    ]);
    
    return { devices, sites, deviceTypes, deviceRoles, platforms, locations, racks, clusters, tenants, tenantGroups, virtualChassis };
}

export async function applyMerge(branchState: AppState): Promise<{ success: boolean, message?: string }> {
    if (!branchState.devices) {
        return { success: false, message: "No device data found in branch state." };
    }
    
    try {
        await prisma.$transaction(async (tx) => {
            // This is a simple "overwrite" strategy for the device table.
            // A real-world scenario would need more complex diffing for all models.
            
            // 1. Get all device IDs from the incoming branch state
            const branchDeviceIds = new Set(branchState.devices.map(d => d.id));

            // 2. Find all existing device IDs in the database
            const dbDevices = await tx.device.findMany({ select: { id: true } });
            const dbDeviceIds = new Set(dbDevices.map(d => d.id));

            // 3. Determine which devices to delete
            const idsToDelete = [...dbDeviceIds].filter(id => !branchDeviceIds.has(id));
            if (idsToDelete.length > 0) {
                 await tx.device.deleteMany({
                    where: { id: { in: idsToDelete } }
                });
            }

            // 4. Upsert all devices from the branch state
            for (const device of branchState.devices) {
                // Prisma's upsert needs separate `where`, `create`, and `update` objects.
                // The related data that we included for enrichment must be stripped out.
                const { deviceRole, site, platform, ...deviceData } = device;
                await tx.device.upsert({
                    where: { id: device.id },
                    update: deviceData,
                    create: deviceData,
                });
            }
        });

        return { success: true };

    } catch (e) {
        console.error("Merge failed:", e);
        return { success: false, message: "An error occurred during the database transaction." };
    }
}
