import prisma from "@/lib/prisma"
import { ContactAssignmentsClientPage } from "./components/contact-assignments-client-page"

export default async function ContactAssignmentsPage() {
    const assignments = await prisma.contactAssignment.findMany({
        include: {
            contact: true,
            role: true,
            region: true,
            site: true,
            location: true,
        },
        orderBy: { objectType: 'asc' }
    });
    const contacts = await prisma.contact.findMany();
    const contactRoles = await prisma.contactRole.findMany();
    const regions = await prisma.region.findMany();
    const sites = await prisma.site.findMany();
    const locations = await prisma.location.findMany();

    return <ContactAssignmentsClientPage 
        initialAssignments={assignments}
        contacts={contacts}
        contactRoles={contactRoles}
        regions={regions}
        sites={sites}
        locations={locations}
    />
}
