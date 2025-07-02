
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TopologyPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Topology</CardTitle>
          <CardDescription>
            Visualize network topology graphs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Topology page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
