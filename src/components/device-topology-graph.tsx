"use client"

import * as React from "react"
import {
  Server,
  Shield,
  Network,
  Router as RouterIcon,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Device as DeviceData, DeviceRole } from "@prisma/client"

type DeviceNode = {
  id: string
  name: string
  role: string
  x: number
  y: number
}

type Connection = {
  from: string // device name
  to: string // device name
}

// Hardcoded connections for visualization purposes.
// In a real app, this would be derived from interface connections.
const connections: Connection[] = [
  { from: "core-sw-01", to: "edge-router-01" },
  { from: "core-sw-01", to: "core-sw-02" },
  { from: "core-sw-01", to: "server-vmhost-01" },
  { from: "core-sw-01", to: "firewall-corp" },
  { from: "firewall-corp", to: "edge-router-01" },
  { from: "access-sw-lobby", to: "core-sw-01" }, // Assuming this connects back to core
]

interface DeviceTopologyGraphProps {
  initialDevices: (DeviceData & { deviceRole: DeviceRole | null })[];
}

const DeviceIcon = ({ role }: { role: string }) => {
  const iconProps = { className: "h-6 w-6 text-primary" }

  if (!role) {
    return <Server {...iconProps} className="h-6 w-6 text-muted-foreground" />
  }

  const lowerCaseRole = role.toLowerCase();

  if (lowerCaseRole.includes("switch")) {
    return <Network {...iconProps} />
  }
  if (lowerCaseRole.includes("router")) {
    return <RouterIcon {...iconProps} />
  }
  if (lowerCaseRole.includes("firewall")) {
    return <Shield {...iconProps} />
  }
  if (
    lowerCaseRole.includes("server") ||
    lowerCaseRole.includes("host")
  ) {
    return <Server {...iconProps} />
  }
  return <Server {...iconProps} className="h-6 w-6 text-muted-foreground" />
}

const DeviceTopologyGraph: React.FC<DeviceTopologyGraphProps> = ({ initialDevices }) => {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = React.useState<DeviceNode[]>([])
  const [draggedNode, setDraggedNode] = React.useState<{ id: string; offsetX: number; offsetY: number } | null>(null)
  
  const width = 800
  const height = 500
  const nodeRadius = 45

  const initialDeviceData = React.useMemo(() => {
    const connectedDeviceIds = new Set(connections.flatMap((c) => [c.from, c.to]))
    return initialDevices
      .filter((d) => d.name && connectedDeviceIds.has(d.name))
      .map((d) => ({
        id: d.name!,
        name: d.name!,
        role: d.deviceRole?.name ?? "Unknown",
      }))
  }, [initialDevices])

  React.useEffect(() => {
    const numNodes = initialDeviceData.length
    if (numNodes === 0) return
    const center = { x: width / 2, y: height / 2 }
    const radius = Math.min(width, height) / 2.5 - nodeRadius
    setNodes(initialDeviceData.map((device, i) => ({
      ...device,
      x: center.x + radius * Math.cos((2 * Math.PI * i) / numNodes),
      y: center.y + radius * Math.sin((2 * Math.PI * i) / numNodes),
    })))
  }, [initialDeviceData]);

  const nodeMap = React.useMemo(() => {
    const map = new Map<string, DeviceNode>()
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
  }, [nodeMap])

  const getPointFromEvent = (event: React.MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    return { x: svgPoint.x, y: svgPoint.y }
  }

  const handleMouseDown = (event: React.MouseEvent, nodeId: string) => {
    event.preventDefault()
    const node = nodeMap.get(nodeId)
    if (!node) return
    const point = getPointFromEvent(event)
    setDraggedNode({ 
        id: nodeId, 
        offsetX: node.x - point.x,
        offsetY: node.y - point.y
    })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggedNode) return
    event.preventDefault()
    const point = getPointFromEvent(event)
    setNodes(nodes.map(n => 
        n.id === draggedNode.id 
        ? { ...n, x: point.x + draggedNode.offsetX, y: point.y + draggedNode.offsetY } 
        : n
    ))
  }

  const handleMouseUp = (event: React.MouseEvent) => {
    event.preventDefault()
    setDraggedNode(null)
  }

  const handleMouseLeave = (event: React.MouseEvent) => {
    event.preventDefault()
    setDraggedNode(null)
  }

  return (
    <TooltipProvider>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("w-full h-auto", draggedNode ? 'cursor-grabbing' : '')}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
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
          <Tooltip key={node.id} open={draggedNode ? false : undefined}>
            <TooltipTrigger asChild>
              <g
                transform={`translate(${node.x}, ${node.y})`}
                className={cn("group", draggedNode ? 'cursor-grabbing' : 'cursor-grab')}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
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
                  className="pointer-events-none"
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="flex flex-col items-center justify-center h-full w-full p-1 text-center"
                  >
                    <DeviceIcon role={node.role} />
                    <span className="text-[10px] font-mono select-none mt-1 leading-tight block w-full truncate">
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
