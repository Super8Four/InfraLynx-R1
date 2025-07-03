"use client"

import { useState } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Tag } from "@prisma/client"

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
import { Badge } from "@/components/ui/badge"
import { createTag, deleteTag } from "../actions"

interface TagsPageProps {
  initialAllTags: Tag[]
}

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

type TagFormValues = z.infer<typeof tagSchema>

export function TagsClientPage({ initialAllTags }: TagsPageProps) {
  const { toast } = useToast()
  const [allTags, setAllTags] = useState<Tag[]>(initialAllTags)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "", description: "" },
  })

  async function onSubmit(data: TagFormValues) {
    const result = await createTag(data);
    if (result.success && result.newTag) {
        setAllTags((prev) => [...prev, result.newTag!].sort((a,b) => a.name.localeCompare(b.name)));
        toast({ title: "Success", description: "Tag has been created." })
        setIsAddDialogOpen(false)
        form.reset()
    } else {
        toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    // UI check for discovered tags (which won't have the standard ID format)
    const isDiscovered = !id.startsWith("tag-");
    if (isDiscovered) {
        toast({
            title: "Cannot Delete Tag",
            description: "This tag is in use by at least one object. To remove it, you must first remove it from all associated objects.",
            variant: "destructive",
        });
        return;
    }

    const result = await deleteTag(id);
    if (result.success) {
        setAllTags((prev) => prev.filter((t) => t.id !== id));
        toast({ title: "Success", description: `Tag '${name}' has been deleted.` })
    } else {
        toast({ title: "Error", description: result.message, variant: "destructive" })
    }
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
              {allTags.map((tag) => {
                const isDiscovered = !tag.id.startsWith("tag-");
                return (
                    <TableRow key={tag.id}>
                    <TableCell className="font-medium">
                        <Badge variant="secondary">{tag.name}</Badge>
                    </TableCell>
                    <TableCell>{isDiscovered ? 'Discovered from an object' : tag.description}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem disabled={isDiscovered} >Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(tag.id, tag.name)}
                            disabled={isDiscovered}
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
