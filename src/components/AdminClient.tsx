"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  PackagePlus,
  ShoppingBag,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Trash2,
  ExternalLink,
  Layers,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { formatPrice } from "@/data/products";
import styles from "@/app/admin/admin.module.css";

type Stats = {
  productsCount: number;
  lowStockCount: number;
  openOrdersCount: number;
  totalOrdersCount: number;
  totalRevenue: number;
  conversionHealth: string;
};

type ProductItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  fabric: string;
  color: string;
  price: number;
  mrp: number;
  stock: number;
  image: string;
  is_active: boolean;
};

type OrderItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  items: Array<{
    productName: string;
    size: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
};

export function AdminClient() {
  const [activeTab, setActiveTab] = useState<"catalog" | "orders" | "keys">("catalog");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    productsCount: 8,
    lowStockCount: 0,
    openOrdersCount: 2,
    totalOrdersCount: 2,
    totalRevenue: 10698,
    conversionHealth: "94%",
  });
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New product form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Festive");
  const [fabric, setFabric] = useState("Silk Blend");
  const [color, setColor] = useState("Maroon");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("30");
  const [sizes, setSizes] = useState("XS, S, M, L, XL");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";

      // 1. Fetch overview stats
      const overviewRes = await fetch("/api/admin/overview", {
        headers: { "x-api-key": apiKey },
      });
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        if (overviewData.success) {
          setStats(overviewData.stats);
        }
      }

      // 2. Fetch products
      const prodRes = await fetch("/api/products", {
        headers: { "x-api-key": apiKey },
      });
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.products);
        }
      }

      // 3. Fetch orders
      const orderRes = await fetch("/api/orders", {
        headers: { "x-api-key": apiKey },
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.success) {
          setOrders(orderData.orders);
        }
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmittingProduct(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const sizeArray = sizes.split(",").map((s) => s.trim()).filter(Boolean);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          name,
          category,
          fabric,
          color,
          price: Number(price),
          mrp: Number(mrp || price),
          stock: Number(stock || 30),
          sizes: sizeArray.length > 0 ? sizeArray : ["XS", "S", "M", "L", "XL"],
          image: imageUrl || "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
          gallery: [imageUrl || "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80"],
          description: description || `${name} handcrafted in ${fabric}.`,
          tags: ["New Arrival", category],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add dress.");
      }

      setMessage({ type: "success", text: `"${name}" added successfully to the live collection!` });
      setName("");
      setPrice("");
      setMrp("");
      setImageUrl("");
      setDescription("");
      fetchDashboardData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to add product." });
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update order.");
      }

      setMessage({ type: "success", text: `Order status updated to "${newStatus}".` });
      fetchDashboardData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update status." });
    }
  };

  const handleDeleteProduct = async (slugOrId: string, prodName: string) => {
    if (!confirm(`Are you sure you want to remove "${prodName}" from inventory?`)) return;
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const res = await fetch(`/api/products/${slugOrId}`, {
        method: "DELETE",
        headers: { "x-api-key": apiKey },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product.");
      }

      setMessage({ type: "success", text: `Product "${prodName}" removed.` });
      fetchDashboardData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to delete product." });
    }
  };

  return (
    <main className={`${styles.admin} section`}>
      <div className="sectionHeader" style={{ alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <span style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <CheckCircle2 size={13} /> Live PostgreSQL: vps.amcmep.in (poonamattire)
            </span>
          </div>
          <h1 className="title">Boutique Operations & Admin Portal</h1>
        </div>
        <button
          className="buttonSecondary"
          onClick={fetchDashboardData}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh Data
        </button>
      </div>

      {message && (
        <div style={{
          padding: "1rem 1.25rem",
          background: message.type === "success" ? "#e8f5e9" : "#fff0f2",
          color: message.type === "success" ? "#2e7d32" : "#d32f2f",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.stats}>
        <article>
          <PackagePlus />
          <strong>{stats.productsCount}</strong>
          <span>Live Attire Collections</span>
        </article>
        <article>
          <ShoppingBag />
          <strong>{stats.openOrdersCount}</strong>
          <span>Open Orders Pipeline</span>
        </article>
        <article>
          <BarChart3 />
          <strong>{formatPrice(stats.totalRevenue)}</strong>
          <span>Total Billed Revenue</span>
        </article>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1.5rem",
        borderBottom: "1px solid var(--line)",
        paddingBottom: "0.5rem"
      }}>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: activeTab === "catalog" ? 700 : 500,
            color: activeTab === "catalog" ? "#8B1E3F" : "#666",
            borderBottom: activeTab === "catalog" ? "3px solid #8B1E3F" : "none",
            paddingBottom: "8px",
            fontSize: "1rem"
          }}
          onClick={() => setActiveTab("catalog")}
        >
          Dresses & Inventory ({products.length})
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: activeTab === "orders" ? 700 : 500,
            color: activeTab === "orders" ? "#8B1E3F" : "#666",
            borderBottom: activeTab === "orders" ? "3px solid #8B1E3F" : "none",
            paddingBottom: "8px",
            fontSize: "1rem"
          }}
          onClick={() => setActiveTab("orders")}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: activeTab === "keys" ? 700 : 500,
            color: activeTab === "keys" ? "#8B1E3F" : "#666",
            borderBottom: activeTab === "keys" ? "3px solid #8B1E3F" : "none",
            paddingBottom: "8px",
            fontSize: "1rem"
          }}
          onClick={() => setActiveTab("keys")}
        >
          API Keys & Scopes
        </button>
      </div>

      {/* TAB 1: Catalog & Add Dress */}
      {activeTab === "catalog" && (
        <section className={styles.panel}>
          <form onSubmit={handleAddProduct}>
            <h2>Add New Dress Collection</h2>
            <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-8px" }}>
              Creates an authentic record in the PostgreSQL <code>products</code> table.
            </p>
            <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Dress Title
              <input
                placeholder="e.g. Meera Chanderi Anarkali"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Festive">Festive</option>
                  <option value="Occasion">Occasion</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Casual">Casual</option>
                  <option value="Workwear">Workwear</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Fabric
                <select value={fabric} onChange={(e) => setFabric(e.target.value)}>
                  <option value="Silk Blend">Silk Blend</option>
                  <option value="Chanderi">Chanderi</option>
                  <option value="Pure Cotton">Pure Cotton</option>
                  <option value="Georgette">Georgette</option>
                  <option value="Banarasi Silk">Banarasi Silk</option>
                  <option value="Linen">Linen</option>
                  <option value="Rayon">Rayon</option>
                </select>
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Color
                <input
                  placeholder="e.g. Maroon"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
              </label>
              <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Price (INR)
                <input
                  type="number"
                  placeholder="4299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </label>
              <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                MRP (INR)
                <input
                  type="number"
                  placeholder="5899"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                />
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Stock Count
                <input
                  type="number"
                  placeholder="30"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </label>
              <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Available Sizes
                <input
                  placeholder="XS, S, M, L, XL"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                />
              </label>
            </div>
            <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Primary Image URL
              <input
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>
            <label style={{ display: "grid", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Description & Styling
              <textarea
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  padding: "8px 12px",
                  minHeight: "70px"
                }}
                placeholder="Artisanal weave with ornate neckline..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <button className="button" type="submit" disabled={submittingProduct}>
              <Upload size={18} /> {submittingProduct ? "Saving to Database..." : "Save Product"}
            </button>
          </form>

          <div>
            <h2>Live Inventory ({products.length})</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", maxHeight: "640px" }}>
              {products.map((product) => (
                <article key={product.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "10px", borderBottom: "1px solid var(--line)" }}>
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong>{product.name}</strong>
                      <span style={{ fontSize: "0.75rem", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" }}>
                        {product.category}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#666", margin: "2px 0" }}>
                      Fabric: {product.fabric} &bull; Color: {product.color} &bull; Stock: <strong>{product.stock}</strong>
                    </p>
                    <span style={{ fontWeight: 700, color: "#8B1E3F" }}>{formatPrice(product.price)}</span>
                    {product.mrp > product.price && (
                      <span style={{ textDecoration: "line-through", color: "#999", fontSize: "0.8rem", marginLeft: "6px" }}>
                        {formatPrice(product.mrp)}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.slug || product.id, product.name)}
                    style={{ background: "#fff0f2", border: "1px solid #ffcdd2", color: "#d32f2f", borderRadius: "6px", cursor: "pointer", padding: "6px 10px" }}
                    title="Remove product"
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: Customer Orders */}
      {activeTab === "orders" && (
        <section style={{ background: "white", padding: "24px", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h2>Customer Order Pipeline</h2>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Live orders received from web and mobile clients, backed by the PostgreSQL <code>orders</code> and <code>order_items</code> tables.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p>No orders recorded yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "#fafafa"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid #eee", paddingBottom: "12px", marginBottom: "12px" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#8B1E3F" }}>
                        #{order.orderNumber}
                      </span>
                      <span style={{ marginLeft: "10px", fontSize: "0.85rem", color: "#888" }}>
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                        {formatPrice(order.totalAmount)}
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          fontWeight: 600,
                          background:
                            order.orderStatus === "delivered"
                              ? "#e8f5e9"
                              : order.orderStatus === "shipped"
                              ? "#e3f2fd"
                              : order.orderStatus === "processing"
                              ? "#fff9c4"
                              : "#f5f5f5",
                        }}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#666", marginBottom: "4px" }}>CUSTOMER DETAILS</p>
                      <strong style={{ fontSize: "1rem" }}>{order.customerName}</strong>
                      <p style={{ margin: "2px 0", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Mail size={14} color="#888" /> {order.customerEmail}
                      </p>
                      <p style={{ margin: "2px 0", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Phone size={14} color="#888" /> {order.customerPhone}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#666", marginBottom: "4px" }}>SHIPPING ADDRESS</p>
                      <p style={{ fontSize: "0.85rem", display: "flex", alignItems: "flex-start", gap: "4px", margin: 0 }}>
                        <MapPin size={16} color="#888" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>
                          {order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}
                        </span>
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#777", marginTop: "4px" }}>
                        Payment: <strong>{order.paymentMethod.toUpperCase()}</strong> ({order.paymentStatus})
                      </p>
                    </div>

                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#666", marginBottom: "4px" }}>ORDERED ITEMS</p>
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: "0.85rem", marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                          <span>
                            {item.productName} (Size: <strong>{item.size}</strong>) &times; {item.quantity}
                          </span>
                          <strong>{formatPrice(item.price * item.quantity)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: API Keys & Scopes */}
      {activeTab === "keys" && (
        <section style={{ background: "white", padding: "24px", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
          <h2>Project API Keys & Scopes Architecture</h2>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            The Poonam Attire API uses scoped API keys recorded in <code>project_api_keys</code> and <code>project_api_key_scopes</code>.
          </p>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ border: "1px solid var(--line)", padding: "16px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong>Next.js Web Client Key</strong>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE</span>
              </div>
              <p style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#555" }}>PA_live_key_web_client_2026_poonam_hash</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>catalog:read</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>cart:write</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>orders:create</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>orders:read</span>
              </div>
            </div>

            <div style={{ border: "1px solid var(--line)", padding: "16px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong>Flutter Mobile App Key</strong>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE</span>
              </div>
              <p style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#555" }}>PA_live_key_flutter_mobile_2026_poonam_hash</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>catalog:read</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>cart:write</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>orders:create</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>orders:read</span>
              </div>
            </div>

            <div style={{ border: "1px solid var(--line)", padding: "16px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong>Administrator Portal Key</strong>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE</span>
              </div>
              <p style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#555" }}>PA_live_key_admin_portal_2026_poonam_hash</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                <span style={{ background: "#8B1E3F", color: "white", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>admin:all</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>catalog:write</span>
                <span style={{ background: "#f0f0f0", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}>orders:write</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
