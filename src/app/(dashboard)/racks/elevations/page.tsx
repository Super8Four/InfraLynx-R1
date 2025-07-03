
"use client"

import { useState, useMemo, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Rack from "@/components/rack"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    initialRacks, 
    initialDevices, 
    initialSites, 
    initialDeviceTypes, 
    initialDeviceRoles, 
} from "@/lib/data"
import type { DeviceInRack, ProcessedRack } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"


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
        <CardHeader>
            <CardTitle>Rack Elevations</CardTitle>
            <CardDescription>Visualize and manage device placement in data center racks.</CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:w-auto">
          <TabsTrigger value="all">All Locations</TabsTrigger>
          {sites.map(site => (
              <TabsTrigger key={site.id} value={site.id}>{site.name}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {racks.map(rack => <Rack key={rack.id} rack={rack} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />)}
          </div>
        </TabsContent>

        {sites.map(site => (
            <TabsContent key={site.id} value={site.id} className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {racks.filter(r => r.siteId === site.id).map(rack => (
                        <Rack key={rack.id} rack={rack} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
                    ))}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
