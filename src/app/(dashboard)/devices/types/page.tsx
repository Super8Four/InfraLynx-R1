import prisma from "@/lib/prisma"
import { DeviceTypesClientPage } from "./components/device-types-client-page"

export default async function DeviceTypesPage() {
    const types = await prisma.deviceType.findMany();

    return (
        <DeviceTypesClientPage initialTypes={types} />
    )
}
