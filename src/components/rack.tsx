import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Device = {
  id: number
  name: string
  u: number
  height: number
  color: string
  role?: string
}

type RackProps = {
  id: string
  uHeight?: number
  devices?: Device[]
}

const DEFAULT_DEVICES: Device[] = [
  { id: 1, name: "Router-A1", u: 42, height: 1, color: "bg-blue-500" },
  { id: 2, name: "Switch-A1", u: 40, height: 2, color: "bg-green-500" },
  { id: 3, name: "Server-A101", u: 30, height: 2, color: "bg-yellow-500" },
  { id: 4, name: "Server-A102", u: 28, height: 2, color: "bg-yellow-500" },
  { id: 5, name: "PDU-L", u: 1, height: 10, color: "bg-gray-700" },
]

export default function Rack({
  id,
  uHeight = 42,
  devices = DEFAULT_DEVICES,
}: RackProps) {
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
        <CardTitle>{id}</CardTitle>
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
      </CardContent>
    </Card>
  )
}
