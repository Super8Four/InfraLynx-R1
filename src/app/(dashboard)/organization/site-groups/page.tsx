import prisma from "@/lib/prisma"
import { SiteGroupsClientPage } from "./components/site-groups-client-page"

export default async function SiteGroupsPage() {
    const siteGroups = await prisma.siteGroup.findMany();

    return (
        <SiteGroupsClientPage initialSiteGroups={siteGroups} />
    )
}
