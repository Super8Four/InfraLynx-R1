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
import { PlusCircle, Edit, MoreVertical } from "lucide-react"

const prefixes = [
  {
    prefix: "10.1.0.0/16",
    vlan: "Servers",
    status: "Active",
    usage: 60,
    ips: [
      { ip: "10.1.1.1", status: "Active", type: "DHCP", device: "server-01" },
      { ip: "10.1.1.2", status: "Active", type: "Static", device: "firewall-01" },
      { ip: "10.1.1.254", status: "Reserved", type: "Gateway", device: "core-sw-01" },
    ],
  },
  {
    prefix: "192.168.1.0/24",
    vlan: "Corporate Wifi",
    status: "Active",
    usage: 85,
    ips: [
      { ip: "192.168.1.100", status: "Active", type: "DHCP", device: "laptop-jdoe" },
    ],
  },
    {
    prefix: "172.16.0.0/12",
    vlan: "Guest Network",
    status: "Deprecated",
    usage: 20,
    ips: [],
  },
]

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
                <AccordionTrigger>
                    <div className="flex w-full items-center gap-4 pr-4">
                        <div className="flex-1 text-left font-mono">{p.prefix}</div>
                        <div className="flex-1 text-left hidden sm:block">{p.vlan}</div>
                        <div className="flex-1 text-left hidden md:block">
                            <Badge variant={p.status === 'Active' ? 'default' : 'outline'}>{p.status}</Badge>
                        </div>
                        <div className="w-32 hidden lg:block">
                            <Progress value={p.usage} />
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-4 bg-muted/50 rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Device</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {p.ips.length > 0 ? p.ips.map((ip) => (
                            <TableRow key={ip.ip}>
                                <TableCell className="font-mono">{ip.ip}</TableCell>
                                <TableCell><Badge variant={ip.status === 'Active' ? 'default' : 'outline'} className={ip.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20' : ''}>{ip.status}</Badge></TableCell>
                                <TableCell>{ip.type}</TableCell>
                                <TableCell>{ip.device}</TableCell>
                                <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">No IP addresses assigned in this prefix.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        </Table>
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
