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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22L6 18L3 13V7L5 2L8 5L12 4L16 5L19 2L21 7V13L18 18L12 22Z" />
      <path d="M12 4V9 M12 13V22" />
      <path d="M8 9V16 M16 9V16" />
      <path d="M8 9H16 M8 12H16 M8 16H16" />
      <path d="M8 9L4 10L8 12 M16 9L20 10L16 12" />
      <path d="M12 9L8 12 M12 9L16 12" />
      <path d="M12 13L8 12 M12 13L16 12" />
      <path d="M12 13L10.5 14.5L12 16L13.5 14.5L12 13Z" />
      <path d="M8 12L3 13L8 16 M16 12L21 13L16 16" />
      <path d="M8 16L6 18 M16 16L18 18" />
      <path d="M12 4L8 5L8 9 M12 4L16 5L16 9" />
      <path d="M8 5L5 2 M16 5L19 2" />
      <path d="M8 5L3 7 M16 5L21 7" />
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
