
"use client"

import { useState } from "react"
import { GitBranch, GitMerge, Archive, PlusCircle, Check, ChevronsRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import BranchGraph from "@/components/branch-graph"

type Branch = {
  id: string
  name: string
  from: string
  merged: boolean
}

type Commit = {
  id: string
  message: string
  branch: string
  author: string
  timestamp: string
}

const initialBranches: Branch[] = [
  { id: "main", name: "main", from: "", merged: false },
]

const initialCommits: Commit[] = [
  { id: 'c1', message: "Initial commit", branch: "main", author: "system", timestamp: "3 days ago" },
  { id: 'c2', message: "Add core networking devices", branch: "main", author: "admin", timestamp: "2 days ago" },
]

const branchSchema = z.object({
  name: z.string().min(3, "Branch name must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Can only contain lowercase letters, numbers, and hyphens."),
})

type BranchFormValues = z.infer<typeof branchSchema>

export default function BranchingPage() {
  const { toast } = useToast()
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [commits, setCommits] = useState<Commit[]>(initialCommits)
  const [activeBranch, setActiveBranch] = useState<string>("main")
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false)
  const [isMergeConfirmOpen, setIsMergeConfirmOpen] = useState(false)

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "" },
  })

  const handleCreateBranch = (data: BranchFormValues) => {
    if (branches.some(b => b.name === data.name)) {
      form.setError("name", { message: "Branch name already exists." })
      return
    }

    const newBranch: Branch = {
      id: data.name,
      name: data.name,
      from: activeBranch,
      merged: false,
    }
    const newCommit: Commit = {
        id: `c${commits.length + 1}`,
        message: `feat: Create branch '${data.name}' from '${activeBranch}'`,
        branch: data.name,
        author: 'admin',
        timestamp: 'Just now'
    }

    setBranches(prev => [...prev, newBranch])
    setCommits(prev => [newCommit, ...prev]);
    setActiveBranch(newBranch.name)
    toast({ title: "Branch Created", description: `Switched to new branch: ${data.name}` })
    setIsAddBranchOpen(false)
    form.reset()
  }

  const handleMerge = () => {
    const currentBranch = branches.find(b => b.id === activeBranch);
    if (!currentBranch || currentBranch.name === 'main') return;

    const newCommits: Commit[] = [
        {
            id: `c${commits.length + 1}`,
            message: `feat: Add new DC site in Dublin`,
            branch: currentBranch.name,
            author: 'admin',
            timestamp: 'Just now'
        },
        {
            id: `c${commits.length + 2}`,
            message: `fix: Update firewall rules for new site`,
            branch: currentBranch.name,
            author: 'admin',
            timestamp: 'Just now'
        },
        {
            id: `c${commits.length + 3}`,
            message: `merge: Merge branch '${currentBranch.name}' into '${currentBranch.from}'`,
            branch: currentBranch.from,
            author: 'admin',
            timestamp: 'Just now'
        },
    ]

    setBranches(prev => prev.map(b => b.id === activeBranch ? { ...b, merged: true } : b));
    setCommits(prev => [newCommits.slice(0, 2).reverse(), {id: newCommits[2].id, message: newCommits[2].message, branch: newCommits[2].branch, author: newCommits[2].author, timestamp: newCommits[2].timestamp}, ...prev.slice(1)].flat());
    setActiveBranch(currentBranch.from);
    setIsMergeConfirmOpen(false);
    toast({ title: "Merge Successful", description: `Branch '${currentBranch.name}' has been merged into '${currentBranch.from}'.`})
  }
  
  const currentBranchIsMergable = activeBranch !== 'main' && !branches.find(b => b.id === activeBranch)?.merged;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Branch & Commit Info */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configuration Branching</CardTitle>
                    <CardDescription>
                        Manage configuration branches and staging environments.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Branches</Label>
                        <div className="space-y-1">
                            {branches.map(branch => (
                                <Button
                                    key={branch.id}
                                    variant={activeBranch === branch.id ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveBranch(branch.id)}
                                >
                                    <GitBranch className="mr-2 h-4 w-4" />
                                    <span>{branch.name}</span>
                                    {branch.merged && <Badge variant="outline" className="ml-auto">Merged</Badge>}
                                </Button>
                            ))}
                        </div>
                     </div>
                      <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
                        <DialogTrigger asChild>
                           <Button className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Branch
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Branch</DialogTitle>
                                <DialogDescription>Branches allow you to work on changes in isolation.</DialogDescription>
                            </DialogHeader>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleCreateBranch)} className="space-y-4">
                                     <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Branch Name</FormLabel> <FormControl><Input placeholder="e.g., feature/add-new-site" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                     <DialogFooter>
                                        <Button type="button" variant="ghost" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
                                        <Button type="submit">Create and Switch</Button>
                                    </DialogFooter>
                                </form>
                             </Form>
                        </DialogContent>
                    </Dialog>
                    {currentBranchIsMergable && (
                        <AlertDialog open={isMergeConfirmOpen} onOpenChange={setIsMergeConfirmOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">
                                    <GitMerge className="mr-2 h-4 w-4" />
                                    Merge Branch '{activeBranch}'
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to merge?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will merge the changes from <span className="font-mono bg-muted p-1 rounded-md">{activeBranch}</span> into <span className="font-mono bg-muted p-1 rounded-md">{branches.find(b => b.id === activeBranch)?.from}</span>. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleMerge} className="bg-green-600 hover:bg-green-700">Confirm Merge</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Changes in '{activeBranch}'</CardTitle>
                    <CardDescription>Simulated list of configuration changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {activeBranch === 'main' ? (
                        <p className="text-sm text-muted-foreground">The main branch reflects the current production configuration. No changes are staged here.</p>
                    ) : (
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /><span>ADD Site "Dublin Office"</span></li>
                            <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /><span>ADD Rack "B201" to Site "Dublin Office"</span></li>
                             <li className="flex items-center"><ChevronsRight className="h-4 w-4 mr-2 text-yellow-500" /><span>MODIFY Device "firewall-corp"</span></li>
                            <li className="flex items-center"><PlusCircle className="h-4 w-4 mr-2 text-blue-500" /><span>ADD 2 new IP Prefixes</span></li>
                        </ul>
                    )}
                </CardContent>
            </Card>

        </div>
        
        {/* Right Column: Graph and History */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Branch Graph</CardTitle>
                    <CardDescription>Visualization of your configuration branches.</CardDescription>
                </CardHeader>
                <CardContent>
                   <BranchGraph branches={branches} commits={commits} activeBranch={activeBranch} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Version History</CardTitle>
                    <CardDescription>Complete history of all configuration changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {commits.map(commit => (
                            <div key={commit.id} className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        <Archive className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{commit.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-semibold">{commit.author}</span> committed on branch <span className="font-mono bg-muted/50 p-0.5 rounded-sm">{commit.branch}</span> - {commit.timestamp}
                                    </p>
                                </div>
                                <div className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">{commit.id}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
