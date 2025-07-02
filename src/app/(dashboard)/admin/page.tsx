
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>
            Administer application settings, users, and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Admin page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
