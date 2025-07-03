import prisma from "@/lib/prisma"
import { ContactRolesClientPage } from "./components/contact-roles-client-page"

export default async function ContactRolesPage() {
    const roles = await prisma.contactRole.findMany();

    return (
        <ContactRolesClientPage initialRoles={roles} />
    )
}
