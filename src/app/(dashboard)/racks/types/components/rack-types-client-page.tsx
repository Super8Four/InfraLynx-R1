"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { RackType } from "@prisma/client"

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
import { createRackType, deleteRackType } from "../actions"

interface RackTypesPageProps {
  initialTypes: RackType[];
}

const typeSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  u_height: z.coerce.number().int().min(1, "U Height must be a positive number"),
  width: z.enum(["nineteen_in", "twentythree_in"]),
})

type TypeFormValues = z.infer<typeof typeSchema>

export function RackTypesClientPage({ initialTypes }: RackTypesPageProps) {
  const { toast } = useToast()
  const [types, setTypes] = useState<RackType[]>(initialTypes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<TypeFormValues>({
    resolver: zodResolver(typeSchema),
    defaultValues: { manufacturer: "", model: "", u_height: 42, width: "nineteen_in" },
  })
  
  async function onSubmit(data: TypeFormValues) {
    const result = await createRackType(data);
    if (result.success && result.newType) {
        setTypes((prev) => [...prev, result.newType]);
        toast({ title: "Success", description: "Rack type has been added." });
        setIsAddDialogOpen(false);
        form.reset();
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' });
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteRackType(id);
    if (result.success) {
        setTypes((prev) => prev.filter((t) => t.id !== id))
        toast({ title: "Success", description: "Rack type has been deleted." })
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' })
    }
  }

  const formatWidth = (width: 'nineteen_in' | 'twentythree_in') => {
    if (width === 'nineteen_in') return '19 inches';
    if (width === 'twentythree_in') return '23 inches';
    return 'Unknown';
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rack Types</CardTitle>
              <CardDescription>Manage standardized rack models for your inventory.</CardDescription>
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
                  <DialogTitle>Add New Rack Type</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl><Input placeholder="e.g., APC" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="e.g., AR3100" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="u_height"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>U Height</FormLabel>
                            <FormControl><Input type="number" placeholder="42" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="width"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Width</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="nineteen_in">19 inches</SelectItem>
                                    <SelectItem value="twentythree_in">23 inches</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
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
                <TableHead>Width</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.manufacturer}</TableCell>
                  <TableCell>{type.model}</TableCell>
                  <TableCell>{type.u_height}U</TableCell>
                  <TableCell>{formatWidth(type.width)}</TableCell>
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
