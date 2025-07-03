import prisma from "@/lib/prisma"
import { PlatformsClientPage } from "./components/platforms-client-page"

export default async function PlatformsPage() {
    const platforms = await prisma.platform.findMany();

    return (
        <PlatformsClientPage initialPlatforms={platforms} />
    )
}
