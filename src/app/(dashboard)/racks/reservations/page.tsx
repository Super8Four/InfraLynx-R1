import prisma from "@/lib/prisma";
import { ReservationsClientPage } from "./components/reservations-client-page";

export default async function RackReservationsPage() {
    const reservations = await prisma.rackReservation.findMany({
        include: {
            rack: true,
            tenant: true,
        },
    });
    const racks = await prisma.rack.findMany();
    const tenants = await prisma.tenant.findMany();

    return <ReservationsClientPage initialReservations={reservations} racks={racks} tenants={tenants} />;
}
