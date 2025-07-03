import prisma from "@/lib/prisma"
import { TenantGroupsClientPage } from "./components/tenant-groups-client-page"

export default async function TenantGroupsPage() {
    const groups = await prisma.tenantGroup.findMany();

    return (
        <TenantGroupsClientPage initialGroups={groups} />
    )
}
