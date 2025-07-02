
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SiteGroupsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Groups</CardTitle>
          <CardDescription>
            Manage groups of sites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Site Groups page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
