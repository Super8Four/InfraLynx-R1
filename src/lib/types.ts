import type { Rack as RackData } from './data';

export type DeviceInRack = { 
    id: string;
    name: string;
    u: number;
    height: number;
    color: string;
    role: string;
    rackId: string;
}

export type ProcessedRack = RackData & {
    devices: DeviceInRack[];
}
