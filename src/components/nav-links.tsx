
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
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
  ChevronRight,
  Globe,
  Warehouse,
  MapPin,
  Users,
  Building,
  UserSquare,
  Group,
  Contact,
  ClipboardList,
  UserCheck,
  Tag,
  Package,
  Bookmark
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"


const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
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

const organizationLinks = {
  sites: [
    { href: "/organization/regions", label: "Regions", icon: Globe },
    { href: "/organization/site-groups", label: "Site Groups", icon: Warehouse },
    { href: "/organization/sites", label: "Sites", icon: Building },
    { href: "/organization/locations", label: "Locations", icon: MapPin },
  ],
  tenancy: [
    { href: "/organization/tenants", label: "Tenants", icon: Users },
    { href: "/organization/tenant-groups", label: "Tenant Groups", icon: Group },
  ],
  contacts: [
    { href: "/organization/contacts", label: "Contacts", icon: Contact },
    { href: "/organization/contact-groups", label: "Contact Groups", icon: UserSquare },
    { href: "/organization/contact-roles", label: "Contact Roles", icon: ClipboardList },
    { href: "/organization/contact-assignments", label: "Contact Assignments", icon: UserCheck },
  ],
};

const rackLinks = [
    { href: "/racks", label: "Racks", icon: Server },
    { href: "/racks/elevations", label: "Elevations", icon: Layers },
    { href: "/racks/roles", label: "Rack Roles", icon: Tag },
    { href: "/racks/types", label: "Rack Types", icon: Package },
    { href: "/racks/reservations", label: "Reservations", icon: Bookmark },
]


export function NavLinks() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = React.useState({
    organization: pathname.startsWith('/organization'),
    racks: pathname.startsWith('/racks'),
    sites: pathname.startsWith('/organization/'),
    tenancy: pathname.startsWith('/organization/'),
    contacts: pathname.startsWith('/organization/'),
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({...prev, [section]: !prev[section]}));
  }

  const NavLink = ({ href, label, icon: Icon, isSubItem = false }: { href: string; label: string; icon: React.ElementType; isSubItem?: boolean }) => {
    const isActive = pathname === href;
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} className={cn(isSubItem && "h-8 w-full justify-start pl-7 text-sm")}>
          <Link href={href}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenu>
       <NavLink href="/" label="Dashboard" icon={LayoutDashboard} />

      <Collapsible open={openSections.organization} onOpenChange={() => toggleSection('organization')}>
        <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
                <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Organization</span>
                </span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.organization && "rotate-90")} />
            </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 pt-1 space-y-1">
             <div className="font-semibold text-xs text-muted-foreground px-3 pt-2">SITES</div>
             {organizationLinks.sites.map(item => <NavLink key={item.label} {...item} isSubItem />)}

             <div className="font-semibold text-xs text-muted-foreground px-3 pt-2">TENANCY</div>
             {organizationLinks.tenancy.map(item => <NavLink key={item.label} {...item} isSubItem />)}

             <div className="font-semibold text-xs text-muted-foreground px-3 pt-2">CONTACTS</div>
             {organizationLinks.contacts.map(item => <NavLink key={item.label} {...item} isSubItem />)}
        </CollapsibleContent>
    </Collapsible>
    
    <Collapsible open={openSections.racks} onOpenChange={() => toggleSection('racks')}>
        <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
                <span className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>Racks</span>
                </span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSections.racks && "rotate-90")} />
            </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 pt-1 space-y-1">
            {rackLinks.map(item => <NavLink key={item.label} {...item} isSubItem />)}
        </CollapsibleContent>
    </Collapsible>


      {mainNavItems.slice(1).map((item) => {
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
