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
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
            <BreadcrumbItem>
                {pathname === '/' ? (
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                ) : (
                    <BreadcrumbLink asChild>
                        <Link href="/">Dashboard</Link>
                    </BreadcrumbLink>
                )}
            </BreadcrumbItem>
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
