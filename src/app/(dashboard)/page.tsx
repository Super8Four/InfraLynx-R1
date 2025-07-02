"use client"

import {
  Activity,
  Cable,
  Network,
  Server,
  MoreVertical,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

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

const MOCK_STATS = [
  {
    title: "Total Devices",
    value: "1,234",
    change: "+5.1%",
    icon: Server,
  },
  {
    title: "Racks Utilized",
    value: "452",
    change: "+12.3%",
    icon: Server,
  },
  {
    title: "IPs Assigned",
    value: "10,890",
    change: "+2.8%",
    icon: Network,
  },
  {
    title: "Active Circuits",
    value: "78",
    change: "-1.2%",
    icon: Cable,
  },
]

const ipUsageData = [
  { name: "DHCP", value: 4567, fill: "var(--color-dhcp)" },
  { name: "Static", value: 3456, fill: "var(--color-static)" },
  { name: "Reserved", value: 2867, fill: "var(--color-reserved)" },
  { name: "Available", value: 8910, fill: "var(--color-available)" },
]
const ipUsageConfig = {
  dhcp: { label: "DHCP", color: "hsl(var(--chart-1))" },
  static: { label: "Static", color: "hsl(var(--chart-2))" },
  reserved: { label: "Reserved", color: "hsl(var(--chart-3))" },
  available: { label: "Available", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

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

const recentActivity = [
  {
    id: 1,
    user: "admin",
    action: "add_device",
    target: "edge-router-01",
    status: "Success",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "jdoe",
    action: "patch_cable",
    target: "core-sw-01:ge-0/0/1",
    status: "Success",
    time: "5 hours ago",
  },
  {
    id: 3,
    user: "automation",
    action: "update_ip",
    target: "10.1.1.15",
    status: "Success",
    time: "1 day ago",
  },
  {
    id: 4,
    user: "admin",
    action: "add_vlan",
    target: "VLAN 100",
    status: "Failed",
    time: "2 days ago",
  },
]

export default function DashboardPage() {
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
              Breakdown of assigned IPv4 addresses.
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
