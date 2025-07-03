"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Circuit, Provider, CircuitType, Site } from "@prisma/client"

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
import { createCircuit, deleteCircuit } from "../actions"

type EnrichedCircuit = Circuit & {
    provider: Provider;
    type: CircuitType;
    termA_site: Site | null;
    termZ_site: Site | null;
}

interface CircuitsClientPageProps {
    initialCircuits: EnrichedCircuit[];
    providers: Provider[];
    circuitTypes: CircuitType[];
    sites: Site[];
}

const circuitSchema = z.object({
  cid: z.string().min(1, "Circuit ID is required"),
  providerId: z.string().min(1, "Provider is required"),
  typeId: z.string().min(1, "Type is required"),
  status: z.enum(["active", "provisioning", "offline", "decommissioned"]),
  installDate: z.string().optional(),
  commitRate: z.coerce.number().optional(),
  description: z.string().optional(),
  termA_siteId: z.string().min(1, "Termination A is required"),
  termZ_siteId: z.string().min(1, "Termination Z is required"),
})

type CircuitFormValues = z.infer<typeof circuitSchema>

export function CircuitsClientPage({
    initialCircuits,
    providers,
    circuitTypes,
    sites
}: CircuitsClientPageProps) {
  const { toast } = useToast()
  const [circuits, setCircuits] = useState<EnrichedCircuit[]>(initialCircuits)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<CircuitFormValues>({
    resolver: zodResolver(circuitSchema),
    defaultValues: {
      status: 'active',
    },
  })

  async function onSubmit(data: CircuitFormValues) {
    const result = await createCircuit(data);
    if (result.success && result.newCircuit) {
        setCircuits((prev) => [...prev, result.newCircuit as EnrichedCircuit]);
        toast({ title: "Success", description: "Circuit has been created." })
        setIsAddDialogOpen(false)
        form.reset()
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteCircuit(id);
    if (result.success) {
        setCircuits((prev) => prev.filter((c) => c.id !== id))
        toast({ title: "Success", description: "Circuit has been deleted." })
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' })
    }
  }

  const getStatusBadge = (status: Circuit['status']) => {
    switch (status) {
        case "active":
            return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
        case "provisioning":
            return <Badge className="capitalize bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20">{status}</Badge>
        case "offline":
            return <Badge variant="secondary" className="capitalize">{status}</Badge>
        case "decommissioned":
            return <Badge variant="destructive" className="capitalize">{status}</Badge>
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
              <CardTitle>Circuits</CardTitle>
              <CardDescription>Manage telecom circuits, providers, and terminations.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Circuit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Circuit</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="cid" render={({ field }) => ( <FormItem><FormLabel>Circuit ID</FormLabel><FormControl><Input placeholder="e.g., 123-ABC-456" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="provisioning">Provisioning</SelectItem>
                                        <SelectItem value="offline">Offline</SelectItem>
                                        <SelectItem value="decommissioned">Decommissioned</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )}/>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="providerId" render={({ field }) => (
                            <FormItem><FormLabel>Provider</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a provider"/></SelectTrigger></FormControl>
                                    <SelectContent>{providers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="typeId" render={({ field }) => (
                            <FormItem><FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a type"/></SelectTrigger></FormControl>
                                    <SelectContent>{circuitTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )}/>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="installDate" render={({ field }) => ( <FormItem><FormLabel>Install Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="commitRate" render={({ field }) => ( <FormItem><FormLabel>Commit Rate (Mbps)</FormLabel><FormControl><Input type="number" placeholder="1000" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <div>
                        <h3 className="text-md font-medium mb-2">Terminations</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <FormField control={form.control} name="termA_siteId" render={({ field }) => (
                                <FormItem><FormLabel>Side A</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a site"/></SelectTrigger></FormControl>
                                        <SelectContent>{sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                <FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="termZ_siteId" render={({ field }) => (
                                <FormItem><FormLabel>Side Z</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a site"/></SelectTrigger></FormControl>
                                        <SelectContent>{sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                <FormMessage /></FormItem>
                            )}/>
                        </div>
                    </div>
                     <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief description of the circuit" {...field} /></FormControl><FormMessage /></FormItem> )} />

                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Add Circuit</Button>
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
                <TableHead>CID</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Termination A</TableHead>
                <TableHead className="hidden lg:table-cell">Termination Z</TableHead>
                <TableHead className="hidden sm:table-cell">Commit Rate</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {circuits.map((circuit) => (
                <TableRow key={circuit.id}>
                  <TableCell className="font-medium">{circuit.cid}</TableCell>
                  <TableCell>{circuit.provider.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{circuit.type.name}</TableCell>
                  <TableCell>{getStatusBadge(circuit.status)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{circuit.termA_site?.name ?? 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{circuit.termZ_site?.name ?? 'N/A'}</TableCell>
                  <TableCell className="hidden sm:table-cell">{circuit.commitRate} Mbps</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(circuit.id)}>Delete</DropdownMenuItem>
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
