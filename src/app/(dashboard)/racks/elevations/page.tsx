
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
} from "@/lib/data"
import type { DeviceInRack, ProcessedRack } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown } from "lucide-react"

export default function RacksPage() {
    const { toast } = useToast()
    const [racks, setRacks] = useState<ProcessedRack[]>(() => {
        const deviceMap = new Map<string, typeof initialDevices>();
        initialDevices.forEach(device => {
            if (device.rackId) {
                if (!deviceMap.has(device.rackId)) {
                    deviceMap.set(device.rackId, []);
                }
                deviceMap.get(device.rackId)!.push(device);
            }
        });

        return initialRacks.map(rack => {
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
    });

    const sites = useMemo(() => {
        const siteIdsWithRacks = new Set(racks.map(r => r.siteId));
        return initialSites.filter(site => siteIdsWithRacks.has(site.id));
    }, [racks]);
    
    const [selectedSiteId, setSelectedSiteId] = useState<string>('all');

    const filteredRacks = useMemo(() => {
        if (selectedSiteId === 'all') {
            return racks;
        }
        return racks.filter(r => r.siteId === selectedSiteId);
    }, [racks, selectedSiteId]);

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
        
        // Prevent dropping on itself if not changing position
        if(deviceToMove.rackId === targetRackId && deviceToMove.u === targetUnit) return;

        setRacks(currentRacks => {
            const targetRack = currentRacks.find(r => r.id === targetRackId);
            if (!targetRack) return currentRacks;

            // Check for conflicts in the target rack before making any changes
            const newDeviceUnits = Array.from({ length: deviceToMove.height }, (_, i) => targetUnit - i);
            
            // Check if device goes out of bounds
            if (newDeviceUnits.some(u => u < 1 || u > targetRack.u_height)) {
                toast({
                    title: "Move Failed",
                    description: `Cannot place device outside of rack bounds (U1-${targetRack.u_height}).`,
                    variant: "destructive",
                });
                return currentRacks;
            }

            const otherDevicesInTargetRack = targetRack.devices.filter(d => d.id !== deviceToMove.id);

            const isOverlap = otherDevicesInTargetRack.some(existingDevice => {
                const existingDeviceUnits = Array.from({ length: existingDevice.height }, (_, i) => existingDevice.u - i);
                return newDeviceUnits.some(unit => existingDeviceUnits.includes(unit));
            });

            if (isOverlap) {
                 toast({
                    title: "Move Failed",
                    description: "Target location is occupied by another device.",
                    variant: "destructive",
                });
                return currentRacks;
            }

            // If no conflicts, proceed with the state update
            const nextRacks = currentRacks.map(rack => {
                // Remove from source rack
                if (rack.id === deviceToMove.rackId) {
                    return {
                        ...rack,
                        devices: rack.devices.filter(d => d.id !== deviceToMove.id)
                    };
                }
                return rack;
            }).map(rack => {
                // Add to target rack
                if (rack.id === targetRackId) {
                    return {
                        ...rack,
                        devices: [
                            ...rack.devices,
                            { ...deviceToMove, u: targetUnit, rackId: targetRackId }
                        ]
                    };
                }
                return rack;
            });
            
            toast({
                title: "Device Moved",
                description: `${deviceToMove.name} moved to Rack ${targetRack.name}, Unit ${targetUnit}.`,
            });

            return nextRacks;
        });
    }, [toast]);

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
                            <Rack key={rack.id} rack={rack} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 rounded-md border border-dashed text-muted-foreground">
                        No racks found for this location.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  )
}
