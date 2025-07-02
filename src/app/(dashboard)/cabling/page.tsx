"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Cable, Link, X, Zap, Wand2 } from "lucide-react"

type Port = {
  id: string
  name: string
  type: "RJ45" | "SFP+" | "Power"
  connectedTo?: string
}

type Device = {
  id: string
  name: string
  ports: Port[]
}

const initialDevices: Device[] = [
  {
    id: "device-a",
    name: "CORE-SW-01",
    ports: [
      { id: "a-1", name: "ge-0/0/0", type: "SFP+" },
      { id: "a-2", name: "ge-0/0/1", type: "SFP+" },
      { id: "a-3", name: "ge-0/0/2", type: "RJ45" },
      { id: "a-4", name: "ge-0/0/3", type: "RJ45" },
      { id: "a-5", name: "pwr-1", type: "Power" },
    ],
  },
  {
    id: "device-b",
    name: "ACCESS-SW-01",
    ports: [
      { id: "b-1", name: "ge-0/0/48", type: "SFP+" },
      { id: "b-2", name: "ge-0/0/49", type: "SFP+" },
      { id: "b-3", name: "ge-0/0/0", type: "RJ45" },
      { id: "b-4", name: "ge-0/0/1", type: "RJ45" },
      { id: "b-5", name: "pwr-1", type: "Power" },
    ],
  },
]

export default function CablingPage() {
  const { toast } = useToast()
  const [devices, setDevices] = useState(initialDevices)
  const [selectedPort, setSelectedPort] = useState<
    { deviceId: string; portId: string } | undefined
  >()

  const handlePortClick = (deviceId: string, portId: string) => {
    const device = devices.find(d => d.id === deviceId);
    const port = device?.ports.find(p => p.id === portId);

    if (port?.connectedTo) {
        toast({ title: "Port already connected", description: "Disconnect the cable first.", variant: "destructive" });
        return;
    }

    if (!selectedPort) {
      setSelectedPort({ deviceId, portId })
    } else {
      if (selectedPort.deviceId === deviceId && selectedPort.portId === portId) {
        setSelectedPort(undefined)
      } else {
        const sourceDevice = devices.find(d => d.id === selectedPort.deviceId)!;
        const sourcePort = sourceDevice.ports.find(p => p.id === selectedPort.portId)!;
        const targetDevice = devices.find(d => d.id === deviceId)!;
        const targetPort = targetDevice.ports.find(p => p.id === portId)!;

        if (sourcePort.type !== targetPort.type) {
            toast({ title: "Connection Error", description: "Ports must be of the same type.", variant: "destructive" });
            setSelectedPort(undefined);
            return;
        }

        setDevices(
          devices.map((d) => {
            if (d.id === sourceDevice.id) {
              d.ports.find((p) => p.id === sourcePort.id)!.connectedTo = `${targetDevice.name}:${targetPort.name}`
            }
            if (d.id === targetDevice.id) {
              d.ports.find((p) => p.id === targetPort.id)!.connectedTo = `${sourceDevice.name}:${sourcePort.name}`
            }
            return d
          })
        )
        toast({ title: "Cable Connected!", description: `${sourceDevice.name}:${sourcePort.name} <-> ${targetDevice.name}:${targetPort.name}` });
        setSelectedPort(undefined)
      }
    }
  }
  
  const handleAutoComplete = () => {
    toast({
        title: "AI Cable Completion",
        description: "Attempting to auto-complete cable based on historical data...",
    });
    // Simulate AI completion
    setTimeout(() => {
        handlePortClick("device-a", "a-1");
        setTimeout(() => handlePortClick("device-b", "b-1"), 100);
    }, 1000);
  }

  const renderPort = (device: Device, port: Port) => {
    const isSelected =
      selectedPort?.deviceId === device.id && selectedPort?.portId === port.id
    return (
      <div
        key={port.id}
        className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
      >
        <div className="flex items-center gap-2">
            {port.type === 'Power' ? <Zap className="h-4 w-4 text-yellow-500" /> : <Cable className="h-4 w-4 text-blue-500" />}
            <span className="font-mono text-sm">{port.name}</span>
        </div>
        <div className="flex items-center gap-2">
            {port.connectedTo && <span className="text-xs text-muted-foreground truncate max-w-[100px]">{port.connectedTo}</span>}
            <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                onClick={() => handlePortClick(device.id, port.id)}
            >
                {isSelected ? "Cancel" : port.connectedTo ? <X className="h-4 w-4" /> : <Link className="h-4 w-4" />}
            </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Cable Management</CardTitle>
                <CardDescription>
                Connect ports between devices. Select one port, then another to create a connection.
                </CardDescription>
            </div>
            <Button onClick={handleAutoComplete}>
                <Wand2 className="mr-2 h-4 w-4" />
                Auto-complete Cable
            </Button>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardHeader>
              <CardTitle>{device.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h4 className="font-semibold text-sm">Data Ports</h4>
              {device.ports.filter(p => p.type !== 'Power').map(port => renderPort(device, port))}
              <Separator className="my-4" />
              <h4 className="font-semibold text-sm">Power Ports</h4>
              {device.ports.filter(p => p.type === 'Power').map(port => renderPort(device, port))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
