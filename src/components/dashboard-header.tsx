"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

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

export default function DashboardHeader() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  
  const getBreadcrumbName = (segment: string) => {
    if (segment === "ipam") return "IPAM"
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <SidebarTrigger className="md:hidden" />
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <div className="rounded-lg bg-primary p-2">
          <LynxIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="hidden sm:inline-block">InfraLynx</span>
      </Link>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join('/')}`
            const isLast = index === segments.length - 1
            return (
              <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{getBreadcrumbName(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{getBreadcrumbName(segment)}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search infrastructure..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <ThemeToggle />
    </header>
  )
}
