# 05. Poonam Attire - Migration & Deployment Plan

## 1. Appwrite Decommissioning Strategy

### 1.1 Codebase Cleaning
1. Remove `appwrite` from `package.json` dependencies.
2. Delete `src/lib/appwrite.ts`.
3. Delete `scripts/appwrite-sync.mjs`.
4. Refactor `useAuthStore.ts` and `useCommerceStore.ts` to consume the native PostgreSQL REST API.
5. Clean out all obsolete Appwrite environment variables from `.env.local` / `.env.production`.

---

## 2. PostgreSQL Database Provisioning on Windows Server

### 2.1 Database Credentials & Location
- **Server Address**: `vps.amcmep.in:5432`
- **Engine**: PostgreSQL 18.4 (x86_64-windows)
- **Superuser**: `postgres`
- **Target Database**: `poonamattire` (co-located on same Windows instance as `agent_db`)
- **Connection URL**:
```env
DATABASE_URL="postgresql://postgres:AnheVps2022@vps.amcmep.in:5432/poonamattire"
```

### 2.2 Execution Order
1. Execute `migrations/001_initial_schema.sql` against `poonamattire`.
2. Seed initial data collections:
   - Initial scopes and API keys (`project_api_keys` and `project_api_key_scopes`).
   - Default boutique administrator account in `users`.
   - Categories taxonomy in `categories`.
   - Authentic dress and ethnic wear collections with gallery images in `products` and `product_images`.
3. Verify table counts and data retrieval via `psql`.

---

## 3. Flutter Client Synchronization

### 3.1 Flutter API Client Integration
- Update Flutter mobile app (`flutter_application_18poonamattire`) configuration with:
  - Base URL pointing to the deployed API (`https://poonamattire.amcmep.in/api` or configured host).
  - Configured `x-api-key` header with `catalog:read`, `cart:write`, `orders:create` scopes.
- Model mapping for:
  - `ProductModel` (matching `products` schema).
  - `UserModel` (email, phone, fullName).
  - `CartModel` & `OrderModel`.
