import prisma from "@/lib/prisma";
import { PowerClientPage } from "./components/power-client-page";

export default async function PowerPage() {
    const powerPanels = await prisma.powerPanel.findMany({
        include: {
            site: true,
            location: true,
        },
    });
    const powerFeeds = await prisma.powerFeed.findMany({
        include: {
            panel: true,
            rack: true,
        },
    });
    const sites = await prisma.site.findMany();
    const locations = await prisma.location.findMany();
    const racks = await prisma.rack.findMany();

    return (
        <PowerClientPage
            initialPowerPanels={powerPanels}
            initialPowerFeeds={powerFeeds}
            sites={sites}
            locations={locations}
            racks={racks}
        />
    );
}
