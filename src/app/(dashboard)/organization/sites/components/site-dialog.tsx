
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { timezones } from "@/lib/timezones"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Region, SiteGroup, Tenant, TenantGroup } from "@prisma/client"
import { createSite } from "../actions"


const siteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "offline", "planned", "decommissioning"]),
  regionId: z.string().optional(),
  groupId: z.string().optional(),
  facility: z.string().optional(),
  asns: z.string().optional(),
  timeZone: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  tenantGroupId: z.string().optional(),
  tenantId: z.string().optional(),
  physicalAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  comments: z.string().optional(),
})

type SiteFormValues = z.infer<typeof siteSchema>

interface SiteDialogProps {
    regions: Region[];
    siteGroups: SiteGroup[];
    tenants: Tenant[];
    tenantGroups: TenantGroup[];
}

export function SiteDialog({ regions, siteGroups, tenants, tenantGroups }: SiteDialogProps) {
    const { toast } = useToast()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const form = useForm<SiteFormValues>({
        resolver: zodResolver(siteSchema),
        defaultValues: {
            name: "",
            status: "active",
            tags: "",
        },
    })

    async function onSubmit(data: SiteFormValues) {
        try {
            await createSite(data)
            toast({ title: "Success", description: "Site has been created." })
            setIsAddDialogOpen(false)
            form.reset()
        } catch (error) {
            toast({ title: "Error", description: "Could not create site.", variant: 'destructive' })
        }
    }

    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Site
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="h-[70vh] pr-6">
                <div className="space-y-6">
                    {/* General section */}
                    <div>
                        <h3 className="text-lg font-medium">General</h3>
                            <Separator className="my-2" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Full name of the site" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="planned">Planned</SelectItem>
                                        <SelectItem value="decommissioning">Decommissioning</SelectItem>
                                        <SelectItem value="offline">Offline</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="regionId" render={({ field }) => (
                                <FormItem><FormLabel>Region</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a region" /></SelectTrigger></FormControl>
                                    <SelectContent>{regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="groupId" render={({ field }) => (
                                <FormItem><FormLabel>Group</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl>
                                    <SelectContent>{siteGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="facility" render={({ field }) => ( <FormItem><FormLabel>Facility</FormLabel><FormControl><Input placeholder="Local facility ID or description" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="asns" render={({ field }) => ( <FormItem><FormLabel>ASNs</FormLabel><FormControl><Input placeholder="Comma-separated AS numbers" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="timeZone" render={({ field }) => (
                                <FormItem><FormLabel>Time Zone</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a time zone" /></SelectTrigger></FormControl>
                                    <SelectContent>{timezones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="tags" render={({ field }) => ( <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="Comma-separated tags" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem className="mt-4"><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief description of the site." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    {/* Tenancy section */}
                    <div>
                        <h3 className="text-lg font-medium">Tenancy</h3>
                            <Separator className="my-2" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField control={form.control} name="tenantGroupId" render={({ field }) => (
                                <FormItem><FormLabel>Tenant Group</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl>
                                    <SelectContent>{tenantGroups.map(tg => <SelectItem key={tg.id} value={tg.id}>{tg.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="tenantId" render={({ field }) => (
                                <FormItem><FormLabel>Tenant</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a tenant" /></SelectTrigger></FormControl>
                                    <SelectContent>{tenants.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </div>
                    {/* Contact Info section */}
                    <div>
                        <h3 className="text-lg font-medium">Contact Info</h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField control={form.control} name="physicalAddress" render={({ field }) => ( <FormItem><FormLabel>Physical Address</FormLabel><FormControl><Textarea placeholder="Physical location of the building" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="shippingAddress" render={({ field }) => ( <FormItem><FormLabel>Shipping Address</FormLabel><FormControl><Textarea placeholder="If different from physical address" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                            <FormField control={form.control} name="latitude" render={({ field }) => ( <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" placeholder="e.g., 36.5297" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="longitude" render={({ field }) => ( <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" placeholder="e.g., -87.3595" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            </div>
                            <div className="mt-4 p-4 border rounded-md bg-muted/50 flex items-center justify-center">
                            <Image src="https://placehold.co/600x400.png" alt="Map placeholder" width={600} height={400} className="rounded-md" data-ai-hint="world map"/>
                            </div>
                    </div>
                    {/* Comments */}
                        <div>
                        <h3 className="text-lg font-medium">Comments</h3>
                            <Separator className="my-2" />
                            <FormField control={form.control} name="comments" render={({ field }) => ( <FormItem><FormControl><Textarea placeholder="Add any relevant comments" {...field} rows={5} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                </div>
                </ScrollArea>
                <DialogFooter className="pt-8">
                    <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Site</Button>
                </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}
