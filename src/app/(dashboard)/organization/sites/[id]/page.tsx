
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
    initialSites, 
    initialRegions, 
    initialSiteGroups, 
    initialTenants, 
    initialTenantGroups, 
    initialRacks, 
    initialDevices 
} from '@/lib/data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building, MapPin, Globe, Users, Tag, Rss, Server, HardDrive, Clock, Hash, Warehouse, User, Contact } from 'lucide-react';
import type { Site } from '@/lib/data';

const getStatusBadge = (status: Site['status']) => {
    switch (status) {
      case "active":
        return <Badge className="capitalize bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20">{status}</Badge>
      case "planned":
        return <Badge className="capitalize bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20">{status}</Badge>
      case "decommissioning":
         return <Badge className="capitalize bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20">{status}</Badge>
      case "offline":
        return <Badge variant="destructive" className="capitalize">{status}</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
}

const InfoField = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: React.ElementType }) => (
    <div>
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
        </h4>
        <div className="text-sm">{value || '—'}</div>
    </div>
);


export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const site = initialSites.find((s) => s.id === params.id);
  
  if (!site) {
    notFound();
  }

  // Fetch related data
  const region = site.regionId ? initialRegions.find(r => r.id === site.regionId) : null;
  const group = site.groupId ? initialSiteGroups.find(g => g.id === site.groupId) : null;
  const tenant = site.tenantId ? initialTenants.find(t => t.id === site.tenantId) : null;
  const tenantGroup = site.tenantGroupId ? initialTenantGroups.find(tg => tg.id === site.tenantGroupId) : null;

  // Calculate stats
  const rackCount = initialRacks.filter(r => r.siteId === site.id).length;
  const deviceCount = initialDevices.filter(d => d.site === site.name).length;

  const mapSrc = `https://maps.google.com/maps?q=${site.latitude},${site.longitude}&z=14&output=embed`;

  return (
    <div className="space-y-6">
      <Link href="/organization/sites" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Sites
      </Link>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Building className="h-10 w-10 text-muted-foreground" />
            <div>
                <CardTitle className="text-3xl">{site.name}</CardTitle>
                <CardDescription>{site.description || "No description provided."}</CardDescription>
            </div>
        </div>
        <div>
            {getStatusBadge(site.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Site Information</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField label="Region" value={region?.name} icon={Globe} />
                    <InfoField label="Site Group" value={group?.name} icon={Warehouse} />
                    <InfoField label="Facility" value={site.facility} icon={Building} />
                    <InfoField label="ASNs" value={site.asns} icon={Rss} />
                    <InfoField label="Time Zone" value={site.timeZone} icon={Clock} />
                </div>
                <Separator className="my-6" />
                <InfoField label="Tags" value={
                    <div className="flex flex-wrap gap-1">
                        {site.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                } icon={Tag} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Tenancy</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField label="Tenant Group" value={tenantGroup?.name} icon={Users} />
                    <InfoField label="Tenant" value={tenant?.name} icon={User} />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
            <CardContent>
                {site.comments ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                        <p>{site.comments}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No comments provided.</p>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card>
             <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
             <CardContent className="space-y-4">
                <InfoField label="Racks" value={rackCount} icon={Server} />
                <InfoField label="Devices" value={deviceCount} icon={HardDrive} />
             </CardContent>
           </Card>

           <Card>
             <CardHeader><CardTitle>Location</CardTitle></CardHeader>
             <CardContent className="p-0">
                {site.latitude && site.longitude ? (
                    <div className="aspect-video w-full">
                        <iframe
                            src={mapSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                ) : <div className="p-6 text-center text-sm text-muted-foreground">No coordinates provided.</div> }
                
                {site.physicalAddress && (
                    <div className="p-4 border-t">
                        <InfoField label="Physical Address" value={site.physicalAddress} icon={Contact} />
                    </div>
                )}
             </CardContent>
           </Card>
            <Card>
                <CardHeader><CardTitle>Site Image</CardTitle></CardHeader>
                <CardContent>
                    {site.imageUrl ? (
                        <Image src={site.imageUrl} alt={`Image of ${site.name}`} width={600} height={400} className="rounded-md object-cover w-full aspect-video" data-ai-hint="building cityscape" />
                    ) : (
                        <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">No image available</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
