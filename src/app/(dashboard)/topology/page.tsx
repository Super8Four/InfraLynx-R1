import prisma from "@/lib/prisma";
import { TopologyClientPage } from "./components/topology-client-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TopologyPage() {
    const devices = await prisma.device.findMany({
        include: {
          deviceRole: true,
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Device Topology</CardTitle>
                <CardDescription>
                    A live visualization of connected devices in your infrastructure. This is a simplified view based on a pre-defined set of connections for demonstration purposes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[600px] flex items-center justify-center border rounded-lg bg-muted/20">
                    <TopologyClientPage initialDevices={devices} />
                </div>
            </CardContent>
        </Card>
    );
}
