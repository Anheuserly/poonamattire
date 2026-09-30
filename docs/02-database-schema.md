# 02. Poonam Attire - PostgreSQL Database Schema Specification

## 1. Overview
The `poonamattire` database is hosted on the Windows Server PostgreSQL 18 instance alongside `agent_db`. It utilizes relational integrity, foreign key constraints, indexes on high-traffic lookup paths (such as `slug`, `email`, `user_id`, and `order_number`), and automatic timestamp updating.

---

## 2. Table Specifications

### 2.1 `project_api_keys`
Stores client and service credentials for API access with rate-limiting and expiration capabilities.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID (e.g. `key_live_...`) |
| `name` | `VARCHAR(100)` | `NOT NULL` | Descriptive name (e.g. `web-client`, `flutter-mobile`, `admin-cli`) |
| `key_hash` | `VARCHAR(255)` | `NOT NULL UNIQUE` | Secure hash of the API key |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Activation status |
| `rate_limit_per_min` | `INT` | `DEFAULT 300` | Allowed requests per minute |
| `expires_at` | `TIMESTAMP WITH TIME ZONE` | `NULL` | Optional expiration date |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp |

### 2.2 `project_api_key_scopes`
Defines fine-grained permission scopes associated with each API key.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-incrementing identifier |
| `api_key_id` | `VARCHAR(64)` | `REFERENCES project_api_keys(id) ON DELETE CASCADE` | Associated API key |
| `scope` | `VARCHAR(100)` | `NOT NULL` | Scope identifier (e.g., `catalog:read`, `cart:write`, `orders:create`, `admin:all`) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Grant timestamp |

### 2.3 `users`
Customer and administrative user records with authentication credentials.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | User ID (e.g. `usr_...`) |
| `email` | `VARCHAR(255)` | `NOT NULL UNIQUE` | Customer email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt/Argon2 password hash |
| `full_name` | `VARCHAR(150)` | `NOT NULL` | Customer or Admin full name |
| `phone` | `VARCHAR(30)` | `NOT NULL` | Contact phone number |
| `role` | `VARCHAR(30)` | `DEFAULT 'customer'` | User role (`customer`, `staff`, `admin`) |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Account active flag |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Registration timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Profile update timestamp |

### 2.4 `categories`
Product categorization taxonomy for traditional Indian attire and modern dresses.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Category ID (e.g. `cat_festive`) |
| `slug` | `VARCHAR(100)` | `NOT NULL UNIQUE` | URL-friendly slug (`festive`, `wedding`, `casual`, `workwear`) |
| `name` | `VARCHAR(150)` | `NOT NULL` | Display title |
| `copy` | `TEXT` | `NULL` | Collection marketing copy |
| `image_url` | `TEXT` | `NULL` | Banner image URL |
| `display_order` | `INT` | `DEFAULT 0` | Ordering priority in navigation |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Display visibility |

### 2.5 `products`
The core clothing and dress catalog with pricing, fabric details, stock, and descriptions.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Product ID (e.g. `pa-001`) |
| `slug` | `VARCHAR(150)` | `NOT NULL UNIQUE` | Unique SEO product slug |
| `name` | `VARCHAR(200)` | `NOT NULL` | Dress / product title |
| `category` | `VARCHAR(100)` | `NOT NULL` | Category name or reference |
| `fabric` | `VARCHAR(100)` | `NOT NULL` | Fabric type (e.g., Silk Blend, Chanderi, Cotton, Georgette) |
| `color` | `VARCHAR(100)` | `NOT NULL` | Primary color (e.g., Maroon, Blush, Ivory, Gold, Teal) |
| `price` | `NUMERIC(10, 2)` | `NOT NULL` | Selling price (in INR) |
| `mrp` | `NUMERIC(10, 2)` | `NOT NULL` | Maximum retail price (in INR) |
| `rating` | `NUMERIC(3, 2)` | `DEFAULT 5.00` | Product star rating |
| `reviews_count` | `INT` | `DEFAULT 0` | Number of verified customer reviews |
| `sizes` | `TEXT[]` | `NOT NULL` | Array of available sizes (e.g., `{'XS','S','M','L','XL'}`) |
| `description` | `TEXT` | `NOT NULL` | Comprehensive fabric and styling description |
| `tags` | `TEXT[]` | `DEFAULT '{}'` | Badges and tags (e.g., `{'Bestseller','3D Preview'}`) |
| `stock` | `INT` | `DEFAULT 100` | Available stock count |
| `is_featured` | `BOOLEAN` | `DEFAULT FALSE` | Spotlight on homepage |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active visibility |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Created timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Updated timestamp |

### 2.6 `product_images`
Image gallery for high-resolution dress photos, flat lays, model shots, and 3D preview textures.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Image sequence ID |
| `product_id` | `VARCHAR(64)` | `REFERENCES products(id) ON DELETE CASCADE` | Associated product |
| `image_url` | `TEXT` | `NOT NULL` | Image URL |
| `display_order` | `INT` | `DEFAULT 0` | Order in gallery |
| `is_primary` | `BOOLEAN` | `DEFAULT FALSE` | Primary thumbnail flag |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Upload timestamp |

### 2.7 `cart_items`
Persistent user carts synced seamlessly between web and mobile devices.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Cart item ID |
| `user_id` | `VARCHAR(64)` | `REFERENCES users(id) ON DELETE CASCADE` | Registered customer |
| `product_id` | `VARCHAR(64)` | `REFERENCES products(id) ON DELETE CASCADE` | Selected product |
| `size` | `VARCHAR(10)` | `NOT NULL` | Selected dress size |
| `quantity` | `INT` | `DEFAULT 1` | Quantity |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Item addition timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp |

### 2.8 `orders`
Customer purchases and boutique order dispatch management.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Order ID (e.g. `ord_1790...`) |
| `order_number` | `VARCHAR(50)` | `NOT NULL UNIQUE` | Customer tracking code (e.g. `PA-2026-9042`) |
| `user_id` | `VARCHAR(64)` | `REFERENCES users(id) ON DELETE SET NULL` | Linked customer account |
| `customer_name` | `VARCHAR(150)` | `NOT NULL` | Customer shipping recipient |
| `customer_email` | `VARCHAR(255)` | `NOT NULL` | Notification email |
| `customer_phone` | `VARCHAR(30)` | `NOT NULL` | Delivery contact phone |
| `shipping_address` | `TEXT` | `NOT NULL` | Street address and locality |
| `city` | `VARCHAR(100)` | `NOT NULL` | City |
| `state` | `VARCHAR(100)` | `NOT NULL` | State |
| `postal_code` | `VARCHAR(20)` | `NOT NULL` | PIN code |
| `subtotal` | `NUMERIC(10, 2)` | `NOT NULL` | Cart subtotal |
| `discount` | `NUMERIC(10, 2)` | `DEFAULT 0.00` | Applied coupon discount |
| `total_amount` | `NUMERIC(10, 2)` | `NOT NULL` | Final billed amount |
| `payment_method` | `VARCHAR(50)` | `DEFAULT 'cod'` | Payment method (`cod`, `upi`, `card`) |
| `payment_status` | `VARCHAR(50)` | `DEFAULT 'pending'` | Payment status (`pending`, `paid`, `failed`) |
| `order_status` | `VARCHAR(50)` | `DEFAULT 'confirmed'` | Status (`confirmed`, `processing`, `shipped`, `delivered`, `cancelled`) |
| `notes` | `TEXT` | `NULL` | Custom tailoring or delivery instructions |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Order placement time |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Status change time |

### 2.9 `order_items`
Snapshot of each product, selected size, and locked price at the time of purchase.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Line item sequence |
| `order_id` | `VARCHAR(64)` | `REFERENCES orders(id) ON DELETE CASCADE` | Associated order |
| `product_id` | `VARCHAR(64)` | `REFERENCES products(id) ON DELETE SET NULL` | Purchased product |
| `product_name` | `VARCHAR(200)` | `NOT NULL` | Captured product name |
| `size` | `VARCHAR(10)` | `NOT NULL` | Selected dress size |
| `price` | `NUMERIC(10, 2)` | `NOT NULL` | Unit price at purchase |
| `quantity` | `INT` | `NOT NULL` | Quantity purchased |
| `image_url` | `TEXT` | `NULL` | Captured primary thumbnail |

### 2.10 `audit_logs`
Records critical administrative actions, stock changes, and order status transitions.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Audit record identifier |
| `actor_id` | `VARCHAR(64)` | `NULL` | Admin or user ID who performed action |
| `action` | `VARCHAR(100)` | `NOT NULL` | Action code (`product.create`, `order.status_update`, etc.) |
| `entity_type` | `VARCHAR(50)` | `NOT NULL` | Affected entity (`product`, `order`, `user`) |
| `entity_id` | `VARCHAR(64)` | `NOT NULL` | Identifier of affected record |
| `details` | `JSONB` | `DEFAULT '{}'` | Metadata, diffs, or snapshot payload |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Audit timestamp |
