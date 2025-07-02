
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, FileCode, PlayCircle } from "lucide-react"

export default function ProvisioningPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provisioning</CardTitle>
          <CardDescription>
            Manage automated device and service provisioning workflows. This section is a placeholder for future automation features.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <FileCode className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Templates</h3>
                <p className="text-sm text-muted-foreground">Create reusable configuration templates (e.g., Jinja2) for devices.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Bot className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Workflows</h3>
                <p className="text-sm text-muted-foreground">Build automated workflows to provision new devices and services.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <PlayCircle className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Execution History</h3>
                <p className="text-sm text-muted-foreground">Track the history and status of all provisioning jobs.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
