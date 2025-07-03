
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, GitBranch, Check } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBranching } from "@/context/branching-context"
import { cn } from "@/lib/utils"
import { useSettings } from "@/context/settings-context"

export default function DashboardHeader() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const { settings } = useSettings()
  // useBranching might throw an error if branching is disabled, so we wrap it
  const branchingData = settings.isBranchingEnabled ? useBranching() : null
  
  const getBreadcrumbName = (segment: string) => {
    if (segment === "ipam") return "IPAM"
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <header className="relative sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
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
      <div className="relative ml-auto flex items-center gap-2">
         {settings.isBranchingEnabled && branchingData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                      <GitBranch className="h-3.5 w-3.5" />
                      <span>{branchingData.activeBranch}</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {branchingData.branches.map(branch => (
                      <DropdownMenuItem key={branch.id} onSelect={() => branchingData.setActiveBranch(branch.id)} disabled={branch.merged}>
                        <GitBranch className="mr-2 h-4 w-4" />
                        <span>{branch.name}</span>
                        {branchingData.activeBranch === branch.id && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                      <Link href="/branching">
                          Manage Branches
                      </Link>
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
         )}

        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search infrastructure..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <ThemeToggle />
      </div>

       {settings.isBranchingEnabled && branchingData?.activeBranch !== 'main' && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/80 animate-pulse" />
      )}
    </header>
  )
}
