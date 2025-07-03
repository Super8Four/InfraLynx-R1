"use client"

import DeviceTopologyGraph from "@/components/device-topology-graph";
import type { Device, DeviceRole } from "@prisma/client";

interface TopologyClientPageProps {
  initialDevices: (Device & { deviceRole: DeviceRole | null })[];
}

export function TopologyClientPage({ initialDevices }: TopologyClientPageProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <DeviceTopologyGraph initialDevices={initialDevices} />
    </div>
  )
}
