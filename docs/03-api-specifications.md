# 03. Poonam Attire - REST API Specification

## 1. Authentication & Security Headers

Every request to the Poonam Attire API can include API key credentials and optional user authorization tokens:

```http
x-api-key: PA_live_sec_poonamattire_2026_key
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```

### Scope Validation Matrix
| Scope | Endpoints Covered | Permitted Actors |
|---|---|---|
| `catalog:read` | `GET /api/products`, `GET /api/products/:slug`, `GET /api/categories` | Public Web & Flutter App |
| `catalog:write` | `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` | Admin Panel |
| `cart:write` | `GET /api/cart`, `POST /api/cart`, `DELETE /api/cart/:id` | Authenticated Customers |
| `orders:create` | `POST /api/orders` | Authenticated Customers & Guests |
| `orders:read` | `GET /api/orders`, `GET /api/orders/:id` | Customer (own) & Admin (all) |
| `admin:all` | All `/api/admin/*` endpoints | Admin Users |

---

## 2. API Endpoints

### 2.1 Customer Authentication
#### `POST /api/auth/register`
Creates a new customer account with email, password, and phone number.
- **Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "StrongPassword123!",
  "fullName": "Ananya Sharma",
  "phone": "+91 98765 43210"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "user": {
    "id": "usr_99120481",
    "email": "customer@example.com",
    "fullName": "Ananya Sharma",
    "phone": "+91 98765 43210",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

#### `POST /api/auth/login`
Authenticates a user and issues a signed session token.
- **Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "StrongPassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "id": "usr_99120481",
    "email": "customer@example.com",
    "fullName": "Ananya Sharma",
    "phone": "+91 98765 43210",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

#### `GET /api/auth/me`
Retrieves currently authenticated user profile and active orders.

---

### 2.2 Products & Collections Catalog
#### `GET /api/products`
Retrieves dress catalog with filtering, sorting, and category filters.
- **Query Parameters**:
  - `category` (optional, e.g. `Festive`, `Wedding`, `Casual`, `Workwear`)
  - `featured` (optional, boolean)
  - `search` (optional, string)
  - `limit` (optional, default 50)
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 6,
  "products": [
    {
      "id": "pa-001",
      "slug": "gulab-zari-salwar-suit",
      "name": "Gulab Zari Salwar Suit",
      "category": "Festive",
      "fabric": "Silk Blend",
      "color": "Maroon",
      "price": 4299,
      "mrp": 5899,
      "rating": 4.8,
      "reviews": 142,
      "sizes": ["XS", "S", "M", "L", "XL"],
      "image": "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80",
      "gallery": [
        "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
      ],
      "description": "A deep maroon salwar suit finished with zari-inspired detailing...",
      "tags": ["Bestseller", "3D Preview"],
      "stock": 45
    }
  ]
}
```

#### `GET /api/products/:slug`
Fetches a single product by unique slug with complete gallery.

---

### 2.3 Cart Management
#### `GET /api/cart`
Returns the customer's active shopping cart items.
#### `POST /api/cart`
Adds or increments an item in the customer's cart.
- **Request Body**:
```json
{
  "productId": "pa-001",
  "size": "M",
  "quantity": 1
}
```

---

### 2.4 Order Creation & Tracking
#### `POST /api/orders`
Creates a confirmed order, deducting stock and recording full customer details.
- **Request Body**:
```json
{
  "customerName": "Poonam Sharma",
  "customerEmail": "poonam@example.com",
  "customerPhone": "+91 98111 22334",
  "shippingAddress": "402 Royal Palms, MG Road",
  "city": "Jaipur",
  "state": "Rajasthan",
  "postalCode": "302001",
  "paymentMethod": "cod",
  "notes": "Please deliver after 2 PM",
  "items": [
    {
      "productId": "pa-001",
      "size": "M",
      "quantity": 1,
      "price": 4299
    }
  ]
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "order": {
    "id": "ord_9872149",
    "orderNumber": "PA-2026-9042",
    "totalAmount": 4299,
    "orderStatus": "confirmed",
    "paymentStatus": "pending"
  }
}
```

#### `GET /api/orders/:orderNumber`
Allows public or customer tracking of an order via tracking code.

---

### 2.5 Admin Management Endpoints
#### `GET /api/admin/overview`
Returns summary statistics: total active products, open orders, total revenue, and conversion health.
#### `POST /api/admin/products`
Adds a new dress to the live catalog.
#### `PATCH /api/admin/orders/:id`
Updates order status (`confirmed`, `processing`, `shipped`, `delivered`, `cancelled`).
