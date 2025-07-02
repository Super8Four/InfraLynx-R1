
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VpnPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>VPN</CardTitle>
          <CardDescription>
            Manage VPN tunnels and user access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>VPN page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
