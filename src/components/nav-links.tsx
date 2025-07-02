
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Server,
  HardDrive,
  Cable,
  Wifi,
  Network,
  ShieldCheck,
  Layers,
  CircuitBoard,
  Plug,
  PackageCheck,
  Settings2,
  GitMerge,
  GitBranch,
  UserCog,
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/organization", label: "Org", icon: Building2 },
  { href: "/racks", label: "Racks", icon: Server },
  { href: "/devices", label: "Devices", icon: HardDrive },
  { href: "/cabling", label: "Connections", icon: Cable },
  { href: "/wireless", label: "Wireless", icon: Wifi },
  { href: "/ipam", label: "IPAM", icon: Network },
  { href: "/vpn", label: "VPN", icon: ShieldCheck },
  { href: "/virtualization", label: "Virtualization", icon: Layers },
  { href: "/circuits", label: "Circuits", icon: CircuitBoard },
  { href: "/power", label: "Power", icon: Plug },
  { href: "/provisioning", label: "Provisioning", icon: PackageCheck },
  { href: "/operations", label: "Operations", icon: Settings2 },
  { href: "/topology", label: "Topology", icon: GitMerge },
  { href: "/branching", label: "Branching", icon: GitBranch },
  { href: "/admin", label: "Admin", icon: UserCog },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === item.href
            : pathname.startsWith(item.href)
        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
