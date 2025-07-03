
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
import { useToast } from "@/hooks/use-toast"
import { initialDeviceTypes, type DeviceType } from "@/lib/data"

const typeSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  u_height: z.coerce.number().int().min(1, "U Height must be a positive number"),
})

type TypeFormValues = z.infer<typeof typeSchema>

export default function DeviceTypesPage() {
  const { toast } = useToast()
  const [types, setTypes] = useState<DeviceType[]>(initialDeviceTypes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<TypeFormValues>({
    resolver: zodResolver(typeSchema),
    defaultValues: { manufacturer: "", model: "", u_height: 1 },
  })
  
  function onSubmit(data: TypeFormValues) {
    const newType: DeviceType = {
      id: `type-${Date.now()}`,
      ...data,
    }
    setTypes((prev) => [...prev, newType])
    toast({ title: "Success", description: "Device type has been added." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    setTypes((prev) => prev.filter((t) => t.id !== id))
    toast({ title: "Success", description: "Device type has been deleted." })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>Manage the templates for specific hardware models in your inventory.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device Type</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl><Input placeholder="e.g., Juniper" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl><Input placeholder="e.g., QFX5120" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="u_height"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>U Height</FormLabel>
                        <FormControl><Input type="number" placeholder="1" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Add Type</Button>
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
                <TableHead>Manufacturer</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>U Height</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.manufacturer}</TableCell>
                  <TableCell>{type.model}</TableCell>
                  <TableCell>{type.u_height}U</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(type.id)}>Delete</DropdownMenuItem>
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
