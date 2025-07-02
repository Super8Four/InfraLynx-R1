
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>
            Manage floors, rooms, or other locations within a site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Locations page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
