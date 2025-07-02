
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, GitMerge, Archive } from "lucide-react"

export default function BranchingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branching</CardTitle>
          <CardDescription>
            Manage configuration branches and staging environments. This section is a placeholder for future branching and version control functionality.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <GitBranch className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Create Branches</h3>
                <p className="text-sm text-muted-foreground">Create isolated branches of your configuration to test changes.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <GitMerge className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Merge Changes</h3>
                <p className="text-sm text-muted-foreground">Merge approved changes from a branch back into the main configuration.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Archive className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Version History</h3>
                <p className="text-sm text-muted-foreground">View a complete history of all configuration changes and roll back if needed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
