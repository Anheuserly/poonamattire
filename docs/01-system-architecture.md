# 01. Poonam Attire - System Architecture Overview

## 1. Executive Summary
Poonam Attire is a luxury and festive Indian ethnic wear boutique offering designer salwar suits, Chanderi kurtas, handloom cotton sets, embroidered anarkalis, mirror work ensembles, and bridal collections.

This document describes the modern, decoupled architecture replacing legacy third-party cloud backends (Appwrite) with a self-hosted, enterprise-grade **PostgreSQL** database cluster running on the user's dedicated Windows server (`vps.amcmep.in`), coupled with a unified REST API serving both the **Next.js Web Application** and the **Flutter Mobile App**.

---

## 2. Infrastructure & Hosting Topology

```
+-----------------------------------------------------------------------------------+
|                           USER CLIENT APPLICATIONS                                |
|                                                                                   |
|   +----------------------------------+    +-----------------------------------+   |
|   |       Next.js 16 Web App         |    |        Flutter Mobile App         |   |
|   |  - Responsive Boutique Storefront|    |  - iOS & Android native apps      |   |
|   |  - Customer Auth & Cart          |    |  - Native cart & orders           |   |
|   |  - Admin Dashboard (/admin)      |    |  - Shared REST API consumption    |   |
|   +-----------------+----------------+    +-----------------+-----------------+   |
|                     |                                       |                     |
+---------------------|---------------------------------------|---------------------+
                      | HTTP/HTTPS                            | HTTP/HTTPS
                      v                                       v
+-----------------------------------------------------------------------------------+
|                             POONAM ATTIRE API LAYER                               |
|                                                                                   |
|  - API Key & Scopes Middleware (`project_api_keys`, `project_api_key_scopes`)    |
|  - JWT Authentication for Customers & Administrators                              |
|  - Catalog & Product Management Engines                                           |
|  - Cart & Order Lifecycle Engine                                                  |
+-----------------------------------------------------------------------------------+
                                      |
                                      | Native TCP / TLS (Port 5432)
                                      v
+-----------------------------------------------------------------------------------+
|               DEDICATED WINDOWS DATABASE SERVER (vps.amcmep.in)                   |
|                                                                                   |
|  - OS: Windows Server (Microsoft Windows [Version 10.0.17763.9020])               |
|  - Database Engine: PostgreSQL 18.4 (x86_64-windows)                              |
|  - Superuser Role: `postgres`                                                     |
|  - Sister Database: `agent_db` (active on same cluster)                           |
|  - Target Dedicated Database: `poonamattire`                                      |
|  - Scoped Tables:                                                                 |
|      * `project_api_keys`                                                         |
|      * `project_api_key_scopes`                                                   |
|      * `users`                                                                    |
|      * `categories`                                                               |
|      * `products`                                                                 |
|      * `product_images`                                                           |
|      * `cart_items`                                                               |
|      * `orders`                                                                   |
|      * `order_items`                                                              |
|      * `audit_logs`                                                               |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Architectural Principles

### 3.1 Total Decommissioning of Appwrite
- **Removal of All SDKs**: The `appwrite` npm dependency (`^25.0.0`) is eradicated from `package.json`.
- **Elimination of Vendor Lock-in**: All references to Appwrite endpoints, project IDs, and collections are removed.
- **Direct Database Ownership**: All customer records, order histories, products, and authentication data reside directly inside the dedicated `poonamattire` PostgreSQL instance.

### 3.2 Granular API Key & Scope Governance
- External and internal requests are governed by `project_api_keys` and linked `project_api_key_scopes`.
- Client apps (Web and Mobile) use scoped public keys (e.g., `catalog:read`, `cart:write`, `orders:create`).
- Administrative interfaces require privileged keys with `admin:all` scope alongside session tokens.

### 3.3 Seamless Dual-Client Support (Web & Flutter)
- The Next.js web application acts both as the responsive web client and API host (via Next.js App Router API handlers with connection pooling).
- The Flutter mobile application interacts with the identical REST API contracts, ensuring synchronized inventory, unified user sessions, and shared order statuses across web and mobile.
