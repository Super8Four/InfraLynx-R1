import prisma from "@/lib/prisma"
import { RackRolesClientPage } from "./components/rack-roles-client-page"

export default async function RackRolesPage() {
    const roles = await prisma.rackRole.findMany();

    return (
        <RackRolesClientPage initialRoles={roles} />
    )
}
