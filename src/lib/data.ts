// This file contains all the mock data for the application.
// In a real-world scenario, this data would come from a database.

import * as z from "zod";

// --- DEVICES ---

const deviceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    manufacturer: z.string().min(1, "Manufacturer is required"),
    model: z.string().min(1, "Model is required"),
    status: z.enum(["Online", "Offline", "Provisioning"]),
    role: z.string().min(1, "Role is required"),
    site: z.string().min(1, "Site is required"),
    ip: z.string().ip({ message: "Invalid IP address" }),
    tags: z.string().optional(),
})

type DeviceFormValues = z.infer<typeof deviceSchema>
export type Device = Omit<DeviceFormValues, 'tags'> & { tags: string[] };
  
export const initialDevices: Device[] = [
    {
        name: "core-sw-01",
        manufacturer: "Juniper",
        model: "QFX5120",
        status: "Online",
        role: "Core Switch",
        site: "Data Center A",
        ip: "10.1.1.2",
        tags: ["core", "critical"],
    },
    {
        name: "edge-router-01",
        manufacturer: "Cisco",
        model: "ASR1001-X",
        status: "Online",
        role: "Edge Router",
        site: "Data Center A",
        ip: "192.0.2.1",
        tags: ["edge", "critical"],
    },
    {
        name: "access-sw-lobby",
        manufacturer: "Arista",
        model: "720XP",
        status: "Offline",
        role: "Access Switch",
        site: "Office Building 1",
        ip: "10.10.20.5",
        tags: ["access", "users"],
    },
    {
        name: "server-vmhost-01",
        manufacturer: "Dell",
        model: "PowerEdge R740",
        status: "Online",
        role: "Virtualization Host",
        site: "Data Center B",
        ip: "10.2.5.10",
        tags: ["compute", "vmware"],
    },
    {
        name: "firewall-corp",
        manufacturer: "Palo Alto",
        model: "PA-3220",
        status: "Provisioning",
        role: "Firewall",
        site: "Data Center A",
        ip: "10.1.1.1",
        tags: ["security"],
    },
]

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
          site: "Data Center A",
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
          site: "Office Building 1",
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
  ]

// --- ORGANIZATION ---

// Regions
export type Region = {
    id: string;
    name: string;
    slug: string;
    description: string;
}
export const initialRegions: Region[] = [
    { id: 'na', name: 'North America', slug: 'north-america', description: 'All US and Canadian facilities' },
    { id: 'eu', name: 'Europe', slug: 'europe', description: 'European data centers and offices' },
];

// Sites
export type Site = {
    id: string;
    name: string;
    slug: string;
    regionId: string;
    facility: string;
    address: string;
    status: 'active' | 'offline' | 'planned';
}
export const initialSites: Site[] = [
    { id: 'florim-tn', name: 'Florim TN Data Center', slug: 'florim-tn-dc', regionId: 'na', facility: 'Main DC', address: '123 Industrial Blvd, Clarksville, TN', status: 'active'},
    { id: 'dub-office', name: 'Dublin Office', slug: 'dub-office', regionId: 'eu', facility: 'Branch Office', address: '456 Tech Way, Dublin, Ireland', status: 'planned'},
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

// Tenants
export type Tenant = {
    id: string;
    name: string;
    slug: string;
    description: string;
    groupId?: string;
}
export const initialTenants: Tenant[] = [
    { id: 'tenant-a', name: 'Internal Services', slug: 'internal-services', description: 'Company-internal applications and infrastructure' },
    { id: 'tenant-b', name: 'Customer Hosting', slug: 'customer-hosting', description: 'Shared hosting platform for external customers' },
];

// Contacts
export type Contact = {
    id: string;
    name: string;
    email: string;
    phone: string;
    title: string;
}
export const initialContacts: Contact[] = [
    { id: 'contact-1', name: 'John Doe', email: 'j.doe@example.com', phone: '123-456-7890', title: 'Network Engineer' },
    { id: 'contact-2', name: 'Jane Smith', email: 'j.smith@example.com', phone: '098-765-4321', title: 'Data Center Manager' },
];
