"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { VpnTunnel } from "@prisma/client"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { createVpnTunnel, deleteVpnTunnel } from "../actions"

interface VpnClientPageProps {
    initialTunnels: VpnTunnel[];
}

const tunnelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "disabled", "planned"]),
  type: z.enum(['IPsec', 'OpenVPN', 'WireGuard']),
  localPeer: z.string().min(1, "Local peer is required"),
  remotePeer: z.string().min(1, "Remote peer is required"),
  description: z.string().optional(),
})

type TunnelFormValues = z.infer<typeof tunnelSchema>

export function VpnClientPage({ initialTunnels }: VpnClientPageProps) {
  const { toast } = useToast()
  const [tunnels, setTunnels] = useState<VpnTunnel[]>(initialTunnels)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<TunnelFormValues>({
    resolver: zodResolver(tunnelSchema),
    defaultValues: {
      status: 'active',
      type: 'IPsec',
    },
  })

  async function onSubmit(data: TunnelFormValues) {
    const result = await createVpnTunnel(data);
    if (result.success && result.newTunnel) {
        setTunnels((prev) => [...prev, result.newTunnel]);
        toast({ title: "Success", description: "VPN Tunnel has been created." })
        setIsAddDialogOpen(false)
        form.reset()
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteVpnTunnel(id);
    if (result.success) {
        setTunnels((prev) => prev.filter((t) => t.id !== id))
        toast({ title: "Success", description: "VPN Tunnel has been deleted." })
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' })
    }
  }

  const getStatusBadge = (status: VpnTunnel['status']) => {
    switch (status) {
        case "active":
            return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
        case "planned":
            return <Badge className="capitalize bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20">{status}</Badge>
        case "disabled":
            return <Badge variant="secondary" className="capitalize">{status}</Badge>
        default:
            return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>VPN Tunnels</CardTitle>
              <CardDescription>Manage VPN tunnels and user access.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Tunnel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add New VPN Tunnel</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Site2Site-TN-to-DUB" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="planned">Planned</SelectItem>
                                            <SelectItem value="disabled">Disabled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                <FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="IPsec">IPsec</SelectItem>
                                            <SelectItem value="OpenVPN">OpenVPN</SelectItem>
                                            <SelectItem value="WireGuard">WireGuard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                <FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="localPeer" render={({ field }) => ( <FormItem><FormLabel>Local Peer</FormLabel><FormControl><Input placeholder="e.g., 192.0.2.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="remotePeer" render={({ field }) => ( <FormItem><FormLabel>Remote Peer</FormLabel><FormControl><Input placeholder="e.g., 203.0.113.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief description of the tunnel" {...field} /></FormControl><FormMessage /></FormItem> )} />

                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Add Tunnel</Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Local Peer</TableHead>
                <TableHead>Remote Peer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tunnels.map((tunnel) => (
                <TableRow key={tunnel.id}>
                  <TableCell className="font-medium">{tunnel.name}</TableCell>
                  <TableCell>{getStatusBadge(tunnel.status)}</TableCell>
                  <TableCell>{tunnel.type}</TableCell>
                  <TableCell className="font-mono">{tunnel.localPeer}</TableCell>
                  <TableCell className="font-mono">{tunnel.remotePeer}</TableCell>
                  <TableCell>{tunnel.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(tunnel.id)}>Delete</DropdownMenuItem>
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
