import prisma from "@/lib/prisma"
import { ContactGroupsClientPage } from "./components/contact-groups-client-page"

export default async function ContactGroupsPage() {
    const groups = await prisma.contactGroup.findMany();

    return (
        <ContactGroupsClientPage initialGroups={groups} />
    )
}
