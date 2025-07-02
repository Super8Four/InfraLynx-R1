
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  initialContactAssignments,
  initialContacts,
  initialContactRoles,
  initialLocations,
  initialRegions,
  initialSites,
  type ContactAssignment,
} from "@/lib/data"

const assignmentSchema = z.object({
  objectType: z.enum(["region", "site", "location"]),
  objectId: z.string().min(1, "An object must be selected"),
  contactId: z.string().min(1, "A contact must be selected"),
  roleId: z.string().min(1, "A role must be selected"),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

export default function ContactAssignmentsPage() {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<ContactAssignment[]>(initialContactAssignments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  const [regions] = useState(initialRegions)
  const [sites] = useState(initialSites)
  const [locations] = useState(initialLocations)
  const [contacts] = useState(initialContacts)
  const [contactRoles] = useState(initialContactRoles)

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {},
  })

  const objectType = form.watch("objectType")

  const objectOptions = useMemo(() => {
    switch (objectType) {
      case 'region': return regions;
      case 'site': return sites;
      case 'location': return locations;
      default: return [];
    }
  }, [objectType, regions, sites, locations]);

  function onSubmit(data: AssignmentFormValues) {
    const newAssignment: ContactAssignment = {
      id: `assign-${Date.now()}`,
      ...data,
    }
    setAssignments((prev) => [...prev, newAssignment])
    toast({ title: "Success", description: "Contact assignment has been created." })
    setIsAddDialogOpen(false)
    form.reset()
  }

  const handleDelete = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    toast({ title: "Success", description: "Assignment has been deleted." })
  }
  
  const getObjectName = (type: ContactAssignment['objectType'], id: string) => {
    let item;
    switch (type) {
      case 'region': item = regions.find(r => r.id === id); break;
      case 'site': item = sites.find(s => s.id === id); break;
      case 'location': item = locations.find(l => l.id === id); break;
    }
    return item?.name ?? 'Unknown'
  }
  const getContactName = (id: string) => contacts.find(c => c.id === id)?.name ?? 'Unknown'
  const getRoleName = (id: string) => contactRoles.find(r => r.id === id)?.name ?? 'Unknown'


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contact Assignments</CardTitle>
              <CardDescription>Assign contacts and roles to objects.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Contact Assignment</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                      control={form.control}
                      name="objectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Object Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select an object type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="region">Region</SelectItem>
                                <SelectItem value="site">Site</SelectItem>
                                <SelectItem value="location">Location</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="objectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Object</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!objectType}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select an object" /></SelectTrigger></FormControl>
                            <SelectContent>{objectOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                            <SelectContent>{contactRoles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="contactId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a contact" /></SelectTrigger></FormControl>
                            <SelectContent>{contacts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Add Assignment</Button>
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
                <TableHead>Object</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="font-medium">{getObjectName(assignment.objectType, assignment.objectId)}</div>
                    <div className="text-sm text-muted-foreground capitalize">{assignment.objectType}</div>
                  </TableCell>
                  <TableCell>{getRoleName(assignment.roleId)}</TableCell>
                  <TableCell>{getContactName(assignment.contactId)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(assignment.id)}>Delete</DropdownMenuItem>
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
