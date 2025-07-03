"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createPowerPanel } from "../actions"
import type { PowerPanel, PowerFeed, Site, Location, Rack } from "@prisma/client"

// Enriched types to include relations
type EnrichedPowerPanel = PowerPanel & {
    site: Site | null;
    location: Location | null;
};
type EnrichedPowerFeed = PowerFeed & {
    panel: PowerPanel | null;
    rack: Rack | null;
};

interface PowerClientPageProps {
    initialPowerPanels: EnrichedPowerPanel[];
    initialPowerFeeds: EnrichedPowerFeed[];
    sites: Site[];
    locations: Location[];
    racks: Rack[];
}

const panelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  siteId: z.string().min(1, "A site must be selected"),
  locationId: z.string().optional().nullable(),
  voltage: z.coerce.number().int().min(1, "Voltage is required"),
  phase: z.enum(["single_phase", "three_phase"]),
  capacityAmps: z.coerce.number().int().min(1, "Capacity is required"),
});

type PanelFormValues = z.infer<typeof panelSchema>;

function PowerPanelsTab({ initialPanels, sites, locations }: { initialPanels: EnrichedPowerPanel[], sites: Site[], locations: Location[] }) {
  const { toast } = useToast();
  const [panels, setPanels] = useState<EnrichedPowerPanel[]>(initialPanels);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<PanelFormValues>({
    resolver: zodResolver(panelSchema),
    defaultValues: { phase: "three_phase" },
  });
  
  const watchedSiteId = form.watch("siteId");
  const filteredLocations = locations.filter(l => l.siteId === watchedSiteId);

  async function onSubmit(data: PanelFormValues) {
    const result = await createPowerPanel(data);
    if (result.success && result.newPanel) {
        setPanels(prev => [...prev, result.newPanel as EnrichedPowerPanel]);
        toast({ title: "Success", description: "Power panel has been created." });
        setIsAddDialogOpen(false);
        form.reset();
    } else {
        toast({ title: "Error", description: result.message ?? "Failed to create panel", variant: 'destructive' });
    }
  }

  const handleDelete = (id: string) => {
    // TODO: Implement delete action
    setPanels((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Success", description: "Power panel has been deleted." });
  }

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
                      <Select onValueChange={field.onChange} defaultValue={field.value ?? ""} disabled={!watchedSiteId}>
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
                          <SelectContent><SelectItem value="single_phase">Single-Phase</SelectItem><SelectItem value="three_phase">Three-Phase</SelectItem></SelectContent>
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
                <TableCell>{panel.site?.name ?? 'N/A'}</TableCell>
                <TableCell>{panel.location?.name ?? 'N/A'}</TableCell>
                <TableCell>{panel.voltage}V / {panel.phase.replace('_', '-')}</TableCell>
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

function PowerFeedsTab({ initialFeeds }: { initialFeeds: EnrichedPowerFeed[] }) {
    const [feeds] = useState<EnrichedPowerFeed[]>(initialFeeds)
    
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
                                <TableCell>{feed.panel?.name ?? 'N/A'}</TableCell>
                                <TableCell>{feed.rack?.name ?? 'N/A'}</TableCell>
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

export function PowerClientPage({ initialPowerPanels, initialPowerFeeds, sites, locations }: PowerClientPageProps) {
  return (
    <div className="space-y-6">
       <Tabs defaultValue="panels">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="panels">Power Panels</TabsTrigger>
          <TabsTrigger value="feeds">Power Feeds</TabsTrigger>
        </TabsList>
        <TabsContent value="panels" className="mt-6">
            <PowerPanelsTab initialPanels={initialPowerPanels} sites={sites} locations={locations} />
        </TabsContent>
        <TabsContent value="feeds" className="mt-6">
            <PowerFeedsTab initialFeeds={initialPowerFeeds} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
