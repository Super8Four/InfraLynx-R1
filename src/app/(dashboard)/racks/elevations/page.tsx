import prisma from "@/lib/prisma";
import { RackElevationsClientPage } from "./components/elevations-client-page";

export default async function RackElevationsPage() {
    // Fetch all necessary data on the server
    const racks = await prisma.rack.findMany();
    const devices = await prisma.device.findMany();
    const sites = await prisma.site.findMany();
    const deviceTypes = await prisma.deviceType.findMany();
    const deviceRoles = await prisma.deviceRole.findMany();

    return (
        <RackElevationsClientPage 
            initialRacks={racks}
            initialDevices={devices}
            initialSites={sites}
            initialDeviceTypes={deviceTypes}
            initialDeviceRoles={deviceRoles}
        />
    )
}
