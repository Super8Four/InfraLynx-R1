import prisma from "@/lib/prisma"
import { TenantsClientPage } from "./components/tenants-client-page"

export default async function TenantsPage() {
    const tenants = await prisma.tenant.findMany({
        include: {
            group: true,
        },
    });
    const tenantGroups = await prisma.tenantGroup.findMany();

    return (
        <TenantsClientPage 
            initialTenants={tenants} 
            tenantGroups={tenantGroups}
        />
    )
}
