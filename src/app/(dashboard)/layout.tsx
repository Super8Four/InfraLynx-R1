import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { LifeBuoy } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { NavLinks } from "@/components/nav-links"
import { Button } from "@/components/ui/button"

const LynxIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 4.5L18 2" />
      <path d="M9.5 4.5L6 2" />
      <path d="M12 20c-4 0-6-2-6-6V9a6 6 0 016-6h0a6 6 0 016 6v5c0 4-2 6-6 6z" />
      <path d="M12 15a2 2 0 00-2 2" />
    </svg>
)

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
                <LynxIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span>InfraLynx</span>
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
