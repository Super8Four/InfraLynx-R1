import {
  MoreHorizontal,
  PlusCircle,
  File,
  ListFilter,
  Search,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const devices = [
  {
    name: "core-sw-01",
    manufacturer: "Juniper",
    model: "QFX5120",
    status: "Online",
    role: "Core Switch",
    site: "Data Center A",
    ip: "10.1.1.2",
    tags: ["core", "critical"],
  },
  {
    name: "edge-router-01",
    manufacturer: "Cisco",
    model: "ASR1001-X",
    status: "Online",
    role: "Edge Router",
    site: "Data Center A",
    ip: "192.0.2.1",
    tags: ["edge", "critical"],
  },
  {
    name: "access-sw-lobby",
    manufacturer: "Arista",
    model: "720XP",
    status: "Offline",
    role: "Access Switch",
    site: "Office Building 1",
    ip: "10.10.20.5",
    tags: ["access", "users"],
  },
  {
    name: "server-vmhost-01",
    manufacturer: "Dell",
    model: "PowerEdge R740",
    status: "Online",
    role: "Virtualization Host",
    site: "Data Center B",
    ip: "10.2.5.10",
    tags: ["compute", "vmware"],
  },
  {
    name: "firewall-corp",
    manufacturer: "Palo Alto",
    model: "PA-3220",
    status: "Provisioning",
    role: "Firewall",
    site: "Data Center A",
    ip: "10.1.1.1",
    tags: ["security"],
  },
]

export default function DevicesPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Online":
        return <Badge className="bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
      case "Offline":
        return <Badge variant="destructive">{status}</Badge>
      case "Provisioning":
        return <Badge className="bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>
          A comprehensive list of all infrastructure devices.
        </CardDescription>
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter devices..." className="pl-8 w-64"/>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Online
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Offline</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Provisioning
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-9 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-9 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Device
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Manufacturer</TableHead>
              <TableHead className="hidden md:table-cell">Model</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Site</TableHead>
              <TableHead className="hidden lg:table-cell">Primary IP</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.name}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{getStatusBadge(device.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{device.manufacturer}</TableCell>
                <TableCell className="hidden md:table-cell">{device.model}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {device.role}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {device.site}
                </TableCell>
                <TableCell className="hidden lg:table-cell font-mono">
                  {device.ip}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {device.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Interfaces</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
