
"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  initialVirtualChassis,
  initialDevices,
  type VirtualChassis,
} from "@/lib/data"

export default function VirtualChassisPage() {
  const [virtualChassis] = useState<VirtualChassis[]>(initialVirtualChassis)

  const getMasterDevice = (masterId: string) => {
    return initialDevices.find(d => d.name === masterId);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Virtual Chassis</CardTitle>
              <CardDescription>Manage groups of devices that act as a single logical unit.</CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Virtual Chassis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Master</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Members</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {virtualChassis.map((vc) => {
                const master = getMasterDevice(vc.masterId);
                return (
                  <TableRow key={vc.id}>
                    <TableCell className="font-medium">{vc.name}</TableCell>
                    <TableCell>{master?.name ?? 'N/A'}</TableCell>
                    <TableCell>{vc.domain}</TableCell>
                    <TableCell>{vc.memberIds.length}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Manage Members</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
