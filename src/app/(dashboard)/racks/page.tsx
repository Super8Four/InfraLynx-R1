import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Rack from "@/components/rack"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type DeviceInRack = { 
    id: number;
    name: string;
    u: number;
    height: number;
    color: string;
    role: string;
}

type RackType = {
    id: string;
    status: 'active' | 'planned' | 'decommissioned';
    role: string;
    comments: string;
    devices: DeviceInRack[];
    uHeight?: number;
}


const SITE_A_RACKS: RackType[] = [
    { 
        id: "A101", 
        status: 'active',
        role: "Core Network",
        comments: "Houses core switching and routing for Site A.",
        devices: [
            { id: 1, name: 'FIREWALL-01', u: 42, height: 1, color: 'bg-red-500', role: 'Firewall' },
            { id: 2, name: 'CORE-SW-01', u: 40, height: 2, color: 'bg-indigo-500', role: 'Core Switch' },
            { id: 3, name: 'ACCESS-SW-01', u: 38, height: 1, color: 'bg-blue-500', role: 'Access Switch' },
            { id: 4, name: 'SERVER-WEB-01', u: 20, height: 2, color: 'bg-gray-600', role: 'Web Server' },
            { id: 5, name: 'SERVER-DB-01', u: 18, height: 2, color: 'bg-gray-600', role: 'Database Server' },
            { id: 6, name: 'UPS-A', u: 1, height: 3, color: 'bg-gray-800', role: 'UPS' },
        ]
    },
    { 
        id: "A102",
        status: 'planned',
        role: "Compute Expansion",
        comments: "Future home for new virtualization cluster.",
        devices: []
    },
    { 
        id: "A103",
        status: 'decommissioned',
        role: "Legacy Storage",
        comments: "To be removed in Q4.",
        devices: []
    },
]

const SITE_B_RACKS: RackType[] = [
    { 
        id: "B201",
        status: 'active',
        role: 'Edge & Virtualization',
        comments: "Mixed-use rack for edge routing and VM hosts.",
        devices: [
            { id: 1, name: 'EDGE-RTR-02', u: 42, height: 2, color: 'bg-purple-500', role: 'Edge Router' },
            { id: 2, name: 'TOR-SW-01', u: 22, height: 1, color: 'bg-green-500', role: 'ToR Switch' },
            { id: 3, name: 'TOR-SW-02', u: 21, height: 1, color: 'bg-green-500', role: 'ToR Switch' },
            { id: 4, name: 'SERVER-VM-HOST-01', u: 15, height: 4, color: 'bg-orange-500', role: 'VM Host' },
            { id: 5, name: 'SERVER-VM-HOST-02', u: 11, height: 4, color: 'bg-orange-500', role: 'VM Host' },
        ]
    }
]

export default function RacksPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Rack Elevations</CardTitle>
            <CardDescription>Visualize device placement in data center racks.</CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="site-a">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="site-a">Data Center A</TabsTrigger>
          <TabsTrigger value="site-b">Data Center B</TabsTrigger>
        </TabsList>
        <TabsContent value="site-a" className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SITE_A_RACKS.map(rack => <Rack key={rack.id} rack={rack} />)}
          </div>
        </TabsContent>
        <TabsContent value="site-b" className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SITE_B_RACKS.map(rack => <Rack key={rack.id} rack={rack} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
