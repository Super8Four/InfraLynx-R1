import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Rack from "@/components/rack"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const RACK_A_DEVICES = [
    { id: 1, name: 'FIREWALL-01', u: 42, height: 1, color: 'bg-red-500', role: 'Firewall' },
    { id: 2, name: 'CORE-SW-01', u: 40, height: 2, color: 'bg-indigo-500', role: 'Core Switch' },
    { id: 3, name: 'ACCESS-SW-01', u: 38, height: 1, color: 'bg-blue-500', role: 'Access Switch' },
    { id: 4, name: 'SERVER-WEB-01', u: 20, height: 2, color: 'bg-gray-600', role: 'Web Server' },
    { id: 5, name: 'SERVER-DB-01', u: 18, height: 2, color: 'bg-gray-600', role: 'Database Server' },
    { id: 6, name: 'UPS-A', u: 1, height: 3, color: 'bg-gray-800', role: 'UPS' },
]

const RACK_B_DEVICES = [
    { id: 1, name: 'EDGE-RTR-02', u: 42, height: 2, color: 'bg-purple-500', role: 'Edge Router' },
    { id: 2, name: 'TOR-SW-01', u: 22, height: 1, color: 'bg-green-500', role: 'ToR Switch' },
    { id: 3, name: 'TOR-SW-02', u: 21, height: 1, color: 'bg-green-500', role: 'ToR Switch' },
    { id: 4, name: 'SERVER-VM-HOST-01', u: 15, height: 4, color: 'bg-orange-500', role: 'VM Host' },
    { id: 5, name: 'SERVER-VM-HOST-02', u: 11, height: 4, color: 'bg-orange-500', role: 'VM Host' },
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
            <Rack id="A101" devices={RACK_A_DEVICES} />
            <Rack id="A102" devices={[]} />
            <Rack id="A103" devices={[]} />
          </div>
        </TabsContent>
        <TabsContent value="site-b" className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Rack id="B201" devices={RACK_B_DEVICES} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
