import prisma from "@/lib/prisma";
import { VirtualizationClientPage } from "./components/virtualization-client-page";

export default async function VirtualizationPage() {
    const clusters = await prisma.cluster.findMany({
        include: {
            type: true,
            group: true,
            site: true,
            _count: {
                select: { virtualMachines: true }
            }
        }
    });

    const vms = await prisma.virtualMachine.findMany({
        include: {
            cluster: true,
        }
    });

    const clusterTypes = await prisma.clusterType.findMany();
    const clusterGroups = await prisma.clusterGroup.findMany();
    const sites = await prisma.site.findMany();

    return (
        <VirtualizationClientPage 
            initialClusters={clusters}
            initialVms={vms}
            clusterTypes={clusterTypes}
            clusterGroups={clusterGroups}
            sites={sites}
        />
    )
}
