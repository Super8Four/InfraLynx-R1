
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
import { useToast } from "@/hooks/use-toast"
import {
  initialPowerPanels,
  initialPowerFeeds,
  initialSites,
  initialLocations,
  type PowerPanel,
  type PowerFeed,
} from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const panelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  siteId: z.string().min(1, "A site must be selected"),
  locationId: z.string().optional(),
  voltage: z.coerce.number().int().min(1, "Voltage is required"),
  phase: z.enum(["single-phase", "three-phase"]),
  capacityAmps: z.coerce.number().int().min(1, "Capacity is required"),
})

type PanelFormValues = z.infer<typeof panelSchema>

function PowerPanelsTab() {
  const { toast } = useToast()
  const [panels, setPanels] = useState<PowerPanel[]>(initialPowerPanels)
  const [sites] = useState(initialSites)
  const [locations] = useState(initialLocations)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<PanelFormValues>({
    resolver: zodResolver(panelSchema),
    defaultValues: { phase: "three-phase" },
  })
  
  const watchedSiteId = form.watch("siteId")
  const filteredLocations = locations.filter(l => l.siteId === watchedSiteId)

  function onSubmit(data: PanelFormValues) {
    const newPanel: PowerPanel = {
      id: `pp-${Date.now()}`,
      ...data,
    }
    setPanels((prev) => [...prev, newPanel])
    toast({ title: "Success", description: "Power panel has been created." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id))
    toast({ title: "Success", description: "Power panel has been deleted." })
  }
  
  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name ?? 'N/A'
  const getLocationName = (id?: string) => locations.find(l => l.id === id)?.name ?? 'N/A'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Power Panels</CardTitle>
            <CardDescription>Manage building power distribution panels.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Panel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Power Panel</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., PP-A1" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                  <FormField control={form.control} name="siteId" render={({ field }) => (
                    <FormItem><FormLabel>Site</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a site" /></SelectTrigger></FormControl>
                        <SelectContent>{sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    <FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="locationId" render={({ field }) => (
                    <FormItem><FormLabel>Location (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedSiteId}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger></FormControl>
                        <SelectContent>{filteredLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                      </Select>
                    <FormMessage /></FormItem>
                  )}/>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="voltage" render={({ field }) => ( <FormItem><FormLabel>Voltage</FormLabel><FormControl><Input type="number" placeholder="208" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="phase" render={({ field }) => (
                      <FormItem><FormLabel>Phase</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="single-phase">Single-Phase</SelectItem><SelectItem value="three-phase">Three-Phase</SelectItem></SelectContent>
                        </Select>
                      <FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="capacityAmps" render={({ field }) => ( <FormItem><FormLabel>Capacity (Amps)</FormLabel><FormControl><Input type="number" placeholder="100" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Panel</Button>
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
              <TableHead>Site</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Voltage</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {panels.map((panel) => (
              <TableRow key={panel.id}>
                <TableCell className="font-medium">{panel.name}</TableCell>
                <TableCell>{getSiteName(panel.siteId)}</TableCell>
                <TableCell>{getLocationName(panel.locationId)}</TableCell>
                <TableCell>{panel.voltage}V / {panel.phase}</TableCell>
                <TableCell>{panel.capacityAmps}A</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(panel.id)}>Delete</DropdownMenuItem>
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

function PowerFeedsTab() {
    const [feeds] = useState<PowerFeed[]>(initialPowerFeeds)
    const [panels] = useState(initialPowerPanels)
    const [racks] = useState(initialRacks)

    const getPanelName = (id: string) => panels.find(p => p.id === id)?.name ?? 'N/A'
    const getRackName = (id?: string) => racks.find(r => r.id === id)?.name ?? 'N/A'
    
    const getStatusBadge = (status: PowerFeed['status']) => {
        switch (status) {
            case "active":
                return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
            case "planned":
                return <Badge className="capitalize bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20">{status}</Badge>
            case "offline":
                return <Badge variant="secondary" className="capitalize">{status}</Badge>
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Power Feeds</CardTitle>
                <CardDescription>Manage individual power feeds from panels to racks.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Panel</TableHead>
                            <TableHead>Rack</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Specs</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feeds.map(feed => (
                            <TableRow key={feed.id}>
                                <TableCell className="font-medium">{feed.name}</TableCell>
                                <TableCell>{getPanelName(feed.panelId)}</TableCell>
                                <TableCell>{getRackName(feed.rackId)}</TableCell>
                                <TableCell>{getStatusBadge(feed.status)}</TableCell>
                                <TableCell className="capitalize">{feed.type}</TableCell>
                                <TableCell>{feed.amperage}A / {feed.voltage}V</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}


export default function PowerPage() {
  return (
    <div className="space-y-6">
       <Tabs defaultValue="panels">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="panels">Power Panels</TabsTrigger>
          <TabsTrigger value="feeds">Power Feeds</TabsTrigger>
        </TabsList>
        <TabsContent value="panels" className="mt-6">
            <PowerPanelsTab />
        </TabsContent>
        <TabsContent value="feeds" className="mt-6">
            <PowerFeedsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
