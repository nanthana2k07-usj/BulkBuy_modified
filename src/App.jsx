import { useState, useEffect, useRef } from "react";

// ─── Storage (in-memory, no localStorage) ─────────────────────────────────────
let _users = [
  { id: 1, ownerName: "Rajesh Kumar", email: "rajesh@shop.com", password: "pass123", phone: "9876543210", shopName: "Rajesh General Store", location: "MG Road, Pune", category: "Grocery", totalSavings: 4200, orders: 12, collaborations: 5, role: "owner", joinDate: "Jan 2024" },
  { id: 2, ownerName: "Priya Sharma", email: "priya@shop.com", password: "pass123", phone: "9812345678", shopName: "Priya Mart", location: "FC Road, Pune", category: "Grocery", totalSavings: 2800, orders: 8, collaborations: 3, role: "owner", joinDate: "Feb 2024" },
  { id: 3, ownerName: "Amit Patel", email: "amit@shop.com", password: "pass123", phone: "9823456789", shopName: "Amit Electronics", location: "Kothrud, Pune", category: "Electronics", totalSavings: 6100, orders: 15, collaborations: 7, role: "owner", joinDate: "Dec 2023" },
  { id: 99, ownerName: "Admin", email: "admin@bulkbuy.com", password: "admin123", phone: "9999999999", shopName: "BulkBuy Admin", location: "HQ", category: "All", totalSavings: 0, orders: 0, collaborations: 0, role: "admin", joinDate: "Jan 2024" },
];
let _session = null;

let _products = [
  { id: 1, name: "Premium Basmati Rice (50kg)", category: "Grocery", price: 2800, bulkPrice: 2200, bulkThreshold: 500, supplier: "AgriSupply Co.", rating: 4.7, reviews: 128, image: "🌾", stock: 5000, unit: "kg" },
  { id: 2, name: "Refined Sunflower Oil (15L)", category: "Grocery", price: 1650, bulkPrice: 1300, bulkThreshold: 300, supplier: "PureOil Ltd.", rating: 4.5, reviews: 94, image: "🫙", stock: 3000, unit: "L" },
  { id: 3, name: "Cotton T-Shirts Bundle (50pcs)", category: "Clothes", price: 4500, bulkPrice: 3200, bulkThreshold: 200, supplier: "TextilePro", rating: 4.3, reviews: 67, image: "👕", stock: 2000, unit: "pcs" },
  { id: 4, name: "A4 Paper Reams (10 packs)", category: "Stationery", price: 850, bulkPrice: 620, bulkThreshold: 100, supplier: "PaperWorld", rating: 4.6, reviews: 201, image: "📄", stock: 10000, unit: "packs" },
  { id: 5, name: "LED Bulbs Pack (50pcs)", category: "Electronics", price: 3200, bulkPrice: 2400, bulkThreshold: 250, supplier: "LightTech", rating: 4.4, reviews: 88, image: "💡", stock: 4000, unit: "pcs" },
  { id: 6, name: "Face Cream Wholesale (100pcs)", category: "Cosmetics", price: 6800, bulkPrice: 5100, bulkThreshold: 400, supplier: "GlowCo", rating: 4.8, reviews: 156, image: "🧴", stock: 2000, unit: "pcs" },
  { id: 7, name: "Wheat Flour (25kg)", category: "Grocery", price: 950, bulkPrice: 720, bulkThreshold: 400, supplier: "FreshMill", rating: 4.6, reviews: 310, image: "🌿", stock: 8000, unit: "kg" },
  { id: 8, name: "Sugar (50kg)", category: "Grocery", price: 2200, bulkPrice: 1750, bulkThreshold: 600, supplier: "SweetFarm", rating: 4.4, reviews: 190, image: "🍬", stock: 6000, unit: "kg" },
  { id: 9, name: "Notebook Bundle (100pcs)", category: "Stationery", price: 3200, bulkPrice: 2300, bulkThreshold: 200, supplier: "WriteRight", rating: 4.5, reviews: 142, image: "📓", stock: 5000, unit: "pcs" },
  { id: 10, name: "Mobile Chargers (20pcs)", category: "Electronics", price: 2800, bulkPrice: 1900, bulkThreshold: 150, supplier: "TechHub", rating: 4.2, reviews: 76, image: "🔌", stock: 3000, unit: "pcs" },
  { id: 11, name: "Shampoo Wholesale (200ml×50)", category: "Cosmetics", price: 4500, bulkPrice: 3400, bulkThreshold: 300, supplier: "CareMore", rating: 4.6, reviews: 112, image: "🧼", stock: 4000, unit: "pcs" },
  { id: 12, name: "Denim Jeans Bundle (30pcs)", category: "Clothes", price: 9000, bulkPrice: 6500, bulkThreshold: 150, supplier: "FashionBulk", rating: 4.3, reviews: 58, image: "👖", stock: 1500, unit: "pcs" },
];

let _orders = [
  { id: "BLK-2841", productId: 1, product: "Premium Basmati Rice", qty: 350, status: "Approved", shops: ["Rajesh General Store", "Priya Mart", "Amit Electronics"], saving: 840, date: "Apr 13", totalAmount: 9800, shopBreakdown: [{ shop: "Rajesh General Store", qty: 150, amount: 4200 }, { shop: "Priya Mart", qty: 120, amount: 3360 }, { shop: "Amit Electronics", qty: 80, amount: 2240 }] },
  { id: "BLK-2790", productId: 5, product: "LED Bulbs Pack", qty: 280, status: "Delivered", shops: ["Priya Mart", "Amit Electronics"], saving: 560, date: "Apr 8", totalAmount: 6720, shopBreakdown: [{ shop: "Priya Mart", qty: 130, amount: 3120 }, { shop: "Amit Electronics", qty: 150, amount: 3600 }] },
  { id: "BLK-2750", productId: 2, product: "Refined Sunflower Oil", qty: 180, status: "Pending", shops: ["Rajesh General Store"], saving: 0, date: "Apr 5", totalAmount: 3240, shopBreakdown: [{ shop: "Rajesh General Store", qty: 180, amount: 3240 }] },
  { id: "BLK-2810", productId: 4, product: "A4 Paper Reams", qty: 220, status: "Paid", shops: ["Rajesh General Store", "Priya Mart"], saving: 308, date: "Apr 10", totalAmount: 1364, shopBreakdown: [{ shop: "Rajesh General Store", qty: 120, amount: 744 }, { shop: "Priya Mart", qty: 100, amount: 620 }] },
];

let _poolCart = [
  { productId: 1, userId: 2, shopName: "Priya Mart", qty: 120 },
  { productId: 1, userId: 3, shopName: "Amit Electronics", qty: 80 },
  { productId: 5, userId: 2, shopName: "Priya Mart", qty: 100 },
];

let _messages = [
  { id: 1, userId: 2, sender: "Priya Mart", text: "Has anyone ordered the Basmati Rice this month?", time: "10:32 AM", avatar: "PM" },
  { id: 2, userId: 3, sender: "Amit Electronics", text: "Yes! I added 80kg. We need 50 more kg to unlock bulk price.", time: "10:35 AM", avatar: "AE" },
  { id: 3, userId: 1, sender: "Rajesh General Store", text: "I'll add 150kg now. That should get us over the threshold!", time: "10:37 AM", avatar: "RG" },
  { id: 4, userId: 2, sender: "Priya Mart", text: "Great! Bulk discount unlocked 🎉", time: "10:38 AM", avatar: "PM" },
];

let _notifications = [
  { id: 1, type: "collab", msg: "Priya Mart accepted your collaboration request", time: "2m ago", icon: "🤝", read: false },
  { id: 2, type: "discount", msg: "Bulk threshold reached! ₹840 savings unlocked on Rice order", time: "1h ago", icon: "🎉", read: false },
  { id: 3, type: "delivery", msg: "Order #BLK-2841 moved to Approved", time: "3h ago", icon: "📦", read: true },
  { id: 4, type: "system", msg: "New product added: Wheat Flour (25kg)", time: "5h ago", icon: "🆕", read: true },
];

const CATEGORIES = ["All", "Grocery", "Clothes", "Stationery", "Electronics", "Cosmetics", "Others"];
const STATUS_FLOW = ["Pending", "Approved", "Paid", "Shipped", "Delivered"];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const pct = (a, b) => Math.round(((b - a) / b) * 100);
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const avatarColor = (name) => {
  const colors = ["#4f7cff", "#7c5cfc", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#38bdf8"];
  return colors[name.charCodeAt(0) % colors.length];
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [chatOpen, setChatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(x => x + 1);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const logout = () => { _session = null; setCurrentUser(null); setScreen("login"); setCart([]); };

  const addToCart = (product, qty = 50) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const poolQty = (pid) => {
    const pool = _poolCart.filter(e => e.productId === pid);
    return pool.reduce((s, e) => s + e.qty, 0);
  };

  if (currentUser?.role === "admin") {
    return <AdminApp user={currentUser} logout={logout} showToast={showToast} toast={toast} refresh={refresh} />;
  }

  const screens = {
    login: <LoginScreen setScreen={setScreen} setCurrentUser={setCurrentUser} showToast={showToast} />,
    register: <RegisterScreen setScreen={setScreen} showToast={showToast} />,
    dashboard: <DashboardScreen user={currentUser} setScreen={setScreen} setSelectedCategory={setSelectedCategory} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} showToast={showToast} />,
    browse: <BrowseScreen category={selectedCategory} setSelectedCategory={setSelectedCategory} setScreen={setScreen} setSelectedProduct={setSelectedProduct} addToCart={addToCart} poolQty={poolQty} />,
    product: <ProductScreen product={selectedProduct} setScreen={setScreen} addToCart={addToCart} poolQty={poolQty} showToast={showToast} currentUser={currentUser} />,
    cart: <CartScreen cart={cart} setCart={setCart} setScreen={setScreen} showToast={showToast} poolQty={poolQty} currentUser={currentUser} />,
    payment: <PaymentScreen cart={cart} setScreen={setScreen} showToast={showToast} currentUser={currentUser} setCart={setCart} />,
    tracking: <TrackingScreen setScreen={setScreen} currentUser={currentUser} />,
    chat: <ChatScreen setScreen={setScreen} currentUser={currentUser} showToast={showToast} />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080d18", minHeight: "100vh", color: "#e2e8f8" }}>
      <GlobalStyles />
      {screens[screen] || screens.dashboard}
      {currentUser && screen !== "login" && screen !== "register" && (
        <>
          <AiChatbot open={chatOpen} setOpen={setChatOpen} currentUser={currentUser} />
          {chatOpen ? null : (
            <button onClick={() => setChatOpen(true)} style={{ position: "fixed", bottom: 28, right: 28, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#4f7cff,#7c5cfc)", border: "none", cursor: "pointer", fontSize: 24, boxShadow: "0 8px 32px rgba(79,124,255,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.target.style.transform = "scale(1.1)"} onMouseLeave={e => e.target.style.transform = "scale(1)"}>🤖</button>
          )}
        </>
      )}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#0d1425}::-webkit-scrollbar-thumb{background:#1e2d4e;border-radius:3px}
      input,textarea,select{font-family:inherit}
      .card{background:linear-gradient(145deg,#0e1829 0%,#0a1220 100%);border:1px solid #162035;border-radius:18px}
      .btn{border:none;border-radius:12px;padding:12px 22px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:0.2px}
      .btn-primary{background:linear-gradient(135deg,#4f7cff,#7c5cfc);color:#fff;box-shadow:0 4px 16px rgba(79,124,255,0.3)}
      .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(79,124,255,0.45)}
      .btn-primary:active{transform:translateY(0)}
      .btn-outline{background:transparent;color:#7c9cff;border:1.5px solid #1e3060}
      .btn-outline:hover{border-color:#4f7cff;background:rgba(79,124,255,0.08)}
      .btn-danger{background:rgba(248,113,113,0.12);color:#f87171;border:1px solid rgba(248,113,113,0.2)}
      .btn-danger:hover{background:rgba(248,113,113,0.2)}
      .btn-success{background:rgba(52,211,153,0.12);color:#34d399;border:1px solid rgba(52,211,153,0.2)}
      .btn-success:hover{background:rgba(52,211,153,0.22)}
      .inp{background:#060d1a;border:1.5px solid #162035;border-radius:12px;padding:12px 16px;color:#e2e8f8;font-size:14px;width:100%;outline:none;transition:border 0.2s}
      .inp:focus{border-color:#4f7cff;box-shadow:0 0 0 3px rgba(79,124,255,0.1)}
      .inp::placeholder{color:#2a3a55}
      .tag{display:inline-flex;align-items:center;gap:5px;border-radius:8px;padding:3px 10px;font-size:11px;font-weight:700;letter-spacing:0.3px}
      .tag-blue{background:rgba(79,124,255,0.12);color:#7c9cff;border:1px solid rgba(79,124,255,0.2)}
      .tag-green{background:rgba(52,211,153,0.1);color:#34d399;border:1px solid rgba(52,211,153,0.2)}
      .tag-amber{background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2)}
      .tag-red{background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2)}
      .tag-purple{background:rgba(167,139,250,0.1);color:#a78bfa;border:1px solid rgba(167,139,250,0.2)}
      @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .fade{animation:fadeIn 0.3s ease}
      .hover-card{transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s}
      .hover-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.5);border-color:#253660}
      .divider{height:1px;background:linear-gradient(90deg,transparent,#162035,transparent);margin:18px 0}
      .progress-track{height:8px;background:#0d1a2e;border-radius:4px;overflow:hidden}
      .progress-fill{height:100%;border-radius:4px;transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1)}
      .status-dot{width:8px;height:8px;border-radius:50%;display:inline-block}
      .avatar{display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:13px;color:#fff;flex-shrink:0}
      select.inp option{background:#0e1829}
    `}</style>
  );
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: toast.type === "success" ? "linear-gradient(135deg,#0d2218,#091a10)" : "linear-gradient(135deg,#221010,#1a0909)", border: `1px solid ${toast.type === "success" ? "#34d399" : "#f87171"}`, borderRadius: 14, padding: "13px 24px", color: toast.type === "success" ? "#34d399" : "#f87171", fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 10px 40px rgba(0,0,0,0.6)", whiteSpace: "nowrap", animation: "fadeIn 0.3s ease" }}>
      {toast.type === "success" ? "✓ " : "✗ "}{toast.msg}
    </div>
  );
}

// ─── TOPBAR ────────────────────────────────────────────────────────────────────
function TopBar({ user, setScreen, cart, logout, notifOpen, setNotifOpen }) {
  const unread = _notifications.filter(n => !n.read).length;
  return (
    <div style={{ background: "rgba(8,13,24,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #0f1e35", padding: "0 24px", position: "sticky", top: 0, zIndex: 200 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setScreen("dashboard")}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4f7cff,#7c5cfc)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>BulkBuy</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <NavBtn icon="🏪" label="Browse" onClick={() => setScreen("browse")} />
          <NavBtn icon="📦" label="Orders" onClick={() => setScreen("tracking")} />
          <NavBtn icon="💬" label="Chat" onClick={() => setScreen("chat")} />
          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button className="btn btn-outline" style={{ padding: "8px 14px", position: "relative" }} onClick={() => setNotifOpen(!notifOpen)}>
              🔔 {unread > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, background: "#f87171", borderRadius: "50%", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>}
            </button>
            {notifOpen && <NotifDropdown setNotifOpen={setNotifOpen} />}
          </div>
          {/* Cart */}
          <button className="btn btn-outline" style={{ padding: "8px 14px", position: "relative" }} onClick={() => setScreen("cart")}>
            🛒 {cart.length > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, background: "#4f7cff", borderRadius: "50%", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>}
          </button>
          {/* Avatar */}
          <div onClick={logout} style={{ width: 36, height: 36, borderRadius: "50%", background: avatarColor(user?.ownerName || "U"), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#fff", border: "2px solid #1e3060" }} title="Logout">
            {initials(user?.ownerName || "U")}
          </div>
        </div>
      </div>
    </div>
  );
}
function NavBtn({ icon, label, onClick }) {
  return <button className="btn btn-outline" style={{ padding: "8px 14px", fontSize: 13 }} onClick={onClick}>{icon} {label}</button>;
}
function NotifDropdown({ setNotifOpen }) {
  return (
    <div className="card fade" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, padding: 0, zIndex: 500, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #162035", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
        <span style={{ fontSize: 11, color: "#4f7cff", cursor: "pointer" }} onClick={() => { _notifications.forEach(n => n.read = true); setNotifOpen(false); }}>Mark all read</span>
      </div>
      {_notifications.map(n => (
        <div key={n.id} style={{ padding: "12px 18px", borderBottom: "1px solid #0f1e35", background: n.read ? "transparent" : "rgba(79,124,255,0.04)", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }} onClick={() => { n.read = true; setNotifOpen(false); }}>
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: n.read ? "#4a6080" : "#c8d4f0", lineHeight: 1.4 }}>{n.msg}</p>
            <p style={{ fontSize: 11, color: "#2a3a55", marginTop: 3 }}>{n.time}</p>
          </div>
          {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f7cff", flexShrink: 0, marginTop: 4 }} />}
        </div>
      ))}
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ setScreen, setCurrentUser, showToast }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const login = () => {
    if (!form.email || !form.password) { showToast("Fill all fields", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      const user = _users.find(u => u.email === form.email && u.password === form.password);
      if (user) { _session = user; setCurrentUser(user); setScreen(user.role === "admin" ? "dashboard" : "dashboard"); showToast(`Welcome back, ${user.ownerName}!`); }
      else showToast("Invalid credentials", "error");
      setLoading(false);
    }, 700);
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "radial-gradient(ellipse at 25% 25%, rgba(79,124,255,0.07) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(124,92,252,0.06) 0%, transparent 55%), #080d18" }}>
      <div className="fade" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#4f7cff,#7c5cfc)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 8px 28px rgba(79,124,255,0.4)" }}>⚡</div>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>BulkBuy</span>
          </div>
          <p style={{ color: "#3a4f6e", fontSize: 14 }}>Collaborative Wholesale Platform</p>
        </div>
        <div className="card" style={{ padding: 36 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Sign In</h2>
          <p style={{ color: "#3a4f6e", fontSize: 13, marginBottom: 28 }}>Access your shop dashboard</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={lblStyle}>Email</label><input className="inp" type="email" placeholder="owner@shop.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label style={lblStyle}>Password</label><input className="inp" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === "Enter" && login()} /></div>
            <button className="btn btn-primary" onClick={login} disabled={loading} style={{ width: "100%", marginTop: 4, padding: 14 }}>{loading ? "Signing in…" : "Sign In →"}</button>
          </div>
          <div className="divider" />
          <div style={{ background: "rgba(79,124,255,0.05)", borderRadius: 10, padding: 14, fontSize: 12, color: "#3a5080", lineHeight: 1.7, border: "1px solid #0f1e35" }}>
            <b style={{ color: "#4f7cff" }}>Demo Accounts:</b><br />
            👤 rajesh@shop.com / pass123 (Shop Owner)<br />
            👤 priya@shop.com / pass123 (Shop Owner)<br />
            🔑 admin@bulkbuy.com / admin123 (Admin)
          </div>
          <p style={{ textAlign: "center", color: "#3a4f6e", fontSize: 13, marginTop: 18 }}>New here? <span style={{ color: "#4f7cff", cursor: "pointer", fontWeight: 600 }} onClick={() => setScreen("register")}>Create Account</span></p>
        </div>
      </div>
    </div>
  );
}
const lblStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#4a6080", marginBottom: 7, letterSpacing: "0.8px", textTransform: "uppercase" };

// ─── REGISTER ──────────────────────────────────────────────────────────────────
function RegisterScreen({ setScreen, showToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ownerName: "", email: "", phone: "", password: "", shopName: "", location: "", category: "" });
  const next = () => {
    if (step === 1) {
      if (!form.ownerName || !form.email || !form.phone || !form.password) { showToast("Fill all fields", "error"); return; }
      setStep(2);
    } else {
      if (!form.shopName || !form.location) { showToast("Fill all fields", "error"); return; }
      if (_users.find(u => u.email === form.email)) { showToast("Email already registered", "error"); return; }
      const newUser = { ...form, id: Date.now(), role: "owner", totalSavings: 0, orders: 0, collaborations: 0, joinDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }) };
      _users.push(newUser);
      showToast("Account created! Please sign in.");
      setScreen("login");
    }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#080d18" }}>
      <div className="fade" style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#4f7cff,#7c5cfc)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚡</div>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>BulkBuy</span>
          </div>
        </div>
        <div className="card" style={{ padding: 36 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[1, 2].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "linear-gradient(90deg,#4f7cff,#7c5cfc)" : "#0f1e35", transition: "background 0.4s" }} />)}
          </div>
          <div className="tag tag-blue" style={{ marginBottom: 10 }}>Step {step} of 2</div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{step === 1 ? "Account Details" : "Shop Information"}</h2>
          <p style={{ color: "#3a4f6e", fontSize: 13, marginBottom: 24 }}>{step === 1 ? "Set up your login credentials" : "Tell us about your business"}</p>
          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[["ownerName","Full Name","Rajesh Kumar"],["email","Email","rajesh@shop.com"],["phone","Phone","+91 98765 43210"]].map(([k,l,p]) => <div key={k}><label style={lblStyle}>{l}</label><input className="inp" placeholder={p} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} /></div>)}
              <div><label style={lblStyle}>Password</label><input className="inp" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div><label style={lblStyle}>Shop Name</label><input className="inp" placeholder="Rajesh General Store" value={form.shopName} onChange={e => setForm({...form,shopName:e.target.value})} /></div>
              <div><label style={lblStyle}>Location</label><input className="inp" placeholder="MG Road, Pune" value={form.location} onChange={e => setForm({...form,location:e.target.value})} /></div>
              <div>
                <label style={lblStyle}>Category</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CATEGORIES.filter(c => c !== "All").map(c => (
                    <div key={c} onClick={() => setForm({...form,category:c})} style={{ padding: "7px 14px", borderRadius: 10, border: `1.5px solid ${form.category===c?"#4f7cff":"#162035"}`, background: form.category===c?"rgba(79,124,255,0.12)":"transparent", color: form.category===c?"#7c9cff":"#3a4f6e", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {step === 2 && <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>}
            <button className="btn btn-primary" onClick={next} style={{ flex: 2, padding: 13 }}>{step === 1 ? "Continue →" : "Create Account ✓"}</button>
          </div>
          <div className="divider" />
          <p style={{ textAlign: "center", color: "#3a4f6e", fontSize: 13 }}>Already registered? <span style={{ color: "#4f7cff", cursor: "pointer", fontWeight: 600 }} onClick={() => setScreen("login")}>Sign In</span></p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardScreen({ user, setScreen, setSelectedCategory, cart, logout, notifOpen, setNotifOpen, showToast }) {
  const [activeTab, setActiveTab] = useState("overview");
  if (!user) return null;
  const myOrders = _orders.filter(o => o.shops.includes(user.shopName));
  const totalSaved = myOrders.filter(o => o.status !== "Pending").reduce((s, o) => s + o.saving, 0);
  const activeOrders = myOrders.filter(o => !["Delivered","Rejected"].includes(o.status));
  return (
    <div>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {/* Welcome */}
        <div className="card fade" style={{ padding: "28px 32px", marginBottom: 24, background: "linear-gradient(135deg,#0d1a30 0%,#0a1220 60%,#0e1628 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle,rgba(79,124,255,0.12) 0%,transparent 70%)", borderRadius: "50%" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "#4a6080", fontSize: 13, marginBottom: 4 }}>Good day 👋</p>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{user.shopName}</h1>
              <p style={{ color: "#4a6080", fontSize: 13 }}>📍 {user.location} · Member since {user.joinDate}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <span className="tag tag-green">✓ Verified Shop</span>
                <span className="tag tag-blue">{user.category}</span>
                <span className="tag tag-purple">{user.collaborations} Collabs</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setScreen("browse")} style={{ padding: "13px 24px", fontSize: 15 }}>🛒 Browse Products</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Savings", value: fmt(totalSaved || user.totalSavings), icon: "💰", color: "#34d399", sub: "This month" },
            { label: "Active Orders", value: activeOrders.length, icon: "📦", color: "#4f7cff", sub: `${myOrders.length} total` },
            { label: "Collaborations", value: user.collaborations, icon: "🤝", color: "#a78bfa", sub: "With nearby shops" },
            { label: "Bulk Unlocked", value: myOrders.filter(o=>o.saving>0).length, icon: "🎉", color: "#fbbf24", sub: "Discount orders" },
          ].map((s,i) => (
            <div key={i} className="card hover-card fade" style={{ padding: 22, animationDelay: `${i*0.05}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <span style={{ fontSize: 11, color: "#3a4f6e" }}>{s.sub}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "Syne,sans-serif", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#4a6080", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#0d1425", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {["overview","orders","notifications"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: activeTab===t ? "linear-gradient(135deg,#4f7cff,#7c5cfc)" : "transparent", color: activeTab===t?"#fff":"#4a6080", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s", fontFamily: "inherit" }}>{t}</button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Pool cart preview */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: "#c8d4f0" }}>🔥 Active Pool Orders</h3>
              {[...new Set(_poolCart.map(e => e.productId))].map(pid => {
                const prod = _products.find(p => p.id === pid);
                if (!prod) return null;
                const total = _poolCart.filter(e => e.productId === pid).reduce((s, e) => s + e.qty, 0);
                const pct2 = Math.min((total / prod.bulkThreshold) * 100, 100);
                const unlocked = total >= prod.bulkThreshold;
                return (
                  <div key={pid} style={{ marginBottom: 18, padding: 16, background: "#0a1220", borderRadius: 12, border: "1px solid #0f1e35" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#c8d4f0" }}>{prod.image} {prod.name}</span>
                      {unlocked ? <span className="tag tag-green">✓ Unlocked</span> : <span className="tag tag-amber">⏳ Pooling</span>}
                    </div>
                    <div className="progress-track" style={{ marginBottom: 6 }}>
                      <div className="progress-fill" style={{ width: `${pct2}%`, background: unlocked ? "linear-gradient(90deg,#34d399,#10b981)" : "linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#3a4f6e" }}>
                      <span>{total} / {prod.bulkThreshold} {prod.unit} pooled</span>
                      <span>{unlocked ? `Save ${pct(prod.bulkPrice,prod.price)}%!` : `${prod.bulkThreshold - total} more to unlock`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Recent orders */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: "#c8d4f0" }}>📋 Recent Orders</h3>
              {myOrders.slice(0, 4).map(o => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #0f1e35" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#c8d4f0" }}>{o.id}</p>
                    <p style={{ fontSize: 12, color: "#4a6080" }}>{o.product} · {o.date}</p>
                  </div>
                  <StatusTag status={o.status} />
                </div>
              ))}
              <button className="btn btn-outline" style={{ width: "100%", marginTop: 14, fontSize: 13 }} onClick={() => setActiveTab("orders")}>View All Orders</button>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="card fade" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #0f1e35" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0" }}>All Orders</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#0a1220" }}>{["Order ID","Product","Qty","Shops","Savings","Status","Action"].map(h => <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#3a4f6e", letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {myOrders.map(o => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #0a1525" }}>
                      <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700, color: "#4f7cff" }}>{o.id}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#c8d4f0" }}>{o.product}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#8a9cc0" }}>{o.qty}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#8a9cc0" }}>{o.shops.length}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#34d399", fontWeight: 600 }}>{fmt(o.saving)}</td>
                      <td style={{ padding: "14px 20px" }}><StatusTag status={o.status} /></td>
                      <td style={{ padding: "14px 20px" }}><button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => setScreen("tracking")}>Track</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="card fade" style={{ padding: 0, overflow: "hidden" }}>
            {_notifications.map(n => (
              <div key={n.id} style={{ padding: "16px 24px", borderBottom: "1px solid #0a1525", background: n.read ? "transparent" : "rgba(79,124,255,0.03)", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22 }}>{n.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: n.read ? "#4a6080" : "#c8d4f0", lineHeight: 1.5 }}>{n.msg}</p>
                  <p style={{ fontSize: 12, color: "#2a3a55", marginTop: 4 }}>{n.time}</p>
                </div>
                {!n.read && <span className="tag tag-blue">New</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusTag({ status }) {
  const map = { Pending: "tag-amber", Approved: "tag-blue", Paid: "tag-purple", Shipped: "tag-blue", Delivered: "tag-green", Rejected: "tag-red" };
  return <span className={`tag ${map[status] || "tag-blue"}`}>{status}</span>;
}

// ─── BROWSE ────────────────────────────────────────────────────────────────────
function BrowseScreen({ category, setSelectedCategory, setScreen, setSelectedProduct, addToCart, poolQty }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const cat = category || "All";
  let prods = cat === "All" ? _products : _products.filter(p => p.category === cat);
  if (search) prods = prods.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "price-asc") prods = [...prods].sort((a,b) => a.price-b.price);
  if (sort === "price-desc") prods = [...prods].sort((a,b) => b.price-a.price);
  if (sort === "discount") prods = [...prods].sort((a,b) => pct(a.bulkPrice,a.price)-pct(b.bulkPrice,b.price));
  return (
    <div>
      <TopBar user={_session} setScreen={setScreen} cart={[]} logout={() => setScreen("dashboard")} notifOpen={false} setNotifOpen={() => {}} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
          <div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Browse Products</h2>
            <p style={{ color: "#4a6080", fontSize: 13, marginTop: 3 }}>{prods.length} products available</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input className="inp" placeholder="🔍 Search products…" style={{ width: 220 }} value={search} onChange={e => setSearch(e.target.value)} />
            <select className="inp" style={{ width: 160 }} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low→High</option>
              <option value="price-desc">Price: High→Low</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)} style={{ padding: "8px 18px", borderRadius: 24, border: `1.5px solid ${cat===c?"#4f7cff":"#162035"}`, background: cat===c?"linear-gradient(135deg,rgba(79,124,255,0.2),rgba(124,92,252,0.2))":"transparent", color: cat===c?"#7c9cff":"#3a4f6e", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 18 }}>
          {prods.map((p, i) => {
            const pooled = poolQty(p.id);
            const progress = Math.min((pooled / p.bulkThreshold) * 100, 100);
            const unlocked = pooled >= p.bulkThreshold;
            const disc = pct(p.bulkPrice, p.price);
            return (
              <div key={p.id} className="card hover-card fade" style={{ padding: 0, overflow: "hidden", cursor: "pointer", animationDelay: `${i * 0.03}s` }} onClick={() => { setSelectedProduct(p); setScreen("product"); }}>
                <div style={{ background: "linear-gradient(135deg,#0d1a30,#0a1525)", padding: "28px 24px 20px", textAlign: "center", position: "relative" }}>
                  {unlocked && <div style={{ position: "absolute", top: 12, right: 12 }} className="tag tag-green">🎉 Bulk!</div>}
                  {!unlocked && <div style={{ position: "absolute", top: 12, right: 12 }} className="tag tag-amber">-{disc}%</div>}
                  <div style={{ fontSize: 48, marginBottom: 8 }}>{p.image}</div>
                  <span className="tag tag-blue">{p.category}</span>
                </div>
                <div style={{ padding: "16px 20px 20px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c8d4f0", marginBottom: 12, lineHeight: 1.4 }}>{p.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: 11, color: "#3a4f6e", marginBottom: 2 }}>MRP / Unit</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Syne,sans-serif" }}>{fmt(p.price)}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 11, color: "#3a4f6e", marginBottom: 2 }}>Bulk Price</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#34d399", fontFamily: "Syne,sans-serif" }}>{fmt(p.bulkPrice)}</p>
                    </div>
                  </div>
                  {/* Pool progress */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#3a4f6e", marginBottom: 5 }}>
                      <span>Pool Progress</span>
                      <span>{pooled}/{p.bulkThreshold} {p.unit}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progress}%`, background: unlocked ? "linear-gradient(90deg,#34d399,#10b981)" : "linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                    </div>
                    {!unlocked && <p style={{ fontSize: 11, color: "#fbbf24", marginTop: 5 }}>⚡ {p.bulkThreshold - pooled} more {p.unit} to unlock {disc}% off</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: "#4a6080" }}>⭐ {p.rating} ({p.reviews})</span>
                    <span style={{ fontSize: 12, color: "#3a4f6e" }}>by {p.supplier}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", padding: 11, fontSize: 13 }} onClick={e => { e.stopPropagation(); addToCart(p); }}>+ Add to Cart</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL ────────────────────────────────────────────────────────────
function ProductScreen({ product: p, setScreen, addToCart, poolQty, showToast, currentUser }) {
  const [qty, setQty] = useState(50);
  if (!p) { setScreen("browse"); return null; }
  const pooled = poolQty(p.id) + qty;
  const progress = Math.min((pooled / p.bulkThreshold) * 100, 100);
  const unlocked = pooled >= p.bulkThreshold;
  const disc = pct(p.bulkPrice, p.price);
  const contributions = _poolCart.filter(e => e.productId === p.id);
  return (
    <div>
      <TopBar user={currentUser} setScreen={setScreen} cart={[]} logout={() => setScreen("dashboard")} notifOpen={false} setNotifOpen={() => {}} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <button className="btn btn-outline" style={{ marginBottom: 20, fontSize: 13 }} onClick={() => setScreen("browse")}>← Back to Browse</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 28, alignItems: "start" }}>
          {/* Left */}
          <div>
            <div className="card" style={{ padding: 40, textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 80, marginBottom: 16 }}>{p.image}</div>
              <span className="tag tag-blue" style={{ marginBottom: 10, display: "inline-block" }}>{p.category}</span>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{p.name}</h2>
              <p style={{ color: "#4a6080", fontSize: 13 }}>Supplied by {p.supplier}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                {"⭐".repeat(Math.floor(p.rating)).padEnd(5, "☆").split("").map((s, i) => <span key={i}>{s}</span>)}
                <span style={{ fontSize: 13, color: "#4a6080" }}>({p.reviews} reviews)</span>
              </div>
            </div>
            {/* Pricing */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c8d4f0", marginBottom: 16 }}>💰 Pricing</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div className="card" style={{ flex: 1, padding: 16, marginRight: 8, textAlign: "center", border: "1px solid #162035" }}>
                  <p style={{ fontSize: 11, color: "#4a6080", marginBottom: 6 }}>Regular Price</p>
                  <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "Syne,sans-serif", color: "#8a9cc0" }}>{fmt(p.price)}</p>
                  <p style={{ fontSize: 11, color: "#4a6080" }}>per unit</p>
                </div>
                <div className="card" style={{ flex: 1, padding: 16, textAlign: "center", border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.04)" }}>
                  <p style={{ fontSize: 11, color: "#34d399", marginBottom: 6 }}>Bulk Price</p>
                  <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "Syne,sans-serif", color: "#34d399" }}>{fmt(p.bulkPrice)}</p>
                  <p style={{ fontSize: 11, color: "#34d399" }}>Save {disc}%</p>
                </div>
              </div>
              <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10, padding: 12, fontSize: 13, color: "#fbbf24" }}>
                ⚡ Order ≥ {p.bulkThreshold} {p.unit} total to unlock bulk pricing
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            {/* Pool status */}
            <div className="card" style={{ padding: 24, marginBottom: 18, border: unlocked ? "1px solid rgba(52,211,153,0.3)" : "1px solid #162035" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0", marginBottom: 18 }}>🤝 Pool Status</h3>
              <div className="progress-track" style={{ height: 12, marginBottom: 10 }}>
                <div className="progress-fill" style={{ width: `${progress}%`, background: unlocked ? "linear-gradient(90deg,#34d399,#10b981)" : "linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 16 }}>
                <span style={{ color: "#c8d4f0", fontWeight: 600 }}>{pooled} / {p.bulkThreshold} {p.unit}</span>
                <span style={{ color: unlocked ? "#34d399" : "#fbbf24", fontWeight: 700 }}>{unlocked ? "✓ Bulk Unlocked!" : `${p.bulkThreshold - pooled} more needed`}</span>
              </div>
              {/* Contributors */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#4a6080", marginBottom: 10 }}>Contributing shops:</p>
                {contributions.map((c, i) => {
                  const u = _users.find(u => u.id === c.userId);
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0a1525" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div className="avatar" style={{ width: 28, height: 28, background: avatarColor(c.shopName), fontSize: 11 }}>{initials(c.shopName)}</div>
                        <span style={{ fontSize: 13, color: "#8a9cc0" }}>{c.shopName}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#4f7cff" }}>{c.qty} {p.unit}</span>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0a1525" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div className="avatar" style={{ width: 28, height: 28, background: "#4f7cff", fontSize: 11 }}>{initials(currentUser?.shopName || "You")}</div>
                    <span style={{ fontSize: 13, color: "#7c9cff", fontWeight: 600 }}>You (adding)</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#4f7cff" }}>{qty} {p.unit}</span>
                </div>
              </div>
              {/* Quantity */}
              <div style={{ marginBottom: 16 }}>
                <label style={lblStyle}>Your Quantity ({p.unit})</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 18, lineHeight: 1 }} onClick={() => setQty(Math.max(10, qty - 10))}>−</button>
                  <input className="inp" type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value)||1))} style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }} />
                  <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 18, lineHeight: 1 }} onClick={() => setQty(qty + 10)}>+</button>
                </div>
              </div>
              {/* Cost summary */}
              <div style={{ background: "#0a1220", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #0f1e35" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#4a6080" }}>Regular cost</span>
                  <span style={{ fontSize: 13, color: "#8a9cc0", textDecoration: "line-through" }}>{fmt(p.price * qty)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#4a6080" }}>Bulk cost</span>
                  <span style={{ fontSize: 13, color: "#34d399", fontWeight: 600 }}>{fmt(p.bulkPrice * qty)}</span>
                </div>
                <div className="divider" style={{ margin: "10px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#c8d4f0" }}>You save</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#34d399", fontFamily: "Syne,sans-serif" }}>{fmt((p.price - p.bulkPrice) * qty)}</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: 15 }} onClick={() => { addToCart(p, qty); showToast(`Added ${qty} ${p.unit} to cart!`); setScreen("cart"); }}>🛒 Add {qty} {p.unit} to Cart</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="card" style={{ flex: 1, padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#4f7cff" }}>{p.stock.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: "#4a6080", marginTop: 4 }}>In Stock ({p.unit})</p>
              </div>
              <div className="card" style={{ flex: 1, padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#a78bfa" }}>{p.bulkThreshold}</p>
                <p style={{ fontSize: 11, color: "#4a6080", marginTop: 4 }}>Bulk Threshold</p>
              </div>
              <div className="card" style={{ flex: 1, padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>{disc}%</p>
                <p style={{ fontSize: 11, color: "#4a6080", marginTop: 4 }}>Max Discount</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CART (AGGREGATOR) ─────────────────────────────────────────────────────────
function CartScreen({ cart, setCart, setScreen, showToast, poolQty, currentUser }) {
  if (cart.length === 0) return (
    <div>
      <TopBar user={currentUser} setScreen={setScreen} cart={cart} logout={() => setScreen("dashboard")} notifOpen={false} setNotifOpen={() => {}} />
      <div style={{ maxWidth: 700, margin: "80px auto", textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, color: "#fff", marginBottom: 10 }}>Your cart is empty</h2>
        <p style={{ color: "#4a6080", marginBottom: 24 }}>Add products to start pooling orders with nearby shops</p>
        <button className="btn btn-primary" style={{ padding: "13px 28px" }} onClick={() => setScreen("browse")}>Browse Products →</button>
      </div>
    </div>
  );

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const bulkTotal = cart.reduce((s, i) => s + i.bulkPrice * i.qty, 0);
  const savings = total - bulkTotal;
  // Simulate other users
  const otherContribs = [
    { shop: "Priya Mart", items: cart.slice(0, 1).map(i => ({ ...i, qty: Math.floor(i.qty * 0.7) })) },
    { shop: "Amit Electronics", items: cart.slice(0, 1).map(i => ({ ...i, qty: Math.floor(i.qty * 0.5) })) },
  ];

  return (
    <div>
      <TopBar user={currentUser} setScreen={setScreen} cart={cart} logout={() => setScreen("dashboard")} notifOpen={false} setNotifOpen={() => {}} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Aggregator Cart</h2>
        <p style={{ color: "#4a6080", fontSize: 14, marginBottom: 28 }}>Pool orders with other shops to unlock bulk discounts</p>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Left — items */}
          <div>
            <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid #0f1e35", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0" }}>Your Items ({cart.length})</h3>
                <span className="tag tag-blue">{currentUser?.shopName}</span>
              </div>
              {cart.map((item, idx) => {
                const pooled = poolQty(item.id) + item.qty;
                const progress = Math.min((pooled / item.bulkThreshold) * 100, 100);
                const unlocked = pooled >= item.bulkThreshold;
                return (
                  <div key={item.id} style={{ padding: "18px 22px", borderBottom: "1px solid #0a1525" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 36 }}>{item.image}</span>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#c8d4f0", marginBottom: 4 }}>{item.name}</p>
                          <p style={{ fontSize: 12, color: "#4a6080" }}>by {item.supplier}</p>
                          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            {unlocked ? <span className="tag tag-green">🎉 Bulk Price Active</span> : <span className="tag tag-amber">⏳ Regular Price</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 18 }}>✕</button>
                    </div>
                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button className="btn btn-outline" style={{ padding: "5px 12px" }} onClick={() => setCart(cart.map((c,i) => i===idx ? {...c, qty: Math.max(10, c.qty-10)} : c))}>−</button>
                        <span style={{ fontWeight: 700, fontSize: 16, minWidth: 40, textAlign: "center" }}>{item.qty}</span>
                        <button className="btn btn-outline" style={{ padding: "5px 12px" }} onClick={() => setCart(cart.map((c,i) => i===idx ? {...c, qty: c.qty+10} : c))}>+</button>
                        <span style={{ fontSize: 12, color: "#4a6080" }}>{item.unit}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 11, color: "#4a6080" }}>Subtotal</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: unlocked ? "#34d399" : "#fff", fontFamily: "Syne,sans-serif" }}>{fmt((unlocked ? item.bulkPrice : item.price) * item.qty)}</p>
                      </div>
                    </div>
                    {/* Pool progress */}
                    <div style={{ background: "#0a1220", borderRadius: 10, padding: 12, border: "1px solid #0f1e35" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a6080", marginBottom: 7 }}>
                        <span>Pool Progress (all shops)</span>
                        <span>{pooled}/{item.bulkThreshold} {item.unit}</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%`, background: unlocked ? "linear-gradient(90deg,#34d399,#10b981)" : "linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                      </div>
                      {!unlocked && <p style={{ fontSize: 11, color: "#fbbf24", marginTop: 6 }}>⚡ Need {item.bulkThreshold - pooled} more {item.unit} for {pct(item.bulkPrice, item.price)}% off!</p>}
                      {unlocked && <p style={{ fontSize: 11, color: "#34d399", marginTop: 6 }}>✓ Bulk discount unlocked! Saving {pct(item.bulkPrice, item.price)}%</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulated other contributions */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c8d4f0", marginBottom: 16 }}>👥 Other Shops Contributing</h3>
              {otherContribs.map((oc, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #0a1525" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div className="avatar" style={{ width: 32, height: 32, background: avatarColor(oc.shop), fontSize: 12 }}>{initials(oc.shop)}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#8a9cc0" }}>{oc.shop}</p>
                      <p style={{ fontSize: 11, color: "#3a4f6e" }}>{oc.items[0]?.qty || 0} {oc.items[0]?.unit || ""} × {oc.items[0]?.name?.slice(0, 20) || ""}</p>
                    </div>
                  </div>
                  <span className="tag tag-green">Contributing</span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "#3a4f6e", marginTop: 12 }}>💡 More shops = bigger pool = guaranteed bulk discount</p>
            </div>
          </div>

          {/* Right — summary */}
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0", marginBottom: 20 }}>Order Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SumRow label="Regular Total" value={fmt(total)} color="#8a9cc0" strike />
                <SumRow label="Bulk Discount" value={`-${fmt(savings)}`} color="#34d399" />
                <SumRow label="Your Share" value={fmt(bulkTotal)} color="#fff" large />
              </div>
              <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: 14, marginTop: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#34d399", fontWeight: 600 }}>💰 Total Savings</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#34d399", fontFamily: "Syne,sans-serif" }}>{fmt(savings)}</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: 15 }} onClick={() => setScreen("payment")}>Proceed to Payment →</button>
              <button className="btn btn-outline" style={{ width: "100%", padding: 12, fontSize: 13, marginTop: 10 }} onClick={() => setScreen("browse")}>+ Add More Products</button>
            </div>
            {/* Bill split preview */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c8d4f0", marginBottom: 16 }}>📊 Bill Split Preview</h3>
              {[{ shop: currentUser?.shopName || "Your Shop", amount: bulkTotal, pct: 45 }, { shop: "Priya Mart", amount: bulkTotal * 0.35, pct: 35 }, { shop: "Amit Electronics", amount: bulkTotal * 0.2, pct: 20 }].map((s, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: i === 0 ? "#7c9cff" : "#6a7c9c", fontWeight: i === 0 ? 700 : 400 }}>{s.shop} {i===0?"(you)":""}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#c8d4f0" }}>{fmt(s.amount)}</span>
                  </div>
                  <div className="progress-track" style={{ height: 5 }}>
                    <div className="progress-fill" style={{ width: `${s.pct}%`, background: i===0?"linear-gradient(90deg,#4f7cff,#7c5cfc)":i===1?"linear-gradient(90deg,#a78bfa,#7c5cfc)":"linear-gradient(90deg,#38bdf8,#4f7cff)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function SumRow({ label, value, color, large, strike }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "#4a6080" }}>{label}</span>
      <span style={{ fontSize: large ? 20 : 14, fontWeight: large ? 800 : 600, color, fontFamily: large ? "Syne,sans-serif" : "inherit", textDecoration: strike ? "line-through" : "none" }}>{value}</span>
    </div>
  );
}

// ─── PAYMENT ────────────────────────────────────────────────────────────────────
function PaymentScreen({ cart, setScreen, showToast, currentUser, setCart }) {
  const [method, setMethod] = useState("upi");
  const [upi, setUpi] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const total = cart.reduce((s, i) => s + i.bulkPrice * i.qty, 0);
  const orderId = `BLK-${3000 + Math.floor(Math.random() * 99)}`;

  const pay = () => {
    if (method === "upi" && !upi) { showToast("Enter UPI ID", "error"); return; }
    setProcessing(true);
    setTimeout(() => {
      const newOrder = { id: orderId, product: cart[0]?.name || "", qty: cart.reduce((s, i) => s + i.qty, 0), status: "Pending", shops: [currentUser?.shopName || "Your Shop", "Priya Mart"], saving: Math.round((cart.reduce((s,i) => s+i.price*i.qty,0) - total) * 0.6), date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }), totalAmount: total, shopBreakdown: [{ shop: currentUser?.shopName, qty: cart[0]?.qty, amount: total }] };
      _orders.unshift(newOrder);
      _notifications.unshift({ id: Date.now(), type: "payment", msg: `Payment of ${fmt(total)} confirmed for order ${orderId}`, time: "Just now", icon: "✅", read: false });
      setProcessing(false);
      setDone(true);
    }, 2000);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#080d18" }}>
      <div className="fade" style={{ textAlign: "center", maxWidth: 460 }}>
        <div style={{ width: 100, height: 100, background: "rgba(52,211,153,0.12)", border: "2px solid rgba(52,211,153,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, margin: "0 auto 24px" }}>✓</div>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 28, fontWeight: 800, color: "#34d399", marginBottom: 10 }}>Payment Successful!</h2>
        <p style={{ color: "#4a6080", marginBottom: 6 }}>Order ID: <b style={{ color: "#4f7cff" }}>{orderId}</b></p>
        <p style={{ color: "#4a6080", marginBottom: 28 }}>Amount paid: <b style={{ color: "#34d399" }}>{fmt(total)}</b></p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => { setCart([]); setScreen("tracking"); }}>Track Order →</button>
          <button className="btn btn-outline" onClick={() => { setCart([]); setScreen("dashboard"); }}>Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <TopBar user={currentUser} setScreen={setScreen} cart={cart} logout={() => setScreen("dashboard")} notifOpen={false} setNotifOpen={() => {}} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 24px" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 28 }}>Checkout</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0", marginBottom: 20 }}>Payment Method</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[["upi","📱 UPI Payment"],["netbanking","🏦 Net Banking"],["card","💳 Debit/Credit Card"]].map(([v,l]) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, border: `1.5px solid ${method===v?"#4f7cff":"#162035"}`, background: method===v?"rgba(79,124,255,0.08)":"transparent", cursor: "pointer", transition: "all 0.2s" }}>
                    <input type="radio" value={v} checked={method===v} onChange={() => setMethod(v)} style={{ accentColor: "#4f7cff" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: method===v?"#7c9cff":"#4a6080" }}>{l}</span>
                  </label>
                ))}
              </div>
              {method === "upi" && (
                <div><label style={lblStyle}>UPI ID</label><input className="inp" placeholder="yourname@upi" value={upi} onChange={e => setUpi(e.target.value)} /></div>
              )}
              {method === "netbanking" && (
                <div><label style={lblStyle}>Select Bank</label>
                  <select className="inp"><option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option></select>
                </div>
              )}
              {method === "card" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><label style={lblStyle}>Card Number</label><input className="inp" placeholder="•••• •••• •••• ••••" /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={lblStyle}>Expiry</label><input className="inp" placeholder="MM/YY" /></div>
                    <div><label style={lblStyle}>CVV</label><input className="inp" placeholder="•••" /></div>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: 15, fontSize: 16 }} onClick={pay} disabled={processing}>
              {processing ? <span>Processing… <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span></span> : `Pay ${fmt(total)} →`}
            </button>
          </div>
          {/* Invoice */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0", marginBottom: 20 }}>📄 Invoice Preview</h3>
            <div style={{ background: "#0a1220", borderRadius: 12, padding: 18, border: "1px solid #0f1e35" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ color: "#4a6080", fontSize: 12 }}>Bill To</span>
                <span style={{ color: "#7c9cff", fontSize: 12, fontWeight: 600 }}>{currentUser?.shopName}</span>
              </div>
              {cart.map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #0f1e35" }}>
                  <div>
                    <p style={{ fontSize: 13, color: "#c8d4f0", fontWeight: 600 }}>{i.image} {i.name.slice(0, 22)}…</p>
                    <p style={{ fontSize: 11, color: "#4a6080" }}>{i.qty} {i.unit} × {fmt(i.bulkPrice)}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>{fmt(i.bulkPrice * i.qty)}</p>
                </div>
              ))}
              <div className="divider" />
              <SumRow label="Subtotal" value={fmt(cart.reduce((s,i) => s+i.price*i.qty,0))} color="#6a7c9c" strike />
              <div style={{ height: 8 }} />
              <SumRow label="Bulk Discount" value={`-${fmt(cart.reduce((s,i)=>s+i.price*i.qty,0)-total)}`} color="#34d399" />
              <div style={{ height: 8 }} />
              <div style={{ height: 1, background: "#162035", margin: "10px 0" }} />
              <SumRow label="TOTAL PAYABLE" value={fmt(total)} color="#fff" large />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRACKING ──────────────────────────────────────────────────────────────────
function TrackingScreen({ setScreen, currentUser }) {
  const [sel, setSel] = useState(_orders[0]?.id);
  const myOrders = currentUser ? _orders.filter(o => o.shops.includes(currentUser.shopName)) : _orders;
  const order = myOrders.find(o => o.id === sel) || myOrders[0];

  return (
    <div>
      <TopBar user={currentUser} setScreen={setScreen} cart={[]} logout={() => setScreen("dashboard")} notifOpen={false} setNotifOpen={() => {}} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 28 }}>Order Tracking</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#4a6080", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Orders</h3>
            {myOrders.map(o => (
              <div key={o.id} onClick={() => setSel(o.id)} className="card hover-card" style={{ padding: 18, marginBottom: 10, cursor: "pointer", border: sel===o.id?"1px solid #4f7cff":"1px solid #162035", background: sel===o.id?"rgba(79,124,255,0.06)":"linear-gradient(145deg,#0e1829,#0a1220)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: sel===o.id?"#4f7cff":"#c8d4f0", fontSize: 14 }}>{o.id}</span>
                  <StatusTag status={o.status} />
                </div>
                <p style={{ fontSize: 13, color: "#4a6080" }}>{o.product}</p>
                <p style={{ fontSize: 12, color: "#3a4f6e", marginTop: 4 }}>{o.date} · {o.shops.length} shops · Saved {fmt(o.saving)}</p>
              </div>
            ))}
          </div>
          {order && (
            <div>
              <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>{order.id}</h3>
                    <p style={{ color: "#4a6080", fontSize: 13, marginTop: 4 }}>{order.product} · {order.qty} units</p>
                  </div>
                  <StatusTag status={order.status} />
                </div>
                {/* Timeline */}
                <div style={{ position: "relative", paddingLeft: 28 }}>
                  {STATUS_FLOW.map((s, i) => {
                    const idx = STATUS_FLOW.indexOf(order.status);
                    const done2 = i <= idx;
                    const active = i === idx;
                    return (
                      <div key={s} style={{ position: "relative", paddingBottom: i < STATUS_FLOW.length - 1 ? 28 : 0 }}>
                        {i < STATUS_FLOW.length - 1 && <div style={{ position: "absolute", left: -20, top: 24, width: 2, height: "100%", background: done2 ? "linear-gradient(180deg,#4f7cff,#7c5cfc)" : "#0f1e35" }} />}
                        <div style={{ position: "absolute", left: -26, top: 2, width: 14, height: 14, borderRadius: "50%", background: active ? "linear-gradient(135deg,#4f7cff,#7c5cfc)" : done2 ? "#34d399" : "#0f1e35", border: `2px solid ${active ? "#4f7cff" : done2 ? "#34d399" : "#162035"}`, boxShadow: active ? "0 0 12px rgba(79,124,255,0.6)" : "none" }} />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#fff" : done2 ? "#34d399" : "#3a4f6e" }}>{s}</p>
                          {active && <p style={{ fontSize: 12, color: "#4f7cff", marginTop: 2 }}>Current Status</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Shop breakdown */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c8d4f0", marginBottom: 16 }}>🏪 Participating Shops</h3>
                {(order.shopBreakdown || []).map((sb, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #0a1525" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div className="avatar" style={{ width: 30, height: 30, background: avatarColor(sb.shop), fontSize: 11 }}>{initials(sb.shop)}</div>
                      <span style={{ fontSize: 13, color: "#8a9cc0" }}>{sb.shop}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#c8d4f0" }}>{fmt(sb.amount)}</p>
                      <p style={{ fontSize: 11, color: "#4a6080" }}>{sb.qty} units</p>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, padding: "10px 0" }}>
                  <span style={{ fontWeight: 700, color: "#c8d4f0" }}>Total</span>
                  <span style={{ fontWeight: 800, color: "#fff", fontFamily: "Syne,sans-serif" }}>{fmt(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT ──────────────────────────────────────────────────────────────────────
function ChatScreen({ setScreen, currentUser, showToast }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(_messages);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);
  const send = () => {
    if (!msg.trim()) return;
    const newMsg = { id: Date.now(), userId: currentUser?.id, sender: currentUser?.shopName || "You", text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), avatar: initials(currentUser?.shopName || "You") };
    setMessages(prev => [...prev, newMsg]);
    _messages.push(newMsg);
    setMsg("");
  };
  return (
    <div>
      <TopBar user={currentUser} setScreen={setScreen} cart={[]} logout={() => setScreen("dashboard")} notifOpen={false} setNotifOpen={() => {}} />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px" }}>
        <div className="card" style={{ overflow: "hidden", height: "calc(100vh - 160px)", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #0f1e35", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(8,13,24,0.6)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ display: "flex" }}>
                {["RG","PM","AE"].map((a, i) => <div key={i} className="avatar" style={{ width: 32, height: 32, background: avatarColor(a), fontSize: 12, marginLeft: i>0?-8:0, border: "2px solid #0e1829" }}>{a}</div>)}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#c8d4f0" }}>Bulk Order Group</p>
                <p style={{ fontSize: 12, color: "#4a6080" }}>3 shops · Active pool order</p>
              </div>
            </div>
            <span className="tag tag-green" style={{ animation: "pulse 2s infinite" }}>● Live</span>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map(m => {
              const isMe = m.userId === currentUser?.id;
              return (
                <div key={m.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
                  {!isMe && <div className="avatar" style={{ width: 32, height: 32, background: avatarColor(m.sender), fontSize: 12, flexShrink: 0 }}>{m.avatar}</div>}
                  <div style={{ maxWidth: "68%" }}>
                    {!isMe && <p style={{ fontSize: 11, color: "#4a6080", marginBottom: 4 }}>{m.sender}</p>}
                    <div style={{ background: isMe ? "linear-gradient(135deg,#1e3a7e,#172a5a)" : "#0d1a2e", border: `1px solid ${isMe?"rgba(79,124,255,0.3)":"#162035"}`, borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "11px 16px" }}>
                      <p style={{ fontSize: 14, color: "#c8d4f0", lineHeight: 1.5 }}>{m.text}</p>
                    </div>
                    <p style={{ fontSize: 11, color: "#2a3a55", marginTop: 4, textAlign: isMe ? "right" : "left" }}>{m.time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          {/* Quick actions */}
          <div style={{ padding: "10px 20px", borderTop: "1px solid #0f1e35", display: "flex", gap: 8, overflowX: "auto" }}>
            {["📦 Check pool status", "💰 What's my savings?", "🤝 Who's contributing?"].map(q => (
              <button key={q} className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12, whiteSpace: "nowrap" }} onClick={() => setMsg(q)}>{q}</button>
            ))}
          </div>
          {/* Input */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #0f1e35", display: "flex", gap: 10 }}>
            <input className="inp" placeholder="Type a message…" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1 }} />
            <button className="btn btn-primary" style={{ padding: "12px 20px" }} onClick={send}>Send →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI CHATBOT ────────────────────────────────────────────────────────────────
function AiChatbot({ open, setOpen, currentUser }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", text: "👋 Hi! I'm your BulkBuy assistant. Ask me about discounts, savings, or pooling orders!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const SUGGESTIONS = ["Check my discount status", "How much will I save?", "Which products have bulk deals?", "How does pooling work?"];

  const ask = async (q) => {
    if (!q.trim()) return;
    const question = q;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: `You are BulkBuy AI assistant. The user is a small shop owner named ${currentUser?.ownerName} running ${currentUser?.shopName}. BulkBuy is a platform where shop owners pool orders to get bulk discounts. Active products with bulk deals include: Rice (21% off at 500kg threshold), LED Bulbs (25% off at 250pcs), Sunflower Oil (21% off at 300L). Current pool status: Rice 430/500kg (86%), LED Bulbs 200/250pcs (80%). Be helpful, concise, and encouraging about bulk savings. Keep responses under 3 sentences.`,
          messages: [{ role: "user", content: question }],
        }),
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "Sorry, I couldn't get a response.";
      setMsgs(prev => [...prev, { role: "assistant", text }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", text: "Sorry, I'm having trouble connecting. Try again!" }]);
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="card fade" style={{ position: "fixed", bottom: 28, right: 28, width: 360, height: 480, display: "flex", flexDirection: "column", zIndex: 1001, overflow: "hidden", border: "1px solid #1e3060", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #0f1e35", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#0d1a30,#0a1220)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4f7cff,#7c5cfc)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: "#c8d4f0" }}>BulkBuy AI</p>
            <p style={{ fontSize: 11, color: "#34d399" }}>● Online</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#4a6080", cursor: "pointer", fontSize: 18 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "85%", background: m.role === "user" ? "linear-gradient(135deg,#1e3a7e,#172a5a)" : "#0d1a2e", border: `1px solid ${m.role==="user"?"rgba(79,124,255,0.3)":"#162035"}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#c8d4f0", lineHeight: 1.5 }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ background: "#0d1a2e", border: "1px solid #162035", borderRadius: 12, padding: "10px 16px", fontSize: 13, color: "#4a6080" }}>Thinking… ⟳</div></div>}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "8px 14px", borderTop: "1px solid #0f1e35", display: "flex", gap: 6, overflowX: "auto" }}>
        {SUGGESTIONS.map(s => <button key={s} className="btn btn-outline" style={{ padding: "5px 10px", fontSize: 11, whiteSpace: "nowrap" }} onClick={() => ask(s)}>{s}</button>)}
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid #0f1e35", display: "flex", gap: 8 }}>
        <input className="inp" placeholder="Ask me anything…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && ask(input)} style={{ flex: 1, fontSize: 13 }} />
        <button className="btn btn-primary" style={{ padding: "10px 16px", fontSize: 13 }} onClick={() => ask(input)}>→</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// ─── ADMIN APP ────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════
function AdminApp({ user, logout, showToast, toast }) {
  const [tab, setTab] = useState("dashboard");
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(x => x + 1);
  const sideItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "products", icon: "📦", label: "Products" },
    { id: "orders", icon: "📋", label: "Orders" },
    { id: "payments", icon: "💳", label: "Payments" },
    { id: "delivery", icon: "🚚", label: "Delivery" },
    { id: "users", icon: "👥", label: "Users" },
  ];
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c18" }}>
      <GlobalStyles />
      {/* Sidebar */}
      <div style={{ width: 240, background: "linear-gradient(180deg,#0a1220,#070c18)", borderRight: "1px solid #0f1e35", padding: "24px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, paddingLeft: 8 }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#4f7cff,#7c5cfc)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <div>
            <p style={{ fontFamily: "Syne,sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>BulkBuy</p>
            <p style={{ fontSize: 10, color: "#3a4f6e", fontWeight: 600, letterSpacing: "1px" }}>ADMIN PANEL</p>
          </div>
        </div>
        {sideItems.map(s => (
          <button key={s.id} onClick={() => setTab(s.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", background: tab===s.id ? "linear-gradient(135deg,rgba(79,124,255,0.15),rgba(124,92,252,0.1))" : "transparent", color: tab===s.id ? "#7c9cff" : "#3a4f6e", cursor: "pointer", fontSize: 14, fontWeight: tab===s.id ? 700 : 500, fontFamily: "inherit", width: "100%", textAlign: "left", marginBottom: 4, transition: "all 0.2s", borderLeft: tab===s.id ? "3px solid #4f7cff" : "3px solid transparent" }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>{s.label}
          </button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #0f1e35", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar" style={{ width: 32, height: 32, background: "#4f7cff", fontSize: 12 }}>AD</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#c8d4f0" }}>Admin</p>
              <p style={{ fontSize: 11, color: "#3a4f6e" }}>admin@bulkbuy.com</p>
            </div>
          </div>
          <button className="btn btn-danger" style={{ width: "100%", marginTop: 8, fontSize: 13, padding: 10 }} onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "28px 32px" }}>
          {tab === "dashboard" && <AdminDashboard setTab={setTab} />}
          {tab === "products" && <AdminProducts showToast={showToast} refresh={refresh} />}
          {tab === "orders" && <AdminOrders showToast={showToast} refresh={refresh} />}
          {tab === "payments" && <AdminPayments />}
          {tab === "delivery" && <AdminDelivery showToast={showToast} refresh={refresh} />}
          {tab === "users" && <AdminUsers />}
        </div>
      </div>
      {toast && <Toast toast={toast} />}
    </div>
  );
}

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard({ setTab }) {
  const pending = _orders.filter(o => o.status === "Pending").length;
  const revenue = _orders.filter(o => ["Paid","Delivered"].includes(o.status)).reduce((s,o) => s+o.totalAmount, 0);
  return (
    <div className="fade">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>Admin Dashboard</h2>
        <p style={{ color: "#4a6080", marginTop: 4 }}>Platform overview · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, marginBottom: 32 }}>
        {[
          { label: "Total Orders", value: _orders.length, icon: "📦", color: "#4f7cff", sub: "All time" },
          { label: "Pending Approvals", value: pending, icon: "⏳", color: "#fbbf24", sub: "Needs action", alert: pending > 0 },
          { label: "Revenue", value: fmt(revenue), icon: "💰", color: "#34d399", sub: "From paid orders" },
          { label: "Active Products", value: _products.length, icon: "🏷️", color: "#a78bfa", sub: "In catalog" },
          { label: "Registered Shops", value: _users.filter(u=>u.role==="owner").length, icon: "🏪", color: "#38bdf8", sub: "Total users" },
          { label: "Total Savings Given", value: fmt(_orders.reduce((s,o)=>s+o.saving,0)), icon: "🎉", color: "#f472b6", sub: "To shop owners" },
        ].map((s, i) => (
          <div key={i} className="card hover-card" style={{ padding: 22, border: s.alert ? "1px solid rgba(251,191,36,0.3)" : "1px solid #162035" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 26 }}>{s.icon}</span>
              {s.alert && <span className="tag tag-amber" style={{ animation: "pulse 2s infinite" }}>Action</span>}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "Syne,sans-serif", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#c8d4f0", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#3a4f6e" }}>{s.sub}</div>
          </div>
        ))}
      </div>
      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0", marginBottom: 18 }}>⏳ Pending Approvals</h3>
          {_orders.filter(o => o.status === "Pending").map(o => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #0a1525" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#c8d4f0" }}>{o.id}</p>
                <p style={{ fontSize: 12, color: "#4a6080" }}>{o.product} · {o.qty} units</p>
              </div>
              <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setTab("orders")}>Review</button>
            </div>
          ))}
          {_orders.filter(o=>o.status==="Pending").length === 0 && <p style={{ color: "#3a4f6e", fontSize: 13 }}>No pending orders 🎉</p>}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0", marginBottom: 18 }}>📈 Pool Activity</h3>
          {[...new Set(_poolCart.map(e => e.productId))].map(pid => {
            const p = _products.find(pr => pr.id === pid);
            if (!p) return null;
            const total = _poolCart.filter(e => e.productId === pid).reduce((s, e) => s + e.qty, 0);
            const prog = Math.min((total / p.bulkThreshold) * 100, 100);
            return (
              <div key={pid} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: "#8a9cc0" }}>{p.image} {p.name.slice(0, 22)}…</span>
                  <span style={{ color: "#4f7cff", fontWeight: 600 }}>{Math.round(prog)}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${prog}%`, background: prog>=100?"linear-gradient(90deg,#34d399,#10b981)":"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PRODUCTS ────────────────────────────────────────────────────────────
function AdminProducts({ showToast, refresh }) {
  const [form, setForm] = useState({ name: "", category: "Grocery", price: "", bulkPrice: "", bulkThreshold: "", supplier: "", image: "📦", stock: "" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const save = () => {
    if (!form.name || !form.price || !form.bulkPrice || !form.bulkThreshold || !form.supplier) { showToast("Fill all required fields", "error"); return; }
    if (editId) {
      const idx = _products.findIndex(p => p.id === editId);
      if (idx >= 0) _products[idx] = { ..._products[idx], ...form, price: +form.price, bulkPrice: +form.bulkPrice, bulkThreshold: +form.bulkThreshold, stock: +form.stock };
      showToast("Product updated!");
    } else {
      const newProd = { ...form, id: Date.now(), price: +form.price, bulkPrice: +form.bulkPrice, bulkThreshold: +form.bulkThreshold, stock: +(form.stock||1000), unit: "pcs", rating: 4.5, reviews: 0 };
      _products.push(newProd);
      _notifications.unshift({ id: Date.now(), type: "system", msg: `New product added: ${form.name}`, time: "Just now", icon: "🆕", read: false });
      showToast("Product added and visible to all shops!");
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", category: "Grocery", price: "", bulkPrice: "", bulkThreshold: "", supplier: "", image: "📦", stock: "" });
    refresh();
  };

  const del = (id) => {
    const idx = _products.findIndex(p => p.id === id);
    if (idx >= 0) { _products.splice(idx, 1); showToast("Product removed"); refresh(); }
  };

  const startEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: p.price, bulkPrice: p.bulkPrice, bulkThreshold: p.bulkThreshold, supplier: p.supplier, image: p.image, stock: p.stock });
    setEditId(p.id);
    setShowForm(true);
  };

  const EMOJIS = ["📦","🌾","🫙","👕","📄","💡","🧴","🌿","🍬","📓","🔌","🧼","👖","🥫","🍫","🛒"];

  return (
    <div className="fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Product Management</h2>
          <p style={{ color: "#4a6080", fontSize: 13, marginTop: 3 }}>{_products.length} products in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", category: "Grocery", price: "", bulkPrice: "", bulkThreshold: "", supplier: "", image: "📦", stock: "" }); }}>
          {showForm ? "✕ Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="card fade" style={{ padding: 28, marginBottom: 24, border: "1px solid rgba(79,124,255,0.3)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c8d4f0", marginBottom: 20 }}>{editId ? "Edit Product" : "Add New Product"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={lblStyle}>Product Name *</label>
              <input className="inp" placeholder="Premium Basmati Rice (50kg)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label style={lblStyle}>Category</label>
              <select className="inp" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lblStyle}>Supplier *</label>
              <input className="inp" placeholder="AgriSupply Co." value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} />
            </div>
            <div>
              <label style={lblStyle}>Regular Price (₹) *</label>
              <input className="inp" type="number" placeholder="2800" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label style={lblStyle}>Bulk Price (₹) *</label>
              <input className="inp" type="number" placeholder="2200" value={form.bulkPrice} onChange={e => setForm({...form, bulkPrice: e.target.value})} />
            </div>
            <div>
              <label style={lblStyle}>Bulk Threshold (qty) *</label>
              <input className="inp" type="number" placeholder="500" value={form.bulkThreshold} onChange={e => setForm({...form, bulkThreshold: e.target.value})} />
            </div>
            <div>
              <label style={lblStyle}>Stock Available</label>
              <input className="inp" type="number" placeholder="5000" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={lblStyle}>Product Icon</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {EMOJIS.map(e => <div key={e} onClick={() => setForm({...form, image: e})} style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${form.image===e?"#4f7cff":"#162035"}`, background: form.image===e?"rgba(79,124,255,0.15)":"#0a1220", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer" }}>{e}</div>)}
              </div>
            </div>
          </div>
          {form.price && form.bulkPrice && (
            <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: "#34d399" }}>
              ✓ Discount: {pct(+form.bulkPrice, +form.price)}% off at bulk · Save {fmt(form.price - form.bulkPrice)} per unit
            </div>
          )}
          <button className="btn btn-primary" style={{ padding: "12px 28px" }} onClick={save}>{editId ? "Update Product ✓" : "Add Product ✓"}</button>
        </div>
      )}

      <div className="card" style={{ overflow: "hidden", padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#0a1220" }}>{["","Product","Category","Regular","Bulk Price","Discount","Threshold","Stock","Supplier","Actions"].map(h => <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#3a4f6e", letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>
              {_products.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #0a1525" }}>
                  <td style={{ padding: "12px 18px", fontSize: 24 }}>{p.image}</td>
                  <td style={{ padding: "12px 18px", fontSize: 13, fontWeight: 600, color: "#c8d4f0", minWidth: 180 }}>{p.name}</td>
                  <td style={{ padding: "12px 18px" }}><span className="tag tag-blue">{p.category}</span></td>
                  <td style={{ padding: "12px 18px", fontSize: 13, color: "#8a9cc0" }}>{fmt(p.price)}</td>
                  <td style={{ padding: "12px 18px", fontSize: 13, color: "#34d399", fontWeight: 600 }}>{fmt(p.bulkPrice)}</td>
                  <td style={{ padding: "12px 18px" }}><span className="tag tag-green">-{pct(p.bulkPrice,p.price)}%</span></td>
                  <td style={{ padding: "12px 18px", fontSize: 13, color: "#8a9cc0" }}>{p.bulkThreshold} {p.unit}</td>
                  <td style={{ padding: "12px 18px", fontSize: 13, color: "#8a9cc0" }}>{p.stock.toLocaleString()}</td>
                  <td style={{ padding: "12px 18px", fontSize: 12, color: "#4a6080" }}>{p.supplier}</td>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-outline" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => del(p.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ORDERS ──────────────────────────────────────────────────────────────
function AdminOrders({ showToast, refresh }) {
  const updateStatus = (id, status) => {
    const o = _orders.find(o => o.id === id);
    if (o) { o.status = status; _notifications.unshift({ id: Date.now(), type: "delivery", msg: `Order ${id} updated to ${status}`, time: "Just now", icon: "📦", read: false }); showToast(`Order ${id} → ${status}`); refresh(); }
  };
  return (
    <div className="fade">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Order Management</h2>
        <p style={{ color: "#4a6080", fontSize: 13, marginTop: 3 }}>{_orders.length} total orders · {_orders.filter(o=>o.status==="Pending").length} pending</p>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {["Pending","Approved","Paid","Shipped","Delivered"].map(s => (
          <div key={s} className="card" style={{ padding: "12px 18px", textAlign: "center", minWidth: 100 }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: s==="Pending"?"#fbbf24":s==="Delivered"?"#34d399":"#4f7cff", fontFamily: "Syne,sans-serif" }}>{_orders.filter(o=>o.status===s).length}</p>
            <p style={{ fontSize: 11, color: "#4a6080", marginTop: 2 }}>{s}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ overflow: "hidden", padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#0a1220" }}>{["Order ID","Product","Total Qty","Shops","Total Value","Savings","Status","Actions"].map(h => <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#3a4f6e", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>
              {_orders.map(o => (
                <tr key={o.id} style={{ borderBottom: "1px solid #0a1525" }}>
                  <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 700, color: "#4f7cff" }}>{o.id}</td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: "#c8d4f0", maxWidth: 160 }}>{o.product}</td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: "#8a9cc0" }}>{o.qty}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: -4 }}>
                      {o.shops.slice(0, 3).map((s, i) => <div key={i} className="avatar" style={{ width: 24, height: 24, background: avatarColor(s), fontSize: 10, marginLeft: i>0?-6:0, border: "1.5px solid #0a1220" }}>{initials(s)}</div>)}
                      {o.shops.length > 3 && <div style={{ width: 24, height: 24, background: "#162035", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#4a6080", marginLeft: -6 }}>+{o.shops.length-3}</div>}
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, color: "#c8d4f0" }}>{fmt(o.totalAmount)}</td>
                  <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, color: "#34d399" }}>{fmt(o.saving)}</td>
                  <td style={{ padding: "14px 18px" }}><StatusTag status={o.status} /></td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {o.status === "Pending" && <>
                        <button className="btn btn-success" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => updateStatus(o.id, "Approved")}>✓ Approve</button>
                        <button className="btn btn-danger" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => updateStatus(o.id, "Rejected")}>✗ Reject</button>
                      </>}
                      {o.status === "Approved" && <button className="btn btn-outline" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => updateStatus(o.id, "Paid")}>→ Mark Paid</button>}
                      {o.status === "Paid" && <button className="btn btn-outline" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => updateStatus(o.id, "Shipped")}>→ Ship</button>}
                      {o.status === "Shipped" && <button className="btn btn-success" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => updateStatus(o.id, "Delivered")}>✓ Delivered</button>}
                      {["Delivered","Rejected"].includes(o.status) && <span style={{ fontSize: 12, color: "#3a4f6e" }}>Completed</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAYMENTS ─────────────────────────────────────────────────────────────
function AdminPayments() {
  const payments = _orders.map(o => ({ orderId: o.id, shop: o.shops[0] || "", product: o.product, amount: o.totalAmount, status: ["Paid","Delivered"].includes(o.status) ? "Paid" : "Pending", date: o.date }));
  const totalPaid = payments.filter(p=>p.status==="Paid").reduce((s,p)=>s+p.amount,0);
  const totalPending = payments.filter(p=>p.status==="Pending").reduce((s,p)=>s+p.amount,0);
  return (
    <div className="fade">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Payment Monitoring</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 28 }}>
        {[
          { label: "Total Collected", value: fmt(totalPaid), color: "#34d399", icon: "✅" },
          { label: "Pending Payments", value: fmt(totalPending), color: "#fbbf24", icon: "⏳" },
          { label: "Total Transactions", value: payments.length, color: "#4f7cff", icon: "📊" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "Syne,sans-serif", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#4a6080" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ overflow: "hidden", padding: 0 }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #0f1e35" }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8d4f0" }}>All Payments</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#0a1220" }}>{["Order ID","Shop","Product","Amount","Date","Status"].map(h => <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#3a4f6e", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #0a1525" }}>
                  <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 700, color: "#4f7cff" }}>{p.orderId}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#8a9cc0" }}>{p.shop}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#8a9cc0", maxWidth: 150 }}>{p.product}</td>
                  <td style={{ padding: "13px 20px", fontSize: 14, fontWeight: 700, color: "#c8d4f0" }}>{fmt(p.amount)}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#4a6080" }}>{p.date}</td>
                  <td style={{ padding: "13px 20px" }}><span className={`tag ${p.status==="Paid"?"tag-green":"tag-amber"}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DELIVERY ────────────────────────────────────────────────────────────
function AdminDelivery({ showToast, refresh }) {
  const updateDelivery = (id, status) => {
    const o = _orders.find(o => o.id === id);
    if (o) { o.status = status; showToast(`Order ${id} → ${status}`); refresh(); }
  };
  const active = _orders.filter(o => ["Approved","Paid","Shipped"].includes(o.status));
  return (
    <div className="fade">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Delivery Management</h2>
        <p style={{ color: "#4a6080", fontSize: 13, marginTop: 3 }}>{active.length} active deliveries</p>
      </div>
      {active.length === 0 ? <div style={{ textAlign: "center", padding: 60, color: "#3a4f6e" }}>No active deliveries</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
          {active.map(o => (
            <div key={o.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#4f7cff", fontSize: 15 }}>{o.id}</p>
                  <p style={{ fontSize: 13, color: "#8a9cc0", marginTop: 4 }}>{o.product}</p>
                </div>
                <StatusTag status={o.status} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                {[["Shops", o.shops.length], ["Qty", o.qty + " units"], ["Value", fmt(o.totalAmount)]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#4a6080" }}>{l}</span>
                    <span style={{ color: "#8a9cc0", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* Status timeline mini */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                {STATUS_FLOW.slice(0, 5).map((s, i) => {
                  const cur = STATUS_FLOW.indexOf(o.status);
                  return (
                    <div key={s} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: 4, borderRadius: 2, background: i <= cur ? "linear-gradient(90deg,#4f7cff,#7c5cfc)" : "#0f1e35", marginBottom: 4 }} />
                      <p style={{ fontSize: 9, color: i <= cur ? "#4f7cff" : "#2a3a55", fontWeight: 600 }}>{s.slice(0, 4)}</p>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {o.status === "Approved" && <button className="btn btn-outline" style={{ flex: 1, padding: "8px", fontSize: 12 }} onClick={() => updateDelivery(o.id, "Paid")}>Mark Paid</button>}
                {o.status === "Paid" && <button className="btn btn-outline" style={{ flex: 1, padding: "8px", fontSize: 12 }} onClick={() => updateDelivery(o.id, "Shipped")}>Ship Now</button>}
                {o.status === "Shipped" && <button className="btn btn-success" style={{ flex: 1, padding: "8px", fontSize: 12 }} onClick={() => updateDelivery(o.id, "Delivered")}>✓ Delivered</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN USERS ──────────────────────────────────────────────────────────────
function AdminUsers() {
  const owners = _users.filter(u => u.role === "owner");
  return (
    <div className="fade">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Registered Users</h2>
        <p style={{ color: "#4a6080", fontSize: 13, marginTop: 3 }}>{owners.length} shop owners</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 18 }}>
        {owners.map(u => (
          <div key={u.id} className="card hover-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div className="avatar" style={{ width: 44, height: 44, background: avatarColor(u.ownerName), fontSize: 16 }}>{initials(u.ownerName)}</div>
              <div>
                <p style={{ fontWeight: 700, color: "#c8d4f0", fontSize: 15 }}>{u.shopName}</p>
                <p style={{ fontSize: 13, color: "#4a6080" }}>{u.ownerName}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <span className="tag tag-blue">{u.category}</span>
                  <span className="tag tag-green">✓ Active</span>
                </div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["📍 Location", u.location], ["📧 Email", u.email], ["📱 Phone", u.phone], ["📅 Joined", u.joinDate]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#4a6080" }}>{l}</span>
                  <span style={{ color: "#6a7c9c", maxWidth: 140, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["Orders", u.orders], ["Collabs", u.collaborations], ["Saved", fmt(u.totalSavings).slice(0, 6)]].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#4f7cff", fontFamily: "Syne,sans-serif" }}>{v}</p>
                  <p style={{ fontSize: 10, color: "#3a4f6e" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}