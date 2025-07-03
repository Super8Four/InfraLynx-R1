
import type { Rack, Device, Site, Region, SiteGroup, Tenant, TenantGroup, Location, Contact, ContactGroup, ContactRole, ContactAssignment, Tag, DeviceRole, Platform, DeviceType, VirtualChassis, RackRole, RackType, RackReservation, IPAddress, Prefix, Provider, CircuitType, Circuit, WirelessLan, AccessPoint, VpnTunnel, PowerPanel, PowerFeed, ClusterType, ClusterGroup, Cluster, VirtualMachine } from '@prisma/client';

export type {
    Rack,
    Device,
    Site,
    Region,
    SiteGroup,
    Tenant,
    TenantGroup,
    Location,
    Contact,
    ContactGroup,
    ContactRole,
    ContactAssignment,
    Tag,
    DeviceRole,
    Platform,
    DeviceType,
    VirtualChassis,
    RackRole,
    RackType,
    RackReservation,
    IPAddress,
    Prefix,
    Provider,
    CircuitType,
    Circuit,
    WirelessLan,
    AccessPoint,
    VpnTunnel,
    PowerPanel,
    PowerFeed,
    ClusterType,
    ClusterGroup,
    Cluster,
    VirtualMachine
};

export type DeviceInRack = { 
    id: string;
    name: string;
    u: number;
    height: number;
    color: string;
    role: string;
    rackId: string;
}

export type ProcessedRack = Rack & {
    devices: DeviceInRack[];
}
