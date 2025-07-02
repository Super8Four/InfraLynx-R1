
"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle, ListFilter, Settings, Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
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
  initialRacks,
  initialSites,
  initialLocations,
  initialRackRoles,
  initialRackTypes,
  initialTenantGroups,
  initialTenants,
  type Rack,
  type Site,
  type Location,
  type RackRole,
  type RackType,
  type TenantGroup,
  type Tenant,
} from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

const rackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  siteId: z.string().min(1, "Site is required"),
  locationId: z.string().optional(),
  status: z.enum(["active", "planned", "decommissioned"]),
  roleId: z.string().optional(),
  typeId: z.string().optional(),
  description: z.string().optional(),
  airflow: z.enum(["front-to-rear", "rear-to-front", "mixed", "passive"]).optional(),
  tags: z.string().optional(),
  facilityId: z.string().optional(),
  serial: z.string().optional(),
  assetTag: z.string().optional(),
  tenantGroupId: z.string().optional(),
  tenantId: z.string().optional(),
  width: z.enum(["19in", "23in"]),
  u_height: z.coerce.number().int().positive("Must be a positive number"),
  startingUnit: z.coerce.number().int().min(1, "Starting unit must be at least 1"),
  outerWidth: z.coerce.number().optional(),
  outerHeight: z.coerce.number().optional(),
  outerDepth: z.coerce.number().optional(),
  outerUnit: z.enum(["mm", "in"]).optional(),
  weight: z.coerce.number().optional(),
  maxWeight: z.coerce.number().optional(),
  weightUnit: z.enum(["kg", "lb"]).optional(),
  mountingDepth: z.coerce.number().optional(),
})

type RackFormValues = z.infer<typeof rackSchema>

export default function RacksPage() {
  const { toast } = useToast()
  const [racks, setRacks] = useState<Rack[]>(initialRacks)
  const [sites] = useState<Site[]>(initialSites)
  const [locations] = useState<Location[]>(initialLocations)
  const [rackRoles] = useState<RackRole[]>(initialRackRoles)
  const [rackTypes] = useState<RackType[]>(initialRackTypes)
  const [tenantGroups] = useState<TenantGroup[]>(initialTenantGroups)
  const [tenants] = useState<Tenant[]>(initialTenants)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<RackFormValues>({
    resolver: zodResolver(rackSchema),
    defaultValues: {
      status: "active",
      width: "19in",
      u_height: 42,
      startingUnit: 1,
      tags: "",
    },
  })

  const watchedSiteId = form.watch("siteId")
  const filteredLocations = locations.filter(l => l.siteId === watchedSiteId)

  function onSubmit(data: RackFormValues) {
    const newRack: Rack = {
      id: `rack-${Date.now()}`,
      ...data,
      tags: data.tags ? data.tags.split(",").map(t => t.trim()) : [],
      deviceCount: 0,
      spaceUtilization: 0,
    }
    setRacks((prev) => [...prev, newRack])
    toast({ title: "Success", description: "Rack has been created." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    setRacks((prev) => prev.filter((r) => r.id !== id))
    toast({ title: "Success", description: "Rack has been deleted." })
  }

  const getSiteName = (siteId: string) => sites.find(s => s.id === siteId)?.name ?? "—"
  const getLocationName = (locationId?: string) => locations.find(l => l.id === locationId)?.name ?? '—'
  const getTenantName = (tenantId?: string) => tenants.find(t => t.id === tenantId)?.name ?? '—'
  const getRoleName = (roleId?: string) => rackRoles.find(r => r.id === roleId)?.name ?? "—"
  const getTypeName = (typeId?: string) => rackTypes.find(t => t.id === typeId)?.model ?? '—'
  
  const getStatusBadge = (status: Rack['status']) => {
    switch (status) {
      case "active":
        return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
      case "planned":
        return <Badge className="capitalize bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20">{status}</Badge>
      case "decommissioned":
        return <Badge variant="destructive" className="capitalize">{status}</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

  const getSpaceUtilizationColor = (utilization: number) => {
    if (utilization > 90) return "bg-red-500";
    if (utilization > 75) return "bg-yellow-500";
    return "bg-green-500";
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Racks</CardTitle>
                    <CardDescription>Results {racks.length}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4" />
                                Configure Table
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                           {/* Add checkbox items for columns here */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Rack
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl">
                            <DialogHeader>
                            <DialogTitle>Add New Rack</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to create a new rack.
                            </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <ScrollArea className="h-[60vh] pr-6">
                                <div className="space-y-8">
                                    <div>
                                    <h3 className="text-lg font-medium">Location</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormField control={form.control} name="siteId" render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Site</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a site" /></SelectTrigger></FormControl>
                                                <SelectContent>{sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <FormField control={form.control} name="locationId" render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedSiteId}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger></FormControl>
                                                <SelectContent>{filteredLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                    </div>

                                    <div>
                                    <h3 className="text-lg font-medium">Rack Details</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Name</FormLabel> <FormControl><Input placeholder="e.g., A101" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="status" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="planned">Planned</SelectItem>
                                                <SelectItem value="decommissioned">Decommissioned</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="roleId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                                            <SelectContent>{rackRoles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}/>
                                    </div>
                                    <FormField control={form.control} name="typeId" render={({ field }) => (
                                        <FormItem className="mt-4">
                                            <FormLabel>Rack Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a pre-defined type" /></SelectTrigger></FormControl>
                                            <SelectContent>{rackTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.manufacturer} {t.model}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormDescription>Select a pre-defined rack type, or set physical characteristics below.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                        )}/>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                                        <FormField control={form.control} name="airflow" render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Airflow</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select airflow" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                <SelectItem value="front-to-rear">Front-to-rear</SelectItem>
                                                <SelectItem value="rear-to-front">Rear-to-front</SelectItem>
                                                <SelectItem value="mixed">Mixed</SelectItem>
                                                <SelectItem value="passive">Passive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="tags" render={({ field }) => ( <FormItem> <FormLabel>Tags</FormLabel> <FormControl><Input placeholder="e.g., critical, core" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                    </div>
                                    <FormField control={form.control} name="description" render={({ field }) => ( <FormItem className="mt-4"> <FormLabel>Description</FormLabel> <FormControl><Textarea placeholder="A brief description of the rack." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                    </div>

                                    <div>
                                    <h3 className="text-lg font-medium">Inventory Control</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <FormField control={form.control} name="facilityId" render={({ field }) => ( <FormItem> <FormLabel>Facility ID</FormLabel> <FormControl><Input placeholder="e.g., A1-01" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="serial" render={({ field }) => ( <FormItem> <FormLabel>Serial Number</FormLabel> <FormControl><Input placeholder="e.g., SN12345" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="assetTag" render={({ field }) => ( <FormItem> <FormLabel>Asset Tag</FormLabel> <FormControl><Input placeholder="e.g., AT67890" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                    </div>
                                    </div>

                                    <div>
                                    <h3 className="text-lg font-medium">Tenancy</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormField control={form.control} name="tenantGroupId" render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Tenant Group</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl>
                                                <SelectContent>{tenantGroups.map(tg => <SelectItem key={tg.id} value={tg.id}>{tg.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="tenantId" render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Tenant</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a tenant" /></SelectTrigger></FormControl>
                                                <SelectContent>{tenants.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}/>
                                    </div>
                                    </div>

                                    <div>
                                    <h3 className="text-lg font-medium">Dimensions</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <FormField control={form.control} name="width" render={({ field }) => (
                                        <FormItem><FormLabel>Width</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="19in">19 inches</SelectItem><SelectItem value="23in">23 inches</SelectItem></SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="u_height" render={({ field }) => ( <FormItem> <FormLabel>Height (U)</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="startingUnit" render={({ field }) => ( <FormItem> <FormLabel>Starting Unit</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-4">
                                        <FormField control={form.control} name="outerWidth" render={({ field }) => ( <FormItem> <FormLabel>Outer Width</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="outerHeight" render={({ field }) => ( <FormItem> <FormLabel>Outer Height</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="outerDepth" render={({ field }) => ( <FormItem> <FormLabel>Outer Depth</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="outerUnit" render={({ field }) => (
                                            <FormItem><FormLabel>Outer Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Unit"/></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem><SelectItem value="in">in</SelectItem></SelectContent>
                                            </Select><FormMessage />
                                            </FormItem>
                                        )}/>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 mt-4">
                                        <FormField control={form.control} name="mountingDepth" render={({ field }) => ( <FormItem> <FormLabel>Mounting Depth</FormLabel> <FormControl><Input type="number" placeholder="e.g., 750" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                    </div>
                                    </div>

                                    <div>
                                    <h3 className="text-lg font-medium">Weight</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <FormField control={form.control} name="weight" render={({ field }) => ( <FormItem> <FormLabel>Weight</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="maxWeight" render={({ field }) => ( <FormItem> <FormLabel>Max Weight</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        <FormField control={form.control} name="weightUnit" render={({ field }) => (
                                            <FormItem><FormLabel>Weight Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Unit"/></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="lb">lb</SelectItem></SelectContent>
                                            </Select><FormMessage />
                                            </FormItem>
                                        )}/>
                                    </div>
                                    </div>
                                </div>
                                </ScrollArea>
                                <DialogFooter className="pt-6">
                                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Rack</Button>
                                </DialogFooter>
                            </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Input placeholder="Quick search" className="w-72" />
            </div>
        </CardHeader>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] px-4">
                  <Checkbox />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Facility ID</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Height</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Space</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {racks.map((rack) => (
                <TableRow key={rack.id}>
                    <TableCell className="px-4">
                        <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">{rack.name}</TableCell>
                    <TableCell>{getSiteName(rack.siteId)}</TableCell>
                    <TableCell>{getLocationName(rack.locationId)}</TableCell>
                    <TableCell>{getStatusBadge(rack.status)}</TableCell>
                    <TableCell>{rack.facilityId || '—'}</TableCell>
                    <TableCell>{getTenantName(rack.tenantId)}</TableCell>
                    <TableCell>
                        {rack.roleId ? <Badge variant="secondary">{getRoleName(rack.roleId)}</Badge> : '—'}
                    </TableCell>
                    <TableCell>{getTypeName(rack.typeId)}</TableCell>
                    <TableCell>{rack.u_height}U</TableCell>
                    <TableCell>{rack.deviceCount}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Progress value={rack.spaceUtilization} indicatorClassName={getSpaceUtilizationColor(rack.spaceUtilization)} className="h-2 w-20" />
                            <span className="text-muted-foreground text-xs">{rack.spaceUtilization.toFixed(1)}%</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="inline-flex rounded-md">
                             <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none">
                                <Pencil className="h-4 w-4" />
                            </Button>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none border-l-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View Elevation</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(rack.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
