
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, HardDrive, Cpu, Tag, Globe, MapPin, Server, GanttChart, Cable, Network, Settings, Fingerprint, Shield, Info, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ConfigBackup from './components/config-backup';
import type { Device } from '@prisma/client';

const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20 capitalize">{status}</Badge>
      case "offline":
        return <Badge variant="destructive" className="capitalize">{status}</Badge>
      case "provisioning":
        return <Badge className="bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20 capitalize">{status}</Badge>
      case "staged":
        return <Badge className="bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20 capitalize">{status}</Badge>
      case "decommissioning":
        return <Badge variant="secondary" className="capitalize">{status}</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
}

const InfoField = ({ label, value, icon: Icon, mono = false }: { label: string, value: React.ReactNode, icon?: React.ElementType, mono?: boolean }) => (
    <div>
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
        </h4>
        <div className={mono ? 'font-mono text-sm' : 'text-sm'}>{value || '—'}</div>
    </div>
);

export default async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const device = await prisma.device.findUnique({
    where: { id: params.id },
    include: {
      deviceType: true,
      deviceRole: true,
      platform: true,
      site: true,
      rack: true,
      virtualChassis: true,
    }
  });

  if (!device) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <Link href="/devices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Devices
        </Link>
      
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <HardDrive className="h-10 w-10 text-muted-foreground" />
                <div>
                    <CardTitle className="text-3xl">{device.name}</CardTitle>
                    <CardDescription>{device.deviceRole.name}</CardDescription>
                </div>
            </div>
            <div>
                {getStatusBadge(device.status)}
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Hardware</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InfoField label="Type" value={`${device.deviceType.manufacturer} ${device.deviceType.model}`} icon={Cpu} />
                            <InfoField label="Platform" value={device.platform?.name} icon={Settings} />
                            <InfoField label="Serial #" value={device.serial} icon={Fingerprint} mono />
                            <InfoField label="Asset Tag" value={device.assetTag} icon={Tag} mono />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Location</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InfoField label="Site" value={<Link href={`/organization/sites/${device.site.id}`} className="hover:underline">{device.site.name}</Link>} icon={Globe} />
                            <InfoField label="Rack" value={device.rack?.name} icon={Server} />
                            <InfoField label="Position" value={device.position ? `U${device.position}` : null} icon={GanttChart} />
                            <InfoField label="Face" value={device.rackFace} icon={Cable} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Management</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InfoField label="Primary IP" value={device.ip} icon={Network} mono/>
                            <InfoField label="Virtual Chassis" value={device.virtualChassis?.name} icon={Shield} />
                            {device.virtualChassis && <InfoField label="VC Position" value={device.vcPosition} icon={Info} />}
                            {device.virtualChassis && <InfoField label="VC Priority" value={device.vcPriority} icon={Info} />}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <ConfigBackup deviceId={device.id} configBackup={device.configBackup} />
                <Card>
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {device.tags.length > 0 ? device.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            )) : <p className="text-sm text-muted-foreground">No tags assigned.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
