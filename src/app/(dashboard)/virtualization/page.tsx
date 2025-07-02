
"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  initialClusters,
  initialVirtualMachines,
  initialClusterGroups,
  initialClusterTypes,
  initialSites,
  type Cluster,
  type VirtualMachine,
} from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const clusterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  typeId: z.string().min(1, "Type is required"),
  groupId: z.string().min(1, "Group is required"),
  siteId: z.string().optional(),
  comments: z.string().optional(),
})

type ClusterFormValues = z.infer<typeof clusterSchema>

function ClustersTab() {
  const { toast } = useToast()
  const [clusters, setClusters] = useState<Cluster[]>(initialClusters)
  const [clusterTypes] = useState(initialClusterTypes)
  const [clusterGroups] = useState(initialClusterGroups)
  const [sites] = useState(initialSites)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<ClusterFormValues>({
    resolver: zodResolver(clusterSchema),
    defaultValues: {},
  })

  function onSubmit(data: ClusterFormValues) {
    const newCluster: Cluster = {
      id: `cluster-${Date.now()}`,
      vmCount: 0,
      comments: "",
      ...data,
    }
    setClusters((prev) => [...prev, newCluster])
    toast({ title: "Success", description: "Cluster has been created." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    setClusters((prev) => prev.filter((p) => p.id !== id))
    toast({ title: "Success", description: "Cluster has been deleted." })
  }
  
  const getTypeName = (id: string) => clusterTypes.find(s => s.id === id)?.name ?? 'N/A'
  const getGroupName = (id: string) => clusterGroups.find(s => s.id === id)?.name ?? 'N/A'
  const getSiteName = (id?: string) => sites.find(s => s.id === id)?.name ?? 'N/A'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clusters</CardTitle>
            <CardDescription>Manage virtualization clusters.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Cluster
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Cluster</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Prod-Compute-East" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="typeId" render={({ field }) => (
                      <FormItem><FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                          <SelectContent>{clusterTypes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                      <FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="groupId" render={({ field }) => (
                      <FormItem><FormLabel>Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl>
                          <SelectContent>{clusterGroups.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                      <FormMessage /></FormItem>
                    )}/>
                  </div>
                  <FormField control={form.control} name="siteId" render={({ field }) => (
                    <FormItem><FormLabel>Site (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a site" /></SelectTrigger></FormControl>
                        <SelectContent>{sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    <FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="comments" render={({ field }) => ( <FormItem><FormLabel>Comments</FormLabel><FormControl><Textarea placeholder="Add any comments about the cluster" {...field} /></FormControl><FormMessage /></FormItem> )}/>

                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Cluster</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>VMs</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clusters.map((cluster) => (
              <TableRow key={cluster.id}>
                <TableCell className="font-medium">{cluster.name}</TableCell>
                <TableCell>{getTypeName(cluster.typeId)}</TableCell>
                <TableCell>{getGroupName(cluster.groupId)}</TableCell>
                <TableCell>{getSiteName(cluster.siteId)}</TableCell>
                <TableCell>{cluster.vmCount}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cluster.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function VirtualMachinesTab() {
    const [vms] = useState<VirtualMachine[]>(initialVirtualMachines)
    const [clusters] = useState(initialClusters)
    
    const getStatusBadge = (status: VirtualMachine['status']) => {
        switch (status) {
            case "active":
                return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
            case "building":
                return <Badge className="capitalize bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20">{status}</Badge>
            case "offline":
                return <Badge variant="secondary" className="capitalize">{status}</Badge>
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>
        }
    }
    const getClusterName = (id: string) => clusters.find(c => c.id === id)?.name ?? "N/A"

    return (
        <Card>
            <CardHeader>
                <CardTitle>Virtual Machines</CardTitle>
                <CardDescription>Manage individual virtual machines.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Cluster</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>vCPUs</TableHead>
                            <TableHead>Memory</TableHead>
                            <TableHead>Disk</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vms.map(vm => (
                            <TableRow key={vm.id}>
                                <TableCell className="font-medium">{vm.name}</TableCell>
                                <TableCell>{getStatusBadge(vm.status)}</TableCell>
                                <TableCell>{getClusterName(vm.clusterId)}</TableCell>
                                <TableCell>{vm.role}</TableCell>
                                <TableCell>{vm.vcpus}</TableCell>
                                <TableCell>{vm.memory} GB</TableCell>
                                <TableCell>{vm.disk} GB</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}

export default function VirtualizationPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="clusters">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
          <TabsTrigger value="vms">Virtual Machines</TabsTrigger>
        </TabsList>
        <TabsContent value="clusters" className="mt-6">
            <ClustersTab />
        </TabsContent>
        <TabsContent value="vms" className="mt-6">
            <VirtualMachinesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
