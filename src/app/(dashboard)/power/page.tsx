
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PowerPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Power</CardTitle>
          <CardDescription>
            Manage power panels, feeds, and PDUs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Power page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
