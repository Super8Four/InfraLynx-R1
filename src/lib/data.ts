
export type Region = {
  id: string
  name: string
  description?: string
  tags: string[]
  parentId?: string | null
}

export type SiteGroup = {
  id: string
  name: string
  description?: string
}

export type Site = {
  id: string;
  name: string;
  regionId?: string | null;
  status: 'active' | 'planned' | 'offline' | 'decommissioning';
  groupId?: string | null;
  tags: string[];
  latitude?: number;
  longitude?: number;
  tenantId?: string | null;
  physicalAddress?: string;
  imageUrl?: string;
  facility?: string;
  asns?: string;
  timeZone?: string;
  description?: string;
  comments?: string;
  tenantGroupId?: string | null;
};

export type Location = {
  id: string
  name: string
  siteId: string
  description: string
}

export type TenantGroup = {
  id: string
  name: string
  description: string
}

export type Tenant = {
  id: string
  name: string
  groupId?: string
  description: string
}

export type ContactGroup = {
  id: string
  name: string
  description: string
}

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  title: string
  groupId?: string
}

export type ContactRole = {
  id: string
  name: string
  description: string
}

export type ContactAssignment = {
  id: string
  objectType: 'region' | 'site' | 'location'
  objectId: string
  contactId: string
  roleId: string
}

export type Tag = {
  id: string
  name: string
  description: string
}

export type DeviceRole = {
  id: string
  name: string
  description: string
  color: string
}

export type Platform = {
  id: string
  name: string
  manufacturer: string
  description: string
}

export type DeviceType = {
  id: string
  manufacturer: string
  model: string
  u_height: number
}

export type VirtualChassis = {
  id: string
  name: string
  domain: string
  masterId: string
  memberIds: string[]
}

export type Device = {
  id?: string
  name: string
  deviceTypeId: string
  status: 'active' | 'offline' | 'provisioning' | 'staged' | 'decommissioning'
  deviceRoleId: string
  platformId?: string | null
  siteId: string
  site?: string // Legacy, prefer siteId
  ip?: string
  tags: string[]
  virtualChassisId?: string | null
  vcPosition?: number | null
  vcPriority?: number | null
  rackId?: string | null
  position?: number | null
  rackFace?: 'front' | 'rear' | null
  assetTag?: string | null
  serial?: string | null
  clusterId?: string | null
  tenantId?: string | null
  tenantGroupId?: string | null
}


export type RackRole = {
  id: string
  name: string
  description: string
  color: string
}

export type RackType = {
  id: string
  manufacturer: string
  model: string
  u_height: number
  width: 'nineteen_in' | 'twenty_three_in' | '19in' | '23in'
}

export type Rack = {
  id: string
  name: string
  siteId: string
  locationId?: string | null
  roleId?: string | null
  typeId?: string | null
  status: 'active' | 'planned' | 'decommissioned'
  u_height: number
  width: 'nineteen_in' | 'twenty_three_in' | '19in' | '23in'
  tags: string[]
  facilityId?: string | null
  tenantId?: string | null
  comments?: string
  deviceCount?: number;
  spaceUtilization?: number;
  startingUnit?: number;
  serial?: string;
  assetTag?: string;
  tenantGroupId?: string;
}

export type RackReservation = {
  id: string
  rackId: string
  units: number[]
  tenantId: string
  description: string
}

export type IPAddress = {
  id: string
  address: string
  status: 'active' | 'reserved' | 'deprecated' | 'dhcp'
  assignedObjectType?: 'device' | 'vm' | 'interface' | null
  assignedObjectId?: string | null
  dns_name?: string | null
  description?: string | null
  prefixId?: string
}

export type Prefix = {
  id: string
  prefix: string
  status: 'active' | 'reserved' | 'deprecated' | 'dhcp'
  site: string
  description: string
  tags: string[]
  ips: IPAddress[]
}

export type Provider = {
  id: string
  name: string
  asn: number
  account: string
}

export type CircuitType = {
  id: string
  name: string
  description: string
}

export type Circuit = {
  id: string
  cid: string
  providerId: string
  typeId: string
  status: 'active' | 'provisioning' | 'offline' | 'decommissioned'
  installDate: Date | string
  commitRate: number
  description: string
  termA_siteId: string
  termZ_siteId: string
}

export type WirelessLan = {
  id: string
  ssid: string
  vlan: string
  description: string
  authType: 'Open' | 'WEP' | 'WPA Personal' | 'WPA Enterprise'
}

export type AccessPoint = {
  id: string
  name: string
  siteId: string
  status: 'active' | 'planned' | 'offline'
  model: string
  ipAddress: string
}

export type VpnTunnel = {
  id: string
  name: string
  status: 'active' | 'disabled' | 'planned'
  type: 'IPsec' | 'OpenVPN' | 'WireGuard'
  localPeer: string
  remotePeer: string
  description: string
}

export type PowerPanel = {
  id: string
  name: string
  siteId: string
  locationId?: string | null
  voltage: number
  phase: 'single-phase' | 'three-phase'
  capacityAmps: number
}

export type PowerFeed = {
  id: string
  name: string
  panelId: string
  rackId?: string | null
  status: 'active' | 'planned' | 'offline'
  type: 'primary' | 'redundant'
  amperage: number
  voltage: number
}

export type ClusterType = {
  id: string
  name: string
  description: string
}

export type ClusterGroup = {
  id: string
  name: string
  description: string
}

export type Cluster = {
  id: string
  name: string
  typeId: string
  groupId: string
  siteId?: string | null
  comments: string
  vmCount: number
}

export type VirtualMachine = {
  id: string
  name: string
  status: 'active' | 'offline' | 'building'
  clusterId: string
  role: string
  vcpus: number
  memory: number
  disk: number
  primaryIp?: string | null
}


// --- DATA ---

export const initialRegions: Region[] = [
    { id: 'na', name: 'North America', description: 'All US and Canadian facilities', tags: ["amer"], parentId: null },
    { id: 'eu', name: 'Europe', description: 'European data centers and offices', tags: ["emea"], parentId: null },
    { id: 'us-east', name: 'US East', description: 'East coast data centers', tags: [], parentId: 'na' },
];

export const initialSiteGroups: SiteGroup[] = [
    { id: 'dc', name: 'Data Centers', description: 'Primary data center facilities' },
    { id: 'office', name: 'Branch Offices', description: 'Remote office locations' },
];

export const initialSites: Site[] = [
    { id: 'florim-tn', name: 'Florim TN Data Center', regionId: 'us-east', status: 'active', groupId: 'dc', tags: ['primary'], latitude: 36.5297, longitude: -87.3595, tenantId: 'tenant-a', physicalAddress: '123 Main St, Clarksville, TN', imageUrl: 'https://placehold.co/600x400.png', facility: 'CL-01', asns: '65000', timeZone: 'America/Chicago', description: 'Primary data center facility for North American operations.', comments: 'All shipments must be scheduled 24 hours in advance with DC operations.' },
    { id: 'dub-office', name: 'Dublin Office', regionId: 'eu', status: 'planned', groupId: 'office', tags: [], latitude: 53.3498, longitude: -6.2603, tenantId: 'tenant-b', physicalAddress: '456 O\'Connell Street, Dublin, Ireland', imageUrl: 'https://placehold.co/600x400.png', facility: 'DUB-01', timeZone: 'Europe/Dublin', description: 'Main European branch office and development hub.' },
    { id: 'legacy-dc', name: 'Legacy DC', status: 'decommissioning', tags: [], description: "Legacy DC" }
];

export const initialLocations: Location[] = [
    { id: 'tn-dc-room-1', name: 'Server Room 1', siteId: 'florim-tn', description: 'Main server room housing racks A1–A10'},
    { id: 'tn-dc-room-2', name: 'Meet-Me-Room', siteId: 'florim-tn', description: 'Carrier interconnect room'},
];

export const initialTenantGroups: TenantGroup[] = [
    { id: 'tg-1', name: 'Corporate', description: 'Corporate Tenants' },
    { id: 'tg-2', name: 'External Customers', description: 'External Customer Tenants' },
];

export const initialTenants: Tenant[] = [
    { id: 'tenant-a', name: 'Internal Services', groupId: 'tg-1', description: 'Company-internal applications and infrastructure' },
    { id: 'tenant-b', name: 'Customer Hosting', groupId: 'tg-2', description: 'Shared hosting platform for external customers' },
];

export const initialContactGroups: ContactGroup[] = [
    { id: 'cg-1', name: 'NOC Team', description: 'Network Operations Center team members.' },
    { id: 'cg-2', name: 'DC On-call', description: 'Data Center on-call personnel.' },
];

export const initialContacts: Contact[] = [
    { id: 'contact-1', name: 'John Doe', email: 'j.doe@example.com', phone: '123-456-7890', title: 'Network Engineer', groupId: 'cg-1' },
    { id: 'contact-2', name: 'Jane Smith', email: 'j.smith@example.com', phone: '098-765-4321', title: 'Data Center Manager', groupId: 'cg-2' },
];

export const initialContactRoles: ContactRole[] = [
    { id: 'role-noc', name: 'NOC', description: 'Network Operations Center contact.'},
    { id: 'role-admin', name: 'Administrative', description: 'Administrative or billing contact.'},
    { id: 'role-technical', name: 'Technical', description: 'Primary technical point of contact.'},
]

export const initialContactAssignments: ContactAssignment[] = [
    { id: 'assign-1', objectType: 'region', objectId: 'na', contactId: 'contact-2', roleId: 'role-admin'},
    { id: 'assign-2', objectType: 'site', objectId: 'florim-tn', contactId: 'contact-1', roleId: 'role-technical'},
];

export const initialTags: Tag[] = [
    { id: 'tag-1', name: 'Critical', description: 'Critical infrastructure devices' },
    { id: 'tag-2', name: 'Core', description: 'Core network infrastructure' },
    { id: 'tag-3', name: 'Users', description: 'User-facing networks or devices' },
    { id: 'tag-4', name: 'Security', description: 'Security appliances and configurations' },
];

export const initialDeviceRoles: DeviceRole[] = [
    { id: 'dr-1', name: 'Core Switch', description: 'Handles core network traffic', color: 'bg-indigo-500' },
    { id: 'dr-2', name: 'Edge Router', description: 'Routes traffic to/from external networks', color: 'bg-purple-500' },
    { id: 'dr-3', name: 'Access Switch', description: 'Connects end-user devices', color: 'bg-blue-500' },
    { id: 'dr-4', name: 'Virtualization Host', description: 'Hosts virtual machines', color: 'bg-orange-500' },
    { id: 'dr-5', name: 'Firewall', description: 'Network security appliance', color: 'bg-red-500' },
];

export const initialPlatforms: Platform[] = [
    { id: 'p-1', name: 'Junos', manufacturer: 'Juniper', description: "" },
    { id: 'p-2', name: 'Cisco IOS-XR', manufacturer: 'Cisco', description: "" },
    { id: 'p-3', name: 'Arista EOS', manufacturer: 'Arista', description: "" },
    { id: 'p-4', name: 'VMware ESXi', manufacturer: 'Dell', description: "" },
    { id: 'p-5', name: 'Palo Alto PAN-OS', manufacturer: 'Palo Alto', description: "" },
];

export const initialDeviceTypes: DeviceType[] = [
    { id: 'dt-1', manufacturer: 'Juniper', model: 'QFX5120', u_height: 2 },
    { id: 'dt-2', manufacturer: 'Cisco', model: 'ASR1001-X', u_height: 1 },
    { id: 'dt-3', manufacturer: 'Arista', model: '720XP', u_height: 1 },
    { id: 'dt-4', manufacturer: 'Dell', model: 'PowerEdge R740', u_height: 2 },
    { id: 'dt-5', manufacturer: 'Palo Alto', model: 'PA-3220', u_height: 2 },
];

export const initialVirtualChassis: VirtualChassis[] = [
    { id: 'vc-1', name: 'Core-Stack-01', domain: 'default', masterId: 'core-sw-01', memberIds: ['dev-1', 'dev-6'] }
];

export const initialDevices: Device[] = [
    { id: 'dev-1', name: "core-sw-01", deviceTypeId: "dt-1", status: 'active', deviceRoleId: "dr-1", platformId: "p-1", siteId: "florim-tn", ip: "10.1.1.2", tags: ["core", "critical"], virtualChassisId: 'vc-1', vcPosition: 1, vcPriority: 255, rackId: 'rack-1', position: 40, rackFace: 'front', assetTag: 'AST-001', serial: 'SN-CORE01' },
    { id: 'dev-2', name: "edge-router-01", deviceTypeId: "dt-2", status: 'active', deviceRoleId: "dr-2", platformId: "p-2", siteId: "florim-tn", ip: "192.0.2.1", tags: ["edge", "critical"], assetTag: 'AST-002', serial: 'SN-EDGE01' },
    { id: 'dev-3', name: "access-sw-lobby", deviceTypeId: "dt-3", status: 'offline', deviceRoleId: "dr-3", platformId: "p-3", siteId: "dub-office", ip: "10.10.20.5", tags: ["access", "users"], assetTag: 'AST-003', serial: 'SN-ACCESS01' },
    { id: 'dev-4', name: "server-vmhost-01", deviceTypeId: "dt-4", status: 'active', deviceRoleId: "dr-4", platformId: "p-4", siteId: "florim-tn", ip: "10.2.5.10", tags: ["compute", "vmware"], clusterId: 'cluster-1', assetTag: 'AST-004', serial: 'SN-VMHOST01' },
    { id: 'dev-5', name: "firewall-corp", deviceTypeId: "dt-5", status: 'provisioning', deviceRoleId: "dr-5", platformId: "p-5", siteId: "florim-tn", ip: "10.1.1.1", tags: ["security"], assetTag: 'AST-005', serial: 'SN-FW01' },
    { id: 'dev-6', name: "core-sw-02", deviceTypeId: "dt-1", status: 'active', deviceRoleId: "dr-1", platformId: "p-1", siteId: "florim-tn", ip: "10.1.1.3", tags: ["core", "critical"], virtualChassisId: 'vc-1', vcPosition: 2, vcPriority: 254, rackId: 'rack-1', position: 38, rackFace: 'front', assetTag: 'AST-006', serial: 'SN-CORE02' },
];

export const initialRackRoles: RackRole[] = [
    { id: 'role-1', name: 'Core Network', description: 'For core switches and routers', color: '#3b82f6' },
    { id: 'role-2', name: 'Compute', description: 'For servers and virtualization hosts', color: '#f97316' },
    { id: 'role-3', name: 'Storage', description: 'For SAN/NAS equipment', color: '#8b5cf6' },
];

export const initialRackTypes: RackType[] = [
    { id: 'type-1', manufacturer: 'APC', model: 'AR3100', u_height: 42, width: '19in' },
    { id: 'type-2', manufacturer: 'Dell', model: 'PowerEdge 4220', u_height: 42, width: '19in' },
];

export const initialRacks: Rack[] = [
    { id: 'rack-1', name: 'A101', siteId: 'florim-tn', locationId: 'tn-dc-room-1', roleId: 'role-1', typeId: 'type-1', status: 'active', u_height: 42, width: '19in', tags: ['core', 'main-row'], facilityId: "DC-A1-101", tenantId: "tenant-a", comments: "Main distribution rack for Row A.", deviceCount: 2, spaceUtilization: 9.5 },
    { id: 'rack-2', name: 'A102', siteId: 'florim-tn', locationId: 'tn-dc-room-1', roleId: 'role-2', typeId: 'type-1', status: 'planned', u_height: 42, width: '19in', tags: ['compute', 'expansion'], tenantId: "tenant-a", comments: "Reserved for future compute expansion.", deviceCount: 0, spaceUtilization: 0 },
    { id: 'rack-3', name: 'B201', siteId: 'dub-office', status: 'active', u_height: 48, width: '19in', tags: [], roleId: 'role-3', tenantId: 'tenant-b', comments: "IDF for 2nd floor.", deviceCount: 0, spaceUtilization: 0 },
];

export const initialRackReservations: RackReservation[] = [
    { id: 'res-1', rackId: 'rack-1', units: [40, 41], tenantId: 'tenant-a', description: 'Reserved for new firewall cluster' },
];

const allIpAddresses: IPAddress[] = [
    { id: 'ip-1', address: "10.1.1.1", status: 'active', assignedObjectType: "device", assignedObjectId: "dev-1", dns_name: "core-sw-01.example.com", description: "Gateway", prefixId: 'prefix-1' },
    { id: 'ip-2', address: "10.1.1.10", status: 'active', assignedObjectType: "vm", assignedObjectId: "vm-1", dns_name: "web-server-01.example.com", description: "Primary Web Server", prefixId: 'prefix-1' },
    { id: 'ip-3', address: "10.1.1.11", status: 'dhcp', assignedObjectType: "vm", assignedObjectId: "vm-2", prefixId: 'prefix-1' },
    { id: 'ip-4', address: "10.1.1.254", status: 'reserved', description: "Broadcast", prefixId: 'prefix-1' },
    { id: 'ip-5', address: "192.168.10.55", status: 'dhcp', assignedObjectType: "device", assignedObjectId: "dev-3", dns_name: "jdoe-laptop.corp.example.com", prefixId: 'prefix-2' },
];

export const initialPrefixes: Prefix[] = [
      { id: 'prefix-1', prefix: "10.1.1.0/24", status: 'active', site: "Florim TN Data Center", description: "Core Server Segment", tags: ["core", "servers", "production"], ips: allIpAddresses.filter(ip => ip.prefixId === 'prefix-1') },
      { id: 'prefix-2', prefix: "192.168.10.0/24", status: 'active', site: "Dublin Office", description: "Corporate User Desktops", tags: ["users", "corp"], ips: allIpAddresses.filter(ip => ip.prefixId === 'prefix-2') },
      { id: 'prefix-3', prefix: "172.16.0.0/16", status: 'deprecated', site: "Legacy DC", description: "Old Guest Network - To be removed", tags: ["legacy", "guest"], ips: allIpAddresses.filter(ip => ip.prefixId === 'prefix-3') },
];

export const initialProviders: Provider[] = [
    { id: 'prov-1', name: 'AT&T', asn: 7018, account: 'ACCT-12345' },
    { id: 'prov-2', name: 'Lumen', asn: 3356, account: 'ACCT-67890' },
];

export const initialCircuitTypes: CircuitType[] = [
    { id: 'ctype-1', name: 'Internet Transit', description: 'DIA circuit' },
    { id: 'ctype-2', name: 'Private WAN', description: 'MPLS or VPLS circuit' },
];

export const initialCircuits: Circuit[] = [
    { id: 'circ-1', cid: '123-ABC-456', providerId: 'prov-1', typeId: 'ctype-1', status: 'active', installDate: new Date('2023-01-15'), commitRate: 1000, description: 'Primary DIA at Florim TN', termA_siteId: 'florim-tn', termZ_siteId: 'florim-tn' },
    { id: 'circ-2', cid: '987-XYZ-654', providerId: 'prov-2', typeId: 'ctype-2', status: 'provisioning', installDate: new Date('2024-08-01'), commitRate: 500, description: 'WAN link to Dublin', termA_siteId: 'florim-tn', termZ_siteId: 'dub-office' },
];

export const initialWirelessLans: WirelessLan[] = [
    { id: 'wlan-1', ssid: 'InfraLynx-Corp', vlan: '100', description: 'Corporate employee network', authType: 'WPA Enterprise' },
    { id: 'wlan-2', ssid: 'InfraLynx-Guest', vlan: '200', description: 'Guest access network', authType: 'Open' },
];

export const initialAccessPoints: AccessPoint[] = [
    { id: 'ap-1', name: 'AP-Lobby-1', siteId: 'florim-tn', status: 'active', model: 'Cisco C9120AXI', ipAddress: '10.1.1.200' },
    { id: 'ap-2', name: 'AP-Eng-1', siteId: 'dub-office', status: 'planned', model: 'Aruba AP-535', ipAddress: '10.2.1.201' },
];

export const initialVpnTunnels: VpnTunnel[] = [
    { id: 'vpn-1', name: 'Site2Site-TN-to-DUB', status: 'planned', type: 'IPsec', localPeer: '192.0.2.1', remotePeer: '203.0.113.1', description: 'Site-to-site tunnel between main data centers' },
    { id: 'vpn-2', name: 'Remote-Access-VPN', status: 'active', type: 'OpenVPN', localPeer: '192.0.2.2', remotePeer: 'dynamic', description: 'Client VPN for remote employees' },
];

export const initialPowerPanels: PowerPanel[] = [
    { id: 'pp-1', name: 'PP-A1', siteId: 'florim-tn', locationId: 'tn-dc-room-1', voltage: 208, phase: 'three-phase', capacityAmps: 100 },
    { id: 'pp-2', name: 'PP-A2', siteId: 'florim-tn', locationId: 'tn-dc-room-1', voltage: 208, phase: 'three-phase', capacityAmps: 100 },
];

export const initialPowerFeeds: PowerFeed[] = [
    { id: 'pf-1', name: 'PP-A1-01A', panelId: 'pp-1', rackId: 'rack-1', status: 'active', type: 'primary', amperage: 30, voltage: 208 },
    { id: 'pf-2', name: 'PP-A2-01B', panelId: 'pp-2', rackId: 'rack-1', status: 'active', type: 'redundant', amperage: 30, voltage: 208 },
];

export const initialClusterTypes: ClusterType[] = [
    { id: 'ct-1', name: 'VMware vSphere', description: 'VMware ESXi virtualization platform' },
    { id: 'ct-2', name: 'Proxmox VE', description: 'Open-source virtualization platform' },
];

export const initialClusterGroups: ClusterGroup[] = [
    { id: 'cg-1', name: 'Production Compute', description: 'Clusters hosting production workloads' },
    { id: 'cg-2', name: 'Lab Environment', description: 'Clusters for testing and development' },
];

export const initialClusters: Cluster[] = [
    { id: 'cluster-1', name: 'Prod-Compute-East', typeId: 'ct-1', groupId: 'cg-1', siteId: 'florim-tn', comments: 'Primary production vSphere cluster in TN.', vmCount: 2 },
    { id: 'cluster-2', name: 'Dev-Lab-Cluster', typeId: 'ct-2', groupId: 'cg-2', siteId: 'dub-office', comments: 'Proxmox lab for developers.', vmCount: 1 },
];

export const initialVirtualMachines: VirtualMachine[] = [
    { id: 'vm-1', name: 'web-prod-01', status: 'active', clusterId: 'cluster-1', role: 'Web Server', vcpus: 4, memory: 8, disk: 100, primaryIp: '10.1.1.10' },
    { id: 'vm-2', name: 'db-prod-01', status: 'active', clusterId: 'cluster-1', role: 'Database Server', vcpus: 8, memory: 32, disk: 500, primaryIp: '10.1.1.12' },
    { id: 'vm-3', name: 'test-runner-ci', status: 'offline', clusterId: 'cluster-2', role: 'CI/CD Runner', vcpus: 2, memory: 4, disk: 50, primaryIp: '192.168.10.100' },
];
