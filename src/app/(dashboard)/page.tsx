
"use client"

import Link from "next/link"
import {
  Cable,
  Network,
  Server,
  MoreVertical,
  CheckCircle,
  GitBranch,
  ArrowRight,
} from "lucide-react"
import {
  Pie,
  PieChart,
  Tooltip,
  Cell,
} from "recharts"
import {
  initialDevices,
  prefixes,
  recentActivity,
} from "@/lib/data"
import { useBranching } from "@/context/branching-context"
import BranchGraph from "@/components/branch-graph"

import {
  Card,
  CardContent,
  CardDescription,
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
const onlineDevices = initialDevices.filter(d => d.status === "active").length
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


export default function DashboardPage() {
  const { branches, commits, activeBranch, setActiveBranch } = useBranching()
  const activeBranches = branches.filter(b => !b.merged && b.name !== 'main')
  const recentCommits = commits.slice(0, 15)

  const STATS = [
    {
      title: "Total Devices",
      value: totalDevices.toLocaleString(),
      change: `${onlineDevices} Active`,
      icon: Server,
      href: "/devices"
    },
    {
        title: "Device Health",
        value: `${onlineDevicePercentage.toFixed(1)}%`,
        change: "Active",
        icon: CheckCircle,
        href: "/devices"
    },
    {
      title: "IPs Assigned",
      value: assignedIPs.toLocaleString(),
      change: `of ${totalIPs.toLocaleString()}`,
      icon: Network,
      href: "/ipam"
    },
    {
      title: "Active Prefixes",
      value: activePrefixes.toLocaleString(),
      change: `of ${totalPrefixes} total`,
      icon: Cable,
      href: "/ipam"
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="hover:bg-muted/50 transition-colors">
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
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                <CardTitle>Branching Overview</CardTitle>
                <CardDescription>
                    {activeBranches.length} active feature branches.
                </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/branching">
                        Manage Branches
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {activeBranches.length > 0 ? (
                        activeBranches.map(branch => (
                            <button key={branch.id} onClick={() => setActiveBranch(branch.id)} className="w-full text-left">
                                <div className="p-2 rounded-md hover:bg-muted flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GitBranch className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm">{branch.name}</span>
                                        <Badge variant="secondary">from '{branch.from}'</Badge>
                                    </div>
                                    {activeBranch === branch.id && <Badge variant="default">Active</Badge>}
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground px-2">No active feature branches.</p>
                    )}
                </div>
                <div className="border-t pt-4">
                    <BranchGraph branches={branches} commits={recentCommits} activeBranch={activeBranch} />
                </div>
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
