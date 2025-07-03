"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { WirelessLan, AccessPoint, Site } from "@prisma/client"

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createWirelessLan, deleteWirelessLan } from "../actions"

type EnrichedAccessPoint = AccessPoint & {
  site: Site | null;
}

interface WirelessClientPageProps {
  initialWlans: WirelessLan[];
  initialAccessPoints: EnrichedAccessPoint[];
  sites: Site[];
}


const wlanSchema = z.object({
  ssid: z.string().min(1, "SSID is required"),
  vlan: z.string().optional(),
  description: z.string().optional(),
  authType: z.enum(['Open', 'WEP', 'WPA_Personal', 'WPA_Enterprise']),
})

type WlanFormValues = z.infer<typeof wlanSchema>

function WirelessLansTab({ initialWlans }: { initialWlans: WirelessLan[]}) {
  const { toast } = useToast()
  const [wlans, setWlans] = useState<WirelessLan[]>(initialWlans)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<WlanFormValues>({
    resolver: zodResolver(wlanSchema),
    defaultValues: { authType: 'WPA_Enterprise' },
  })

  async function onSubmit(data: WlanFormValues) {
    const result = await createWirelessLan(data);
    if (result.success && result.newWlan) {
      setWlans((prev) => [...prev, result.newWlan]);
      toast({ title: "Success", description: "Wireless LAN has been created." })
      setIsAddDialogOpen(false)
      form.reset()
    } else {
        toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteWirelessLan(id);
    if (result.success) {
      setWlans((prev) => prev.filter((w) => w.id !== id))
      toast({ title: "Success", description: "Wireless LAN has been deleted." })
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Wireless LANs</CardTitle>
            <CardDescription>Manage SSIDs and their associated properties.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add WLAN
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Wireless LAN</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="ssid" render={({ field }) => ( <FormItem><FormLabel>SSID</FormLabel><FormControl><Input placeholder="e.g., InfraLynx-Corp" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                  <FormField control={form.control} name="vlan" render={({ field }) => ( <FormItem><FormLabel>VLAN ID</FormLabel><FormControl><Input placeholder="e.g., 100" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                  <FormField control={form.control} name="authType" render={({ field }) => (
                    <FormItem><FormLabel>Authentication Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="WPA_Personal">WPA Personal</SelectItem>
                            <SelectItem value="WPA_Enterprise">WPA Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Description of the WLAN" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Create WLAN</Button>
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
              <TableHead>SSID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>VLAN</TableHead>
              <TableHead>Auth Type</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wlans.map((wlan) => (
              <TableRow key={wlan.id}>
                <TableCell className="font-medium">{wlan.ssid}</TableCell>
                <TableCell>{wlan.description}</TableCell>
                <TableCell>{wlan.vlan ?? '—'}</TableCell>
                <TableCell>{wlan.authType.replace('_', ' ')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(wlan.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function AccessPointsTab({ initialAccessPoints }: { initialAccessPoints: EnrichedAccessPoint[] }) {
    
    const getStatusBadge = (status: AccessPoint['status']) => {
        switch (status) {
            case "active":
                return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
            case "planned":
                return <Badge className="capitalize bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20">{status}</Badge>
            case "offline":
                return <Badge variant="secondary" className="capitalize">{status}</Badge>
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Points</CardTitle>
                <CardDescription>Manage individual wireless access points.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Site</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialAccessPoints.map(ap => (
                            <TableRow key={ap.id}>
                                <TableCell className="font-medium">{ap.name}</TableCell>
                                <TableCell>{getStatusBadge(ap.status)}</TableCell>
                                <TableCell>{ap.site?.name ?? 'N/A'}</TableCell>
                                <TableCell>{ap.model}</TableCell>
                                <TableCell className="font-mono">{ap.ipAddress}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}


export function WirelessClientPage({ initialWlans, initialAccessPoints, sites }: WirelessClientPageProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="wlans">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wlans">Wireless LANs</TabsTrigger>
          <TabsTrigger value="aps">Access Points</TabsTrigger>
        </TabsList>
        <TabsContent value="wlans" className="mt-6">
            <WirelessLansTab initialWlans={initialWlans} />
        </TabsContent>
        <TabsContent value="aps" className="mt-6">
            <AccessPointsTab initialAccessPoints={initialAccessPoints} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
