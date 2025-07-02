
"use client"

import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Device = {
  id: string;
  name: string;
};

type Connection = {
  from: string; // device id
  to: string;   // device id
};

// Mock data based on what's available in other parts of the app.
// In a real application, this would come from a central data source.
const devices: Device[] = [
  { id: 'core-sw-01', name: 'core-sw-01' },
  { id: 'edge-router-01', name: 'edge-router-01' },
  { id: 'access-sw-lobby', name: 'access-sw-lobby' },
  { id: 'server-vmhost-01', name: 'server-vmhost-01' },
  { id: 'firewall-corp', name: 'firewall-corp' },
];

const connections: Connection[] = [
  { from: 'edge-router-01', to: 'firewall-corp' },
  { from: 'firewall-corp', to: 'core-sw-01' },
  { from: 'core-sw-01', to: 'access-sw-lobby' },
  { from: 'core-sw-01', to: 'server-vmhost-01' },
  { from: 'core-sw-01', to: 'edge-router-01' },
];


const DeviceTopologyGraph: React.FC = () => {
    const width = 800;
    const height = 500;
    const nodeRadius = 35;

    const nodes = React.useMemo(() => {
        const numNodes = devices.length;
        const center = { x: width / 2, y: height / 2 };
        const radius = Math.min(width, height) / 2.5 - nodeRadius;
        return devices.map((device, i) => ({
            ...device,
            x: center.x + radius * Math.cos((2 * Math.PI * i) / numNodes),
            y: center.y + radius * Math.sin((2 * Math.PI * i) / numNodes),
        }));
    }, []);

    const nodeMap = React.useMemo(() => {
        const map = new Map<string, typeof nodes[0]>();
        nodes.forEach(node => map.set(node.id, node));
        return map;
    }, [nodes]);

    const edges = React.useMemo(() => {
        return connections.map(conn => {
            const fromNode = nodeMap.get(conn.from);
            const toNode = nodeMap.get(conn.to);
            if (!fromNode || !toNode) return null;
            return {
                id: `${conn.from}-${conn.to}`,
                x1: fromNode.x,
                y1: fromNode.y,
                x2: toNode.x,
                y2: toNode.y,
            };
        }).filter((edge): edge is NonNullable<typeof edge> => edge !== null);
    }, [connections, nodeMap]);

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
                {nodes.map(node => (
                    <Tooltip key={node.id}>
                        <TooltipTrigger asChild>
                             <g transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer group">
                                <circle
                                    r={nodeRadius}
                                    fill="hsl(var(--background))"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                    className="group-hover:stroke-blue-400 group-hover:stroke-[3px] transition-all"
                                />
                                <text
                                    textAnchor="middle"
                                    dy=".3em"
                                    fill="hsl(var(--foreground))"
                                    className="text-xs font-mono select-none pointer-events-none"
                                >
                                    {node.name.length > 12 ? `${node.name.slice(0,10)}...` : node.name}
                                </text>
                            </g>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold">{node.name}</p>
                            <p className="text-sm text-muted-foreground">Device</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </svg>
        </TooltipProvider>
    );
};

export default DeviceTopologyGraph;
