
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>
            Overview of your organization's infrastructure resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section contains all organizational data, including sites, tenancy, and contacts.</p>
        </CardContent>
      </Card>
    </div>
  )
}
