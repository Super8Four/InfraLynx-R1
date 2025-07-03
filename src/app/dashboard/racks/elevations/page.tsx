
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


export default function RacksPage() {
    // Memoize the initial processing of data to avoid re-computation on every render
    const initialProcessedRacks = useMemo((): ProcessedRack[] => {
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
                    id: device.name, // Using name as a unique ID for this context
                    name: device.name,
                    u: device.position || 0,
                    height: deviceType?.u_height || 1,
                    color: deviceRole?.color || 'bg-gray-600',
                    role: deviceRole?.name || 'Unknown',
                    rackId: rack.id,
                };
            }).filter(d => d.u > 0); // Only include devices with a position

            return { ...rack, devices: devicesInRack };
        });
    }, []);

    const [racks, setRacks] = useState<ProcessedRack[]>(initialProcessedRacks);
    const sites = useMemo(() => initialSites.filter(site => racks.some(r => r.siteId === site.id)), [racks]);

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
            const newRacks = JSON.parse(JSON.stringify(currentRacks)) as ProcessedRack[];

            // Find and remove the device from its original rack
            const sourceRack = newRacks.find(r => r.id === deviceToMove.rackId);
            if (sourceRack) {
                sourceRack.devices = sourceRack.devices.filter(d => d.id !== deviceToMove.id);
            }

            // Find the target rack and add the device
            const targetRack = newRacks.find(r => r.id === targetRackId);
            if (targetRack) {
                // Update device properties
                deviceToMove.rackId = targetRackId;
                deviceToMove.u = targetUnit;
                targetRack.devices.push(deviceToMove);
            }

            return newRacks;
        });
    }, []);

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
