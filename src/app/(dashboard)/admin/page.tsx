
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Users, Lock, GitBranch } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/context/settings-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPage() {
  const { settings, toggleBranching, isLoading } = useSettings()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>
            Administer application settings, users, and permissions. This section is a placeholder for future administrative functionality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">Add, remove, and manage user accounts.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Lock className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Permissions</h3>
                <p className="text-sm text-muted-foreground">Define roles and control access to features.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Security Settings</h3>
                <p className="text-sm text-muted-foreground">Configure authentication and security policies.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>Enable or disable application features.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <GitBranch className="h-6 w-6 text-primary" />
                <div>
                  <Label htmlFor="branching-toggle" className="font-semibold text-base">
                    Configuration Branching
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Git-like versioning for all configurations.
                  </p>
                </div>
              </div>
              <Switch
                id="branching-toggle"
                checked={settings.isBranchingEnabled}
                onCheckedChange={toggleBranching}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
