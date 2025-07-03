
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Globe, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function RegionDetailPage({ params }: { params: { id: string } }) {
  const region = await prisma.region.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
      sites: true,
      contactAssignments: {
        include: {
          contact: true,
          role: true,
        }
      }
    }
  });
  
  if (!region) {
    notFound();
  }

  const sitesInRegion = region.sites;
  const assignments = region.contactAssignments;

  return (
    <div className="space-y-6">
       <Link href="/organization/regions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Regions
        </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Globe className="h-8 w-8 text-muted-foreground" />
            <div>
                <CardTitle>{region.name}</CardTitle>
                <CardDescription>{region.description || "No description provided."}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="font-semibold text-sm mb-1">Parent Region</h4>
              <p className="text-sm text-muted-foreground">{region.parent ? region.parent.name : '—'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {region.tags.length > 0 ? (
                    region.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)
                ) : (
                    <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
            </div>
             <div>
              <h4 className="font-semibold text-sm mb-1">Site Count</h4>
              <p className="text-sm text-muted-foreground">{sitesInRegion.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Sites</CardTitle>
                <CardDescription>Sites located within this region.</CardDescription>
            </CardHeader>
            <CardContent>
                 {sitesInRegion.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Facility</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sitesInRegion.map(site => (
                                <TableRow key={site.id}>
                                    <TableCell>
                                        <Link href={`/organization/sites/${site.id}`} className="font-medium hover:underline">{site.name}</Link>
                                    </TableCell>
                                    <TableCell><Badge variant={site.status === 'active' ? 'default' : 'outline'}>{site.status}</Badge></TableCell>
                                    <TableCell>{site.facility || '—'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 ) : (
                    <p className="text-sm text-muted-foreground">No sites found in this region.</p>
                 )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Contact Assignments</CardTitle>
                <CardDescription>Contacts assigned to this region.</CardDescription>
            </CardHeader>
            <CardContent>
                 {assignments.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contact</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map(a => (
                                <TableRow key={a.id}>
                                    <TableCell className="font-medium">{a.contact.name}</TableCell>
                                    <TableCell>{a.role.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 ) : (
                    <p className="text-sm text-muted-foreground">No contacts assigned to this region.</p>
                 )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
