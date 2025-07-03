
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ProcessedRack, DeviceInRack } from "@/lib/types"

type RackProps = {
  rack: ProcessedRack
  onDragStart: (event: React.DragEvent<HTMLDivElement>, device: DeviceInRack) => void
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>, rackId: string, unit: number) => void
}

const getStatusBadge = (status: ProcessedRack['status']) => {
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

export default function Rack({ rack, onDragStart, onDragOver, onDrop }: RackProps) {
  const { id, u_height = 42, devices, status, name, roleId, comments } = rack
  const units = Array.from({ length: u_height }, (_, i) => u_height - i)

  const mountedDevices = new Map<number, DeviceInRack>()
  devices.forEach((device) => {
    for (let i = 0; i < device.height; i++) {
      mountedDevices.set(device.u - i, device)
    }
  })

  return (
    <Card 
        onDrop={(e) => onDrop(e, id, 0)} // Fallback drop on the card itself (less precise)
        onDragOver={onDragOver}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>{name}</CardTitle>
            {getStatusBadge(status)}
        </div>
        <CardDescription>{roleId || 'No role assigned'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex bg-muted/30 dark:bg-slate-900/50 p-2 rounded-md">
            {/* Unit Numbers (Left) */}
            <div className="flex flex-col-reverse text-xs text-center font-mono text-muted-foreground w-6 pr-2">
                {units.map((u) => (
                    <div key={`num-l-${u}`} className="flex h-6 items-center justify-center border-b border-transparent">
                        {u}
                    </div>
                ))}
            </div>
            
            {/* Rack Body */}
            <div className="flex-1 border-x-2 border-slate-700 dark:border-slate-400 bg-background flex flex-col-reverse">
                {units.map((u) => {
                    const device = mountedDevices.get(u);
                    if (device && device.u === u) {
                        return (
                            <div
                                key={`${device.id}-${u}`}
                                draggable
                                onDragStart={(e) => onDragStart(e, device)}
                                onDrop={(e) => { e.stopPropagation(); onDrop(e, id, u); }}
                                onDragOver={onDragOver}
                                className={cn(
                                    "flex items-center justify-center text-white text-xs font-semibold border-y border-border cursor-move",
                                    device.color
                                )}
                                style={{ height: `${device.height * 1.5}rem` }} // 1.5rem = h-6
                            >
                                <span className="truncate px-1">{device.name}</span>
                            </div>
                        );
                    }
                    if (device) return null; // This is a unit covered by a multi-U device
                    return (
                        <div
                            key={`empty-${u}`}
                            onDrop={(e) => { e.stopPropagation(); onDrop(e, id, u); }}
                            onDragOver={onDragOver}
                            className="h-6 border-b border-dashed border-border/50 last:border-b-0 hover:bg-primary/10"
                        />
                    );
                })}
            </div>
            
            {/* Unit Numbers (Right) */}
            <div className="flex flex-col-reverse text-xs text-center font-mono text-muted-foreground w-6 pl-2">
                {units.map((u) => (
                    <div key={`num-r-${u}`} className="flex h-6 items-center justify-center border-b border-transparent">
                        {u}
                    </div>
                ))}
            </div>
        </div>
        {comments && <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">{comments}</p>}
      </CardContent>
    </Card>
  )
}
