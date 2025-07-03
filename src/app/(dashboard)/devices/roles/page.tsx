import prisma from "@/lib/prisma"
import { DeviceRolesClientPage } from "./components/device-roles-client-page"

export default async function DeviceRolesPage() {
    const roles = await prisma.deviceRole.findMany();

    return (
        <DeviceRolesClientPage initialRoles={roles} />
    )
}
