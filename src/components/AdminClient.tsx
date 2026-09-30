"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  PackagePlus,
  ShoppingBag,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Trash2,
  ExternalLink,
  Edit,
  Search,
  Filter,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  Plus,
  Minus,
  Sparkles,
  Truck,
  Check,
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
  sizes: string[];
  image: string;
  gallery?: string[];
  description: string;
  tags?: string[];
  is_featured?: boolean;
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
  subtotal?: number;
  discount?: number;
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

  // Filters
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    category: "Festive",
    fabric: "Silk Blend",
    color: "Maroon",
    price: "",
    mrp: "",
    stock: "25",
    sizes: "XS, S, M, L, XL",
    image: "",
    description: "",
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    fabric: "",
    color: "",
    price: "",
    mrp: "",
    stock: "",
    sizes: "",
    image: "",
    description: "",
    is_active: true,
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

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

  // Quick Notification Helper
  const showToast = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4500);
  };

  // 1. Add Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAdd(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const sizeArray = addForm.sizes.split(",").map((s) => s.trim()).filter(Boolean);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          name: addForm.name,
          category: addForm.category,
          fabric: addForm.fabric,
          color: addForm.color,
          price: Number(addForm.price),
          mrp: Number(addForm.mrp || addForm.price),
          stock: Number(addForm.stock || 25),
          sizes: sizeArray.length > 0 ? sizeArray : ["XS", "S", "M", "L", "XL"],
          image: addForm.image || "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80",
          gallery: [addForm.image || "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80"],
          description: addForm.description || `${addForm.name} handcrafted in ${addForm.fabric}.`,
          tags: ["New Arrival", addForm.category],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add dress.");
      }

      showToast("success", `"${addForm.name}" added successfully to the catalog!`);
      setShowAddModal(false);
      setAddForm({
        name: "",
        category: "Festive",
        fabric: "Silk Blend",
        color: "Maroon",
        price: "",
        mrp: "",
        stock: "25",
        sizes: "XS, S, M, L, XL",
        image: "",
        description: "",
      });
      fetchDashboardData();
    } catch (err: any) {
      showToast("error", err.message || "Failed to add product.");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // 2. Open Edit Modal
  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      category: p.category,
      fabric: p.fabric,
      color: p.color,
      price: String(p.price),
      mrp: String(p.mrp),
      stock: String(p.stock),
      sizes: (p.sizes || []).join(", "),
      image: p.image,
      description: p.description || "",
      is_active: p.is_active,
    });
  };

  // 3. Save Edit Product
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmittingEdit(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const sizeArray = editForm.sizes.split(",").map((s) => s.trim()).filter(Boolean);

      const res = await fetch(`/api/products/${editingProduct.slug || editingProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          name: editForm.name,
          category: editForm.category,
          fabric: editForm.fabric,
          color: editForm.color,
          price: Number(editForm.price),
          mrp: Number(editForm.mrp),
          stock: Number(editForm.stock),
          sizes: sizeArray,
          image: editForm.image,
          description: editForm.description,
          is_active: editForm.is_active,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update dress.");
      }

      showToast("success", `"${editForm.name}" updated successfully.`);
      setEditingProduct(null);
      fetchDashboardData();
    } catch (err: any) {
      showToast("error", err.message || "Failed to update product.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // 4. Quick Stock Adjustment
  const handleQuickStock = async (product: ProductItem, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const res = await fetch(`/api/products/${product.slug || product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
        );
      }
    } catch (e) {
      console.error("Failed to adjust stock", e);
    }
  };

  // 5. Toggle Active Status
  const handleToggleActive = async (product: ProductItem) => {
    const newActive = !product.is_active;
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const res = await fetch(`/api/products/${product.slug || product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ is_active: newActive }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_active: newActive } : p))
        );
        showToast("success", `"${product.name}" is now ${newActive ? "Active" : "Archived"}.`);
      }
    } catch (e) {
      console.error("Failed to toggle status", e);
    }
  };

  // 6. Delete Product
  const handleDeleteProduct = async (slugOrId: string, prodName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${prodName}" from inventory?`)) return;
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

      showToast("success", `Product "${prodName}" deleted.`);
      fetchDashboardData();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete product.");
    }
  };

  // 7. Update Order Status
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
        throw new Error(data.error || "Failed to update order status.");
      }

      showToast("success", `Order #${orderId} marked as "${newStatus}".`);
      fetchDashboardData();
    } catch (err: any) {
      showToast("error", err.message || "Failed to update order status.");
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.fabric.toLowerCase().includes(productSearch.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [products, productSearch, selectedCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch);
      const matchStatus =
        orderStatusFilter === "All" || o.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  return (
    <main className={styles.admin}>
      {/* Top Header */}
      <div className={styles.adminHeader}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: "12px", fontSize: "0.76rem", fontWeight: 700 }}>
              POSTGRESQL LIVE CONNECTED
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Database: <code>poonamattire</code> on <code>vps.amcmep.in</code>
            </span>
          </div>
          <h1 className={styles.adminTitle}>Atelier Boutique Control Center</h1>
        </div>

        <div className={styles.adminHeaderActions}>
          <button
            type="button"
            className="button"
            onClick={() => setShowAddModal(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <PackagePlus size={18} /> Add New Dress
          </button>
          <button
            type="button"
            className="buttonSecondary"
            onClick={fetchDashboardData}
            title="Refresh database records"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <Link href="/shop" target="_blank" className="buttonSecondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            View Boutique <ExternalLink size={15} />
          </Link>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          style={{
            background: message.type === "success" ? "#e8f5e9" : "#ffebee",
            border: `1px solid ${message.type === "success" ? "#c8e6c9" : "#ffcdd2"}`,
            color: message.type === "success" ? "#2e7d32" : "#c62828",
            padding: "14px 20px",
            borderRadius: "var(--radius)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 600,
          }}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel}>TOTAL GROSS REVENUE</span>
            <div className={styles.statIcon} style={{ background: "#fcf4f7", color: "var(--primary)" }}>
              <BarChart3 size={20} />
            </div>
          </div>
          <strong className={styles.statValue}>{formatPrice(stats.totalRevenue)}</strong>
          <span style={{ fontSize: "0.78rem", color: "#2e7d32", fontWeight: 600 }}>
            Active customer billing
          </span>
        </article>

        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel}>PIPELINE ORDERS</span>
            <div className={styles.statIcon} style={{ background: "#e3f2fd", color: "#1565c0" }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <strong className={styles.statValue}>{stats.totalOrdersCount}</strong>
          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            {stats.openOrdersCount} in tailoring / active dispatch
          </span>
        </article>

        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel}>CATALOG DESIGNS</span>
            <div className={styles.statIcon} style={{ background: "#f3e5f5", color: "#7b1fa2" }}>
              <Sparkles size={20} />
            </div>
          </div>
          <strong className={styles.statValue}>{stats.productsCount}</strong>
          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            Handcrafted luxury silhouettes
          </span>
        </article>

        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel}>INVENTORY ALERTS</span>
            <div className={styles.statIcon} style={{ background: stats.lowStockCount > 0 ? "#fff3e0" : "#e8f5e9", color: stats.lowStockCount > 0 ? "#e65100" : "#2e7d32" }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <strong className={styles.statValue}>{stats.lowStockCount}</strong>
          <span style={{ fontSize: "0.78rem", color: stats.lowStockCount > 0 ? "#e65100" : "#2e7d32", fontWeight: 600 }}>
            {stats.lowStockCount > 0 ? "Low stock items (<10)" : "All stock levels optimal"}
          </span>
        </article>
      </div>

      {/* Main Tabs */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`${styles.tabBtn} ${activeTab === "catalog" ? styles.tabBtnActive : ""}`}
        >
          <Sparkles size={18} /> Dresses &amp; Inventory ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`${styles.tabBtn} ${activeTab === "orders" ? styles.tabBtnActive : ""}`}
        >
          <Truck size={18} /> Customer Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("keys")}
          className={`${styles.tabBtn} ${activeTab === "keys" ? styles.tabBtnActive : ""}`}
        >
          <KeyRound size={18} /> API Keys &amp; Database Architecture
        </button>
      </div>

      {/* TAB 1: CATALOG MANAGEMENT */}
      {activeTab === "catalog" && (
        <section>
          {/* Search & Category Filter Controls */}
          <div className={styles.catalogControls}>
            <div className={styles.searchWrap}>
              <Search size={18} color="var(--muted)" />
              <input
                placeholder="Search dresses by name, fabric, or color..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              {productSearch && (
                <button type="button" onClick={() => setProductSearch("")} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--muted)" }}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div className={styles.filterPills}>
              {["All", "Festive", "Wedding", "Occasion", "Casual", "Workwear"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.filterPill} ${selectedCategory === cat ? styles.filterPillActive : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table Card */}
          <div className={styles.productTableCard}>
            <div style={{ display: "grid", gridTemplateColumns: "70px 1.8fr 1fr 1fr 1.2fr 100px 110px", gap: "16px", padding: "14px 20px", background: "#fbf5f7", borderBottom: "1px solid var(--line)", fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <span>Photo</span>
              <span>Dress Name &amp; Silhouette</span>
              <span>Category / Fabric</span>
              <span>Price &amp; MRP</span>
              <span>Stock Adjustment</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
                No dresses match the current filter criteria.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <div key={p.id} className={styles.productRow}>
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={64}
                    height={80}
                    className={styles.thumbImg}
                  />

                  <div className={styles.productTitleCol}>
                    <Link href={`/product/${p.slug}`} target="_blank" style={{ textDecoration: "none" }}>
                      <strong>{p.name}</strong>
                    </Link>
                    <p>Color: {p.color} &bull; Sizes: {(p.sizes || []).join(", ")}</p>
                  </div>

                  <div>
                    <span style={{ background: "var(--surface)", border: "1px solid var(--line)", padding: "3px 8px", borderRadius: "4px", fontSize: "0.82rem", fontWeight: 600 }}>
                      {p.category}
                    </span>
                    <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>{p.fabric}</p>
                  </div>

                  <div>
                    <strong style={{ color: "var(--primary)", fontSize: "1.05rem" }}>{formatPrice(p.price)}</strong>
                    {p.mrp > p.price && (
                      <span style={{ fontSize: "0.8rem", color: "#999", textDecoration: "line-through", display: "block" }}>
                        {formatPrice(p.mrp)}
                      </span>
                    )}
                  </div>

                  {/* Stock with Steppers */}
                  <div className={styles.stockCol}>
                    <button
                      type="button"
                      className={styles.stockBtn}
                      onClick={() => handleQuickStock(p, -1)}
                      title="Decrease stock by 1"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{
                      fontWeight: 700,
                      minWidth: "36px",
                      textAlign: "center",
                      color: p.stock <= 5 ? "#d32f2f" : p.stock < 15 ? "#f57c00" : "var(--ink)",
                    }}>
                      {p.stock}
                    </span>
                    <button
                      type="button"
                      className={styles.stockBtn}
                      onClick={() => handleQuickStock(p, 1)}
                      title="Increase stock by 1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      style={{
                        background: p.is_active ? "#e8f5e9" : "#ffebee",
                        color: p.is_active ? "#2e7d32" : "#c62828",
                        border: `1px solid ${p.is_active ? "#c8e6c9" : "#ffcdd2"}`,
                        borderRadius: "12px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        cursor: "pointer",
                      }}
                    >
                      {p.is_active ? "LIVE" : "HIDDEN"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className={styles.actionsCol}>
                    <button
                      type="button"
                      className={styles.iconActionBtn}
                      onClick={() => openEditModal(p)}
                      title="Edit dress details"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconActionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteProduct(p.slug || p.id, p.name)}
                      title="Delete from database"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB 2: ORDER PIPELINE MANAGEMENT */}
      {activeTab === "orders" && (
        <section>
          {/* Order Search & Status Filter */}
          <div className={styles.catalogControls}>
            <div className={styles.searchWrap}>
              <Search size={18} color="var(--muted)" />
              <input
                placeholder="Search orders by Order #, Customer Name, or Phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
              {orderSearch && (
                <button type="button" onClick={() => setOrderSearch("")} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--muted)" }}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div className={styles.filterPills}>
              {["All", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`${styles.filterPill} ${orderStatusFilter === st ? styles.filterPillActive : ""}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div style={{ background: "white", padding: "48px 24px", textAlign: "center", borderRadius: "var(--radius)", border: "1px solid var(--line)", color: "var(--muted)" }}>
              No customer orders match the search criteria.
            </div>
          ) : (
            <div className={styles.ordersList}>
              {filteredOrders.map((order) => (
                <article key={order.id} className={styles.orderCard}>
                  {/* Card Header */}
                  <div className={styles.orderCardHeader}>
                    <div>
                      <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--primary)" }}>
                        #{order.orderNumber}
                      </span>
                      <span style={{ marginLeft: "14px", fontSize: "0.85rem", color: "var(--muted)" }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)" }}>
                        {formatPrice(order.totalAmount)}
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={styles.statusDropdown}
                        style={{
                          background:
                            order.orderStatus === "delivered"
                              ? "#e8f5e9"
                              : order.orderStatus === "shipped"
                              ? "#ede7f6"
                              : order.orderStatus === "processing"
                              ? "#e3f2fd"
                              : order.orderStatus === "cancelled"
                              ? "#ffebee"
                              : "#fff8e1",
                          color:
                            order.orderStatus === "delivered"
                              ? "#2e7d32"
                              : order.orderStatus === "shipped"
                              ? "#512da8"
                              : order.orderStatus === "processing"
                              ? "#1565c0"
                              : order.orderStatus === "cancelled"
                              ? "#c62828"
                              : "#b78103",
                        }}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing (Tailoring &amp; QC)</option>
                        <option value="shipped">Shipped (Dispatched)</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Link
                        href={`/track-order?orderId=${order.orderNumber}`}
                        target="_blank"
                        className="buttonSecondary"
                        style={{ padding: "6px 12px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "5px" }}
                      >
                        Live Tracking <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className={styles.orderCardBody}>
                    {/* Customer */}
                    <div>
                      <p className={styles.orderSectionTitle}>CUSTOMER DETAILS</p>
                      <strong style={{ fontSize: "1.05rem" }}>{order.customerName}</strong>
                      <p style={{ margin: "6px 0 2px", fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Mail size={14} color="var(--muted)" /> {order.customerEmail}
                      </p>
                      <p style={{ margin: "2px 0", fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Phone size={14} color="var(--muted)" /> {order.customerPhone}
                      </p>
                    </div>

                    {/* Shipping Address & Payment */}
                    <div>
                      <p className={styles.orderSectionTitle}>DELIVERY ADDRESS &amp; PAYMENT</p>
                      <p style={{ margin: "0 0 6px", fontSize: "0.88rem", lineHeight: 1.5, display: "flex", gap: "6px" }}>
                        <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>
                          {order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}
                        </span>
                      </p>
                      <p style={{ margin: "4px 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                        Method: <strong>{order.paymentMethod.toUpperCase()}</strong> &bull; Status: <strong>{order.paymentStatus}</strong>
                      </p>
                      {order.notes && (
                        <p style={{ margin: "4px 0", fontSize: "0.8rem", color: "#666", background: "#f5f5f5", padding: "4px 8px", borderRadius: "4px" }}>
                          Instructions: {order.notes}
                        </p>
                      )}
                    </div>

                    {/* Ordered Items Preview */}
                    <div>
                      <p className={styles.orderSectionTitle}>
                        ORDERED ITEMS ({order.items?.length || 0})
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              fontSize: "0.86rem",
                              background: "var(--surface)",
                              padding: "8px 10px",
                              borderRadius: "6px",
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              {item.productName} (Size: <strong>{item.size}</strong>) &times; {item.quantity}
                            </span>
                            <strong style={{ color: "var(--primary)" }}>
                              {formatPrice(item.price * item.quantity)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: API KEYS & DATABASE ARCHITECTURE */}
      {activeTab === "keys" && (
        <section style={{ background: "white", padding: "32px", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--primary)", fontSize: "1.6rem", margin: "0 0 8px" }}>
            Project API Keys &amp; Permissions Architecture
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.92rem", marginBottom: "28px", lineHeight: 1.6 }}>
            The Poonam Attire API uses dedicated scoped keys in PostgreSQL tables <code>project_api_keys</code> and <code>project_api_key_scopes</code> to secure mobile apps, Next.js storefront, and administration dashboards.
          </p>

          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{ border: "1px solid var(--line)", padding: "20px", borderRadius: "var(--radius)", background: "#fcf8fa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong style={{ fontSize: "1.05rem" }}>Next.js Web Client Live Key</strong>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE &bull; PRODUCTION</span>
              </div>
              <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#444", background: "white", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}>
                PA_live_key_web_client_2026_poonam_hash
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>catalog:read</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>cart:write</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>orders:create</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>orders:read</span>
              </div>
            </div>

            <div style={{ border: "1px solid var(--line)", padding: "20px", borderRadius: "var(--radius)", background: "#fcf8fa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong style={{ fontSize: "1.05rem" }}>Flutter Mobile App Live Key</strong>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE &bull; PRODUCTION</span>
              </div>
              <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#444", background: "white", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}>
                PA_live_key_flutter_mobile_2026_poonam_hash
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>catalog:read</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>cart:write</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>orders:create</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>orders:read</span>
              </div>
            </div>

            <div style={{ border: "1px solid var(--line)", padding: "20px", borderRadius: "var(--radius)", background: "#fcf8fa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong style={{ fontSize: "1.05rem" }}>Administrator Console Key</strong>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>FULL ACCESS</span>
              </div>
              <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#444", background: "white", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}>
                PA_live_key_admin_portal_2026_poonam_hash
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                <span style={{ background: "var(--primary)", color: "white", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>admin:all</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>catalog:write</span>
                <span style={{ background: "white", border: "1px solid var(--line)", fontSize: "0.76rem", padding: "3px 8px", borderRadius: "4px" }}>orders:write</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODAL 1: ADD NEW DRESS */}
      {showAddModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2>Add New Handcrafted Dress</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: 0, cursor: "pointer", color: "var(--muted)" }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className={styles.formGrid}>
              <div className={styles.formField}>
                <label>Dress Title *</label>
                <input
                  placeholder="e.g. Riyasat Banarasi Silk Lehenga"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className={styles.formField}>
                  <label>Category *</label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  >
                    <option value="Festive">Festive</option>
                    <option value="Occasion">Occasion</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Casual">Casual</option>
                    <option value="Workwear">Workwear</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label>Fabric *</label>
                  <select
                    value={addForm.fabric}
                    onChange={(e) => setAddForm({ ...addForm, fabric: e.target.value })}
                  >
                    <option value="Silk Blend">Silk Blend</option>
                    <option value="Chanderi">Chanderi</option>
                    <option value="Pure Cotton">Pure Cotton</option>
                    <option value="Georgette">Georgette</option>
                    <option value="Banarasi Silk">Banarasi Silk</option>
                    <option value="Linen">Linen</option>
                    <option value="Rayon">Rayon</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div className={styles.formField}>
                  <label>Color</label>
                  <input
                    placeholder="e.g. Maroon"
                    value={addForm.color}
                    onChange={(e) => setAddForm({ ...addForm, color: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="4299"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label>MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="5899"
                    value={addForm.mrp}
                    onChange={(e) => setAddForm({ ...addForm, mrp: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className={styles.formField}>
                  <label>Stock Count</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={addForm.stock}
                    onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Available Sizes</label>
                  <input
                    placeholder="XS, S, M, L, XL"
                    value={addForm.sizes}
                    onChange={(e) => setAddForm({ ...addForm, sizes: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label>Photo URL (High-Resolution Image)</label>
                <input
                  placeholder="https://images.unsplash.com/photo-..."
                  value={addForm.image}
                  onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                />
              </div>

              <div className={styles.formField}>
                <label>Description &amp; Artisanal Story</label>
                <textarea
                  placeholder="Describe the fabric weaves, neckline embroidery, and silhouette..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className="buttonSecondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={submittingAdd}>
                  {submittingAdd ? "Saving to Database..." : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT EXISTING DRESS */}
      {editingProduct && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2>Edit Dress: {editingProduct.name}</h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                style={{ background: "none", border: 0, cursor: "pointer", color: "var(--muted)" }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className={styles.formGrid}>
              <div className={styles.formField}>
                <label>Dress Title</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className={styles.formField}>
                  <label>Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="Festive">Festive</option>
                    <option value="Occasion">Occasion</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Casual">Casual</option>
                    <option value="Workwear">Workwear</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label>Fabric</label>
                  <input
                    value={editForm.fabric}
                    onChange={(e) => setEditForm({ ...editForm, fabric: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div className={styles.formField}>
                  <label>Color</label>
                  <input
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label>MRP (₹)</label>
                  <input
                    type="number"
                    value={editForm.mrp}
                    onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className={styles.formField}>
                  <label>Stock Count</label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label>Available Sizes</label>
                  <input
                    value={editForm.sizes}
                    onChange={(e) => setEditForm({ ...editForm, sizes: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label>Photo URL</label>
                <input
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formField}>
                <label>Description &amp; Care Details</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  style={{ width: "18px", height: "18px" }}
                />
                <label htmlFor="isActiveCheck" style={{ fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                  Active &amp; Visible in Boutique Storefront
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className="buttonSecondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={submittingEdit}>
                  {submittingEdit ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
