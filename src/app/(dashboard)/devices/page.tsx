
import { DeviceClientPage } from "./components/device-client-page"

export default async function DevicesPage() {
  // All data is now fetched and managed by the BranchingProvider
  // This component just renders the client-side page which consumes the context.
  return <DeviceClientPage />
}
