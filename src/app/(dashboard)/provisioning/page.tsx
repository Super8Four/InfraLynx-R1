
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProvisioningPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provisioning</CardTitle>
          <CardDescription>
            Manage automated device and service provisioning workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Provisioning page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
