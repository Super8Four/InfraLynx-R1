"use client"

import { useState, useMemo } from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { ContactAssignment, Contact, ContactRole, Site, Region, Location } from "@prisma/client"

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
import { createContactAssignment, deleteContactAssignment } from "../actions"

type EnrichedContactAssignment = ContactAssignment & {
  contact: Contact;
  role: ContactRole;
  region: Region | null;
  site: Site | null;
  location: Location | null;
}

interface ContactAssignmentsPageProps {
  initialAssignments: EnrichedContactAssignment[];
  contacts: Contact[];
  contactRoles: ContactRole[];
  regions: Region[];
  sites: Site[];
  locations: Location[];
}

const assignmentSchema = z.object({
  objectType: z.enum(["Region", "Site", "Location"]),
  objectId: z.string().min(1, "An object must be selected"),
  contactId: z.string().min(1, "A contact must be selected"),
  roleId: z.string().min(1, "A role must be selected"),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

export function ContactAssignmentsClientPage({ 
    initialAssignments,
    contacts,
    contactRoles,
    regions,
    sites,
    locations
}: ContactAssignmentsPageProps) {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<EnrichedContactAssignment[]>(initialAssignments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {},
  })

  const objectType = form.watch("objectType")

  const objectOptions = useMemo(() => {
    switch (objectType) {
      case 'Region': return regions;
      case 'Site': return sites;
      case 'Location': return locations;
      default: return [];
    }
  }, [objectType, regions, sites, locations]);

  async function onSubmit(data: AssignmentFormValues) {
    const result = await createContactAssignment(data);
    if (result.success && result.newAssignment) {
        setAssignments((prev) => [...prev, result.newAssignment as EnrichedContactAssignment]);
        toast({ title: "Success", description: "Contact assignment has been created." });
        setIsAddDialogOpen(false);
        form.reset();
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' });
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteContactAssignment(id);
    if (result.success) {
        setAssignments((prev) => prev.filter((a) => a.id !== id))
        toast({ title: "Success", description: "Assignment has been deleted." })
    } else {
        toast({ title: "Error", description: result.message, variant: 'destructive' })
    }
  }
  
  const getObjectName = (assignment: EnrichedContactAssignment) => {
    switch (assignment.objectType) {
      case 'Region': return assignment.region?.name;
      case 'Site': return assignment.site?.name;
      case 'Location': return assignment.location?.name;
      default: return 'Unknown';
    }
  }

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
                                <SelectItem value="Region">Region</SelectItem>
                                <SelectItem value="Site">Site</SelectItem>
                                <SelectItem value="Location">Location</SelectItem>
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
                    <div className="font-medium">{getObjectName(assignment)}</div>
                    <div className="text-sm text-muted-foreground capitalize">{assignment.objectType}</div>
                  </TableCell>
                  <TableCell>{assignment.role.name}</TableCell>
                  <TableCell>{assignment.contact.name}</TableCell>
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
