import prisma from "@/lib/prisma"
import { CircuitsClientPage } from "./components/circuits-client-page"

export default async function CircuitsPage() {
    const circuits = await prisma.circuit.findMany({
        include: {
            provider: true,
            type: true,
            termA_site: true,
            termZ_site: true,
        }
    });
    const providers = await prisma.provider.findMany();
    const circuitTypes = await prisma.circuitType.findMany();
    const sites = await prisma.site.findMany();

    return (
        <CircuitsClientPage 
            initialCircuits={circuits}
            providers={providers}
            circuitTypes={circuitTypes}
            sites={sites}
        />
    )
}
