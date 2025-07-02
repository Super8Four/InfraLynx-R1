
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TenantGroupsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tenant Groups</CardTitle>
          <CardDescription>
            Manage groups of tenants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tenant Groups page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
