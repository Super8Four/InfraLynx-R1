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

To get a local copy up and running, you have two primary options: using Docker/Docker Compose (recommended) or performing a standard installation directly on your system.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18 or higher is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm or yarn:** These package managers are installed with Node.js.
*   **Docker and Docker Compose:** Required for the Docker-based installation. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/).
*   **Git:** For cloning the repository.

### Installation

#### Option 1: Using Docker Compose (Recommended)

This method uses Docker Compose to set up and run the application and its database container. It is the easiest way to get started.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Super8Four/InfraLynx-R1.git
    cd InfraLynx-R1
    ```

2.  **Start the Services**
    ```bash
    docker-compose up --build
    ```
    This command will build the app's container and start both the application and database services.

3.  **Set Up the Database (First-Time Only)**
    In a new terminal window, while the containers are running, execute the following commands to apply the database schema and seed it with initial data:
    ```bash
    # Apply the schema
    docker-compose exec app npx prisma db push

    # Seed the database
    docker-compose exec app npx prisma db seed
    ```

4.  **Access the Application**
    Open your browser and navigate to [http://localhost:9002](http://localhost:9002).

#### Option 2: Standard Installation (Manual)

This method requires you to have a PostgreSQL database server running on your local machine.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Super8Four/InfraLynx-R1.git
    cd InfraLynx-R1
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and ensure the `DATABASE_URL` points to your local PostgreSQL instance. The default value should work if your database credentials match the example.

4.  **Set Up the Database**
    Apply the database schema and seed it with initial data:
    ```bash
    # Apply the schema
    npx prisma db push

    # Seed the database
    npx prisma db seed
    ```

5.  **Run the Application**
    ```bash
    npm run dev
    ```

6.  **Access the Application**
    Open your browser and navigate to [http://localhost:9002](http://localhost:9002).

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
