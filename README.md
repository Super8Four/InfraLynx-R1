# InfraLynx

InfraLynx is a NextJS project designed to provide a comprehensive UI for managing various aspects of a network infrastructure, inspired by NetBox. It aims to offer a user-friendly interface for tasks such as device management, IP address management (IPAM), cabling, power, and more.

## Features

- Device Management: Track and manage network devices.
- IPAM: Manage IP addresses and subnets.
- Cabling: Document network cabling infrastructure.
- Power: Monitor and manage power distribution.
- Racks: Visualize and manage rack space.
- Organization: Manage sites, regions, tenants, and contacts.
- Virtualization: Manage virtual machines and clusters.
- Wireless: Manage wireless infrastructure.
- And more!

## Getting Started

To get a local copy up and running, you have two primary options: using Docker/Docker Compose or performing a standard installation directly on your system.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18 or higher is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm or yarn:** These package managers are installed with Node.js.
*   **Docker and Docker Compose:** Required for the Docker-based installation. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/).
*   **Git:** For cloning the repository.

### Installation

## Available Functionalities

Based on the project's file structure under `src/app/(dashboard)`, the UI provides access to the following key areas and their related functionalities:

-   **Admin:**
-   **Branching:**
-   **Cabling:**
-   **Circuits:**
-   **Devices:**
    -   Actions
    -   Modules
    -   Platforms
    -   Roles
    -   Types
    -   Virtual Chassis
-   **IPAM:**
-   **Operations:**
-   **Organization:**
    -   Contact Assignments
    -   Contact Groups
    -   Contact Roles
    -   Contacts
    -   Locations
    -   Regions
    -   Site Groups
    -   Sites
    -   Tags
    -   Tenant Groups
    -   Tenants
-   **Power:**
-   **Provisioning:**
-   **Racks:**
    -   Elevations
    -   Reservations
    -   Roles
    -   Types
-   **Topology:**
-   **Virtualization:**
-   **VPN:**
-   **Wireless:**


#### Option 1: Using Docker Compose (Recommended)

This method uses Docker Compose to set up and run the application and its dependencies. It is the easiest way to get started as it handles setting up the database and other dependencies.

1.  Clone the repository:



1. Clone the repository:

