
"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { initialRackReservations, initialRacks, initialTenants, type RackReservation } from "@/lib/data"
import { Textarea } from "@/components/ui/textarea"

const reservationSchema = z.object({
  rackId: z.string().min(1, "A rack must be selected"),
  units: z.string().min(1, "At least one unit must be specified"),
  tenantId: z.string().min(1, "A tenant must be selected"),
  description: z.string().min(1, "Description is required"),
})

type ReservationFormValues = z.infer<typeof reservationSchema>

export default function RackReservationsPage() {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<RackReservation[]>(initialRackReservations)
  const [racks] = useState(initialRacks)
  const [tenants] = useState(initialTenants)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      rackId: "",
      units: "",
      tenantId: "",
      description: "",
    },
  })

  function onSubmit(data: ReservationFormValues) {
    const newReservation: RackReservation = {
      id: `res-${Date.now()}`,
      rackId: data.rackId,
      tenantId: data.tenantId,
      description: data.description,
      units: data.units.split(',').map(u => parseInt(u.trim(), 10)).filter(u => !isNaN(u)),
    }
    setReservations((prev) => [...prev, newReservation])
    toast({ title: "Success", description: "Rack reservation has been created." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id))
    toast({ title: "Success", description: "Reservation has been deleted." })
  }
  
  const getRackName = (rackId: string) => racks.find(r => r.id === rackId)?.name ?? 'N/A'
  const getTenantName = (tenantId: string) => tenants.find(t => t.id === tenantId)?.name ?? 'N/A'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rack Reservations</CardTitle>
              <CardDescription>Reserve units within a rack for future use.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Reservation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Rack Reservation</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="rackId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rack</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a rack" /></SelectTrigger></FormControl>
                            <SelectContent>{racks.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({racks.find(s => s.id === r.siteId)?.name})</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tenantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a tenant" /></SelectTrigger></FormControl>
                            <SelectContent>{tenants.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="units"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Units</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 25, 26, 27" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., Reserved for future firewall cluster" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Create Reservation</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rack</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell className="font-medium">{getRackName(res.rackId)}</TableCell>
                  <TableCell>{res.units.join(', ')}</TableCell>
                  <TableCell>{getTenantName(res.tenantId)}</TableCell>
                  <TableCell>{res.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(res.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
