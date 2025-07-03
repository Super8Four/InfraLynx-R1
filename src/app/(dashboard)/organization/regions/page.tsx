import prisma from "@/lib/prisma";
import { RegionsClientPage } from "./components/regions-client-page";

export default async function RegionsPage() {
    const regions = await prisma.region.findMany({
        include: {
            parent: true,
            _count: {
                select: { sites: true }
            }
        }
    });

    return <RegionsClientPage initialRegions={regions} />;
}
