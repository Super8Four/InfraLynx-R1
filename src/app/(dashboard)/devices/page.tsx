
import prisma from "@/lib/prisma"
import { DeviceClientPage } from "./components/device-client-page"

export default async function DevicesPage() {
  // Fetch all necessary data on the server
  const devices = await prisma.device.findMany({
    include: {
      deviceRole: true,
      site: true,
    }
  });
  const sites = await prisma.site.findMany();
  const deviceTypes = await prisma.deviceType.findMany();
  const deviceRoles = await prisma.deviceRole.findMany();
  const platforms = await prisma.platform.findMany();
  const locations = await prisma.location.findMany();
  const racks = await prisma.rack.findMany();
  const clusters = await prisma.cluster.findMany();
  const tenants = await prisma.tenant.findMany();
  const tenantGroups = await prisma.tenantGroup.findMany();
  const virtualChassis = await prisma.virtualChassis.findMany();

  return (
    <DeviceClientPage
      initialDevices={devices}
      sites={sites}
      deviceTypes={deviceTypes}
      deviceRoles={deviceRoles}
      platforms={platforms}
      locations={locations}
      racks={racks}
      clusters={clusters}
      tenants={tenants}
      tenantGroups={tenantGroups}
      virtualChassis={virtualChassis}
    />
  )
}
