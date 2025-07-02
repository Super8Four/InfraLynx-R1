
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
          <CardDescription>
            Manage tenants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tenants page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
