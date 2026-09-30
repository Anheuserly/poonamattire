-- ============================================================
-- POONAM ATTIRE - Production Database Schema & Seed Data
-- Dedicated Database: poonamattire
-- Host: Windows Server PostgreSQL 18 (vps.amcmep.in:5432)
-- ============================================================

-- 1. Project API Keys
CREATE TABLE IF NOT EXISTS project_api_keys (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    rate_limit_per_min INT DEFAULT 300,
    expires_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Project API Key Scopes
CREATE TABLE IF NOT EXISTS project_api_key_scopes (
    id SERIAL PRIMARY KEY,
    api_key_id VARCHAR(64) NOT NULL REFERENCES project_api_keys(id) ON DELETE CASCADE,
    scope VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(api_key_id, scope)
);

-- 3. Users Table (Customers, Staff, Administrators)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role VARCHAR(30) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    copy TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Catalog
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    fabric VARCHAR(100) NOT NULL,
    color VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    sizes TEXT[] NOT NULL DEFAULT '{"XS","S","M","L","XL"}',
    image TEXT NOT NULL,
    gallery TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    stock INT DEFAULT 100,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product Images (Normalized gallery support)
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(10) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id, size)
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cod',
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    size VARCHAR(10) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id VARCHAR(64),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high performance querying
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- 1. Seed API Keys
INSERT INTO project_api_keys (id, name, key_hash, is_active, rate_limit_per_min)
VALUES 
('key_web_client', 'NextJS Web Client', 'PA_live_key_web_client_2026_poonam_hash', TRUE, 600),
('key_flutter_mobile', 'Flutter Mobile App', 'PA_live_key_flutter_mobile_2026_poonam_hash', TRUE, 600),
('key_admin_portal', 'Poonam Attire Admin', 'PA_live_key_admin_portal_2026_poonam_hash', TRUE, 1200)
ON CONFLICT (id) DO UPDATE SET is_active = TRUE;

-- 2. Seed API Key Scopes
INSERT INTO project_api_key_scopes (api_key_id, scope)
VALUES
('key_web_client', 'catalog:read'),
('key_web_client', 'cart:write'),
('key_web_client', 'orders:create'),
('key_web_client', 'orders:read'),

('key_flutter_mobile', 'catalog:read'),
('key_flutter_mobile', 'cart:write'),
('key_flutter_mobile', 'orders:create'),
('key_flutter_mobile', 'orders:read'),

('key_admin_portal', 'admin:all'),
('key_admin_portal', 'catalog:read'),
('key_admin_portal', 'catalog:write'),
('key_admin_portal', 'orders:read'),
('key_admin_portal', 'orders:write')
ON CONFLICT (api_key_id, scope) DO NOTHING;

-- 3. Seed Default Admin & Customer Accounts
INSERT INTO users (id, email, password_hash, full_name, phone, role)
VALUES
('usr_admin_001', 'admin@poonamattire.com', '$2a$10$wE8Z9R1kLq1xP9oT3A9Z5.u5Z1V9oT3A9Z5.u5Z1V9oT3A9Z5.u5Z', 'Poonam Sharma (Admin)', '+91 98100 12345', 'admin'),
('usr_cust_001', 'customer@example.com', '$2a$10$wE8Z9R1kLq1xP9oT3A9Z5.u5Z1V9oT3A9Z5.u5Z1V9oT3A9Z5.u5Z', 'Ananya Sharma', '+91 98765 43210', 'customer')
ON CONFLICT (email) DO NOTHING;

-- 4. Seed Collections / Categories
INSERT INTO categories (id, slug, name, copy, image_url, display_order)
VALUES
('cat_festive', 'festive', 'Festive Salwar Sets', 'Gold-accented silhouettes for pujas, sangeet evenings, and family celebrations.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80', 1),
('cat_cotton', 'everyday-cotton', 'Everyday Cotton', 'Breathable handcrafted textures made for workdays, errands, and soft weekends.', 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=900&q=80', 2),
('cat_wedding', 'wedding-guest', 'Wedding Guest Edit', 'Premium festive pieces with graceful embroidery and rich festive drape.', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80', 3),
('cat_occasion', 'occasion', 'Occasion Wear', 'Luminous palettes and delicate neckline work tailored for celebrations.', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=900&q=80', 4),
('cat_workwear', 'workwear', 'Workwear Classics', 'Refined tailoring and elegant office-to-dinner silhouettes.', 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=900&q=80', 5)
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed Real Authentic Clothing Collections
INSERT INTO products (id, slug, name, category, fabric, color, price, mrp, rating, reviews_count, sizes, image, gallery, description, tags, stock, is_featured)
VALUES
(
    'pa-001',
    'gulab-zari-salwar-suit',
    'Gulab Zari Salwar Suit',
    'Festive',
    'Silk Blend',
    'Maroon',
    4299.00,
    5899.00,
    4.8,
    142,
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'
    ],
    'A deep maroon salwar suit finished with zari-inspired detailing, soft lining, and an elegant dupatta for festive evenings.',
    ARRAY['Bestseller', '3D Preview'],
    35,
    TRUE
),
(
    'pa-002',
    'noor-chanderi-kurta-set',
    'Noor Chanderi Kurta Set',
    'Occasion',
    'Chanderi',
    'Blush',
    3799.00,
    4999.00,
    4.7,
    96,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80'
    ],
    'Lightweight Chanderi with a luminous blush tone, delicate neckline work, and trousers tailored for graceful movement.',
    ARRAY['New', 'Handloom'],
    28,
    TRUE
),
(
    'pa-003',
    'aabha-cotton-palazzo-set',
    'Aabha Cotton Palazzo Set',
    'Casual',
    'Cotton',
    'Ivory',
    2499.00,
    3299.00,
    4.6,
    78,
    ARRAY['XS', 'S', 'M', 'L'],
    'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80'
    ],
    'Easy cotton kurta with a relaxed palazzo bottom, made for breathable all-day wear without losing polish.',
    ARRAY['Everyday', 'Breathable'],
    50,
    FALSE
),
(
    'pa-004',
    'sunehri-embroidered-anarkali',
    'Sunehri Embroidered Anarkali',
    'Wedding',
    'Georgette',
    'Gold',
    6899.00,
    8499.00,
    4.9,
    211,
    ARRAY['S', 'M', 'L', 'XL'],
    'https://images.unsplash.com/photo-1603217040830-34473db521a5?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1603217040830-34473db521a5?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80'
    ],
    'A flowing Anarkali with ornate embroidery, soft flare, and a celebratory gold palette for wedding guest dressing.',
    ARRAY['Premium', 'Limited Edition'],
    18,
    TRUE
),
(
    'pa-005',
    'mehfil-mirror-work-set',
    'Mehfil Mirror Work Set',
    'Festive',
    'Rayon',
    'Teal',
    3299.00,
    4499.00,
    4.5,
    64,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'
    ],
    'A teal kurta set with mirror-work accents and a confident festive personality for intimate celebrations.',
    ARRAY['Trending'],
    40,
    FALSE
),
(
    'pa-006',
    'kesar-linen-straight-set',
    'Kesar Linen Straight Set',
    'Workwear',
    'Linen',
    'Mustard',
    2899.00,
    3699.00,
    4.4,
    52,
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80'
    ],
    'A clean straight-cut linen set with refined tailoring, subtle color, and an elegant office-to-dinner rhythm.',
    ARRAY['Workwear', 'Smart Casual'],
    32,
    FALSE
),
(
    'pa-007',
    'chandani-chikankari-sharara',
    'Chandani Chikankari Sharara Set',
    'Festive',
    'Pure Cotton',
    'Off White',
    4999.00,
    6499.00,
    4.9,
    88,
    ARRAY['S', 'M', 'L', 'XL'],
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80'
    ],
    'Artisanal Lucknowi Chikankari embroidery on pure mulmul cotton paired with a flared sharara and gota patti dupatta.',
    ARRAY['Artisanal', 'Bestseller'],
    22,
    TRUE
),
(
    'pa-008',
    'riyasat-banarasi-lehenga',
    'Riyasat Banarasi Silk Lehenga',
    'Wedding',
    'Banarasi Silk',
    'Emerald Green',
    12499.00,
    15999.00,
    5.0,
    115,
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'
    ],
    'A majestic emerald Banarasi silk weave with handcrafted gold zari motifs, matching blouse piece, and organza dupatta.',
    ARRAY['Bridal', 'Luxury'],
    12,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    mrp = EXCLUDED.mrp,
    fabric = EXCLUDED.fabric,
    color = EXCLUDED.color,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    gallery = EXCLUDED.gallery,
    sizes = EXCLUDED.sizes,
    stock = EXCLUDED.stock;

-- 6. Seed Product Images Table
INSERT INTO product_images (product_id, image_url, display_order, is_primary)
VALUES
('pa-001', 'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80', 1, TRUE),
('pa-001', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80', 2, FALSE),
('pa-002', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=900&q=80', 1, TRUE),
('pa-002', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80', 2, FALSE),
('pa-003', 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=900&q=80', 1, TRUE),
('pa-004', 'https://images.unsplash.com/photo-1603217040830-34473db521a5?auto=format&fit=crop&w=900&q=80', 1, TRUE),
('pa-005', 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80', 1, TRUE),
('pa-006', 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=900&q=80', 1, TRUE),
('pa-007', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80', 1, TRUE),
('pa-008', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80', 1, TRUE);

-- 7. Seed Initial Sample Orders for Tracking & Admin
INSERT INTO orders (id, order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, city, state, postal_code, subtotal, discount, total_amount, payment_method, payment_status, order_status, notes)
VALUES
(
    'ord_demo_101',
    'PA-2026-1001',
    'usr_cust_001',
    'Ananya Sharma',
    'customer@example.com',
    '+91 98765 43210',
    'Flat 301, Silver Sands, Bandra West',
    'Mumbai',
    'Maharashtra',
    '400050',
    4299.00,
    0.00,
    4299.00,
    'cod',
    'pending',
    'processing',
    'Please call before delivery'
),
(
    'ord_demo_102',
    'PA-2026-1002',
    'usr_cust_001',
    'Ananya Sharma',
    'customer@example.com',
    '+91 98765 43210',
    'Flat 301, Silver Sands, Bandra West',
    'Mumbai',
    'Maharashtra',
    '400050',
    6899.00,
    500.00,
    6399.00,
    'upi',
    'paid',
    'shipped',
    'Gift wrap requested'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Order Items
INSERT INTO order_items (order_id, product_id, product_name, size, price, quantity, image_url)
VALUES
('ord_demo_101', 'pa-001', 'Gulab Zari Salwar Suit', 'M', 4299.00, 1, 'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80'),
('ord_demo_102', 'pa-004', 'Sunehri Embroidered Anarkali', 'L', 6899.00, 1, 'https://images.unsplash.com/photo-1603217040830-34473db521a5?auto=format&fit=crop&w=900&q=80')
ON CONFLICT DO NOTHING;
