import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Device = {
  id: number
  name: string
  u: number
  height: number
  color: string
  role?: string
}

type RackInfo = {
  id: string
  status: "active" | "planned" | "decommissioned"
  role: string
  devices: Device[]
  uHeight?: number
  comments?: string
}

type RackProps = {
  rack: RackInfo
}

const getStatusBadge = (status: RackInfo['status']) => {
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


export default function Rack({ rack }: RackProps) {
  const { id, uHeight = 42, devices, status, role, comments } = rack
  const units = Array.from({ length: uHeight }, (_, i) => uHeight - i)

  const mountedDevices = new Map<number, Device>()
  devices.forEach((device) => {
    for (let i = 0; i < device.height; i++) {
      mountedDevices.set(device.u - i, device)
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>{id}</CardTitle>
            {getStatusBadge(status)}
        </div>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          <div className="flex w-full flex-col-reverse">
            {units.map((u) => {
              const device = mountedDevices.get(u)
              if (device && device.u === u) {
                return (
                  <div
                    key={u}
                    className={cn(
                      "flex items-center justify-center text-white text-xs font-semibold border-x border-b border-border",
                      device.color
                    )}
                    style={{ height: `${device.height * 1.5}rem` }}
                  >
                    {device.name}
                  </div>
                )
              }
              if (device) {
                return null
              }
              return (
                <div
                  key={u}
                  className="h-6 border-b border-dashed border-border last:border-b-0"
                />
              )
            })}
          </div>
          <div className="flex flex-col-reverse text-xs text-muted-foreground">
            {units.map((u) => (
              <div key={u} className="flex h-6 items-center">
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
