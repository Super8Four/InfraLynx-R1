
"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  PlusCircle,
  File,
  ListFilter,
  Search,
  Activity,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Badge } from "@/components/ui/badge"
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { 
    initialDevices, 
    initialSites, 
    initialDeviceRoles,
    initialDeviceTypes,
    initialPlatforms,
    initialLocations,
    initialRacks,
    initialClusters,
    initialTenants,
    initialTenantGroups,
    initialVirtualChassis,
    type Device 
} from "@/lib/data"

const deviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  deviceRoleId: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  tags: z.string().optional(),

  // Hardware
  deviceTypeId: z.string().min(1, "Device Type is required"),
  airflow: z.enum(["front-to-rear", "rear-to-front", "side-to-rear", "passive"]).optional(),
  serial: z.string().optional(),
  assetTag: z.string().optional(),

  // Location
  siteId: z.string().min(1, "Site is required"),
  locationId: z.string().optional(),
  rackId: z.string().optional(),
  rackFace: z.enum(["front", "rear"]).optional(),
  position: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),

  // Management
  status: z.enum(["active", "offline", "provisioning", "staged", "decommissioning"]),
  platformId: z.string().optional(),
  configTemplate: z.string().optional(),
  ip: z.string().ip({ message: "Invalid IP address" }).optional(),

  // Virtualization
  clusterId: z.string().optional(),

  // Tenancy
  tenantGroupId: z.string().optional(),
  tenantId: z.string().optional(),
  
  // Virtual Chassis
  virtualChassisId: z.string().optional(),
  vcPosition: z.coerce.number().optional(),
  vcPriority: z.coerce.number().optional(),
})

type DeviceFormValues = z.infer<typeof deviceSchema>

export default function DevicesPage() {
  const { toast } = useToast()
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [sites] = useState(initialSites)
  const [deviceTypes] = useState(initialDeviceTypes)
  const [deviceRoles] = useState(initialDeviceRoles)
  const [platforms] = useState(initialPlatforms)
  const [locations] = useState(initialLocations)
  const [racks] = useState(initialRacks)
  const [clusters] = useState(initialClusters)
  const [tenants] = useState(initialTenants)
  const [tenantGroups] = useState(initialTenantGroups)
  const [virtualChassis] = useState(initialVirtualChassis)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null)
  const [pingingStatus, setPingingStatus] = useState<Record<string, boolean>>({});

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      status: "active",
    },
  })

  const watchedSiteId = form.watch("siteId")
  const watchedLocationId = form.watch("locationId")
  const watchedTenantGroupId = form.watch("tenantGroupId")

  const filteredLocations = locations.filter(l => l.siteId === watchedSiteId)
  const filteredRacks = racks.filter(r => r.locationId === watchedLocationId)
  const filteredTenants = tenants.filter(t => t.groupId === watchedTenantGroupId)


  function onSubmit(data: DeviceFormValues) {
    const newDevice: Device = {
      ...data,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
    }
    setDevices((prev) => [...prev, newDevice])
    toast({ title: "Success", description: "Device has been added." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDeleteConfirm = () => {
    if (deviceToDelete) {
      setDevices((prev) => prev.filter((d) => d.id !== deviceToDelete))
      toast({
        title: "Success",
        description: `Device "${deviceToDelete}" has been deleted.`,
      })
    }
    setIsDeleteDialogOpen(false)
    setDeviceToDelete(null)
  }

  const openDeleteDialog = (deviceId: string) => {
    setDeviceToDelete(deviceId)
    setIsDeleteDialogOpen(true)
  }

  const handlePingDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId)
    if (!device) return;

    setPingingStatus(prev => ({ ...prev, [deviceId]: true }));
    toast({ title: `Pinging ${device.name}...` });

    setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate
        
        setDevices(prevDevices => 
            prevDevices.map(d => 
                d.id === deviceId 
                    ? { ...d, status: isSuccess ? 'active' : 'offline' } 
                    : d
            )
        );

        toast({ 
            title: isSuccess ? `Ping to ${device.name} successful!` : `Ping to ${device.name} failed.`,
            description: isSuccess ? 'Device is now marked as active.' : 'Device is now marked as offline.',
            variant: isSuccess ? 'default' : 'destructive',
        });

        setPingingStatus(prev => ({ ...prev, [deviceId]: false }));

    }, 1500);
  };


  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20 capitalize">{status}</Badge>
      case "offline":
        return <Badge variant="destructive" className="capitalize">{status}</Badge>
      case "provisioning":
        return <Badge className="bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20 capitalize">{status}</Badge>
      case "staged":
        return <Badge className="bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20 capitalize">{status}</Badge>
      case "decommissioning":
        return <Badge variant="secondary" className="capitalize">{status}</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

  const getDeviceType = (id: string) => deviceTypes.find(t => t.id === id);
  const getDeviceRole = (id: string) => deviceRoles.find(r => r.id === id);
  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name ?? 'N/A';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
          <CardDescription>
            A comprehensive list of all infrastructure devices.
          </CardDescription>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filter devices..." className="pl-8 w-64"/>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Offline</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Provisioning</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Staged</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Decommissioning</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-9 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Device
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new device to the inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <ScrollArea className="h-[70vh] pr-6">
                        <div className="space-y-8">
                          {/* Device Section */}
                          <div>
                            <h3 className="text-lg font-medium mb-2">Device</h3>
                            <Separator className="mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Device Name</FormLabel> <FormControl><Input placeholder="e.g., core-router-01" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                               <FormField control={form.control} name="deviceRoleId" render={({ field }) => ( <FormItem> <FormLabel>Role</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a role" /> </SelectTrigger> </FormControl> <SelectContent> {deviceRoles.map((role) => ( <SelectItem key={role.id} value={role.id}> {role.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                            </div>
                            <div className="mt-4"><FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea placeholder="Brief description of the device's role and purpose." {...field} /></FormControl> <FormMessage /> </FormItem> )}/></div>
                            <div className="mt-4"><FormField control={form.control} name="tags" render={({ field }) => ( <FormItem> <FormLabel>Tags</FormLabel> <FormControl> <Input placeholder="e.g., critical, core" {...field} /> </FormControl> <FormDescription>Enter a comma-separated list of tags.</FormDescription> <FormMessage /> </FormItem> )}/></div>
                          </div>

                          {/* Hardware Section */}
                          <div>
                            <h3 className="text-lg font-medium mb-2">Hardware</h3>
                            <Separator className="mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField control={form.control} name="deviceTypeId" render={({ field }) => ( <FormItem> <FormLabel>Device Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a type" /> </SelectTrigger> </FormControl> <SelectContent> {deviceTypes.map((type) => ( <SelectItem key={type.id} value={type.id}> {type.manufacturer} - {type.model} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                              <FormField control={form.control} name="airflow" render={({ field }) => ( <FormItem> <FormLabel>Airflow</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select airflow" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="front-to-rear">Front-to-rear</SelectItem> <SelectItem value="rear-to-front">Rear-to-front</SelectItem> <SelectItem value="side-to-rear">Side-to-rear</SelectItem> <SelectItem value="passive">Passive</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                              <FormField control={form.control} name="serial" render={({ field }) => ( <FormItem> <FormLabel>Serial Number</FormLabel> <FormControl><Input placeholder="Device serial number" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                              <FormField control={form.control} name="assetTag" render={({ field }) => ( <FormItem> <FormLabel>Asset Tag</FormLabel> <FormControl><Input placeholder="Unique asset tag" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </div>
                          </div>

                           {/* Location Section */}
                           <div>
                            <h3 className="text-lg font-medium mb-2">Location</h3>
                            <Separator className="mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField control={form.control} name="siteId" render={({ field }) => ( <FormItem> <FormLabel>Site</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a site" /> </SelectTrigger> </FormControl> <SelectContent> {sites.map((site) => ( <SelectItem key={site.id} value={site.id}> {site.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                              <FormField control={form.control} name="locationId" render={({ field }) => ( <FormItem> <FormLabel>Location</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedSiteId}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a location" /> </SelectTrigger> </FormControl> <SelectContent> {filteredLocations.map((loc) => ( <SelectItem key={loc.id} value={loc.id}> {loc.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                              <FormField control={form.control} name="rackId" render={({ field }) => ( <FormItem> <FormLabel>Rack</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedLocationId}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a rack" /> </SelectTrigger> </FormControl> <SelectContent> {filteredRacks.map((rack) => ( <SelectItem key={rack.id} value={rack.id}> {rack.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                               <FormField control={form.control} name="rackFace" render={({ field }) => ( <FormItem> <FormLabel>Rack Face</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select face" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="front">Front</SelectItem> <SelectItem value="rear">Rear</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                               <FormField control={form.control} name="position" render={({ field }) => ( <FormItem> <FormLabel>Position (U)</FormLabel> <FormControl><Input type="number" placeholder="Lowest unit" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <FormField control={form.control} name="latitude" render={({ field }) => ( <FormItem> <FormLabel>Latitude</FormLabel> <FormControl><Input type="number" step="any" placeholder="e.g., 36.5297" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                <FormField control={form.control} name="longitude" render={({ field }) => ( <FormItem> <FormLabel>Longitude</FormLabel> <FormControl><Input type="number" step="any" placeholder="e.g., -87.3595" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                            </div>
                           </div>

                           {/* Management Section */}
                           <div>
                            <h3 className="text-lg font-medium mb-2">Management</h3>
                            <Separator className="mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="status" render={({ field }) => ( <FormItem> <FormLabel>Status</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a status" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="active">Active</SelectItem> <SelectItem value="offline">Offline</SelectItem> <SelectItem value="provisioning">Provisioning</SelectItem> <SelectItem value="staged">Staged</SelectItem> <SelectItem value="decommissioning">Decommissioning</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name="platformId" render={({ field }) => ( <FormItem> <FormLabel>Platform</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a platform" /> </SelectTrigger> </FormControl> <SelectContent> {platforms.map((platform) => ( <SelectItem key={platform.id} value={platform.id}> {platform.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <FormField control={form.control} name="ip" render={({ field }) => ( <FormItem> <FormLabel>Primary IP</FormLabel> <FormControl><Input placeholder="e.g., 192.0.2.1" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name="configTemplate" render={({ field }) => ( <FormItem> <FormLabel>Config Template</FormLabel> <FormControl><Input placeholder="e.g., juniper-qfx-template.j2" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </div>
                           </div>

                           {/* Virtualization Section */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Virtualization</h3>
                                <Separator className="mb-4" />
                                <FormField control={form.control} name="clusterId" render={({ field }) => ( <FormItem> <FormLabel>Cluster</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Assign to a cluster" /> </SelectTrigger> </FormControl> <SelectContent> {clusters.map((cluster) => ( <SelectItem key={cluster.id} value={cluster.id}> {cluster.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                            </div>
                            
                            {/* Tenancy Section */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Tenancy</h3>
                                <Separator className="mb-4" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="tenantGroupId" render={({ field }) => ( <FormItem> <FormLabel>Tenant Group</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a group" /> </SelectTrigger> </FormControl> <SelectContent> {tenantGroups.map((group) => ( <SelectItem key={group.id} value={group.id}> {group.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name="tenantId" render={({ field }) => ( <FormItem> <FormLabel>Tenant</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedTenantGroupId}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a tenant" /> </SelectTrigger> </FormControl> <SelectContent> {filteredTenants.map((tenant) => ( <SelectItem key={tenant.id} value={tenant.id}> {tenant.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                                </div>
                            </div>
                            
                            {/* Virtual Chassis Section */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Virtual Chassis</h3>
                                <Separator className="mb-4" />
                                <FormField control={form.control} name="virtualChassisId" render={({ field }) => ( <FormItem> <FormLabel>Virtual Chassis</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Assign to a virtual chassis" /> </SelectTrigger> </FormControl> <SelectContent> {virtualChassis.map((vc) => ( <SelectItem key={vc.id} value={vc.id}> {vc.name} </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <FormField control={form.control} name="vcPosition" render={({ field }) => ( <FormItem> <FormLabel>VC Position</FormLabel> <FormControl><Input type="number" placeholder="Position in VC" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name="vcPriority" render={({ field }) => ( <FormItem> <FormLabel>VC Priority</FormLabel> <FormControl><Input type="number" placeholder="VC priority" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                </div>
                            </div>

                        </div>
                      </ScrollArea>
                      <DialogFooter className="pt-8">
                        <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Device</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Site</TableHead>
                <TableHead className="hidden md:table-cell">Asset Tag</TableHead>
                <TableHead className="hidden md:table-cell">Serial</TableHead>
                <TableHead className="hidden lg:table-cell">Primary IP</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => {
                const deviceRole = getDeviceRole(device.deviceRoleId);
                const siteName = getSiteName(device.siteId);
                const isPinging = pingingStatus[device.id!];
                return (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">
                    <Link href={`/devices/${device.id}`} className="hover:underline">
                      {device.name}
                    </Link>
                  </TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell>
                    {deviceRole?.name ?? 'N/A'}
                  </TableCell>
                  <TableCell>
                    {siteName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono">{device.assetTag ?? 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono">{device.serial ?? 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell font-mono">
                    {device.ip ?? 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {device.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Interfaces</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handlePingDevice(device.id!)}
                            disabled={isPinging}
                        >
                            {isPinging ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <Activity className="mr-2 h-4 w-4" />
                            )}
                            <span>{isPinging ? "Pinging..." : "Ping Device"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(device.id!)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the device
              "{deviceToDelete && devices.find(d => d.id === deviceToDelete)?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
