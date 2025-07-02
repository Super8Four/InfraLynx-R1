"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Cable, Network, Server, Router } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/racks", label: "Racks", icon: Server },
  { href: "/ipam", label: "IPAM", icon: Network },
  { href: "/cabling", label: "Cabling", icon: Cable },
  { href: "/devices", label: "Devices", icon: Router },
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
