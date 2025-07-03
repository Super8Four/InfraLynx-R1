
"use client"

import { useState, useMemo, useCallback } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Rack from "@/components/rack"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    initialRacks, 
    initialDevices, 
    initialSites, 
    initialDeviceTypes, 
    initialDeviceRoles, 
    type Rack as RackType,
    type Device as DeviceType,
} from "@/lib/data"
import type { DeviceInRack, ProcessedRack } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const addDeviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  deviceTypeId: z.string().min(1, "Device Type is required"),
  deviceRoleId: z.string().min(1, "Device Role is required"),
});

type AddDeviceFormValues = z.infer<typeof addDeviceSchema>;

export default function RacksPage() {
    const { toast } = useToast()
    const [allRacks, setAllRacks] = useState<RackType[]>(initialRacks)
    const [allDevices, setAllDevices] = useState<DeviceType[]>(initialDevices)
    
    const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false)
    const [newDeviceLocation, setNewDeviceLocation] = useState<{ rackId: string, unit: number } | null>(null)

    const form = useForm<AddDeviceFormValues>({
        resolver: zodResolver(addDeviceSchema),
        defaultValues: {
            name: "",
            deviceTypeId: "",
            deviceRoleId: "",
        },
    });

    const processedRacks = useMemo((): ProcessedRack[] => {
        const deviceMap = new Map<string, DeviceType[]>();
        allDevices.forEach(device => {
            if (device.rackId) {
                if (!deviceMap.has(device.rackId)) {
                    deviceMap.set(device.rackId, []);
                }
                deviceMap.get(device.rackId)!.push(device);
            }
        });

        return allRacks.map(rack => {
            const devicesData = deviceMap.get(rack.id) || [];
            const devicesInRack: DeviceInRack[] = devicesData.map(device => {
                const deviceType = initialDeviceTypes.find(dt => dt.id === device.deviceTypeId);
                const deviceRole = initialDeviceRoles.find(dr => dr.id === device.deviceRoleId);
                return {
                    id: device.name,
                    name: device.name,
                    u: device.position || 0,
                    height: deviceType?.u_height || 1,
                    color: deviceRole?.color || 'bg-gray-600',
                    role: deviceRole?.name || 'Unknown',
                    rackId: rack.id,
                };
            }).filter(d => d.u > 0);

            return { ...rack, devices: devicesInRack };
        });
    }, [allRacks, allDevices]);

    const sites = useMemo(() => {
        const siteIdsWithRacks = new Set(allRacks.map(r => r.siteId));
        return initialSites.filter(site => siteIdsWithRacks.has(site.id));
    }, [allRacks]);
    
    const [selectedSiteId, setSelectedSiteId] = useState<string>('all');

    const filteredRacks = useMemo(() => {
        if (selectedSiteId === 'all') {
            return processedRacks;
        }
        return processedRacks.filter(r => r.siteId === selectedSiteId);
    }, [processedRacks, selectedSiteId]);

    const selectedSiteName = useMemo(() => {
        if (selectedSiteId === 'all') {
            return 'All Locations';
        }
        return sites.find(s => s.id === selectedSiteId)?.name || 'All Locations';
    }, [selectedSiteId, sites]);


    const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, device: DeviceInRack) => {
        event.dataTransfer.setData("application/json", JSON.stringify(device));
        event.dataTransfer.effectAllowed = "move";
    }, []);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>, targetRackId: string, targetUnit: number) => {
        event.preventDefault();
        const deviceToMoveJSON = event.dataTransfer.getData("application/json");
        if (!deviceToMoveJSON) return;
        
        const deviceToMove: DeviceInRack = JSON.parse(deviceToMoveJSON);
        
        if (deviceToMove.rackId === targetRackId && deviceToMove.u === targetUnit) return;

        const targetRack = processedRacks.find(r => r.id === targetRackId);
        if (!targetRack) return;

        const newDeviceUnits = Array.from({ length: deviceToMove.height }, (_, i) => targetUnit - i);
        
        if (newDeviceUnits.some(u => u < 1 || u > targetRack.u_height)) {
            toast({ title: "Move Failed", description: `Cannot place device outside of rack bounds (U1-${targetRack.u_height}).`, variant: "destructive" });
            return;
        }

        const otherDevicesInTargetRack = targetRack.devices.filter(d => d.id !== deviceToMove.id);
        const isOverlap = otherDevicesInTargetRack.some(existingDevice => {
            const existingDeviceUnits = Array.from({ length: existingDevice.height }, (_, i) => existingDevice.u - i);
            return newDeviceUnits.some(unit => existingDeviceUnits.includes(unit));
        });

        if (isOverlap) {
             toast({ title: "Move Failed", description: "Target location is occupied by another device.", variant: "destructive" });
             return;
        }

        setAllDevices(currentDevices => currentDevices.map(d => {
            if (d.name === deviceToMove.id) {
                return { ...d, rackId: targetRackId, position: targetUnit };
            }
            return d;
        }));
        
        toast({ title: "Device Moved", description: `${deviceToMove.name} moved to Rack ${targetRack.name}, Unit ${targetUnit}.` });

    }, [processedRacks, toast]);

    const handleOpenAddDeviceDialog = (rackId: string, unit: number) => {
        const rack = processedRacks.find(r => r.id === rackId);
        if (rack) {
            setNewDeviceLocation({ rackId, unit });
            setIsAddDeviceDialogOpen(true);
        }
    };

    function onAddDeviceSubmit(data: AddDeviceFormValues) {
        if (!newDeviceLocation) return;
        
        const deviceType = initialDeviceTypes.find(dt => dt.id === data.deviceTypeId);
        if (!deviceType) return;

        const targetRack = processedRacks.find(r => r.id === newDeviceLocation.rackId);
        if (!targetRack) return;

        const newDeviceUnits = Array.from({ length: deviceType.u_height }, (_, i) => newDeviceLocation.unit - i);

        if (newDeviceUnits.some(u => u < 1 || u > targetRack.u_height)) {
            toast({ title: "Error", description: "Device would exceed rack bounds.", variant: "destructive" });
            return;
        }

        const isOverlap = targetRack.devices.some(existingDevice => {
            const existingDeviceUnits = Array.from({ length: existingDevice.height }, (_, i) => existingDevice.u - i);
            return newDeviceUnits.some(unit => existingDeviceUnits.includes(unit));
        });

        if (isOverlap) {
            toast({ title: "Error", description: "Target location is occupied by another device.", variant: "destructive" });
            return;
        }

        const newDevice: DeviceType = {
            name: data.name,
            deviceRoleId: data.deviceRoleId,
            deviceTypeId: data.deviceTypeId,
            rackId: newDeviceLocation.rackId,
            position: newDeviceLocation.unit,
            siteId: targetRack.siteId,
            status: 'active',
            tags: [],
            assetTag: `AST-${Math.floor(Math.random() * 9000) + 1000}`,
            serial: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        };

        setAllDevices(prev => [...prev, newDevice]);
        toast({ title: "Device Added", description: `${newDevice.name} added to Rack ${targetRack.name}.` });
        setIsAddDeviceDialogOpen(false);
        form.reset();
    }


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Rack Elevations</CardTitle>
                    <CardDescription>Visualize and manage device placement in data center racks.</CardDescription>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <span>{selectedSiteName}</span>
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Site</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setSelectedSiteId('all')}>All Locations</DropdownMenuItem>
                        {sites.map(site => (
                            <DropdownMenuItem key={site.id} onSelect={() => setSelectedSiteId(site.id)}>
                                {site.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                 {filteredRacks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredRacks.map(rack => (
                            <Rack 
                                key={rack.id} 
                                rack={rack} 
                                onDragStart={handleDragStart} 
                                onDragOver={handleDragOver} 
                                onDrop={handleDrop}
                                onAddDevice={handleOpenAddDeviceDialog}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 rounded-md border border-dashed text-muted-foreground">
                        No racks found for this location.
                    </div>
                )}
            </CardContent>
        </Card>
        <Dialog open={isAddDeviceDialogOpen} onOpenChange={setIsAddDeviceDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                        Adding a new device to Rack {processedRacks.find(r => r.id === newDeviceLocation?.rackId)?.name} at Unit {newDeviceLocation?.unit}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAddDeviceSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Device Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., core-router-03" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deviceRoleId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {initialDeviceRoles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deviceTypeId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Device Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {initialDeviceTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                        {type.manufacturer} - {type.model} ({type.u_height}U)
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsAddDeviceDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Add Device</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
  )
}

  