
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Edit, Server, Tv, Globe } from "lucide-react"

type IPAddress = {
  address: string;
  status: "active" | "reserved" | "dhcp" | "deprecated";
  assigned_object_type?: "device" | "vm" | "interface";
  assigned_object_id?: string;
  dns_name?: string;
  description?: string;
};

type Prefix = {
  prefix: string;
  status: "active" | "reserved" | "deprecated";
  site: string;
  description: string;
  tags: string[];
  usage: number;
  ips: IPAddress[];
};

const prefixes: Prefix[] = [
    {
        prefix: "10.1.1.0/24",
        status: "active",
        site: "Data Center A",
        description: "Core Server Segment",
        tags: ["core", "servers", "production"],
        usage: 40,
        ips: [
            { address: "10.1.1.1", status: "active", assigned_object_type: "device", assigned_object_id: "core-sw-01", dns_name: "core-sw-01.example.com", description: "Gateway" },
            { address: "10.1.1.10", status: "active", assigned_object_type: "vm", assigned_object_id: "web-server-01", dns_name: "web-server-01.example.com", description: "Primary Web Server" },
            { address: "10.1.1.11", status: "dhcp", assigned_object_type: "vm", assigned_object_id: "web-server-02" },
            { address: "10.1.1.254", status: "reserved", description: "Broadcast" },
        ],
    },
    {
        prefix: "192.168.10.0/24",
        status: "active",
        site: "Office Building 1",
        description: "Corporate User Desktops",
        tags: ["users", "corp"],
        usage: 85,
        ips: [
             { address: "192.168.10.55", status: "dhcp", assigned_object_type: "device", assigned_object_id: "jdoe-laptop", dns_name: "jdoe-laptop.corp.example.com" },
        ],
    },
    {
        prefix: "172.16.0.0/16",
        status: "deprecated",
        site: "Legacy DC",
        description: "Old Guest Network - To be removed",
        tags: ["legacy", "guest"],
        usage: 10,
        ips: [],
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
      case "reserved":
         return <Badge className="capitalize bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20">{status}</Badge>
      case "deprecated":
        return <Badge variant="destructive" className="capitalize">{status}</Badge>
      case "dhcp":
        return <Badge variant="secondary" className="capitalize">{status}</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

const getAssignedObjectIcon = (type?: "device" | "vm" | "interface") => {
    switch (type) {
        case 'device': return <Server className="h-4 w-4 text-muted-foreground" />;
        case 'vm': return <Tv className="h-4 w-4 text-muted-foreground" />;
        case 'interface': return <Globe className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
}


export default function IpamPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>IP Address Management (IPAM)</CardTitle>
                <CardDescription>Manage network prefixes, VLANs, and IP addresses.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Prefix
            </Button>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
            {prefixes.map((p) => (
                <AccordionItem value={p.prefix} key={p.prefix}>
                <AccordionTrigger className="hover:no-underline">
                    <div className="grid grid-cols-12 w-full items-center gap-4 pr-4 text-sm">
                        <div className="col-span-12 sm:col-span-3 font-mono text-left">{p.prefix}</div>
                        <div className="col-span-12 sm:col-span-3 text-left text-muted-foreground truncate">{p.description}</div>
                        <div className="col-span-6 md:col-span-2 text-left hidden md:block">{p.site}</div>
                        <div className="col-span-6 md:col-span-4 lg:col-span-2 hidden sm:block">
                            <div className="flex flex-wrap gap-1">
                                {p.tags.slice(0, 2).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                {p.tags.length > 2 && <Badge variant="outline">+{p.tags.length - 2}</Badge>}
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-2 flex items-center gap-2">
                            {getStatusBadge(p.status)}
                            <Progress value={p.usage} className="w-16 hidden lg:block" />
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-4 bg-muted/50 rounded-md">
                        {p.ips.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>DNS Name</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {p.ips.map((ip) => (
                                    <TableRow key={ip.address}>
                                        <TableCell className="font-mono">{ip.address}</TableCell>
                                        <TableCell>{getStatusBadge(ip.status)}</TableCell>
                                        <TableCell className="font-mono text-xs">{ip.dns_name || '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getAssignedObjectIcon(ip.assigned_object_type)}
                                                <span>{ip.assigned_object_id || '—'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{ip.description || '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                No IP addresses assigned in this prefix.
                            </div>
                        )}
                    </div>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
