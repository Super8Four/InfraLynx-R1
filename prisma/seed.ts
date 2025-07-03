import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- ORGANIZATION ---

const initialRegions = [
    { id: 'na', name: 'North America', description: 'All US and Canadian facilities', tags: ["amer"], parentId: null },
    { id: 'eu', name: 'Europe', description: 'European data centers and offices', tags: ["emea"], parentId: null },
    { id: 'us-east', name: 'US East', description: 'East coast data centers', tags: [], parentId: 'na' },
];

const initialSiteGroups = [
    { id: 'dc', name: 'Data Centers', description: 'Primary data center facilities' },
    { id: 'office', name: 'Branch Offices', description: 'Remote office locations' },
];

const initialSites = [
    { id: 'florim-tn', name: 'Florim TN Data Center', regionId: 'us-east', status: 'active', groupId: 'dc', tags: ['primary'], latitude: 36.5297, longitude: -87.3595, tenantId: 'tenant-a', tenantGroupId: 'tg-1', physicalAddress: '123 Main St, Clarksville, TN', imageUrl: 'https://placehold.co/600x400.png', facility: 'CL-01', asns: '65000', timeZone: 'America/Chicago', description: 'Primary data center facility for North American operations.', comments: 'All shipments must be scheduled 24 hours in advance with DC operations.' },
    { id: 'dub-office', name: 'Dublin Office', regionId: 'eu', status: 'planned', groupId: 'office', tags: [], latitude: 53.3498, longitude: -6.2603, tenantId: 'tenant-b', tenantGroupId: 'tg-2', physicalAddress: '456 O\'Connell Street, Dublin, Ireland', imageUrl: 'https://placehold.co/600x400.png', facility: 'DUB-01', timeZone: 'Europe/Dublin', description: 'Main European branch office and development hub.' },
    { id: 'legacy-dc', name: 'Legacy DC', status: 'decommissioning', tags: [], description: "Legacy DC" }
];

const initialLocations = [
    { id: 'tn-dc-room-1', name: 'Server Room 1', siteId: 'florim-tn', description: 'Main server room housing racks A1–A10'},
    { id: 'tn-dc-room-2', name: 'Meet-Me-Room', siteId: 'florim-tn', description: 'Carrier interconnect room'},
];

const initialTenantGroups = [
    { id: 'tg-1', name: 'Corporate', description: 'Corporate Tenants' },
    { id: 'tg-2', name: 'External Customers', description: 'External Customer Tenants' },
];

const initialTenants = [
    { id: 'tenant-a', name: 'Internal Services', groupId: 'tg-1', description: 'Company-internal applications and infrastructure' },
    { id: 'tenant-b', name: 'Customer Hosting', groupId: 'tg-2', description: 'Shared hosting platform for external customers' },
];

const initialContactGroups = [
    { id: 'cg-1', name: 'NOC Team', description: 'Network Operations Center team members.' },
    { id: 'cg-2', name: 'DC On-call', description: 'Data Center on-call personnel.' },
];

const initialContacts = [
    { id: 'contact-1', name: 'John Doe', email: 'j.doe@example.com', phone: '123-456-7890', title: 'Network Engineer', groupId: 'cg-1' },
    { id: 'contact-2', name: 'Jane Smith', email: 'j.smith@example.com', phone: '098-765-4321', title: 'Data Center Manager', groupId: 'cg-2' },
];

const initialContactRoles = [
    { id: 'role-noc', name: 'NOC', description: 'Network Operations Center contact.'},
    { id: 'role-admin', name: 'Administrative', description: 'Administrative or billing contact.'},
    { id: 'role-technical', name: 'Technical', description: 'Primary technical point of contact.'},
]

const initialContactAssignments = [
    { id: 'assign-1', objectType: 'Region', objectId: 'na', contactId: 'contact-2', roleId: 'role-admin'},
    { id: 'assign-2', objectType: 'Site', objectId: 'florim-tn', contactId: 'contact-1', roleId: 'role-technical'},
];

const initialTags = [
    { id: 'tag-1', name: 'Critical', description: 'Critical infrastructure devices' },
    { id: 'tag-2', name: 'Core', description: 'Core network infrastructure' },
    { id: 'tag-3', name: 'Users', description: 'User-facing networks or devices' },
    { id: 'tag-4', name: 'Security', description: 'Security appliances and configurations' },
];

const initialDeviceRoles = [
    { id: 'dr-1', name: 'Core Switch', description: 'Handles core network traffic', color: 'bg-indigo-500' },
    { id: 'dr-2', name: 'Edge Router', description: 'Routes traffic to/from external networks', color: 'bg-purple-500' },
    { id: 'dr-3', name: 'Access Switch', description: 'Connects end-user devices', color: 'bg-blue-500' },
    { id: 'dr-4', name: 'Virtualization Host', description: 'Hosts virtual machines', color: 'bg-orange-500' },
    { id: 'dr-5', name: 'Firewall', description: 'Network security appliance', color: 'bg-red-500' },
];

const initialPlatforms = [
    { id: 'p-1', name: 'Junos', manufacturer: 'Juniper', description: "" },
    { id: 'p-2', name: 'Cisco IOS-XR', manufacturer: 'Cisco', description: "" },
    { id: 'p-3', name: 'Arista EOS', manufacturer: 'Arista', description: "" },
    { id: 'p-4', name: 'VMware ESXi', manufacturer: 'Dell', description: "" },
    { id: 'p-5', name: 'Palo Alto PAN-OS', manufacturer: 'Palo Alto', description: "" },
];

const initialDeviceTypes = [
    { id: 'dt-1', manufacturer: 'Juniper', model: 'QFX5120', u_height: 2 },
    { id: 'dt-2', manufacturer: 'Cisco', model: 'ASR1001-X', u_height: 1 },
    { id: 'dt-3', manufacturer: 'Arista', model: '720XP', u_height: 1 },
    { id: 'dt-4', manufacturer: 'Dell', model: 'PowerEdge R740', u_height: 2 },
    { id: 'dt-5', manufacturer: 'Palo Alto', model: 'PA-3220', u_height: 2 },
];

const initialVirtualChassis = [
    { id: 'vc-1', name: 'Core-Stack-01', domain: 'default', masterId: 'dev-1' }
];

const initialDevices = [
    { id: 'dev-1', name: "core-sw-01", deviceTypeId: "dt-1", status: 'active', deviceRoleId: "dr-1", platformId: "p-1", siteId: "florim-tn", ip: "10.1.1.2", tags: ["core", "critical"], virtualChassisId: 'vc-1', vcPosition: 1, vcPriority: 255, rackId: 'rack-1', position: 40, rackFace: 'front', assetTag: 'AST-001', serial: 'SN-CORE01', configBackup: `!
version 15.1X53-D59.4
system {
    host-name core-sw-01;
}
interfaces {
    ge-0/0/0 {
        unit 0 {
            family ethernet-switching {
                vlan {
                    members 100;
                }
            }
        }
    }
}` },
    { id: 'dev-2', name: "edge-router-01", deviceTypeId: "dt-2", status: 'active', deviceRoleId: "dr-2", platformId: "p-2", siteId: "florim-tn", ip: "192.0.2.1", tags: ["edge", "critical"], assetTag: 'AST-002', serial: 'SN-EDGE01', configBackup: null },
    { id: 'dev-3', name: "access-sw-lobby", deviceTypeId: "dt-3", status: 'offline', deviceRoleId: "dr-3", platformId: "p-3", siteId: "dub-office", ip: "10.10.20.5", tags: ["access", "users"], assetTag: 'AST-003', serial: 'SN-ACCESS01', configBackup: null },
    { id: 'dev-4', name: "server-vmhost-01", deviceTypeId: "dt-4", status: 'active', deviceRoleId: "dr-4", platformId: "p-4", siteId: "florim-tn", ip: "10.2.5.10", tags: ["compute", "vmware"], clusterId: 'cluster-1', assetTag: 'AST-004', serial: 'SN-VMHOST01', configBackup: null },
    { id: 'dev-5', name: "firewall-corp", deviceTypeId: "dt-5", status: 'provisioning', deviceRoleId: "dr-5", platformId: "p-5", siteId: "florim-tn", ip: "10.1.1.1", tags: ["security"], assetTag: 'AST-005', serial: 'SN-FW01', configBackup: null },
    { id: 'dev-6', name: "core-sw-02", deviceTypeId: "dt-1", status: 'active', deviceRoleId: "dr-1", platformId: "p-1", siteId: "florim-tn", ip: "10.1.1.3", tags: ["core", "critical"], virtualChassisId: 'vc-1', vcPosition: 2, vcPriority: 254, rackId: 'rack-1', position: 38, rackFace: 'front', assetTag: 'AST-006', serial: 'SN-CORE02', configBackup: null },
];

const initialRackRoles = [
    { id: 'role-1', name: 'Core Network', description: 'For core switches and routers', color: '#3b82f6' },
    { id: 'role-2', name: 'Compute', description: 'For servers and virtualization hosts', color: '#f97316' },
    { id: 'role-3', name: 'Storage', description: 'For SAN/NAS equipment', color: '#8b5cf6' },
];

const initialRackTypes = [
    { id: 'type-1', manufacturer: 'APC', model: 'AR3100', u_height: 42, width: 'nineteen_in' },
    { id: 'type-2', manufacturer: 'Dell', model: 'PowerEdge 4220', u_height: 42, width: 'nineteen_in' },
];

const initialRacks = [
    { id: 'rack-1', name: 'A101', siteId: 'florim-tn', locationId: 'tn-dc-room-1', roleId: 'role-1', typeId: 'type-1', status: 'active', u_height: 42, width: 'nineteen_in', tags: ['core', 'main-row'], facilityId: "DC-A1-101", tenantId: "tenant-a", comments: "Main distribution rack for Row A." },
    { id: 'rack-2', name: 'A102', siteId: 'florim-tn', locationId: 'tn-dc-room-1', roleId: 'role-2', typeId: 'type-1', status: 'planned', u_height: 42, width: 'nineteen_in', tags: ['compute', 'expansion'], tenantId: "tenant-a", comments: "Reserved for future compute expansion." },
    { id: 'rack-3', name: 'B201', siteId: 'dub-office', status: 'active', u_height: 48, width: 'nineteen_in', tags: [], roleId: 'role-3', tenantId: 'tenant-b', comments: "IDF for 2nd floor." },
];

const initialRackReservations = [
    { id: 'res-1', rackId: 'rack-1', units: [40, 41], tenantId: 'tenant-a', description: 'Reserved for new firewall cluster' },
];

const initialPrefixes = [
      { id: 'prefix-1', prefix: "10.1.1.0/24", status: 'active', site: "Florim TN Data Center", description: "Core Server Segment", tags: ["core", "servers", "production"] },
      { id: 'prefix-2', prefix: "192.168.10.0/24", status: 'active', site: "Dublin Office", description: "Corporate User Desktops", tags: ["users", "corp"] },
      { id: 'prefix-3', prefix: "172.16.0.0/16", status: 'deprecated', site: "Legacy DC", description: "Old Guest Network - To be removed", tags: ["legacy", "guest"] },
];

const initialIpAddresses = [
    { id: 'ip-1', address: "10.1.1.1", status: 'active', assignedObjectType: "Device", assignedObjectId: "dev-1", dnsName: "core-sw-01.example.com", description: "Gateway", prefixId: 'prefix-1' },
    { id: 'ip-2', address: "10.1.1.10", status: 'active', assignedObjectType: "VirtualMachine", assignedObjectId: "vm-1", dnsName: "web-server-01.example.com", description: "Primary Web Server", prefixId: 'prefix-1' },
    { id: 'ip-3', address: "10.1.1.11", status: 'dhcp', assignedObjectType: "VirtualMachine", assignedObjectId: "vm-2", dnsName: null, description: null, prefixId: 'prefix-1' },
    { id: 'ip-4', address: "10.1.1.254", status: 'reserved', description: "Broadcast", prefixId: 'prefix-1', assignedObjectType: null, assignedObjectId: null, dnsName: null },
    { id: 'ip-5', address: "192.168.10.55", status: 'dhcp', assignedObjectType: "Device", assignedObjectId: "dev-3", dnsName: "jdoe-laptop.corp.example.com", description: null, prefixId: 'prefix-2' },
];

const initialProviders = [
    { id: 'prov-1', name: 'AT&T', asn: 7018, account: 'ACCT-12345' },
    { id: 'prov-2', name: 'Lumen', asn: 3356, account: 'ACCT-67890' },
];

const initialCircuitTypes = [
    { id: 'ctype-1', name: 'Internet Transit', description: 'DIA circuit' },
    { id: 'ctype-2', name: 'Private WAN', description: 'MPLS or VPLS circuit' },
];

const initialCircuits = [
    { id: 'circ-1', cid: '123-ABC-456', providerId: 'prov-1', typeId: 'ctype-1', status: 'active', installDate: new Date('2023-01-15'), commitRate: 1000, description: 'Primary DIA at Florim TN', termA_siteId: 'florim-tn', termZ_siteId: 'florim-tn' },
    { id: 'circ-2', cid: '987-XYZ-654', providerId: 'prov-2', typeId: 'ctype-2', status: 'provisioning', installDate: new Date('2024-08-01'), commitRate: 500, description: 'WAN link to Dublin', termA_siteId: 'florim-tn', termZ_siteId: 'dub-office' },
];

const initialWirelessLans = [
    { id: 'wlan-1', ssid: 'InfraLynx-Corp', vlan: '100', description: 'Corporate employee network', authType: 'WPA_Enterprise' },
    { id: 'wlan-2', ssid: 'InfraLynx-Guest', vlan: '200', description: 'Guest access network', authType: 'Open' },
];

const initialAccessPoints = [
    { id: 'ap-1', name: 'AP-Lobby-1', siteId: 'florim-tn', status: 'active', model: 'Cisco C9120AXI', ipAddress: '10.1.1.200' },
    { id: 'ap-2', name: 'AP-Eng-1', siteId: 'dub-office', status: 'planned', model: 'Aruba AP-535', ipAddress: '10.2.1.201' },
];

const initialVpnTunnels = [
    { id: 'vpn-1', name: 'Site2Site-TN-to-DUB', status: 'planned', type: 'IPsec', localPeer: '192.0.2.1', remotePeer: '203.0.113.1', description: 'Site-to-site tunnel between main data centers' },
    { id: 'vpn-2', name: 'Remote-Access-VPN', status: 'active', type: 'OpenVPN', localPeer: '192.0.2.2', remotePeer: 'dynamic', description: 'Client VPN for remote employees' },
];

const initialPowerPanels = [
    { id: 'pp-1', name: 'PP-A1', siteId: 'florim-tn', locationId: 'tn-dc-room-1', voltage: 208, phase: 'three_phase', capacityAmps: 100 },
    { id: 'pp-2', name: 'PP-A2', siteId: 'florim-tn', locationId: 'tn-dc-room-1', voltage: 208, phase: 'three_phase', capacityAmps: 100 },
];

const initialPowerFeeds = [
    { id: 'pf-1', name: 'PP-A1-01A', panelId: 'pp-1', rackId: 'rack-1', status: 'active', type: 'primary', amperage: 30, voltage: 208 },
    { id: 'pf-2', name: 'PP-A2-01B', panelId: 'pp-2', rackId: 'rack-1', status: 'active', type: 'redundant', amperage: 30, voltage: 208 },
];

const initialClusterTypes = [
    { id: 'ct-1', name: 'VMware vSphere', description: 'VMware ESXi virtualization platform' },
    { id: 'ct-2', name: 'Proxmox VE', description: 'Open-source virtualization platform' },
];

const initialClusterGroups = [
    { id: 'cg-1', name: 'Production Compute', description: 'Clusters hosting production workloads' },
    { id: 'cg-2', name: 'Lab Environment', description: 'Clusters for testing and development' },
];

const initialClusters = [
    { id: 'cluster-1', name: 'Prod-Compute-East', typeId: 'ct-1', groupId: 'cg-1', siteId: 'florim-tn', comments: 'Primary production vSphere cluster in TN.' },
    { id: 'cluster-2', name: 'Dev-Lab-Cluster', typeId: 'ct-2', groupId: 'cg-2', siteId: 'dub-office', comments: 'Proxmox lab for developers.' },
];

const initialVirtualMachines = [
    { id: 'vm-1', name: 'web-prod-01', status: 'active', clusterId: 'cluster-1', role: 'Web Server', vcpus: 4, memory: 8, disk: 100, primaryIp: '10.1.1.10' },
    { id: 'vm-2', name: 'db-prod-01', status: 'active', clusterId: 'cluster-1', role: 'Database Server', vcpus: 8, memory: 32, disk: 500, primaryIp: '10.1.1.12' },
    { id: 'vm-3', name: 'test-runner-ci', status: 'offline', clusterId: 'cluster-2', role: 'CI/CD Runner', vcpus: 2, memory: 4, disk: 50, primaryIp: '192.168.10.100' },
];

async function main() {
  console.log(`Start seeding ...`)
  
  // Clear existing data
  await prisma.contactAssignment.deleteMany();
  await prisma.powerFeed.deleteMany();
  await prisma.rackReservation.deleteMany();
  await prisma.device.deleteMany();
  await prisma.iPAddress.deleteMany();
  await prisma.rack.deleteMany();
  await prisma.accessPoint.deleteMany();
  await prisma.circuit.deleteMany();
  await prisma.virtualMachine.deleteMany();
  await prisma.cluster.deleteMany();
  await prisma.powerPanel.deleteMany();
  await prisma.location.deleteMany();
  await prisma.site.deleteMany();
  await prisma.siteGroup.deleteMany();
  await prisma.region.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.contactGroup.deleteMany();
  await prisma.contactRole.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.tenantGroup.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.deviceRole.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.deviceType.deleteMany();
  await prisma.virtualChassis.deleteMany();
  await prisma.rackRole.deleteMany();
  await prisma.rackType.deleteMany();
  await prisma.prefix.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.circuitType.deleteMany();
  await prisma.wirelessLan.deleteMany();
  await prisma.vpnTunnel.deleteMany();
  await prisma.clusterType.deleteMany();
  await prisma.clusterGroup.deleteMany();


  await prisma.tag.createMany({ data: initialTags, skipDuplicates: true });
  await prisma.region.createMany({ data: initialRegions, skipDuplicates: true });
  await prisma.siteGroup.createMany({ data: initialSiteGroups, skipDuplicates: true });
  await prisma.tenantGroup.createMany({ data: initialTenantGroups, skipDuplicates: true });
  await prisma.tenant.createMany({ data: initialTenants.map(t => ({...t, groupId: t.groupId || null })), skipDuplicates: true });
  await prisma.site.createMany({ data: initialSites.map(s => ({...s, regionId: s.regionId || null, groupId: s.groupId || null, tenantGroupId: s.tenantGroupId || null, tenantId: s.tenantId || null })), skipDuplicates: true });
  await prisma.location.createMany({ data: initialLocations, skipDuplicates: true });
  
  await prisma.contactGroup.createMany({ data: initialContactGroups, skipDuplicates: true });
  await prisma.contact.createMany({ data: initialContacts.map(c=> ({...c, groupId: c.groupId || null})), skipDuplicates: true });
  await prisma.contactRole.createMany({ data: initialContactRoles, skipDuplicates: true });
  await prisma.contactAssignment.createMany({ data: initialContactAssignments, skipDuplicates: true });

  await prisma.deviceRole.createMany({ data: initialDeviceRoles, skipDuplicates: true });
  await prisma.platform.createMany({ data: initialPlatforms, skipDuplicates: true });
  await prisma.deviceType.createMany({ data: initialDeviceTypes, skipDuplicates: true });
  
  await prisma.rackRole.createMany({ data: initialRackRoles, skipDuplicates: true });
  await prisma.rackType.createMany({ data: initialRackTypes, skipDuplicates: true });
  await prisma.rack.createMany({ data: initialRacks.map(r => ({...r, locationId: r.locationId || null, roleId: r.roleId || null, typeId: r.typeId || null, tenantId: r.tenantId || null, startingUnit: r.startingUnit || 1, facilityId: r.facilityId || null, tenantGroupId: r.tenantGroupId || null, serial: r.serial || null, assetTag: r.assetTag || null })), skipDuplicates: true });
  await prisma.rackReservation.createMany({ data: initialRackReservations, skipDuplicates: true });

  await prisma.prefix.createMany({ data: initialPrefixes, skipDuplicates: true });
  await prisma.iPAddress.createMany({ data: initialIpAddresses.map(ip => ({...ip, assignedObjectId: ip.assignedObjectId || null, assignedObjectType: ip.assignedObjectType || null, dnsName: ip.dnsName || null, description: ip.description || null })), skipDuplicates: true });
  
  await prisma.provider.createMany({ data: initialProviders, skipDuplicates: true });
  await prisma.circuitType.createMany({ data: initialCircuitTypes, skipDuplicates: true });
  await prisma.circuit.createMany({ data: initialCircuits.map(c => ({...c, installDate: c.installDate ? new Date(c.installDate) : new Date()})), skipDuplicates: true });

  await prisma.wirelessLan.createMany({ data: initialWirelessLans, skipDuplicates: true });
  await prisma.accessPoint.createMany({ data: initialAccessPoints, skipDuplicates: true });
  await prisma.vpnTunnel.createMany({ data: initialVpnTunnels, skipDuplicates: true });

  await prisma.powerPanel.createMany({ data: initialPowerPanels.map(p => ({...p, locationId: p.locationId || null})), skipDuplicates: true });
  await prisma.powerFeed.createMany({ data: initialPowerFeeds.map(f => ({...f, rackId: f.rackId || null})), skipDuplicates: true });

  await prisma.clusterType.createMany({ data: initialClusterTypes, skipDuplicates: true });
  await prisma.clusterGroup.createMany({ data: initialClusterGroups, skipDuplicates: true });
  await prisma.cluster.createMany({ data: initialClusters.map(c => ({...c, siteId: c.siteId || null})), skipDuplicates: true });
  await prisma.virtualMachine.createMany({ data: initialVirtualMachines.map(vm => ({...vm, primaryIp: vm.primaryIp || null})) , skipDuplicates: true });
  await prisma.virtualChassis.createMany({ data: initialVirtualChassis, skipDuplicates: true });
  await prisma.device.createMany({ data: initialDevices.map(d => ({...d, configBackup: d.configBackup, rackId: d.rackId || null, platformId: d.platformId || null, clusterId: d.clusterId || null, virtualChassisId: d.virtualChassisId || null, position: d.position || null, rackFace: d.rackFace || null, tenantId: d.tenantId || null, tenantGroupId: d.tenantGroupId || null, assetTag: d.assetTag || null, serial: d.serial || null})), skipDuplicates: true });


  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
