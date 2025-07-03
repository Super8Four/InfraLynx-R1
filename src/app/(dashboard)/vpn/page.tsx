import prisma from "@/lib/prisma";
import { VpnClientPage } from "./components/vpn-client-page";

export default async function VpnPage() {
    const tunnels = await prisma.vpnTunnel.findMany();

    return <VpnClientPage initialTunnels={tunnels} />;
}
