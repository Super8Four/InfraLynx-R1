
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Map, Route } from "lucide-react"
import DeviceTopologyGraph from "@/components/device-topology-graph"


export default function TopologyPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Topology</CardTitle>
          <CardDescription>
            Visualize network topology graphs.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Share2 className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Device Topology</h3>
                <p className="text-sm text-muted-foreground">Automatically generate diagrams showing how devices are connected.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Map className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Geographic Map</h3>
                <p className="text-sm text-muted-foreground">View all sites on a world map to visualize your physical footprint.</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Route className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Circuit Paths</h3>
                <p className="text-sm text-muted-foreground">Trace and visualize the path of long-haul circuits between sites.</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-center">Device Connectivity Graph</h3>
            <div className="flex items-center justify-center p-4 border rounded-md bg-muted/50 min-h-[450px]">
                 <DeviceTopologyGraph />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
