"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Map, Route, Maximize, Minimize } from "lucide-react"
import DeviceTopologyGraph from "@/components/device-topology-graph"
import { Button } from "@/components/ui/button"


export default function TopologyPage() {
  const graphContainerRef = React.useRef<HTMLDivElement>(null)
  const [isFullScreen, setIsFullScreen] = React.useState(false)

  const handleFullScreenToggle = () => {
    const elem = graphContainerRef.current
    if (!elem) return

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  React.useEffect(() => {
    const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-center flex-1">Device Connectivity Graph</h3>
              <Button variant="outline" size="icon" onClick={handleFullScreenToggle} title={isFullScreen ? "Exit full screen" : "Enter full screen"}>
                {isFullScreen ? <Minimize className="h-4 w-4"/> : <Maximize className="h-4 w-4"/>}
              </Button>
            </div>
            <div
              ref={graphContainerRef}
              className="p-4 border rounded-md bg-muted/50 min-h-[450px] flex items-center justify-center transition-colors dark:bg-background bg-slate-50"
            >
                 <DeviceTopologyGraph />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
