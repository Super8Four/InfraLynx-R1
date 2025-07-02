
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactGroupsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Groups</CardTitle>
          <CardDescription>
            Manage groups of contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contact Groups page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
