"use client"

import {
  Cable,
  Network,
  Server,
  MoreVertical,
  CheckCircle,
} from "lucide-react"
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  initialDevices,
  prefixes,
  recentActivity,
} from "@/lib/data"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// --- Data Calculations ---

// Stats
const totalDevices = initialDevices.length
const onlineDevices = initialDevices.filter(d => d.status === "Online").length
const onlineDevicePercentage = totalDevices > 0 ? (onlineDevices / totalDevices) * 100 : 0

const totalPrefixes = prefixes.length
const activePrefixes = prefixes.filter(p => p.status === 'active').length

const totalIPs = prefixes.reduce((acc, p) => {
    const cidr = parseInt(p.prefix.split('/')[1], 10);
    return acc + Math.pow(2, 32 - cidr);
}, 0);
const assignedIPs = prefixes.reduce((acc, p) => acc + p.ips.length, 0);


// IP Usage Pie Chart
const ipStatusCounts = prefixes
  .flatMap(p => p.ips)
  .reduce((acc, ip) => {
    acc[ip.status] = (acc[ip.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

const ipUsageData = Object.entries(ipStatusCounts).map(([name, value]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  value,
  fill: `var(--color-${name})`,
}))

const ipUsageConfig = {
  active: { label: "Active", color: "hsl(var(--chart-1))" },
  dhcp: { label: "DHCP", color: "hsl(var(--chart-2))" },
  reserved: { label: "Reserved", color: "hsl(var(--chart-3))" },
  deprecated: { label: "Deprecated", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig


// Rack Capacity Chart (remains static for now)
const rackCapacityData = [
  { date: "2024-01", dc1: 65, dc2: 45 },
  { date: "2024-02", dc1: 70, dc2: 50 },
  { date: "2024-03", dc1: 72, dc2: 60 },
  { date: "2024-04", dc1: 78, dc2: 65 },
  { date: "2024-05", dc1: 82, dc2: 70 },
  { date: "2024-06", dc1: 85, dc2: 75 },
]

const rackCapacityConfig = {
  dc1: { label: "DC-1", color: "hsl(var(--chart-1))" },
  dc2: { label: "DC-2", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig


export default function DashboardPage() {
  const MOCK_STATS = [
    {
      title: "Total Devices",
      value: totalDevices.toLocaleString(),
      change: `${onlineDevices} Online`,
      icon: Server,
    },
    {
        title: "Device Health",
        value: `${onlineDevicePercentage.toFixed(1)}%`,
        change: "Online",
        icon: CheckCircle,
    },
    {
      title: "IPs Assigned",
      value: assignedIPs.toLocaleString(),
      change: `of ${totalIPs.toLocaleString()}`,
      icon: Network,
    },
    {
      title: "Active Prefixes",
      value: activePrefixes.toLocaleString(),
      change: `of ${totalPrefixes} total`,
      icon: Cable,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Rack Capacity Trend</CardTitle>
            <CardDescription>
              Monthly rack unit utilization across primary data centers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={rackCapacityConfig} className="h-[250px]">
              <LineChart data={rackCapacityData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="dc1"
                  type="monotone"
                  stroke="var(--color-dc1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="dc2"
                  type="monotone"
                  stroke="var(--color-dc2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>IP Address Usage</CardTitle>
            <CardDescription>
              Breakdown of assigned IPv4 addresses by status.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={ipUsageConfig} className="h-[250px]">
              <PieChart>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={ipUsageData} dataKey="value" nameKey="name" innerRadius={60}>
                   {ipUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest changes and actions across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">...</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>
                    <code className="font-mono">{activity.target}</code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        activity.status === "Success"
                          ? "default"
                          : "destructive"
                      }
                      className={activity.status === "Success" ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20" : ""}
                    >
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.time}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
