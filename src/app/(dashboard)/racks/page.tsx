
import prisma from "@/lib/prisma";
import { RacksClientPage } from "./components/racks-client-page";

export default async function RacksPage() {
  const racks = await prisma.rack.findMany({
    include: {
      site: {
        select: { name: true }
      },
      location: {
        select: { name: true }
      },
      tenant: {
        select: { name: true }
      },
      role: {
        select: { name: true }
      },
      type: {
        select: { model: true }
      },
      devices: {
        include: {
          deviceType: true,
        }
      }
    }
  });

  // Calculate device count and space utilization on the server
  const processedRacks = racks.map(rack => {
    const deviceCount = rack.devices.length;
    const occupiedUnits = rack.devices.reduce((acc, dev) => acc + (dev.deviceType?.u_height ?? 0), 0);
    const spaceUtilization = rack.u_height > 0 ? (occupiedUnits / rack.u_height) * 100 : 0;
    
    return {
      ...rack,
      deviceCount,
      spaceUtilization: parseFloat(spaceUtilization.toFixed(1))
    };
  });
  
  const sites = await prisma.site.findMany();
  const locations = await prisma.location.findMany();
  const rackRoles = await prisma.rackRole.findMany();
  const rackTypes = await prisma.rackType.findMany();
  const tenantGroups = await prisma.tenantGroup.findMany();
  const tenants = await prisma.tenant.findMany();

  return (
    <RacksClientPage
      initialRacks={processedRacks}
      sites={sites}
      locations={locations}
      rackRoles={rackRoles}
      rackTypes={rackTypes}
      tenantGroups={tenantGroups}
      tenants={tenants}
    />
  );
}
