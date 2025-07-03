
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { initialPlatforms, type Platform } from "@/lib/data"

const platformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  description: z.string().optional(),
})

type PlatformFormValues = z.infer<typeof platformSchema>

export default function PlatformsPage() {
  const { toast } = useToast()
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformSchema),
    defaultValues: { name: "", manufacturer: "", description: "" },
  })

  function onSubmit(data: PlatformFormValues) {
    const newPlatform: Platform = {
      id: `platform-${Date.now()}`,
      name: data.name,
      manufacturer: data.manufacturer,
      description: data.description || "",
    }
    setPlatforms((prev) => [...prev, newPlatform])
    toast({ title: "Success", description: "Platform has been created." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== id))
    toast({ title: "Success", description: "Platform has been deleted." })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Platforms</CardTitle>
              <CardDescription>Manage device operating systems and software platforms.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Platform
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Platform</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Junos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Juniper" {...field} />
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
                            <Textarea placeholder="A brief description of the platform." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Add Platform</Button>
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
                <TableHead>Manufacturer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platforms.map((platform) => (
                <TableRow key={platform.id}>
                  <TableCell className="font-medium">{platform.name}</TableCell>
                  <TableCell>{platform.manufacturer}</TableCell>
                  <TableCell>{platform.description}</TableCell>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(platform.id)}
                        >
                          Delete
                        </DropdownMenuItem>
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
