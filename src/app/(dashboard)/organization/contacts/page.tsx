import prisma from "@/lib/prisma"
import { ContactsClientPage } from "./components/contacts-client-page"

export default async function ContactsPage() {
    const contacts = await prisma.contact.findMany({
        include: {
            group: true,
        },
    });
    const contactGroups = await prisma.contactGroup.findMany();

    return (
        <ContactsClientPage 
            initialContacts={contacts} 
            contactGroups={contactGroups}
        />
    )
}
