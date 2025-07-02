
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SitesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sites</CardTitle>
          <CardDescription>
            Manage individual data centers, offices, or facilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Sites page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
