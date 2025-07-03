import prisma from "@/lib/prisma";
import { WirelessClientPage } from "./components/wireless-client-page";

export default async function WirelessPage() {
    const wlans = await prisma.wirelessLan.findMany();
    const accessPoints = await prisma.accessPoint.findMany({
        include: {
            site: true,
        }
    });
    const sites = await prisma.site.findMany();

    return (
        <WirelessClientPage 
            initialWlans={wlans}
            initialAccessPoints={accessPoints}
            sites={sites}
        />
    )
}
