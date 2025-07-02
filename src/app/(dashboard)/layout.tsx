import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { LifeBuoy, Network } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { NavLinks } from "@/components/nav-links"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex h-full flex-col">
          <SidebarHeader>
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <div className="rounded-lg bg-primary p-2">
                <Network className="h-6 w-6 text-primary-foreground" />
              </div>
              <span>InfraWeb</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <NavLinks />
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LifeBuoy className="h-4 w-4" />
              <span>Support</span>
            </Button>
          </SidebarFooter>
        </div>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto bg-muted/30 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
