

// This file contains all the mock data for the application.
// In a real-world scenario, this data would come from a database.

// --- ORGANIZATION ---

// Regions
export type Region = {
    id: string;
    name: string;
    description: string;
    parentId?: string;
    tags: string[];
}
export const initialRegions: Region[] = [
    { id: 'na', name: 'North America', description: 'All US and Canadian facilities', tags: ["amer"], parentId: undefined },
    { id: 'eu', name: 'Europe', description: 'European data centers and offices', tags: ["emea"], parentId: undefined },
    { id: 'us-east', name: 'US East', description: 'East coast data centers', tags: [], parentId: 'na' },
];

// Site Groups
export type SiteGroup = {
    id: string;
    name: string;
    description: string;
}
export const initialSiteGroups: SiteGroup[] = [
    { id: 'dc', name: 'Data Centers', description: 'Primary data center facilities' },
    { id: 'office', name: 'Branch Offices', description: 'Remote office locations' },
];

// Sites
export type Site = {
    id: string;
    name: string;
    status: 'active' | 'offline' | 'planned' | 'decommissioning';
    regionId?: string;
    groupId?: string;
    facility?: string;
    asns?: string;
    timeZone?: string;
    description?: string;
    tags: string[];
    tenantGroupId?: string;
    tenantId?: string;
    physicalAddress?: string;
    shippingAddress?: string;
    latitude?: number;
    longitude?: number;
    comments?: string;
    imageUrl?: string;
}
export const initialSites: Site[] = [
    { id: 'florim-tn', name: 'Florim TN Data Center', regionId: 'us-east', status: 'active', groupId: 'dc', tags: ['primary'], latitude: 36.5297, longitude: -87.3595, tenantId: 'tenant-a', physicalAddress: '123 Main St, Clarksville, TN', imageUrl: 'https://placehold.co/600x400.png', facility: 'CL-01', asns: '65000', timeZone: 'America/Chicago', description: 'Primary data center facility for North American operations.', comments: 'All shipments must be scheduled 24 hours in advance with DC operations.' },
    { id: 'dub-office', name: 'Dublin Office', regionId: 'eu', status: 'planned', groupId: 'office', tags: [], latitude: 53.3498, longitude: -6.2603, tenantId: 'tenant-b', physicalAddress: '456 O\'Connell Street, Dublin, Ireland', imageUrl: 'https://placehold.co/600x400.png', facility: 'DUB-01', timeZone: 'Europe/Dublin', description: 'Main European branch office and development hub.' },
];

export const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo"
];

// Locations
export type Location = {
    id: string;
    name: string;
    siteId: string;
    description: string;
}
export const initialLocations: Location[] = [
    { id: 'tn-dc-room-1', name: 'Server Room 1', siteId: 'florim-tn', description: 'Main server room housing racks A1–A10'},
    { id: 'tn-dc-room-2', name: 'Meet-Me-Room', siteId: 'florim-tn', description: 'Carrier interconnect room'},
];

// Tenant Groups
export type TenantGroup = {
    id: string;
    name: string;
    description: string;
}
export const initialTenantGroups: TenantGroup[] = [
    { id: 'tg-1', name: 'Corporate', description: 'Corporate Tenants' },
    { id: 'tg-2', name: 'External Customers', description: 'External Customer Tenants' },
];

// Tenants
export type Tenant = {
    id: string;
    name: string;
    description: string;
    groupId?: string;
}
export const initialTenants: Tenant[] = [
    { id: 'tenant-a', name: 'Internal Services', groupId: 'tg-1', description: 'Company-internal applications and infrastructure' },
    { id: 'tenant-b', name: 'Customer Hosting', groupId: 'tg-2', description: 'Shared hosting platform for external customers' },
];

// Contact Groups
export type ContactGroup = {
    id: string;
    name: string;
    description: string;
}
export const initialContactGroups: ContactGroup[] = [
    { id: 'cg-1', name: 'NOC Team', description: 'Network Operations Center team members.' },
    { id: 'cg-2', name: 'DC On-call', description: 'Data Center on-call personnel.' },
];


// Contacts
export type Contact = {
    id: string;
    name: string;
    email: string;
    phone: string;
    title: string;
    groupId?: string;
}
export const initialContacts: Contact[] = [
    { id: 'contact-1', name: 'John Doe', email: 'j.doe@example.com', phone: '123-456-7890', title: 'Network Engineer', groupId: 'cg-1' },
    { id: 'contact-2', name: 'Jane Smith', email: 'j.smith@example.com', phone: '098-765-4321', title: 'Data Center Manager', groupId: 'cg-2' },
];

// Contact Roles
export type ContactRole = {
    id: string;
    name: string;
    description: string;
}
export const initialContactRoles: ContactRole[] = [
    { id: 'role-noc', name: 'NOC', description: 'Network Operations Center contact.'},
    { id: 'role-admin', name: 'Administrative', description: 'Administrative or billing contact.'},
    { id: 'role-technical', name: 'Technical', description: 'Primary technical point of contact.'},
]

// Contact Assignments
export type ContactAssignment = {
    id: string;
    objectType: 'region' | 'site' | 'location';
    objectId: string;
    contactId: string;
    roleId: string;
}
export const initialContactAssignments: ContactAssignment[] = [
    { id: 'assign-1', objectType: 'region', objectId: 'na', contactId: 'contact-2', roleId: 'role-admin'},
    { id: 'assign-2', objectType: 'site', objectId: 'florim-tn', contactId: 'contact-1', roleId: 'role-technical'},
];


// Tags
export type Tag = {
    id: string;
    name: string;
    description: string;
}
export const initialTags: Tag[] = [
    { id: 'tag-1', name: 'Critical', description: 'Critical infrastructure devices' },
    { id: 'tag-2', name: 'Core', description: 'Core network infrastructure' },
    { id: 'tag-3', name: 'Users', description: 'User-facing networks or devices' },
    { id: 'tag-4', name: 'Security', description: 'Security appliances and configurations' },
];

// --- DEVICES ---
// Device Roles
export type DeviceRole = {
    id: string;
    name: string;
    description: string;
    color: string; // e.g., 'bg-blue-500'
}
export const initialDeviceRoles: DeviceRole[] = [
    { id: 'dr-1', name: 'Core Switch', description: 'Handles core network traffic', color: 'bg-indigo-500' },
    { id: 'dr-2', name: 'Edge Router', description: 'Routes traffic to/from external networks', color: 'bg-purple-500' },
    { id: 'dr-3', name: 'Access Switch', description: 'Connects end-user devices', color: 'bg-blue-500' },
    { id: 'dr-4', name: 'Virtualization Host', description: 'Hosts virtual machines', color: 'bg-orange-500' },
    { id: 'dr-5', name: 'Firewall', description: 'Network security appliance', color: 'bg-red-500' },
]

// Platforms
export type Platform = {
    id: string;
    name: string;
    manufacturer: string;
    description?: string;
}
export const initialPlatforms: Platform[] = [
    { id: 'p-1', name: 'Junos', manufacturer: 'Juniper' },
    { id: 'p-2', name: 'Cisco IOS-XR', manufacturer: 'Cisco' },
    { id: 'p-3', name: 'Arista EOS', manufacturer: 'Arista' },
    { id: 'p-4', name: 'VMware ESXi', manufacturer: 'Dell' },
    { id: 'p-5', name: 'Palo Alto PAN-OS', manufacturer: 'Palo Alto' },
]

// Device Types
export type DeviceType = {
    id: string;
    manufacturer: string;
    model: string;
    u_height: number;
    description?: string;
}
export const initialDeviceTypes: DeviceType[] = [
    { id: 'dt-1', manufacturer: 'Juniper', model: 'QFX5120', u_height: 2 },
    { id: 'dt-2', manufacturer: 'Cisco', model: 'ASR1001-X', u_height: 1 },
    { id: 'dt-3', manufacturer: 'Arista', model: '720XP', u_height: 1 },
    { id: 'dt-4', manufacturer: 'Dell', model: 'PowerEdge R740', u_height: 2 },
    { id: 'dt-5', manufacturer: 'Palo Alto', model: 'PA-3220', u_height: 2 },
]

// Virtual Chassis
export type VirtualChassis = {
    id: string;
    name: string;
    domain: string;
    masterId: string; // device name for simplicity
    memberIds: string[];
}
export const initialVirtualChassis: VirtualChassis[] = [
    { id: 'vc-1', name: 'Core-Stack-01', domain: 'default', masterId: 'core-sw-01', memberIds: ['core-sw-01', 'core-sw-02'] }
]

// Modules (placeholder for now)
export type Module = {
    id: string;
    name: string;
};
export const initialModules: Module[] = [];

export type Device = {
    name: string;
    deviceTypeId: string; 
    status: "active" | "offline" | "provisioning" | "staged" | "decommissioning";
    deviceRoleId: string; 
    platformId?: string; 
    siteId: string; 
    ip?: string;
    tags: string[];

    // Virtualization
    clusterId?: string;

    // Tenancy
    tenantGroupId?: string;
    tenantId?: string;

    // Hardware
    description?: string;
    airflow?: 'front-to-rear' | 'rear-to-front' | 'side-to-rear' | 'passive';
    serial?: string;
    assetTag?: string;

    // Location
    locationId?: string;
    rackId?: string;
    rackFace?: 'front' | 'rear';
    position?: number;
    latitude?: number;
    longitude?: number;

    // Management
    configTemplate?: string;

    // Virtual Chassis
    virtualChassisId?: string; 
    vcPosition?: number;
    vcPriority?: number;
};
  
export const initialDevices: Device[] = [
    {
        name: "core-sw-01",
        deviceTypeId: "dt-1",
        status: "active",
        deviceRoleId: "dr-1",
        platformId: "p-1",
        siteId: "florim-tn",
        ip: "10.1.1.2",
        tags: ["core", "critical"],
        virtualChassisId: 'vc-1',
        vcPosition: 1,
        vcPriority: 255,
        rackId: 'rack-1',
        position: 40,
        rackFace: 'front',
        assetTag: 'AST-001',
        serial: 'SN-CORE01',
    },
    {
        name: "edge-router-01",
        deviceTypeId: "dt-2",
        status: "active",
        deviceRoleId: "dr-2",
        platformId: "p-2",
        siteId: "florim-tn",
        ip: "192.0.2.1",
        tags: ["edge", "critical"],
        assetTag: 'AST-002',
        serial: 'SN-EDGE01',
    },
    {
        name: "access-sw-lobby",
        deviceTypeId: "dt-3",
        status: "offline",
        deviceRoleId: "dr-3",
        platformId: "p-3",
        siteId: "dub-office",
        ip: "10.10.20.5",
        tags: ["access", "users"],
        assetTag: 'AST-003',
        serial: 'SN-ACCESS01',
    },
    {
        name: "server-vmhost-01",
        deviceTypeId: "dt-4",
        status: "active",
        deviceRoleId: "dr-4",
        platformId: "p-4",
        siteId: "florim-tn",
        ip: "10.2.5.10",
        tags: ["compute", "vmware"],
        clusterId: 'cluster-1',
        assetTag: 'AST-004',
        serial: 'SN-VMHOST01',
    },
    {
        name: "firewall-corp",
        deviceTypeId: "dt-5",
        status: "provisioning",
        deviceRoleId: "dr-5",
        platformId: "p-5",
        siteId: "florim-tn",
        ip: "10.1.1.1",
        tags: ["security"],
        assetTag: 'AST-005',
        serial: 'SN-FW01',
    },
    {
        name: "core-sw-02",
        deviceTypeId: "dt-1",
        status: "active",
        deviceRoleId: "dr-1",
        platformId: "p-1",
        siteId: "florim-tn",
        ip: "10.1.1.3",
        tags: ["core", "critical"],
        virtualChassisId: 'vc-1',
        vcPosition: 2,
        vcPriority: 254,
        rackId: 'rack-1',
        position: 38,
        rackFace: 'front',
        assetTag: 'AST-006',
        serial: 'SN-CORE02',
    },
];

// --- RACKS ---
export type RackRole = {
    id: string;
    name: string;
    description: string;
    color: string;
};
export const initialRackRoles: RackRole[] = [
    { id: 'role-1', name: 'Core Network', description: 'For core switches and routers', color: '#3b82f6' },
    { id: 'role-2', name: 'Compute', description: 'For servers and virtualization hosts', color: '#f97316' },
    { id: 'role-3', name: 'Storage', description: 'For SAN/NAS equipment', color: '#8b5cf6' },
];

export type RackType = {
    id: string;
    manufacturer: string;
    model: string;
    u_height: number;
    width: '19in' | '23in';
};
export const initialRackTypes: RackType[] = [
    { id: 'type-1', manufacturer: 'APC', model: 'AR3100', u_height: 42, width: '19in' },
    { id: 'type-2', manufacturer: 'Dell', model: 'PowerEdge 4220', u_height: 42, width: '19in' },
];

export type Rack = {
    id: string;
    name: string;
    siteId: string;
    locationId?: string;
    status: 'active' | 'planned' | 'decommissioned';
    roleId?: string;
    typeId?: string;
    description?: string;
    airflow?: 'front-to-rear' | 'rear-to-front' | 'mixed' | 'passive';
    tags: string[];
    facilityId?: string;
    serial?: string;
    assetTag?: string;
    tenantGroupId?: string;
    tenantId?: string;
    width: '19in' | '23in';
    startingUnit: number;
    u_height: number;
    outerWidth?: number;
    outerHeight?: number;
    outerDepth?: number;
    outerUnit?: 'mm' | 'in';
    weight?: number;
    maxWeight?: number;
    weightUnit?: 'kg' | 'lb';
    mountingDepth?: number;
    deviceCount: number;
    spaceUtilization: number;
    comments?: string;
};

export const initialRacks: Rack[] = [
    {
        id: 'rack-1',
        name: 'A101',
        siteId: 'florim-tn',
        locationId: 'tn-dc-room-1',
        roleId: 'role-1',
        typeId: 'type-1',
        status: 'active',
        u_height: 42,
        width: '19in',
        startingUnit: 1,
        tags: ['core', 'main-row'],
        facilityId: "DC-A1-101",
        tenantId: "tenant-a",
        deviceCount: 12,
        spaceUtilization: 71,
        comments: "Main distribution rack for Row A.",
    },
    {
        id: 'rack-2',
        name: 'A102',
        siteId: 'florim-tn',
        locationId: 'tn-dc-room-1',
        roleId: 'role-2',
        typeId: 'type-1',
        status: 'planned',
        u_height: 42,
        width: '19in',
        startingUnit: 1,
        tags: ['compute', 'expansion'],
        tenantId: "tenant-a",
        deviceCount: 0,
        spaceUtilization: 0,
        comments: "Reserved for future compute expansion.",
    },
    {
        id: 'rack-3',
        name: 'B201',
        siteId: 'dub-office',
        status: 'active',
        u_height: 48,
        width: '19in',
        startingUnit: 1,
        tags: [],
        roleId: 'role-3',
        tenantId: 'tenant-b',
        deviceCount: 4,
        spaceUtilization: 25,
        comments: "IDF for 2nd floor.",
    },
];

export type RackReservation = {
    id: string;
    rackId: string;
    units: number[];
    tenantId: string;
    description: string;
};
export const initialRackReservations: RackReservation[] = [
    { id: 'res-1', rackId: 'rack-1', units: [40, 41], tenantId: 'tenant-a', description: 'Reserved for new firewall cluster' },
];


// --- IPAM ---
export type IPAddress = {
    address: string;
    status: "active" | "reserved" | "dhcp" | "deprecated";
    assigned_object_type?: "device" | "vm" | "interface";
    assigned_object_id?: string;
    dns_name?: string;
    description?: string;
};
  
export type Prefix = {
    prefix: string;
    status: "active" | "reserved" | "deprecated";
    site: string;
    description: string;
    tags: string[];
    usage: number;
    ips: IPAddress[];
};
  
export const prefixes: Prefix[] = [
      {
          prefix: "10.1.1.0/24",
          status: "active",
          site: "Florim TN Data Center",
          description: "Core Server Segment",
          tags: ["core", "servers", "production"],
          usage: 40,
          ips: [
              { address: "10.1.1.1", status: "active", assigned_object_type: "device", assigned_object_id: "core-sw-01", dns_name: "core-sw-01.example.com", description: "Gateway" },
              { address: "10.1.1.10", status: "active", assigned_object_type: "vm", assigned_object_id: "web-server-01", dns_name: "web-server-01.example.com", description: "Primary Web Server" },
              { address: "10.1.1.11", status: "dhcp", assigned_object_type: "vm", assigned_object_id: "web-server-02" },
              { address: "10.1.1.254", status: "reserved", description: "Broadcast" },
          ],
      },
      {
          prefix: "192.168.10.0/24",
          status: "active",
          site: "Dublin Office",
          description: "Corporate User Desktops",
          tags: ["users", "corp"],
          usage: 85,
          ips: [
               { address: "192.168.10.55", status: "dhcp", assigned_object_type: "device", assigned_object_id: "jdoe-laptop", dns_name: "jdoe-laptop.corp.example.com" },
          ],
      },
      {
          prefix: "172.16.0.0/16",
          status: "deprecated",
          site: "Legacy DC",
          description: "Old Guest Network - To be removed",
          tags: ["legacy", "guest"],
          usage: 10,
          ips: [],
      },
];

// --- DASHBOARD ---
export const recentActivity = [
    {
      id: 1,
      user: "admin",
      action: "add_device",
      target: "edge-router-01",
      status: "Success",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "jdoe",
      action: "patch_cable",
      target: "core-sw-01:ge-0/0/1",
      status: "Success",
      time: "5 hours ago",
    },
    {
      id: 3,
      user: "automation",
      action: "update_ip",
      target: "10.1.1.15",
      status: "Success",
      time: "1 day ago",
    },
    {
      id: 4,
      user: "admin",
      action: "add_vlan",
      target: "VLAN 100",
      status: "Failed",
      time: "2 days ago",
    },
];

// --- VIRTUALIZATION ---
export type ClusterType = {
    id: string;
    name: string;
    description: string;
};
export const initialClusterTypes: ClusterType[] = [
    { id: 'ct-1', name: 'VMware vSphere', description: 'VMware ESXi virtualization platform' },
    { id: 'ct-2', name: 'Proxmox VE', description: 'Open-source virtualization platform' },
];

export type ClusterGroup = {
    id: string;
    name: string;
    description: string;
};
export const initialClusterGroups: ClusterGroup[] = [
    { id: 'cg-1', name: 'Production Compute', description: 'Clusters hosting production workloads' },
    { id: 'cg-2', name: 'Lab Environment', description: 'Clusters for testing and development' },
];

export type Cluster = {
    id: string;
    name: string;
    typeId: string;
    groupId: string;
    siteId?: string;
    comments: string;
    vmCount: number;
};
export const initialClusters: Cluster[] = [
    { id: 'cluster-1', name: 'Prod-Compute-East', typeId: 'ct-1', groupId: 'cg-1', siteId: 'florim-tn', comments: 'Primary production vSphere cluster in TN.', vmCount: 25 },
    { id: 'cluster-2', name: 'Dev-Lab-Cluster', typeId: 'ct-2', groupId: 'cg-2', siteId: 'dub-office', comments: 'Proxmox lab for developers.', vmCount: 10 },
];

export type VirtualMachine = {
    id: string;
    name: string;
    status: 'active' | 'offline' | 'building';
    clusterId: string;
    role: string;
    vcpus: number;
    memory: number; // in GB
    disk: number; // in GB
    primary_ip: string;
};
export const initialVirtualMachines: VirtualMachine[] = [
    { id: 'vm-1', name: 'web-prod-01', status: 'active', clusterId: 'cluster-1', role: 'Web Server', vcpus: 4, memory: 8, disk: 100, primary_ip: '10.1.1.10' },
    { id: 'vm-2', name: 'db-prod-01', status: 'active', clusterId: 'cluster-1', role: 'Database Server', vcpus: 8, memory: 32, disk: 500, primary_ip: '10.1.1.12' },
    { id: 'vm-3', name: 'test-runner-ci', status: 'offline', clusterId: 'cluster-2', role: 'CI/CD Runner', vcpus: 2, memory: 4, disk: 50, primary_ip: '192.168.10.100' },
];

// --- CIRCUITS ---
export type Provider = {
    id: string;
    name: string;
    asn?: number;
    account: string;
};
export const initialProviders: Provider[] = [
    { id: 'prov-1', name: 'AT&T', asn: 7018, account: 'ACCT-12345' },
    { id: 'prov-2', name: 'Lumen', asn: 3356, account: 'ACCT-67890' },
];

export type CircuitType = {
    id: string;
    name: string;
    description: string;
};
export const initialCircuitTypes: CircuitType[] = [
    { id: 'ctype-1', name: 'Internet Transit', description: 'DIA circuit' },
    { id: 'ctype-2', name: 'Private WAN', description: 'MPLS or VPLS circuit' },
];

export type Circuit = {
    id: string;
    cid: string; // Circuit ID
    providerId: string;
    typeId: string;
    status: 'active' | 'provisioning' | 'offline' | 'decommissioned';
    installDate: string;
    commitRate: number; // in Mbps
    description: string;
    termA_siteId: string;
    termZ_siteId: string;
};
export const initialCircuits: Circuit[] = [
    { id: 'circ-1', cid: '123-ABC-456', providerId: 'prov-1', typeId: 'ctype-1', status: 'active', installDate: '2023-01-15', commitRate: 1000, description: 'Primary DIA at Florim TN', termA_siteId: 'florim-tn', termZ_siteId: 'florim-tn' },
    { id: 'circ-2', cid: '987-XYZ-654', providerId: 'prov-2', typeId: 'ctype-2', status: 'provisioning', installDate: '2024-08-01', commitRate: 500, description: 'WAN link to Dublin', termA_siteId: 'florim-tn', termZ_siteId: 'dub-office' },
];


// --- WIRELESS ---
export type WirelessLan = {
    id: string;
    ssid: string;
    vlan?: string;
    description: string;
    authType: 'Open' | 'WEP' | 'WPA Personal' | 'WPA Enterprise';
};
export const initialWirelessLans: WirelessLan[] = [
    { id: 'wlan-1', ssid: 'InfraLynx-Corp', vlan: '100', description: 'Corporate employee network', authType: 'WPA Enterprise' },
    { id: 'wlan-2', ssid: 'InfraLynx-Guest', vlan: '200', description: 'Guest access network', authType: 'Open' },
];

export type AccessPoint = {
    id: string;
    name: string;
    siteId: string;
    status: 'active' | 'offline' | 'planned';
    model: string;
    ipAddress: string;
};
export const initialAccessPoints: AccessPoint[] = [
    { id: 'ap-1', name: 'AP-Lobby-1', siteId: 'florim-tn', status: 'active', model: 'Cisco C9120AXI', ipAddress: '10.1.1.200' },
    { id: 'ap-2', name: 'AP-Eng-1', siteId: 'dub-office', status: 'planned', model: 'Aruba AP-535', ipAddress: '10.2.1.201' },
];

// --- VPN ---
export type VpnTunnel = {
    id: string;
    name: string;
    status: 'active' | 'disabled' | 'planned';
    type: 'IPsec' | 'OpenVPN' | 'WireGuard';
    localPeer: string;
    remotePeer: string;
    description: string;
};
export const initialVpnTunnels: VpnTunnel[] = [
    { id: 'vpn-1', name: 'Site2Site-TN-to-DUB', status: 'planned', type: 'IPsec', localPeer: '192.0.2.1', remotePeer: '203.0.113.1', description: 'Site-to-site tunnel between main data centers' },
    { id: 'vpn-2', name: 'Remote-Access-VPN', status: 'active', type: 'OpenVPN', localPeer: '192.0.2.2', remotePeer: 'dynamic', description: 'Client VPN for remote employees' },
];

// --- POWER ---
export type PowerPanel = {
    id: string;
    name: string;
    siteId: string;
    locationId?: string;
    voltage: number;
    phase: 'single-phase' | 'three-phase';
    capacityAmps: number;
};
export const initialPowerPanels: PowerPanel[] = [
    { id: 'pp-1', name: 'PP-A1', siteId: 'florim-tn', locationId: 'tn-dc-room-1', voltage: 208, phase: 'three-phase', capacityAmps: 100 },
    { id: 'pp-2', name: 'PP-A2', siteId: 'florim-tn', locationId: 'tn-dc-room-1', voltage: 208, phase: 'three-phase', capacityAmps: 100 },
];

export type PowerFeed = {
    id: string;
    name: string;
    panelId: string;
    rackId?: string;
    status: 'active' | 'offline' | 'planned';
    type: 'primary' | 'redundant';
    amperage: number;
    voltage: number;
};
export const initialPowerFeeds: PowerFeed[] = [
    { id: 'pf-1', name: 'PP-A1-01A', panelId: 'pp-1', rackId: 'rack-1', status: 'active', type: 'primary', amperage: 30, voltage: 208 },
    { id: 'pf-2', name: 'PP-A2-01B', panelId: 'pp-2', rackId: 'rack-1', status: 'active', type: 'redundant', amperage: 30, voltage: 208 },
];
