import prisma from "@/lib/prisma"
import { LocationsClientPage } from "./components/locations-client-page"

export default async function LocationsPage() {
    const locations = await prisma.location.findMany({ 
        include: { 
            site: true 
        }
    });
    const sites = await prisma.site.findMany();
    
    return <LocationsClientPage initialLocations={locations} sites={sites} />
}
