import prisma from "@/lib/prisma"
import { RackTypesClientPage } from "./components/rack-types-client-page"

export default async function RackTypesPage() {
    const types = await prisma.rackType.findMany();

    return (
        <RackTypesClientPage initialTypes={types} />
    )
}
