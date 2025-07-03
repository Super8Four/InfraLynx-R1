
"use client"

import { useState, useMemo } from "react"
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
import {
  initialTags,
  type Tag,
  initialDevices,
  initialRegions,
  initialSites,
  initialRacks,
} from "@/lib/data"
import { Badge } from "@/components/ui/badge"

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

type TagFormValues = z.infer<typeof tagSchema>

export default function TagsPage() {
  const { toast } = useToast()
  const [userCreatedTags, setUserCreatedTags] = useState<Tag[]>(initialTags)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const allTags = useMemo(() => {
    const discoveredTagSet = new Set<string>()

    initialDevices.forEach((d) => d.tags.forEach((t) => discoveredTagSet.add(t)))
    initialRegions.forEach((r) => r.tags.forEach((t) => discoveredTagSet.add(t)))
    initialSites.forEach((s) => s.tags.forEach((t) => discoveredTagSet.add(t)))
    initialRacks.forEach((r) => r.tags.forEach((t) => discoveredTagSet.add(t)))

    const discoveredTags: Tag[] = Array.from(discoveredTagSet).map((name) => ({
      id: `discovered-${name}`,
      name,
      description: "Discovered from an object",
    }))

    const combined = [...userCreatedTags, ...discoveredTags]
    const uniqueTags = Array.from(
      new Map(combined.map((tag) => [tag.name.toLowerCase(), tag])).values()
    )

    uniqueTags.sort((a, b) => a.name.localeCompare(b.name))

    return uniqueTags
  }, [userCreatedTags])

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "", description: "" },
  })

  function onSubmit(data: TagFormValues) {
    if (allTags.some((t) => t.name.toLowerCase() === data.name.toLowerCase())) {
      toast({
        title: "Duplicate Tag",
        description: "A tag with this name already exists.",
        variant: "destructive",
      })
      return
    }

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: data.name,
      description: data.description || "",
    }
    setUserCreatedTags((prev) => [...prev, newTag])
    toast({ title: "Success", description: "Tag has been created." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    if (id.startsWith("discovered-")) {
      toast({
        title: "Cannot Delete Tag",
        description:
          "This tag is in use by at least one object. To remove it, you must first remove it from all associated objects.",
        variant: "destructive",
      })
      return
    }
    setUserCreatedTags((prev) => prev.filter((t) => t.id !== id))
    toast({ title: "Success", description: "Tag has been deleted." })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Manage tags for organizing objects. Tags in use by objects are
                discovered automatically.
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Tag</DialogTitle>
                  <DialogDescription>
                    Create a new tag that can be assigned to objects.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Critical" {...field} />
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
                            <Textarea
                              placeholder="A brief description of the tag's purpose."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Tag</Button>
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
                <TableHead>Description</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary">{tag.name}</Badge>
                  </TableCell>
                  <TableCell>{tag.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem disabled={tag.id.startsWith('discovered-')} >Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(tag.id)}
                           disabled={tag.id.startsWith('discovered-')}
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
