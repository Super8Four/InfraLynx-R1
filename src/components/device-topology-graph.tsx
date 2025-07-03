"use client"

import * as React from "react"
import {
  Server,
  Shield,
  Switch,
  Router as RouterIcon,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { initialDevices as allDevices } from "@/lib/data"

type Device = {
  id: string
  name: string
  role: string
}

type Connection = {
  from: string // device id
  to: string // device id
}

// Hardcoded connections for visualization purposes.
const connections: Connection[] = [
  { from: "edge-router-01", to: "firewall-corp" },
  { from: "firewall-corp", to: "core-sw-01" },
  { from: "core-sw-01", to: "access-sw-lobby" },
  { from: "core-sw-01", to: "server-vmhost-01" },
  { from: "core-sw-01", to: "edge-router-01" },
]

// Dynamically create the list of devices for the graph from the connections list
const connectedDeviceIds = new Set(connections.flatMap((c) => [c.from, c.to]))
const devices: Device[] = allDevices
  .filter((d) => connectedDeviceIds.has(d.name))
  .map((d) => ({
    id: d.name,
    name: d.name,
    role: d.role,
  }))

const DeviceIcon = ({ role }: { role: string }) => {
  const iconProps = { className: "h-6 w-6 text-primary" }

  if (role.toLowerCase().includes("switch")) {
    return <Switch {...iconProps} />
  }
  if (role.toLowerCase().includes("router")) {
    return <RouterIcon {...iconProps} />
  }
  if (role.toLowerCase().includes("firewall")) {
    return <Shield {...iconProps} />
  }
  if (
    role.toLowerCase().includes("server") ||
    role.toLowerCase().includes("host")
  ) {
    return <Server {...iconProps} />
  }
  // Default icon for unknown roles
  return <Server {...iconProps} className="h-6 w-6 text-muted-foreground" />
}

const DeviceTopologyGraph: React.FC = () => {
  const width = 800
  const height = 500
  const nodeRadius = 45 // increased radius for icon and text

  const nodes = React.useMemo(() => {
    const numNodes = devices.length
    if (numNodes === 0) return []
    const center = { x: width / 2, y: height / 2 }
    const radius = Math.min(width, height) / 2.5 - nodeRadius
    return devices.map((device, i) => ({
      ...device,
      x: center.x + radius * Math.cos((2 * Math.PI * i) / numNodes),
      y: center.y + radius * Math.sin((2 * Math.PI * i) / numNodes),
    }))
  }, [])

  const nodeMap = React.useMemo(() => {
    const map = new Map<string, (typeof nodes)[0]>()
    nodes.forEach((node) => map.set(node.id, node))
    return map
  }, [nodes])

  const edges = React.useMemo(() => {
    return connections
      .map((conn) => {
        const fromNode = nodeMap.get(conn.from)
        const toNode = nodeMap.get(conn.to)
        if (!fromNode || !toNode) return null
        return {
          id: `${conn.from}-${conn.to}`,
          x1: fromNode.x,
          y1: fromNode.y,
          x2: toNode.x,
          y2: toNode.y,
        }
      })
      .filter((edge): edge is NonNullable<typeof edge> => edge !== null)
  }, [connections, nodeMap])

  return (
    <TooltipProvider>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Render Edges */}
        {edges.map((edge) => (
          <line
            key={edge.id}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
          />
        ))}

        {/* Render Nodes */}
        {nodes.map((node) => (
          <Tooltip key={node.id}>
            <TooltipTrigger asChild>
              <g
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
              >
                <circle
                  r={nodeRadius}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1.5"
                  className="group-hover:stroke-primary group-hover:stroke-[2.5px] transition-all"
                />
                <foreignObject
                  x={-nodeRadius}
                  y={-nodeRadius}
                  width={nodeRadius * 2}
                  height={nodeRadius * 2}
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="flex flex-col items-center justify-center h-full w-full p-1 text-center"
                  >
                    <DeviceIcon role={node.role} />
                    <span className="text-[10px] font-mono select-none pointer-events-none mt-1 leading-tight block w-full truncate">
                      {node.name}
                    </span>
                  </div>
                </foreignObject>
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{node.name}</p>
              <p className="text-sm text-muted-foreground">{node.role}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </svg>
    </TooltipProvider>
  )
}

export default DeviceTopologyGraph
