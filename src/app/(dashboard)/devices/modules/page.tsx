
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Component } from "lucide-react"

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Modules</CardTitle>
          <CardDescription>
            Manage modular components that can be installed within a device, such as line cards or power supplies. This section is a placeholder for future functionality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center gap-4 p-8 border rounded-lg border-dashed">
            <Component className="h-16 w-16 text-muted-foreground" />
            <h3 className="font-semibold text-lg">Module Management Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-md">
                This area will allow you to define and track inventory of modular components like supervisor engines, line cards, and transceivers, and install them into parent devices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
