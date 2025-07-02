
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BranchingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branching</CardTitle>
          <CardDescription>
            Manage configuration branches and staging environments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Branching page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
