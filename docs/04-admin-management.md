# 04. Poonam Attire - Admin Portal Guide (`/admin`)

## 1. Overview
The Poonam Attire Admin Panel (`/admin`) provides full operational control over the boutique's inventory, dress collections, image galleries, customer order fulfillment, and metrics.

---

## 2. Key Modules & Capabilities

### 2.1 Live Statistics & Insights
- **Catalog Count**: Real-time tally of active products across Festive, Occasion, Casual, Wedding, and Workwear categories.
- **Open Orders Pipeline**: Live counter of orders requiring attention (Confirmed, Processing, Shipped).
- **Revenue Overview**: Gross sales and average order value calculation.

### 2.2 Product & Dress Collection Management
- **Add New Dress**:
  - Title, URL slug, and collection category.
  - Fabric specification (Silk Blend, Pure Chanderi, Organic Cotton, Georgette, Organza).
  - Primary color palette.
  - Pricing (Selling price & MRP discount display).
  - Available size matrix (`XS`, `S`, `M`, `L`, `XL`, `XXL`).
  - Stock count tracking.
  - Rich marketing description and styling advice.
  - Primary thumbnail and secondary gallery image URLs.
- **Edit & Update**:
  - Instant price alterations, stock adjustments, and size availability toggles.
- **Inventory Archival**:
  - Deactivate seasonal collections without breaking past order histories.

### 2.3 Order Fulfillment & Tracking
- **Order Pipeline Tracking**:
  - Filter orders by status: `All`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`.
  - Customer contact details: Full Name, Email, and Phone Number.
  - Full shipping address and postal code.
  - Itemized dress breakdown with ordered sizes and quantities.
- **Status Progression**:
  - Single-click status transitions to trigger tracking updates for customers.

### 2.4 Security & Role Authorization
- The `/admin` route checks for administrative credentials and authorized API key scopes (`admin:all`).
- All administrative actions produce an immutable record inside `audit_logs` for traceability.
