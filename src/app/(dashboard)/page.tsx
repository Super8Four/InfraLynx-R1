
"use client"

import Link from "next/link"
import * as React from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import {
  Cable,
  Network,
  Server,
  MoreVertical,
  CheckCircle,
  GitBranch,
  ArrowRight,
  Move,
} from "lucide-react"
import {
  Pie,
  PieChart,
  Tooltip,
  Cell,
} from "recharts"
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
import { useSettings } from "@/context/settings-context"

const ResponsiveGridLayout = WidthProvider(Responsive)

// This is mock data, in a real app this would be fetched from a DB
// and likely would be more complex to represent activity.
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
];

// IP Usage Pie Chart data would be calculated from DB query
const ipUsageData = [
    { name: 'Active', value: 4, fill: 'var(--color-active)' },
    { name: 'DHCP', value: 2, fill: 'var(--color-dhcp)' },
    { name: 'Reserved', value: 1, fill: 'var(--color-reserved)' },
];

const ipUsageConfig = {
  active: { label: "Active", color: "hsl(var(--chart-1))" },
  dhcp: { label: "DHCP", color: "hsl(var(--chart-2))" },
  reserved: { label: "Reserved", color: "hsl(var(--chart-3))" },
  deprecated: { label: "Deprecated", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

function BranchingWidget() {
  const { branches, commits, activeBranch, setActiveBranch } = useBranching()
  const activeBranches = branches.filter(b => !b.merged && b.name !== 'main')
  const recentCommits = commits.slice(0, 15)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between relative">
        <div className="drag-handle cursor-move absolute top-2 right-2 p-1 text-muted-foreground"><Move className="h-4 w-4" /></div>
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
      <CardContent className="space-y-4 flex-1 flex flex-col">
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
        <div className="border-t pt-4 flex-1">
          <BranchGraph branches={branches} commits={recentCommits} activeBranch={activeBranch} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { settings } = useSettings()

  // In a real app, these stats would come from props passed by a server component
  const STATS = [
    {
      title: "Total Devices",
      value: "6", // Example value
      change: `5 Active`,
      icon: Server,
      href: "/devices"
    },
    {
        title: "Device Health",
        value: `83.3%`, // Example value
        change: "Active",
        icon: CheckCircle,
        href: "/devices"
    },
    {
      title: "IPs Assigned",
      value: "5", // Example value
      change: `of 512 total`,
      icon: Network,
      href: "/ipam"
    },
    {
      title: "Active Prefixes",
      value: "2", // Example value
      change: `of 3 total`,
      icon: Cable,
      href: "/ipam"
    },
  ]

  const layouts = {
    lg: settings.isBranchingEnabled
      ? [
          { i: "stats", x: 0, y: 0, w: 12, h: 1, isResizable: false },
          { i: "branching", x: 0, y: 1, w: 7, h: 4 },
          { i: "ip-usage", x: 7, y: 1, w: 5, h: 4 },
          { i: "activity", x: 0, y: 5, w: 12, h: 4 },
        ]
      : [
          { i: "stats", x: 0, y: 0, w: 12, h: 1, isResizable: false },
          { i: "ip-usage", x: 0, y: 1, w: 6, h: 4 },
          { i: "activity", x: 6, y: 1, w: 6, h: 4 },
        ],
  }

  return (
    <ResponsiveGridLayout
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={95}
      draggableHandle=".drag-handle"
    >
      <div key="stats">
        <Card className="h-full flex flex-col">
          <CardHeader className="relative pb-2">
            <div className="drag-handle cursor-move absolute top-2 right-2 p-1 text-muted-foreground"><Move className="h-4 w-4" /></div>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-full">
              {STATS.map((stat) => (
                <Link href={stat.href} key={stat.title}>
                  <Card className="hover:bg-muted/50 transition-colors h-full">
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
          </CardContent>
        </Card>
      </div>

      {settings.isBranchingEnabled && (
        <div key="branching">
          <BranchingWidget />
        </div>
      )}

      <div key="ip-usage">
        <Card className="h-full flex flex-col">
          <CardHeader className="relative">
            <div className="drag-handle cursor-move absolute top-2 right-2 p-1 text-muted-foreground"><Move className="h-4 w-4" /></div>
            <CardTitle>IP Address Usage</CardTitle>
            <CardDescription>
              Breakdown of assigned IPv4 addresses by status.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center flex-1 items-center">
            <ChartContainer config={ipUsageConfig} className="h-[250px] w-full">
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

      <div key="activity">
        <Card className="h-full flex flex-col">
          <CardHeader className="relative">
            <div className="drag-handle cursor-move absolute top-2 right-2 p-1 text-muted-foreground"><Move className="h-4 w-4" /></div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes and actions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
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
    </ResponsiveGridLayout>
  )
}
