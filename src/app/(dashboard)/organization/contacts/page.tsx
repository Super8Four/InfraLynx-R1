
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>
            Manage contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contacts page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
