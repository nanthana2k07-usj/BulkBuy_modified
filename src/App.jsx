import { useState, useEffect, useRef } from "react";
import apiFetch, { API_BASE } from './utils/api';
import {
  BulkBuyMark, IcShoppingCart, IcPackage, IcChat, IcHandshake, IcBell,
  IcUser, IcLogout, IcSearch, IcArrowRight, IcArrowLeft, IcCheck,
  IcCheckCircle, IcXCircle, IcAlertTriangle, IcTrendUp, IcBarChart,
  IcDollar, IcStore, IcBuilding, IcZap, IcLayers, IcTarget, IcStar,
  IcLock, IcMail, IcEye, IcEyeOff, IcPlus, IcMinus, IcTrash, IcEdit,
  IcMapPin, IcPhone, IcCalendar, IcFileText, IcShield, IcKey, IcSend,
  IcUsers, IcCreditCard, IcTruck, IcLoader, IcTag, IcAward, IcPercent,
  IcPieChart, IcInfo, IcFilter, IcSave, IcRefresh, IcSettings
} from './icons';

// ─── LOGO COMPONENT ────────────────────────────────────────────────────────────
function Logo({ size = 32, textSize = 20, showText = true }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <BulkBuyMark size={size} />
      {showText && (
        <span style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:textSize, fontWeight:800, color:"var(--text)", letterSpacing:"-0.03em" }}>
          BulkBuy
        </span>
      )}
    </div>
  );
}
let _users = [
  { id:1, ownerName:"Rajesh Kumar", email:"rajesh@shop.com", password:"pass123", phone:"9876543210", shopName:"Rajesh General Store", location:"Mumbai, Maharashtra", category:"Grocery", totalSavings:840, orders:3, collaborations:2, role:"owner", joinDate:"Jan 2024", loyaltyPoints:1500, loyaltyTier:"silver" },
  { id:2, ownerName:"Priya Sharma", email:"priya@shop.com", password:"pass123", phone:"9876543211", shopName:"Priya Mart", location:"Delhi, NCR", category:"Electronics", totalSavings:560, orders:2, collaborations:2, role:"owner", joinDate:"Feb 2024", loyaltyPoints:800, loyaltyTier:"bronze" },
  { id:3, ownerName:"Amit Patel", email:"amit@shop.com", password:"pass123", phone:"9876543212", shopName:"Amit Electronics", location:"Bangalore, Karnataka", category:"Electronics", totalSavings:308, orders:2, collaborations:1, role:"owner", joinDate:"Mar 2024", loyaltyPoints:500, loyaltyTier:"bronze" },
  { id:99, ownerName:"Admin User", email:"admin@bulkbuy.com", password:"admin123", phone:"9876543999", shopName:"BulkBuy Admin", location:"India", category:"Admin", totalSavings:0, orders:0, collaborations:0, role:"admin", joinDate:"Jan 2024", loyaltyPoints:0, loyaltyTier:"bronze" },
];
let _session = null;
let _products = [
  { id:1, name:"Premium Basmati Rice", category:"Grocery", price:28, bulkPrice:24, bulkThreshold:200, stock:500, image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating:4.5, reviews:128 },
  { id:2, name:"Refined Sunflower Oil", category:"Grocery", price:18, bulkPrice:15, bulkThreshold:150, stock:400, image:"https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400", rating:4.3, reviews:95 },
  { id:3, name:"LED Bulbs Pack (10pcs)", category:"Electronics", price:24, bulkPrice:20, bulkThreshold:100, stock:300, image:"https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400", rating:4.7, reviews:156 },
  { id:4, name:"A4 Paper Reams", category:"Office Supplies", price:6.2, bulkPrice:5, bulkThreshold:200, stock:600, image:"https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400", rating:4.4, reviews:87 },
  { id:5, name:"Toothpaste Pack", category:"Grocery", price:12, bulkPrice:10, bulkThreshold:120, stock:350, image:"https://images.unsplash.com/photo-1559548384-c00a7b5fc9bb?w=400", rating:4.2, reviews:203 },
  { id:6, name:"Detergent Powder 5kg", category:"Grocery", price:35, bulkPrice:30, bulkThreshold:80, stock:250, image:"https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=400", rating:4.6, reviews:142 },
  { id:7, name:"USB Cables (10pcs)", category:"Electronics", price:8, bulkPrice:6, bulkThreshold:150, stock:400, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", rating:4.1, reviews:78 },
  { id:8, name:"Biscuits Pack", category:"Grocery", price:15, bulkPrice:12, bulkThreshold:180, stock:450, image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", rating:4.5, reviews:189 },
  { id:9, name:"Wheat Flour (25kg)", category:"Grocery", price:22, bulkPrice:18, bulkThreshold:250, stock:550, image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400", rating:4.6, reviews:167 },
  { id:10, name:"Sugar (50kg)", category:"Grocery", price:32, bulkPrice:28, bulkThreshold:200, stock:400, image:"https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400", rating:4.4, reviews:134 },
  { id:11, name:"Tea Powder (5kg)", category:"Grocery", price:45, bulkPrice:38, bulkThreshold:100, stock:280, image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", rating:4.8, reviews:201 },
  { id:12, name:"Coffee Beans (10kg)", category:"Grocery", price:55, bulkPrice:48, bulkThreshold:80, stock:200, image:"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400", rating:4.9, reviews:178 },
  { id:13, name:"Spices Mix (2kg)", category:"Grocery", price:28, bulkPrice:24, bulkThreshold:150, stock:320, image:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", rating:4.3, reviews:92 },
  { id:14, name:"Cooking Oil (10L)", category:"Grocery", price:42, bulkPrice:36, bulkThreshold:120, stock:380, image:"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", rating:4.5, reviews:145 },
  { id:15, name:"Rice (50kg)", category:"Grocery", price:38, bulkPrice:32, bulkThreshold:200, stock:450, image:"https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400", rating:4.4, reviews:156 },
  { id:16, name:"Notebooks (100pcs)", category:"Stationery", price:18, bulkPrice:15, bulkThreshold:200, stock:500, image:"https://images.unsplash.com/photo-1531346878377-a5be20888657?w=400", rating:4.2, reviews:89 },
  { id:17, name:"Pens Pack (50pcs)", category:"Stationery", price:12, bulkPrice:10, bulkThreshold:150, stock:400, image:"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400", rating:4.1, reviews:67 },
  { id:18, name:"Markers Set (20pcs)", category:"Stationery", price:22, bulkPrice:18, bulkThreshold:100, stock:280, image:"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400", rating:4.3, reviews:78 },
  { id:19, name:"Calculator", category:"Electronics", price:15, bulkPrice:12, bulkThreshold:80, stock:350, image:"https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400", rating:4.4, reviews:112 },
  { id:20, name:"Power Strips (5pcs)", category:"Electronics", price:28, bulkPrice:24, bulkThreshold:100, stock:300, image:"https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400", rating:4.5, reviews:134 },
  { id:21, name:"Shampoo Bottles (12pcs)", category:"Grocery", price:18, bulkPrice:15, bulkThreshold:100, stock:320, image:"https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400", rating:4.3, reviews:156 },
  { id:22, name:"Soap Bars (24pcs)", category:"Grocery", price:14, bulkPrice:11, bulkThreshold:120, stock:400, image:"https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400", rating:4.2, reviews:134 },
  { id:23, name:"Hand Wash (5L)", category:"Grocery", price:22, bulkPrice:18, bulkThreshold:80, stock:280, image:"https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=400", rating:4.5, reviews:98 },
  { id:24, name:"Tissue Paper Packs", category:"Grocery", price:8, bulkPrice:6, bulkThreshold:200, stock:500, image:"https://images.unsplash.com/photo-1583947215256-38c3a828e5a9?w=400", rating:4.1, reviews:76 },
  { id:25, name:"Cleaning Supplies Kit", category:"Grocery", price:35, bulkPrice:28, bulkThreshold:60, stock:180, image:"https://images.unsplash.com/photo-1581578731117-104f2a65391c?w=400", rating:4.4, reviews:112 },
  { id:26, name:"Storage Containers (Set of 10)", category:"Grocery", price:25, bulkPrice:20, bulkThreshold:100, stock:350, image:"https://images.unsplash.com/photo-1594908900066-3f47337c1d9b?w=400", rating:4.3, reviews:89 },
  { id:27, name:"Plastic Bags Bundle", category:"Grocery", price:6, bulkPrice:4, bulkThreshold:300, stock:600, image:"https://images.unsplash.com/photo-1616628188859-9a1c1e5d4e5e?w=400", rating:3.9, reviews:67 },
  { id:28, name:"Disposable Plates (100pcs)", category:"Grocery", price:12, bulkPrice:9, bulkThreshold:150, stock:400, image:"https://images.unsplash.com/photo-1530103862676-de3c9a59af57?w=400", rating:4.0, reviews:78 },
  { id:29, name:"Paper Cups (200pcs)", category:"Grocery", price:10, bulkPrice:7, bulkThreshold:200, stock:450, image:"https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400", rating:4.1, reviews:92 },
  { id:30, name:"Aluminum Foil Rolls", category:"Grocery", price:8, bulkPrice:6, bulkThreshold:180, stock:380, image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating:4.2, reviews:84 },
  { id:31, name:"Clips and Pins Set", category:"Stationery", price:5, bulkPrice:3, bulkThreshold:250, stock:550, image:"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400", rating:4.0, reviews:56 },
  { id:32, name:"Stapler and Staples", category:"Stationery", price:8, bulkPrice:6, bulkThreshold:120, stock:320, image:"https://images.unsplash.com/photo-1531346878377-a5be20888657?w=400", rating:4.3, reviews:73 },
  { id:33, name:"Glue Bottles (6pcs)", category:"Stationery", price:10, bulkPrice:8, bulkThreshold:100, stock:280, image:"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400", rating:4.1, reviews:68 },
  { id:34, name:"Scissors Set (3pcs)", category:"Stationery", price:15, bulkPrice:12, bulkThreshold:80, stock:240, image:"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400", rating:4.4, reviews:91 },
  { id:35, name:"Tape Rolls (10pcs)", category:"Stationery", price:12, bulkPrice:9, bulkThreshold:150, stock:380, image:"https://images.unsplash.com/photo-1531346878377-a5be20888657?w=400", rating:4.2, reviews:79 },
  { id:36, name:"File Folders (25pcs)", category:"Stationery", price:18, bulkPrice:14, bulkThreshold:100, stock:300, image:"https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400", rating:4.3, reviews:85 },
  { id:37, name:"Envelopes (100pcs)", category:"Stationery", price:8, bulkPrice:6, bulkThreshold:200, stock:450, image:"https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400", rating:4.0, reviews:62 },
  { id:38, name:"Whiteboard Markers", category:"Stationery", price:14, bulkPrice:11, bulkThreshold:80, stock:220, image:"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400", rating:4.5, reviews:104 },
  { id:39, name:"Desk Organizer", category:"Stationery", price:20, bulkPrice:16, bulkThreshold:60, stock:180, image:"https://images.unsplash.com/photo-1531346878377-a5be20888657?w=400", rating:4.4, reviews:88 },
  { id:40, name:"Mouse Pad (10pcs)", category:"Electronics", price:6, bulkPrice:4, bulkThreshold:150, stock:400, image:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", rating:4.1, reviews:72 },
  { id:41, name:"Keyboard Wrist Rest", category:"Electronics", price:12, bulkPrice:9, bulkThreshold:80, stock:240, image:"https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=400", rating:4.3, reviews:65 },
  { id:42, name:"HDMI Cables (5pcs)", category:"Electronics", price:18, bulkPrice:14, bulkThreshold:60, stock:180, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", rating:4.4, reviews:97 },
  { id:43, name:"Ethernet Cables (10pcs)", category:"Electronics", price:15, bulkPrice:12, bulkThreshold:100, stock:300, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", rating:4.2, reviews:84 },
  { id:44, name:"SD Cards (10pcs)", category:"Electronics", price:35, bulkPrice:28, bulkThreshold:50, stock:150, image:"https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400", rating:4.6, reviews:123 },
  { id:45, name:"USB Flash Drives (5pcs)", category:"Electronics", price:28, bulkPrice:22, bulkThreshold:40, stock:120, image:"https://images.unsplash.com/photo-1618410320928-25228d611631?w=400", rating:4.5, reviews:108 },
  { id:46, name:"Phone Chargers (5pcs)", category:"Electronics", price:22, bulkPrice:17, bulkThreshold:60, stock:180, image:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400", rating:4.3, reviews:95 },
  { id:47, name:"Bluetooth Speakers (3pcs)", category:"Electronics", price:45, bulkPrice:36, bulkThreshold:30, stock:90, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", rating:4.7, reviews:167 },
  { id:48, name:"Earbuds (10pcs)", category:"Electronics", price:32, bulkPrice:25, bulkThreshold:50, stock:150, image:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", rating:4.4, reviews:142 },
  { id:49, name:"Webcam HD", category:"Electronics", price:38, bulkPrice:30, bulkThreshold:25, stock:75, image:"https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400", rating:4.5, reviews:89 },
  { id:50, name:"Wireless Mouse (5pcs)", category:"Electronics", price:28, bulkPrice:22, bulkThreshold:40, stock:120, image:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", rating:4.4, reviews:118 }
];

let _orders = [
  { id:"BLK-2841", product:"Premium Basmati Rice", qty:350, status:"Approved", shops:["Rajesh General Store","Priya Mart","Amit Electronics"], saving:840, date:"Apr 13", totalAmount:9800, shopBreakdown:[{shop:"Rajesh General Store",qty:150,amount:4200},{shop:"Priya Mart",qty:120,amount:3360},{shop:"Amit Electronics",qty:80,amount:2240}] },
  { id:"BLK-2790", product:"LED Bulbs Pack", qty:280, status:"Delivered", shops:["Priya Mart","Amit Electronics"], saving:560, date:"Apr 8", totalAmount:6720, shopBreakdown:[{shop:"Priya Mart",qty:130,amount:3120},{shop:"Amit Electronics",qty:150,amount:3600}] },
  { id:"BLK-2750", product:"Refined Sunflower Oil", qty:180, status:"Pending", shops:["Rajesh General Store"], saving:0, date:"Apr 5", totalAmount:3240, shopBreakdown:[{shop:"Rajesh General Store",qty:180,amount:3240}] },
  { id:"BLK-2810", product:"A4 Paper Reams", qty:220, status:"Paid", shops:["Rajesh General Store","Priya Mart"], saving:308, date:"Apr 10", totalAmount:1364, shopBreakdown:[{shop:"Rajesh General Store",qty:120,amount:744},{shop:"Priya Mart",qty:100,amount:620}] },
];

let _poolCart = [
  { productId:1, userId:2, shopName:"Priya Mart", qty:120 },
  { productId:1, userId:3, shopName:"Amit Electronics", qty:80 },
  { productId:5, userId:2, shopName:"Priya Mart", qty:100 },
];

let _messages = [
  { id:1, userId:2, sender:"Priya Mart", text:"Has anyone ordered the Basmati Rice this month?", time:"10:32 AM", avatar:"PM" },
  { id:2, userId:3, sender:"Amit Electronics", text:"Yes! I added 80kg. We need 50 more kg to unlock bulk price.", time:"10:35 AM", avatar:"AE" },
  { id:3, userId:1, sender:"Rajesh General Store", text:"I'll add 150kg now. That should get us over the threshold!", time:"10:37 AM", avatar:"RG" },
  { id:4, userId:2, sender:"Priya Mart", text:"Great! Bulk discount unlocked for this order.", time:"10:38 AM", avatar:"PM" },
];

let _notifications = [
  { id:1, type:"collab",   msg:"Priya Mart accepted your collaboration request", time:"2m ago",  icon: IcHandshake, read:false },
  { id:2, type:"discount", msg:"Bulk threshold reached — ₹840 savings unlocked on Rice order",  time:"1h ago",  icon: IcAward, read:false },
  { id:3, type:"delivery", msg:"Order #BLK-2841 moved to Approved",               time:"3h ago",  icon: IcPackage, read:true  },
  { id:4, type:"system",   msg:"New product added: Wheat Flour (25kg)",            time:"5h ago",  icon: IcTag, read:true  },
];

const CATEGORIES = ["All","Grocery","Clothes","Stationery","Electronics","Cosmetics","Others"];
const STATUS_FLOW = ["Pending","Approved","Paid","Shipped","Delivered"];

// ─── THEME SYSTEM ─────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    name: 'Dark',
    background: '#060b14',
    cardBackground: 'linear-gradient(145deg, rgba(12,20,36,0.92), rgba(8,14,28,0.96))',
    cardBorder: 'rgba(28,44,76,0.55)',
    text: '#d8e4f0',
    textMuted: '#4a607e',
    textLight: '#b8ccee',
    inputBackground: 'rgba(4,8,18,0.85)',
    inputBorder: 'rgba(28,44,76,0.75)',
    inputFocus: 'rgba(64,98,232,0.55)',
    scrollbar: '#1a2840',
    primary: '#4062e8',
    primaryGradient: 'linear-gradient(135deg, #4062e8 0%, #6b4fdb 100%)',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#eab308',
    border: 'rgba(28,44,76,0.55)',
    hover: 'rgba(255,255,255,0.04)',
    shadow: 'rgba(0,0,0,0.45)'
  },
  light: {
    name: 'Light',
    background: '#f8fafc',
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    text: '#1e293b',
    textMuted: '#64748b',
    textLight: '#334155',
    inputBackground: '#ffffff',
    inputBorder: '#cbd5e1',
    inputFocus: 'rgba(64,98,232,0.55)',
    scrollbar: '#cbd5e1',
    primary: '#4062e8',
    primaryGradient: 'linear-gradient(135deg, #4062e8 0%, #6b4fdb 100%)',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#eab308',
    border: '#e2e8f0',
    hover: 'rgba(0,0,0,0.04)',
    shadow: 'rgba(0,0,0,0.1)'
  },
  blue: {
    name: 'Ocean Blue',
    background: '#0f172a',
    cardBackground: 'linear-gradient(145deg, rgba(30,58,138,0.92), rgba(15,23,42,0.96))',
    cardBorder: 'rgba(59,130,246,0.3)',
    text: '#e0f2fe',
    textMuted: '#60a5fa',
    textLight: '#93c5fd',
    inputBackground: 'rgba(15,23,42,0.85)',
    inputBorder: 'rgba(59,130,246,0.4)',
    inputFocus: 'rgba(59,130,246,0.6)',
    scrollbar: '#1e3a8a',
    primary: '#3b82f6',
    primaryGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#eab308',
    border: 'rgba(59,130,246,0.3)',
    hover: 'rgba(59,130,246,0.1)',
    shadow: 'rgba(59,130,246,0.2)'
  },
  purple: {
    name: 'Royal Purple',
    background: '#1a0b2e',
    cardBackground: 'linear-gradient(145deg, rgba(58,17,94,0.92), rgba(26,11,46,0.96))',
    cardBorder: 'rgba(139,92,246,0.3)',
    text: '#f3e8ff',
    textMuted: '#a78bfa',
    textLight: '#c4b5fd',
    inputBackground: 'rgba(26,11,46,0.85)',
    inputBorder: 'rgba(139,92,246,0.4)',
    inputFocus: 'rgba(139,92,246,0.6)',
    scrollbar: '#3b0764',
    primary: '#8b5cf6',
    primaryGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#eab308',
    border: 'rgba(139,92,246,0.3)',
    hover: 'rgba(139,92,246,0.1)',
    shadow: 'rgba(139,92,246,0.2)'
  }
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const pct = (a,b) => Math.round(((b-a)/b)*100);
const initials = (name) => (name||"U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const avatarColor = (name) => {
  const colors = ["#4f7cff","#7c5cfc","#34d399","#fbbf24","#f87171","#a78bfa","#38bdf8"];
  return colors[(name||"U").charCodeAt(0) % colors.length];
};
// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
function GlobalStyles({ theme }) {
  const t = THEMES[theme] || THEMES.dark;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap');

      :root {
        --background: ${t.background};
        --card-background: ${t.cardBackground};
        --card-border: ${t.cardBorder};
        --text: ${t.text};
        --text-muted: ${t.textMuted};
        --text-light: ${t.textLight};
        --input-background: ${t.inputBackground};
        --input-border: ${t.inputBorder};
        --input-focus: ${t.inputFocus};
        --scrollbar: ${t.scrollbar};
        --primary: ${t.primary};
        --primary-gradient: ${t.primaryGradient};
        --success: ${t.success};
        --danger: ${t.danger};
        --warning: ${t.warning};
        --border: ${t.border};
        --hover: ${t.hover};
        --shadow: ${t.shadow};
      }

      *{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{
        font-family:'Inter','Helvetica Neue',Arial,sans-serif;
        background:var(--background);color:var(--text);overflow-x:hidden;
        -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
        font-feature-settings:'ss01','cv01','cv11';
        letter-spacing:-0.01em;
        transition: background 0.3s ease, color 0.3s ease;
      }
      h1,h2,h3,h4,h5,.heading{
        font-family:'Manrope','Inter','Helvetica Neue',Arial,sans-serif;
        font-feature-settings:'ss01';letter-spacing:-0.03em;
        color: var(--text);
      }
      ::-webkit-scrollbar{width:4px;height:4px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:var(--scrollbar);border-radius:4px}
      input,textarea,select,button{font-family:'Inter','Helvetica Neue',Arial,sans-serif}

      /* Cards */
      .card{background:var(--card-background);border:1px solid var(--card-border);border-radius:18px;backdrop-filter:blur(12px);transition: background 0.3s ease, border 0.3s ease}
      .card-glow{background:var(--card-background);border:1px solid var(--card-border);border-radius:18px;box-shadow:0 0 40px rgba(79,124,255,0.05),inset 0 1px 0 rgba(255,255,255,0.04);transition: background 0.3s ease, border 0.3s ease}

      /* Buttons */
      .btn{border:none;border-radius:12px;padding:11px 20px;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s cubic-bezier(0.4,0,0.2,1);letter-spacing:-0.01em;position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:7px}
      .btn:disabled{opacity:0.5;cursor:not-allowed;transform:none !important}
      .btn-primary{background:var(--primary-gradient);color:#fff;box-shadow:0 4px 18px rgba(64,98,232,0.32)}
      .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 24px rgba(64,98,232,0.48)}
      .btn-primary:active{transform:translateY(0)}
      .btn-outline{background:transparent;color:var(--primary);border:1px solid rgba(64,98,232,0.22)}
      .btn-outline:hover{border-color:rgba(64,98,232,0.45);background:rgba(64,98,232,0.07);color:#92adf0}
      .btn-ghost{background:transparent;color:var(--text-muted);border:none}
      .btn-ghost:hover{color:var(--text-light);background:var(--hover)}
      .btn-danger{background:rgba(239,68,68,0.09);color:var(--danger);border:1px solid rgba(239,68,68,0.18)}
      .btn-danger:hover{background:rgba(239,68,68,0.16)}
      .btn-success{background:rgba(34,197,94,0.09);color:var(--success);border:1px solid rgba(34,197,94,0.18)}
      .btn-success:hover{background:rgba(34,197,94,0.18)}

      /* Inputs */
      .inp{background:var(--input-background);border:1px solid var(--input-border);border-radius:12px;padding:12px 15px;color:var(--text);font-size:14px;font-family:'Inter','Helvetica Neue',Arial,sans-serif;width:100%;outline:none;transition:all 0.18s;letter-spacing:-0.01em}
      .inp:focus{border-color:var(--input-focus);box-shadow:0 0 0 3px rgba(64,98,232,0.09)}
      .inp::placeholder{color:var(--text-muted)}
      .inp-icon{position:relative}
      .inp-icon .inp{padding-left:40px}
      .inp-icon .icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);pointer-events:none;display:flex;align-items:center}
      select.inp option{background:var(--background);color:var(--text)}
      textarea.inp{resize:vertical;line-height:1.5}

      /* Tags / Badges */
      .tag{display:inline-flex;align-items:center;gap:4px;border-radius:6px;padding:3px 9px;font-size:11px;font-weight:600;letter-spacing:0.02em;font-family:'Inter',sans-serif}
      .tag-blue{background:rgba(64,98,232,0.1);color:#6d90e8;border:1px solid rgba(64,98,232,0.18)}
      .tag-green{background:rgba(34,197,94,0.09);color:var(--success);border:1px solid rgba(34,197,94,0.18)}
      .tag-amber{background:rgba(234,179,8,0.09);color:var(--warning);border:1px solid rgba(234,179,8,0.18)}
      .tag-red{background:rgba(239,68,68,0.09);color:var(--danger);border:1px solid rgba(239,68,68,0.18)}
      .tag-purple{background:rgba(139,92,246,0.09);color:#8b5cf6;border:1px solid rgba(139,92,246,0.18)}
      .tag-cyan{background:rgba(6,182,212,0.09);color:#06b6d4;border:1px solid rgba(6,182,212,0.18)}

      /* Animations */
      @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
      @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
      @keyframes glowPulse{0%,100%{box-shadow:0 0 18px rgba(64,98,232,0.28)}50%{box-shadow:0 0 36px rgba(64,98,232,0.55),0 0 70px rgba(107,79,219,0.28)}}
      @keyframes bounceIn{0%{opacity:0;transform:scale(0.4)}55%{opacity:1;transform:scale(1.04)}75%{transform:scale(0.96)}100%{transform:scale(1)}}

      .fade-up{animation:fadeUp 0.45s cubic-bezier(0.4,0,0.2,1) forwards}
      .fade-in{animation:fadeIn 0.35s ease forwards}

      .hover-lift{transition:transform 0.18s,box-shadow 0.18s,border-color 0.18s}
      .hover-lift:hover{transform:translateY(-3px);box-shadow:0 16px 48px var(--shadow);border-color:rgba(64,98,232,0.28)}

      .progress-track{height:6px;background:rgba(10,20,38,0.9);border-radius:4px;overflow:hidden}
      .progress-fill{height:100%;border-radius:4px;transition:width 0.9s cubic-bezier(0.34,1.2,0.64,1)}

      .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(28,44,76,0.5),transparent);margin:14px 0}
      .avatar{display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:12px;color:#fff;flex-shrink:0;font-family:'Manrope','Inter',sans-serif}
      .dot-pattern{background-image:radial-gradient(rgba(64,98,232,0.12) 1px,transparent 1px);background-size:22px 22px}
      .gradient-text{background:linear-gradient(135deg,#4062e8,#6b4fdb,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    `}</style>
  );
}


// ─── THEME SWITCHER ─────────────────────────────────────────────────────────────
function ThemeSwitcher({ currentTheme, onThemeChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => onThemeChange(key)}
          title={theme.name}
          style={{
            width:32,
            height:32,
            borderRadius:8,
            border:currentTheme === key ? `2px solid ${theme.primary}` : `2px solid transparent`,
            background:theme.background,
            cursor:"pointer",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            transition:"all 0.2s",
            position:"relative"
          }}
        >
          {currentTheme === key && (
            <div style={{
              position:"absolute",
              top:-4,
              right:-4,
              width:12,
              height:12,
              background:theme.primary,
              borderRadius:"50%",
              border:"2px solid var(--background)"
            }} />
          )}
          <div style={{
            width:16,
            height:16,
            borderRadius:"50%",
            background:theme.primaryGradient,
            opacity:0.8
          }} />
        </button>
      ))}
    </div>
  );
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  const ok = toast.type === "success";
  return (
    <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:ok?"rgba(8,20,14,0.96)":"rgba(20,8,8,0.96)", border:`1px solid ${ok?"rgba(34,197,94,0.35)":"rgba(239,68,68,0.35)"}`, borderRadius:14, padding:"13px 22px", color:ok?"#22c55e":"#ef4444", fontWeight:600, fontSize:14, zIndex:9999, boxShadow:"0 12px 40px rgba(0,0,0,0.7)", display:"flex", alignItems:"center", gap:10, animation:"fadeUp 0.3s ease", backdropFilter:"blur(20px)", maxWidth:"90vw", fontFamily:"'Inter',sans-serif" }}>
      {ok ? <IcCheckCircle size={16} color="#22c55e" /> : <IcXCircle size={16} color="#ef4444" />}
      {toast.msg}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bulkbuy-theme');
    return saved || 'dark';
  });
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(x => x+1);

  useEffect(() => {
    // Products are already loaded from local demo data
    // No need to fetch from API
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('bulkbuy-theme', newTheme);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const logout = () => { _session = null; setCurrentUser(null); setScreen("auth-landing"); setCart([]); };

  const addToCart = (product, qty = 50) => {
    setCart(prev => {
      const ex = prev.find(i => (i._id||i.id) === (product._id||product.id));
      if (ex) return prev.map(i => (i._id||i.id)===(product._id||product.id) ? {...i, qty: i.qty+qty} : i);
      return [...prev, {...product, qty}];
    });
    showToast(`${product.name} added to cart!`);
  };

  const poolQty = (pid) => _poolCart.filter(e => e.productId===pid).reduce((s,e)=>s+e.qty, 0);

  if (currentUser?.role === "admin") {
    return <AdminApp user={currentUser} logout={logout} showToast={showToast} toast={toast} refresh={refresh} />;
  }

  const screens = {
    splash: <SplashScreen onDone={() => setScreen("auth-landing")} />,
    "auth-landing": <AuthLandingScreen setScreen={setScreen} />,
    login: <LoginScreen setScreen={setScreen} setCurrentUser={setCurrentUser} showToast={showToast} />,
    "register-choice": <RegisterChoiceScreen setScreen={setScreen} />,
    "register-owner": <RegisterOwnerScreen setScreen={setScreen} showToast={showToast} />,
    "register-wholesale": <RegisterWholesaleScreen setScreen={setScreen} showToast={showToast} />,
    dashboard: <DashboardScreen user={currentUser} setScreen={setScreen} setSelectedCategory={setSelectedCategory} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} showToast={showToast} refresh={refresh} />,
    browse: <BrowseScreen category={selectedCategory} setSelectedCategory={setSelectedCategory} setScreen={setScreen} setSelectedProduct={setSelectedProduct} addToCart={addToCart} poolQty={poolQty} currentUser={currentUser} logout={logout} cart={cart} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />,
    product: <ProductScreen product={selectedProduct} setScreen={setScreen} addToCart={addToCart} poolQty={poolQty} showToast={showToast} currentUser={currentUser} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />,
    cart: <CartScreen cart={cart} setCart={setCart} setScreen={setScreen} showToast={showToast} poolQty={poolQty} currentUser={currentUser} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />,
    payment: <PaymentScreen cart={cart} setScreen={setScreen} showToast={showToast} currentUser={currentUser} setCart={setCart} />,
    tracking: <TrackingScreen setScreen={setScreen} currentUser={currentUser} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />,
    chat: <ChatScreen setScreen={setScreen} currentUser={currentUser} showToast={showToast} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />,
    shops: <ShopsScreen setScreen={setScreen} currentUser={currentUser} showToast={showToast} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />,
    analytics: <AnalyticsScreen setScreen={setScreen} currentUser={currentUser} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />,
    profile: <ProfileScreen setScreen={setScreen} currentUser={currentUser} setCurrentUser={setCurrentUser} showToast={showToast} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} theme={theme} handleThemeChange={handleThemeChange} />,
  };

  return (
    <div style={{ fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif", background:THEMES[theme].background, minHeight:"100vh", color:THEMES[theme].text, position:"relative" }}>
      <GlobalStyles theme={theme} />
      {screens[screen] || screens.dashboard}
      {currentUser && !["login","register-choice","register-owner","register-wholesale","splash","auth-landing","payment"].includes(screen) && (
        <>
          <AiChatbot open={chatBotOpen} setOpen={setChatBotOpen} currentUser={currentUser} />
          {!chatBotOpen && (
            <button onClick={() => setChatBotOpen(true)} style={{ position:"fixed", bottom:28, right:28, width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#4062e8,#6b4fdb)", border:"none", cursor:"pointer", boxShadow:"0 8px 28px rgba(64,98,232,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", animation:"glowPulse 3s infinite" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <IcChat size={22} color="#fff" />
            </button>
          )}
        </>
      )}
      {toast && <Toast toast={toast} />}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── SPLASH SCREEN ────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => onDone(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({length: 60}, () => ({
      x: Math.random() * canvas.width, y: canvas.height + Math.random() * 200,
      size: Math.random() * 3 + 1, speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.5 ? 220 : 260
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -10) p.y = canvas.height + 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 30% 20%, rgba(79,124,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(124,92,252,0.12) 0%, transparent 50%), #060b14", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", zIndex:9999, overflow:"hidden" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, pointerEvents:"none" }} />

      {/* Ambient glows */}
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(79,124,255,0.08) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
        {/* Logo mark */}
        <div style={{ marginBottom:32, opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "scale(1)" : "scale(0.5)", transition:"all 0.7s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ width:100, height:100, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", filter:"drop-shadow(0 20px 60px rgba(79,124,255,0.45))", animation: phase >= 1 ? "glowPulse 2s infinite" : "none" }}>
            <BulkBuyMark size={100} />
          </div>
        </div>

        {/* Brand name */}
        <div style={{ overflow:"hidden", marginBottom:12 }}>
          <h1 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:64, fontWeight:900, letterSpacing:"-3px", opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(60px)", transition:"all 0.6s cubic-bezier(0.4,0,0.2,1) 0.2s", background:"linear-gradient(135deg,#ffffff 0%,#a0b8ff 50%,#c4b5fd 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            BulkBuy
          </h1>
        </div>

        {/* Tagline */}
        <p style={{ fontSize:16, color:"rgba(164,196,255,0.7)", letterSpacing:"3px", textTransform:"uppercase", fontWeight:500, opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(16px)", transition:"all 0.5s ease 0.1s", marginBottom:48 }}>
          Collaborative Wholesale Platform
        </p>

        {/* Features row */}
        <div style={{ display:"flex", gap:32, justifyContent:"center", opacity: phase >= 2 ? 1 : 0, transition:"opacity 0.5s ease 0.3s" }}>
          {[
            { icon: IcStore, label:"Shop Owners" },
            { icon: IcHandshake, label:"Pool Orders" },
            { icon: IcDollar, label:"Save More" }
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ textAlign:"center" }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><Icon size={24} color="#8fb0ff" /></div>
              <div style={{ fontSize:11, color:"rgba(164,196,255,0.5)", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Loading bar */}
        <div style={{ marginTop:56, width:200, margin:"56px auto 0", height:3, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden", opacity: phase >= 2 ? 1 : 0, transition:"opacity 0.3s" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#4f7cff,#7c5cfc,#a78bfa)", borderRadius:3, width: phase >= 3 ? "100%" : phase >= 2 ? "60%" : "0%", transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)", backgroundSize:"200% 100%", animation:"gradientShift 2s linear infinite" }} />
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── AUTH LANDING (Choose Login or Create Account) ────────────────
// ════════════════════════════════════════════════════════════════════
function AuthLandingScreen({ setScreen }) {
  const [hovered, setHovered] = useState(null);

  const stats = [
    { value:"2,400+", label:"Shop Owners" },
    { value:"₹1.2Cr", label:"Total Savings" },
    { value:"48,000+", label:"Orders Pooled" },
    { value:"30%", label:"Avg Discount" },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr", overflow:"hidden" }}>
      {/* Left — hero panel */}
      <div style={{ position:"relative", background:"radial-gradient(ellipse at 20% 50%, rgba(79,124,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,92,252,0.15) 0%, transparent 50%), var(--background)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 56px", overflow:"hidden" }}>
        {/* Dot pattern bg */}
        <div className="dot-pattern" style={{ position:"absolute", inset:0, opacity:0.4 }} />

        {/* Floating orbs */}
        <div style={{ position:"absolute", top:"10%", right:"5%", width:300, height:300, background:"radial-gradient(circle, rgba(79,124,255,0.12) 0%, transparent 70%)", borderRadius:"50%", animation:"float 8s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"15%", left:"10%", width:200, height:200, background:"radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)", borderRadius:"50%", animation:"float 6s ease-in-out infinite 2s" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          {/* Logo */}
          <div style={{ marginBottom:56, animation:"fadeUp 0.6s ease" }}>
            <Logo size={52} textSize={28} />
          </div>

          {/* Headline */}
          <div style={{ animation:"fadeUp 0.6s ease 0.1s both" }}>
            <h1 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:52, fontWeight:900, lineHeight:1.1, marginBottom:20, letterSpacing:"-2px" }}>
              <span style={{ color:"var(--text)" }}>Pool Orders.</span><br/>
              <span style={{ background:"linear-gradient(135deg,#4f7cff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Save Together.</span>
            </h1>
            <p style={{ fontSize:17, color:"var(--text-muted)", lineHeight:1.7, maxWidth:420, marginBottom:48 }}>
              Join India's largest collaborative wholesale network. Pool bulk orders with nearby shop owners and unlock savings of up to 30% on every purchase.
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:52, animation:"fadeUp 0.6s ease 0.2s both" }}>
            {[
              { icon: IcHandshake, label:"Shop Pooling" },
              { icon: IcDollar, label:"Bulk Discounts" },
              { icon: IcPackage, label:"Smart Tracking" },
              { icon: IcChat, label:"Real-time Chat" },
              { icon: IcShield, label:"Secure Access" }
            ].map(({ icon: Icon, label }) => (
              <span key={label} style={{ padding:"8px 16px", background:"rgba(79,124,255,0.08)", border:"1px solid rgba(79,124,255,0.2)", borderRadius:24, fontSize:13, color:"var(--text-muted)", fontWeight:500, display:"inline-flex", alignItems:"center", gap:8 }}>
                <Icon size={14} color="#8fb0ff" />
                {label}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, animation:"fadeUp 0.6s ease 0.3s both" }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:"var(--text)", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{s.value}</div>
                <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:3, fontWeight:500, letterSpacing:"0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — auth choice panel */}
      <div style={{ background:"var(--background)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 56px", position:"relative" }}>
        <div style={{ width:"100%", maxWidth:400, animation:"fadeUp 0.6s ease 0.2s both" }}>
          <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:32, fontWeight:800, color:"var(--text)", marginBottom:8, textAlign:"center" }}>Get Started</h2>
          <p style={{ color:"var(--text-muted)", fontSize:14, textAlign:"center", marginBottom:48 }}>Join thousands of shop owners saving together</p>

          {/* Primary CTA - Create Account */}
          <button
            className="btn btn-primary"
            onClick={() => setScreen("register-choice")}
            onMouseEnter={() => setHovered("create")}
            onMouseLeave={() => setHovered(null)}
            style={{ width:"100%", padding:"18px 24px", fontSize:16, fontWeight:700, marginBottom:16, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
          >
            <IcUser size={18} color="#ffffff" />
            Create Account
            <span style={{ marginLeft:"auto", opacity:0.7, fontSize:12 }}>Free →</span>
          </button>

          {/* Secondary CTA - Sign In */}
          <button
            className="btn"
            onClick={() => setScreen("login")}
            style={{ width:"100%", padding:"17px 24px", fontSize:15, fontWeight:600, background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.8)", borderRadius:16, marginBottom:48, display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}
          >
            Sign In to Your Account
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize:12, color:"rgba(164,196,255,0.3)", fontWeight:500 }}>TRUSTED BY</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
          </div>

          {/* Social proof avatars */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
            <div style={{ display:"flex" }}>
              {["R","P","A","M","S"].map((l,i) => (
                <div key={i} className="avatar" style={{ width:36, height:36, background:`hsl(${i*60+200},70%,55%)`, fontSize:13, marginLeft:i>0?-10:0, border:"2px solid #060b14" }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>2,400+ shop owners</div>
              <div style={{ fontSize:12, color:"rgba(164,196,255,0.4)" }}>across 120+ cities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── LOGIN ────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
const lblStyle = { display:"block", fontSize:10, fontWeight:700, color:"rgba(148,176,220,0.55)", marginBottom:7, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" };

function LoginScreen({ setScreen, setCurrentUser, showToast }) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep] = useState(1); // 1: credentials, 2: OTP
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [foundUser, setFoundUser] = useState(null);

  const sendOtp = async () => {
    if (!form.email || !form.password) { showToast("Please fill all fields", "error"); return; }
    setLoading(true);
    try {
      // Use local demo data instead of API call
      const user = _users.find(u => u.email === form.email && u.password === form.password);
      
      if (user) {
        setFoundUser(user);
        showToast(`OTP sent to ${form.email}`, "success");
        setStep(2);
        setResendTimer(60);
      } else {
        showToast("Invalid credentials. Try rajesh@shop.com / pass123", "error");
      }
    } catch (err) {
      showToast("Login failed. Please try again.", "error");
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) { showToast("Enter OTP", "error"); return; }
    setLoading(true);
    try {
      // Simulate OTP verification - accept any 6-digit OTP
      if (otp.length === 6) {
        localStorage.setItem("token", "demo-token-" + Date.now());
        _session = foundUser;
        setCurrentUser(foundUser);
        setScreen(foundUser.role === "admin" ? "admin-dashboard" : "dashboard");
        showToast(`Welcome back, ${foundUser.ownerName}!`);
      } else {
        showToast("Invalid OTP. Enter 6 digits", "error");
      }
    } catch (err) {
      showToast("OTP verification failed", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(r=>r-1), 1000); return () => clearTimeout(t); }
  }, [resendTimer]);

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"radial-gradient(ellipse at 25% 25%, rgba(79,124,255,0.08) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(124,92,252,0.06) 0%, transparent 55%), var(--background)", position:"relative", overflow:"hidden" }}>
      <div className="dot-pattern" style={{ position:"absolute", inset:0, opacity:0.3 }} />
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:700, height:700, background:"radial-gradient(circle,rgba(79,124,255,0.06) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:420, position:"relative", animation:"fadeUp 0.5s ease" }}>
        {/* Back button */}
        <button className="btn btn-ghost" onClick={() => setScreen("auth-landing")} style={{ marginBottom:24, fontSize:13, padding:"8px 0" }}>
          <IcArrowLeft size={16} /> Back
        </button>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40, display:"flex", justifyContent:"center" }}>
          <Logo size={44} textSize={26} />
        </div>

        <div className="card-glow" style={{ padding:40, textAlign:"center" }}>
          {step === 1 ? (
            <>
              <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:26, fontWeight:800, color:"var(--text)", marginBottom:6 }}>Welcome back</h2>
              <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:32 }}>Sign in to your shop dashboard</p>

              <div style={{ display:"flex", flexDirection:"column", gap:18, textAlign:"left" }}>
                <div>
                  <label style={lblStyle}>Email Address</label>
                  <div className="inp-icon">
                    <span className="icon"><IcMail size={16} color="currentColor" /></span>
                    <input className="inp" type="email" placeholder="owner@yourshop.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <label style={{...lblStyle, marginBottom:0}}>Password</label>
                    <span style={{ fontSize:12, color:"var(--primary)", cursor:"pointer", fontWeight:500 }}>Forgot?</span>
                  </div>
                  <div style={{ position:"relative" }}>
                    <input className="inp" type={showPwd?"text":"password"} placeholder="••••••••••" value={form.password} onChange={e => setForm({...form, password:e.target.value})} onKeyDown={e => e.key==="Enter" && sendOtp()} style={{ paddingRight:48 }} />
                    <button onClick={() => setShowPwd(!showPwd)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", display:"flex", alignItems:"center" }}>{showPwd ? <IcEyeOff size={16} color="currentColor" /> : <IcEye size={16} color="currentColor" />}</button>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={sendOtp} disabled={loading} style={{ padding:"15px", fontSize:15, fontWeight:700, marginTop:4, borderRadius:14, width:"100%" }}>
                  {loading ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Sending OTP…</span> : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>Send OTP <IcArrowRight size={16} color="#ffffff" /></span>}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:26, fontWeight:800, color:"var(--text)", marginBottom:6 }}>Verify OTP</h2>
              <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:32 }}>Enter the 6-digit code sent to {form.email}</p>

              <div style={{ marginBottom:24 }}>
                <OtpInput value={otp} onChange={setOtp} />
              </div>

              <button className="btn btn-primary" onClick={verifyOtp} disabled={loading || otp.length !== 6} style={{ padding:"15px", fontSize:15, fontWeight:700, marginTop:4, borderRadius:14, width:"100%" }}>
                {loading ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Verifying…</span> : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>Verify & Sign In <IcCheckCircle size={16} color="#ffffff" /></span>}
              </button>

              <div style={{ marginTop:20, fontSize:13, color:"var(--text-muted)" }}>
                {resendTimer > 0 ? <span>Resend in {resendTimer}s</span> : <span style={{ color:"var(--primary)", cursor:"pointer" }} onClick={sendOtp}>Resend OTP</span>}
              </div>

              <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ marginTop:16, fontSize:13 }}>
                <IcArrowLeft size={14} /> Back to login
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <div className="divider" style={{ margin:"24px 0" }} />
              <p style={{ textAlign:"center", color:"var(--text-muted)", fontSize:13 }}>
                Don't have an account?{" "}
                <span style={{ color:"var(--primary)", cursor:"pointer", fontWeight:600 }} onClick={() => setScreen("register-choice")}>Create one free</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── REGISTER CHOICE (Role Selection) ─────────────────────────────
// ════════════════════════════════════════════════════════════════════
function RegisterChoiceScreen({ setScreen }) {
  const [hovered, setHovered] = useState(null);
  const roles = [
    { id:"register-owner", icon: IcStore, title:"Shop Owner", subtitle:"Retail / Kirana Store", desc:"I own a retail shop and want to pool bulk orders with nearby stores to save on wholesale purchases.", perks:["Browse & pool bulk orders","Connect with nearby shops","Real-time savings tracker","Group chat with partners"] },
    { id:"register-wholesale", icon: IcBuilding, title:"Wholesale Seller", subtitle:"Distributor / Manufacturer", desc:"I supply goods in bulk and want to list my products, manage wholesale buyers, and grow my distribution network.", perks:["List products at bulk prices","Manage buyer orders","Analytics & revenue tools","Priority buyer matching"] },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"radial-gradient(ellipse at 50% 0%, rgba(79,124,255,0.1) 0%, transparent 60%), var(--background)" }}>
      <div style={{ width:"100%", maxWidth:860, animation:"fadeUp 0.5s ease" }}>
        <button className="btn btn-ghost" onClick={() => setScreen("auth-landing")} style={{ marginBottom:32, fontSize:13, padding:"8px 0" }}><IcArrowLeft size={16} /> Back</button>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ display:"inline-flex", alignItems:"center", marginBottom:16 }}>
            <Logo size={44} textSize={24} />
          </div>
          <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:36, fontWeight:900, color:"#fff", marginBottom:10, letterSpacing:"-1px" }}>Choose your account type</h2>
          <p style={{ color:"rgba(164,196,255,0.5)", fontSize:16 }}>Select the option that best describes your business</p>
        </div>

        {/* Role cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:32 }}>
          {roles.map(r => (
            <div key={r.id} onClick={() => setScreen(r.id)} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered(null)}
              style={{ padding:36, borderRadius:24, border:`2px solid ${hovered===r.id?"rgba(79,124,255,0.5)":"rgba(30,48,80,0.6)"}`, background: hovered===r.id ? "rgba(79,124,255,0.06)" : "rgba(14,24,41,0.6)", cursor:"pointer", transition:"all 0.25s", transform:hovered===r.id?"translateY(-4px)":"translateY(0)", boxShadow:hovered===r.id?"0 20px 60px rgba(79,124,255,0.15)":"none", backdropFilter:"blur(12px)" }}>
              <div style={{ marginBottom:20, width:56, height:56, borderRadius:18, background:"rgba(79,124,255,0.08)", border:"1px solid rgba(79,124,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}><r.icon size={30} color="#8fb0ff" /></div>
              <div style={{ marginBottom:6 }}>
                <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:800, color:"#fff", marginBottom:2 }}>{r.title}</h3>
                <span style={{ fontSize:12, color:"rgba(79,124,255,0.8)", fontWeight:600, letterSpacing:"0.5px" }}>{r.subtitle}</span>
              </div>
              <p style={{ color:"rgba(164,196,255,0.55)", fontSize:14, lineHeight:1.6, marginBottom:24 }}>{r.desc}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {r.perks.map(p => (
                  <div key={p} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"rgba(164,196,255,0.7)" }}>
                    <span style={{ width:20, height:20, background:"rgba(52,211,153,0.12)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><IcCheck size={12} color="#34d399" /></span>
                    {p}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width:"100%", marginTop:28, padding:"13px", fontWeight:700, fontSize:14, borderRadius:14 }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>Continue as {r.title} <IcArrowRight size={16} color="#ffffff" /></span>
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign:"center", color:"rgba(164,196,255,0.4)", fontSize:13 }}>
          Already have an account?{" "}
          <span style={{ color:"#7c9cff", cursor:"pointer", fontWeight:600 }} onClick={() => setScreen("login")}>Sign In</span>
        </p>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── OTP INPUT COMPONENT ──────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function OtpInput({ value, onChange, length = 6 }) {
  const refs = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);
  const handle = (i, e) => {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = digits.map((d,j) => j===i ? v : d);
    onChange(arr.join(""));
    if (v && i < length-1) refs.current[i+1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key==="Backspace" && !digits[i] && i>0) refs.current[i-1]?.focus();
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(paste.padEnd(length, "").slice(0, length));
    refs.current[Math.min(paste.length, length-1)]?.focus();
    e.preventDefault();
  };
  return (
    <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
      {digits.map((d,i) => (
        <input key={i} ref={el => refs.current[i]=el} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handle(i, e)} onKeyDown={e => handleKey(i, e)} onPaste={i===0 ? handlePaste : undefined}
          style={{ width:52, height:58, textAlign:"center", fontSize:24, fontWeight:700, background:"rgba(6,11,20,0.9)", border:`2px solid ${d?"rgba(79,124,255,0.6)":"rgba(30,48,80,0.8)"}`, borderRadius:14, color:"#fff", outline:"none", transition:"all 0.2s", boxShadow:d?"0 0 0 4px rgba(79,124,255,0.1)":"none", caretColor:"#4f7cff" }} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ─── REGISTER — SHOP OWNER ────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function RegisterOwnerScreen({ setScreen, showToast }) {
  const [step, setStep] = useState(1); // 1:Personal, 2:Shop, 3:Documents, 4:OTP, 5:Done
  const [form, setForm] = useState({ ownerName:"", email:"", phone:"", password:"", confirmPassword:"", shopName:"", location:"", category:"", gstNumber:"", aadharNumber:"", tradeLicense:"" });
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const sendOtp = async () => {
    if (!form.email) { showToast("Enter your email first", "error"); return; }
    setLoading(true);
    try {
      // Simulate OTP sending for demo
      showToast(`OTP sent to ${form.email}`, "success");
      setStep(3);
      setResendTimer(60);
    } catch (err) {
      showToast("Failed to send OTP", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(r=>r-1), 1000); return () => clearTimeout(t); }
  }, [resendTimer]);

  const verifyAndRegister = async () => {
    if (!otp.trim()) { showToast("Enter any OTP value", "error"); return; }
    setLoading(true);
    try {
      // Simulate registration for demo
      const newUser = {
        id: _users.length + 1,
        ownerName: form.ownerName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        shopName: form.shopName,
        location: form.location,
        category: form.category,
        totalSavings: 0,
        orders: 0,
        collaborations: 0,
        role: "owner",
        joinDate: new Date().toLocaleDateString("en-IN",{month:"short",year:"numeric"}),
        loyaltyPoints: 0,
        loyaltyTier: "bronze"
      };
      _users.push(newUser);
      setStep(5);
      showToast("Account created successfully.");
    } catch { showToast("Registration failed", "error"); }
    setLoading(false);
  };

  const totalSteps = 4;
  const progress = ((step - 1) / totalSteps) * 100;

  if (step === 5) return <RegisterSuccessScreen onLogin={() => setScreen("login")} accountType="Shop Owner" />;

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"radial-gradient(ellipse at 50% 0%, rgba(79,124,255,0.08) 0%, transparent 60%), var(--background)" }}>
      <div style={{ width:"100%", maxWidth:520, animation:"fadeUp 0.5s ease" }}>
        <button className="btn btn-ghost" onClick={() => step>1 ? setStep(step-1) : setScreen("register-choice")} style={{ marginBottom:24, fontSize:13, padding:"8px 0" }}><IcArrowLeft size={16} /> Back</button>

        {/* Logo + title */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(79,124,255,0.08)", border:"1px solid rgba(79,124,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}><IcStore size={20} color="#8fb0ff" /></div>
          <div>
            <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:22, fontWeight:800, color:"#fff", lineHeight:1 }}>Shop Owner Registration</h2>
            <p style={{ color:"rgba(164,196,255,0.4)", fontSize:12, marginTop:2 }}>Step {Math.min(step,totalSteps)} of {totalSteps}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:4, background:"rgba(30,48,80,0.6)", borderRadius:4, marginBottom:32, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#4f7cff,#7c5cfc)", width:`${progress}%`, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius:4 }} />
        </div>

        <div className="card-glow" style={{ padding:40 }}>

          {/* STEP 1 — Personal Info */}
          {step === 1 && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Personal Details</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:28 }}>Your basic contact information</p>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[["ownerName","Full Name","text","Rajesh Kumar"],["email","Email Address","email","rajesh@yourshop.com"],["phone","Phone Number","tel","+91 98765 43210"]].map(([k,l,t,p]) => (
                  <div key={k}><label style={lblStyle}>{l}</label><input className="inp" type={t} placeholder={p} value={form[k]} onChange={e=>f(k,e.target.value)} /></div>
                ))}
                <div>
                  <label style={lblStyle}>Password</label>
                  <input className="inp" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e=>f("password",e.target.value)} />
                </div>
                <div>
                  <label style={lblStyle}>Confirm Password</label>
                  <input className="inp" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e=>f("confirmPassword",e.target.value)} />
                </div>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14 }} onClick={() => {
                if (!form.ownerName||!form.email||!form.phone||!form.password) { showToast("Please fill all fields","error"); return; }
                if (form.password !== form.confirmPassword) { showToast("Passwords don't match","error"); return; }
                if (form.password.length < 8) { showToast("Password must be at least 8 characters","error"); return; }
                setStep(2);
              }}>Continue →</button>
            </div>
          )}

          {/* STEP 2 — Shop Info */}
          {step === 2 && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Shop Information</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:28 }}>Tell us about your business</p>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div><label style={lblStyle}>Shop Name</label><input className="inp" placeholder="Rajesh General Store" value={form.shopName} onChange={e=>f("shopName",e.target.value)} /></div>
                <div><label style={lblStyle}>Location / Area</label><input className="inp" placeholder="MG Road, Pune" value={form.location} onChange={e=>f("location",e.target.value)} /></div>
                <div>
                  <label style={lblStyle}>Business Category</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
                    {CATEGORIES.filter(c=>c!=="All").map(c=>(
                      <div key={c} onClick={()=>f("category",c)} style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${form.category===c?"rgba(79,124,255,0.6)":"rgba(30,48,80,0.8)"}`, background:form.category===c?"rgba(79,124,255,0.12)":"transparent", color:form.category===c?"#7c9cff":"rgba(164,196,255,0.4)", cursor:"pointer", fontSize:13, fontWeight:500, transition:"all 0.2s" }}>{c}</div>
                    ))}
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14 }} onClick={() => {
                if (!form.shopName||!form.location||!form.category) { showToast("Please fill all fields","error"); return; }
                setStep(3);
              }}>Continue →</button>
            </div>
          )}

          {/* STEP 3 — Documents */}
          {step === 3 && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Business Verification</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:8 }}>Your documents are encrypted and secure</p>
              <div style={{ background:"rgba(79,124,255,0.06)", border:"1px solid rgba(79,124,255,0.15)", borderRadius:12, padding:"12px 16px", marginBottom:24, fontSize:13, color:"rgba(164,196,255,0.6)", display:"flex", alignItems:"center", gap:10 }}>
                <IcLock size={16} color="#8fb0ff" /> All data is encrypted and only used for verification
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={lblStyle}>GST Number <span style={{ color:"rgba(164,196,255,0.3)", fontSize:10 }}>(Optional)</span></label>
                  <input className="inp" placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={e=>f("gstNumber",e.target.value.toUpperCase())} style={{ letterSpacing:"1px" }} />
                </div>
                <div>
                  <label style={lblStyle}>Aadhaar Number <span style={{ color:"rgba(248,113,113,0.7)", fontSize:10 }}>*Required</span></label>
                  <input className="inp" placeholder="XXXX XXXX XXXX" value={form.aadharNumber} onChange={e=>f("aadharNumber",e.target.value)} />
                </div>
                <div>
                  <label style={lblStyle}>Trade License / Shop Act No. <span style={{ color:"rgba(164,196,255,0.3)", fontSize:10 }}>(Optional)</span></label>
                  <input className="inp" placeholder="TL/2024/XXXXXX" value={form.tradeLicense} onChange={e=>f("tradeLicense",e.target.value.toUpperCase())} />
                </div>
                <div style={{ background:"rgba(251,191,36,0.05)", border:"1px solid rgba(251,191,36,0.15)", borderRadius:12, padding:"12px 16px", fontSize:12, color:"rgba(251,191,36,0.7)", lineHeight:1.6 }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><IcAlertTriangle size={14} color="#fbbf24" /> Providing accurate documents helps you get verified status and unlocks higher bulk purchase limits.</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14 }} onClick={() => {
                if (!form.aadharNumber) { showToast("Aadhaar number is required","error"); return; }
                sendOtp();
              }} disabled={loading}>
                {loading ? "Sending OTP…" : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><IcMail size={16} color="#ffffff" /> Send OTP to Email</span>}
              </button>
            </div>
          )}

          {/* STEP 4 — OTP */}
          {step === 4 && (
            <div style={{ animation:"fadeUp 0.3s ease", textAlign:"center" }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}><IcMail size={40} color="#7c9cff" /></div>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Verify Your Email</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:14, marginBottom:8 }}>We've sent a 6-digit code to</p>
              <p style={{ color:"#7c9cff", fontWeight:700, marginBottom:32 }}>{form.email}</p>
              <OtpInput value={otp} onChange={setOtp} />
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14 }} onClick={verifyAndRegister} disabled={loading||!otp.trim()}>
                {loading ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Verifying…</span> : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><IcCheckCircle size={16} color="#ffffff" /> Verify & Create Account</span>}
              </button>
              <div style={{ marginTop:20, fontSize:13, color:"rgba(164,196,255,0.4)" }}>
                {resendTimer > 0 ? <span>Resend in {resendTimer}s</span> : <span style={{ color:"#7c9cff", cursor:"pointer" }} onClick={sendOtp}>Resend OTP</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── REGISTER — WHOLESALE SELLER ──────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function RegisterWholesaleScreen({ setScreen, showToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ownerName:"", email:"", phone:"", password:"", confirmPassword:"", companyName:"", location:"", category:"", gstNumber:"", panNumber:"", fssaiNumber:"", businessType:"", yearsInBusiness:"", bankAccountNumber:"", ifscCode:"", annualTurnover:"" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const sendOtp = async () => {
    setLoading(true);
    try {
      // Simulate OTP sending for demo
      showToast(`OTP sent to ${form.email}`);
      setStep(4);
      setResendTimer(60);
    } catch { showToast("Failed to send OTP", "error"); }
    setLoading(false);
  };

  useEffect(() => {
    if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(r=>r-1), 1000); return () => clearTimeout(t); }
  }, [resendTimer]);

  const verifyAndRegister = async () => {
    if (!otp.trim()) { showToast("Enter any OTP value","error"); return; }
    setLoading(true);
    try {
      // Simulate registration for demo
      const newUser = {
        id: _users.length + 1,
        ownerName: form.ownerName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        shopName: form.companyName,
        location: form.location,
        category: form.category,
        totalSavings: 0,
        orders: 0,
        collaborations: 0,
        role: "wholesale",
        joinDate: new Date().toLocaleDateString("en-IN",{month:"short",year:"numeric"}),
        loyaltyPoints: 0,
        loyaltyTier: "bronze"
      };
      _users.push(newUser);
      setStep(5);
      showToast("Wholesale account created.");
    } catch { showToast("Registration failed","error"); }
    setLoading(false);
  };

  const totalSteps = 4;
  const progress = ((step - 1) / totalSteps) * 100;
  if (step === 5) return <RegisterSuccessScreen onLogin={() => setScreen("login")} accountType="Wholesale Seller" />;

  const businessTypes = ["Manufacturer","Distributor","Importer","Wholesaler","C&F Agent","Exporter"];

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", background:"radial-gradient(ellipse at 50% 0%, rgba(124,92,252,0.1) 0%, transparent 60%), var(--background)" }}>
      <div style={{ width:"100%", maxWidth:560, animation:"fadeUp 0.5s ease" }}>
        <button className="btn btn-ghost" onClick={() => step>1 ? setStep(step-1) : setScreen("register-choice")} style={{ marginBottom:24, fontSize:13, padding:"8px 0" }}><IcArrowLeft size={16} /> Back</button>

        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(124,92,252,0.08)", border:"1px solid rgba(124,92,252,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}><IcBuilding size={20} color="#b59cff" /></div>
          <div>
            <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:22, fontWeight:800, color:"#fff", lineHeight:1 }}>Wholesale Seller Registration</h2>
            <p style={{ color:"rgba(164,196,255,0.4)", fontSize:12, marginTop:2 }}>Step {Math.min(step,totalSteps)} of {totalSteps}</p>
          </div>
        </div>

        <div style={{ height:4, background:"rgba(30,48,80,0.6)", borderRadius:4, marginBottom:32, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#7c5cfc,#a78bfa)", width:`${progress}%`, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius:4 }} />
        </div>

        <div className="card-glow" style={{ padding:40, border:"1px solid rgba(124,92,252,0.25)" }}>

          {/* STEP 1 — Personal Info */}
          {step === 1 && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Your Details</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:28 }}>Primary contact information</p>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[["ownerName","Your Full Name","text","Amit Verma"],["email","Business Email","email","amit@company.com"],["phone","Mobile Number","tel","+91 98765 43210"]].map(([k,l,t,p])=>(
                  <div key={k}><label style={lblStyle}>{l}</label><input className="inp" type={t} placeholder={p} value={form[k]} onChange={e=>f(k,e.target.value)} /></div>
                ))}
                <div><label style={lblStyle}>Password</label><input className="inp" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e=>f("password",e.target.value)} /></div>
                <div><label style={lblStyle}>Confirm Password</label><input className="inp" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e=>f("confirmPassword",e.target.value)} /></div>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14, background:"linear-gradient(135deg,#7c5cfc,#a78bfa)" }} onClick={() => {
                if (!form.ownerName||!form.email||!form.phone||!form.password) { showToast("Fill all fields","error"); return; }
                if (form.password !== form.confirmPassword) { showToast("Passwords don't match","error"); return; }
                if (form.password.length < 8) { showToast("Password too short","error"); return; }
                setStep(2);
              }}>Continue →</button>
            </div>
          )}

          {/* STEP 2 — Company Info */}
          {step === 2 && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Company Information</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:28 }}>Details about your wholesale business</p>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div><label style={lblStyle}>Company / Business Name</label><input className="inp" placeholder="Verma Trading Co." value={form.companyName} onChange={e=>f("companyName",e.target.value)} /></div>
                <div><label style={lblStyle}>Business Location</label><input className="inp" placeholder="APMC Market, Mumbai" value={form.location} onChange={e=>f("location",e.target.value)} /></div>
                <div>
                  <label style={lblStyle}>Product Category</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
                    {CATEGORIES.filter(c=>c!=="All").map(c=>(
                      <div key={c} onClick={()=>f("category",c)} style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${form.category===c?"rgba(124,92,252,0.6)":"rgba(30,48,80,0.8)"}`, background:form.category===c?"rgba(124,92,252,0.12)":"transparent", color:form.category===c?"#a78bfa":"rgba(164,196,255,0.4)", cursor:"pointer", fontSize:13, fontWeight:500, transition:"all 0.2s" }}>{c}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={lblStyle}>Business Type</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
                    {businessTypes.map(t=>(
                      <div key={t} onClick={()=>f("businessType",t)} style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${form.businessType===t?"rgba(124,92,252,0.6)":"rgba(30,48,80,0.8)"}`, background:form.businessType===t?"rgba(124,92,252,0.12)":"transparent", color:form.businessType===t?"#a78bfa":"rgba(164,196,255,0.4)", cursor:"pointer", fontSize:13, fontWeight:500, transition:"all 0.2s" }}>{t}</div>
                    ))}
                  </div>
                </div>
                <div><label style={lblStyle}>Years in Business</label><input className="inp" type="number" placeholder="5" value={form.yearsInBusiness} onChange={e=>f("yearsInBusiness",e.target.value)} /></div>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14, background:"linear-gradient(135deg,#7c5cfc,#a78bfa)" }} onClick={() => {
                if (!form.companyName||!form.location||!form.category||!form.businessType) { showToast("Fill all fields","error"); return; }
                setStep(3);
              }}>Continue →</button>
            </div>
          )}

          {/* STEP 3 — Legal Documents */}
          {step === 3 && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Legal & Financial Docs</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:8 }}>Required for wholesale seller verification</p>
              <div style={{ background:"rgba(124,92,252,0.06)", border:"1px solid rgba(124,92,252,0.15)", borderRadius:12, padding:"12px 16px", marginBottom:24, fontSize:13, color:"rgba(164,196,255,0.6)", display:"flex", alignItems:"center", gap:10 }}>
                <IcLock size={16} color="#b59cff" /> Encrypted and shared only with the compliance team
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={lblStyle}>GST Registration Number <span style={{ color:"rgba(248,113,113,0.7)", fontSize:10 }}>*Required</span></label>
                  <input className="inp" placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={e=>f("gstNumber",e.target.value.toUpperCase())} style={{ letterSpacing:"1px" }} />
                </div>
                <div>
                  <label style={lblStyle}>PAN Number <span style={{ color:"rgba(248,113,113,0.7)", fontSize:10 }}>*Required</span></label>
                  <input className="inp" placeholder="AAAAA9999A" value={form.panNumber} onChange={e=>f("panNumber",e.target.value.toUpperCase())} style={{ letterSpacing:"2px" }} />
                </div>
                <div>
                  <label style={lblStyle}>FSSAI License <span style={{ color:"rgba(164,196,255,0.3)", fontSize:10 }}>(Food businesses only)</span></label>
                  <input className="inp" placeholder="12345678901234" value={form.fssaiNumber} onChange={e=>f("fssaiNumber",e.target.value)} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div><label style={lblStyle}>Bank Account No.</label><input className="inp" placeholder="XXXXXXXXX" value={form.bankAccountNumber} onChange={e=>f("bankAccountNumber",e.target.value)} /></div>
                  <div><label style={lblStyle}>IFSC Code</label><input className="inp" placeholder="SBIN0001234" value={form.ifscCode} onChange={e=>f("ifscCode",e.target.value.toUpperCase())} style={{ letterSpacing:"1px" }} /></div>
                </div>
                <div>
                  <label style={lblStyle}>Annual Turnover (₹)</label>
                  <select className="inp" value={form.annualTurnover} onChange={e=>f("annualTurnover",e.target.value)}>
                    <option value="">Select range</option>
                    {["Under ₹10L","₹10L – ₹50L","₹50L – ₹1Cr","₹1Cr – ₹5Cr","Above ₹5Cr"].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14, background:"linear-gradient(135deg,#7c5cfc,#a78bfa)" }} onClick={() => {
                if (!form.gstNumber||!form.panNumber) { showToast("GST and PAN are required","error"); return; }
                sendOtp();
              }} disabled={loading}>
                {loading ? "Sending OTP…" : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><IcMail size={16} color="#ffffff" /> Verify via OTP</span>}
              </button>
            </div>
          )}

          {/* STEP 4 — OTP */}
          {step === 4 && (
            <div style={{ animation:"fadeUp 0.3s ease", textAlign:"center" }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}><IcMail size={40} color="#a78bfa" /></div>
              <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Verify Your Email</h3>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:14, marginBottom:8 }}>Enter the 6-digit code sent to</p>
              <p style={{ color:"#a78bfa", fontWeight:700, marginBottom:32 }}>{form.email}</p>
              <OtpInput value={otp} onChange={setOtp} />
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginTop:28, fontSize:15, fontWeight:700, borderRadius:14, background:"linear-gradient(135deg,#7c5cfc,#a78bfa)" }} onClick={verifyAndRegister} disabled={loading||!otp.trim()}>
                {loading ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Verifying…</span> : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><IcCheckCircle size={16} color="#ffffff" /> Create Wholesale Account</span>}
              </button>
              <div style={{ marginTop:20, fontSize:13, color:"rgba(164,196,255,0.4)" }}>
                {resendTimer > 0 ? <span>Resend in {resendTimer}s</span> : <span style={{ color:"#a78bfa", cursor:"pointer" }} onClick={sendOtp}>Resend OTP</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER SUCCESS ──────────────────────────────────────────────────────────
function RegisterSuccessScreen({ onLogin, accountType }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--background)", padding:24 }}>
      <div style={{ textAlign:"center", maxWidth:440, animation:"bounceIn 0.6s ease" }}>
        <div style={{ width:120, height:120, background:"radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)", border:"2px solid rgba(52,211,153,0.3)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", animation:"glowPulse 2s infinite" }}><IcCheckCircle size={52} color="#34d399" /></div>
        <h1 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:32, fontWeight:900, color:"#34d399", marginBottom:12 }}>Account Ready</h1>
        <p style={{ color:"rgba(164,196,255,0.6)", fontSize:16, marginBottom:8, lineHeight:1.6 }}>Your {accountType} account has been created successfully.</p>
        <p style={{ color:"rgba(164,196,255,0.4)", fontSize:14, marginBottom:40 }}>Sign in now to start using BulkBuy.</p>
        <button className="btn btn-primary" onClick={onLogin} style={{ padding:"15px 40px", fontSize:16, fontWeight:700, borderRadius:16 }}><span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>Sign In to Continue <IcArrowRight size={16} color="#ffffff" /></span></button>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── TOPBAR ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function TopBar({ user, setScreen, cart, logout, notifOpen, setNotifOpen }) {
  const unread = _notifications.filter(n=>!n.read).length;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background:scrolled?"rgba(6,11,20,0.95)":"rgba(6,11,20,0.8)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,48,80,0.4)", padding:"0 24px", position:"sticky", top:0, zIndex:200, transition:"all 0.3s" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={() => setScreen("dashboard")}>
          <Logo size={36} textSize={20} />
        </div>

        <nav style={{ display:"flex", gap:2, alignItems:"center" }}>
          {[
            [IcStore,"Browse","browse"],
            [IcPackage,"Orders","tracking"],
            [IcChat,"Chat","chat"],
            [IcHandshake,"Shops","shops"],
            [IcBarChart,"Analytics","analytics"]
          ].map(([Icon,label,sc]) => (
            <button key={sc} className="btn btn-ghost" style={{ padding:"8px 14px", fontSize:13, fontWeight:500, borderRadius:10, gap:6, display:"flex", alignItems:"center" }} onClick={() => setScreen(sc)}>
              <Icon size={14} color="currentColor" />{label}
            </button>
          ))}
        </nav>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* Notifications */}
          <div style={{ position:"relative" }}>
            <button className="btn btn-ghost" style={{ padding:"8px 12px", position:"relative", fontSize:18 }} onClick={() => setNotifOpen(!notifOpen)}>
              <IcBell size={18} color="currentColor" />
              {unread > 0 && <span style={{ position:"absolute", top:4, right:4, width:16, height:16, background:"#f87171", borderRadius:"50%", fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #060b14" }}>{unread}</span>}
            </button>
            {notifOpen && <NotifDropdown setNotifOpen={setNotifOpen} />}
          </div>

          {/* Cart */}
          <button className="btn btn-outline" style={{ padding:"8px 14px", position:"relative", fontSize:14, gap:6, display:"flex", alignItems:"center", borderRadius:12 }} onClick={() => setScreen("cart")}>
            <IcShoppingCart size={16} color="currentColor" />
            {cart?.length > 0 && <span style={{ background:"#4f7cff", color:"#fff", borderRadius:8, padding:"1px 6px", fontSize:11, fontWeight:700 }}>{cart.length}</span>}
          </button>

          {/* User avatar */}
          <div style={{ position:"relative", cursor:"pointer" }} onClick={() => setScreen("profile")}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${avatarColor(user?.ownerName||"U")},${avatarColor((user?.ownerName||"U")+"x")})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#fff", border:"2px solid rgba(79,124,255,0.3)", boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
              {initials(user?.ownerName||"U")}
            </div>
            <div style={{ position:"absolute", bottom:-1, right:-1, width:12, height:12, background:"#34d399", borderRadius:"50%", border:"2px solid #060b14" }} />
          </div>

          {/* Logout */}
          <button className="btn btn-ghost" style={{ padding:"8px", fontSize:16, color:"rgba(248,113,113,0.6)" }} onClick={logout} title="Sign out"><IcLogout size={16} color="currentColor" /></button>
        </div>
      </div>
    </div>
  );
}

function NotifDropdown({ setNotifOpen }) {
  return (
    <div className="card-glow fade-in" style={{ position:"absolute", top:"calc(100% + 8px)", right:-8, width:340, padding:0, zIndex:500, overflow:"hidden", border:"1px solid rgba(30,48,80,0.8)" }}>
      <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(30,48,80,0.6)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontWeight:700, fontSize:14 }}>Notifications</span>
        <span style={{ fontSize:11, color:"#4f7cff", cursor:"pointer", fontWeight:600 }} onClick={() => { _notifications.forEach(n=>n.read=true); setNotifOpen(false); }}>Mark all read</span>
      </div>
      {_notifications.map(n => (
        <div key={n.id} style={{ padding:"13px 18px", borderBottom:"1px solid rgba(15,30,53,0.4)", background:n.read?"transparent":"rgba(79,124,255,0.03)", display:"flex", gap:12, alignItems:"flex-start", cursor:"pointer", transition:"background 0.2s" }} onClick={() => { n.read=true; setNotifOpen(false); }} onMouseEnter={e=>e.currentTarget.style.background="rgba(79,124,255,0.06)"} onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(79,124,255,0.03)"}>
          <span style={{ marginTop:1, color:n.read?"rgba(164,196,255,0.45)":"#8fb0ff" }}><n.icon size={18} color="currentColor" /></span>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, color:n.read?"rgba(164,196,255,0.4)":"rgba(200,212,240,0.9)", lineHeight:1.5 }}>{n.msg}</p>
            <p style={{ fontSize:11, color:"rgba(42,58,85,0.8)", marginTop:3 }}>{n.time}</p>
          </div>
          {!n.read && <div style={{ width:7, height:7, borderRadius:"50%", background:"#4f7cff", flexShrink:0, marginTop:5 }} />}
        </div>
      ))}
    </div>
  );
}

function StatusTag({ status }) {
  const map = { Pending:"tag-amber", Approved:"tag-blue", Paid:"tag-purple", Shipped:"tag-cyan", Delivered:"tag-green", Rejected:"tag-red" };
  return <span className={`tag ${map[status]||"tag-blue"}`}>{status}</span>;
}


// ════════════════════════════════════════════════════════════════════
// ─── DASHBOARD ────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function DashboardScreen({ user, setScreen, setSelectedCategory, cart, logout, notifOpen, setNotifOpen, showToast, refresh }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [greeting, setGreeting] = useState("Good morning");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoadingRecs(true);
        // Use local demo data for recommendations
        const userCategory = user?.category || 'Grocery';
        const recommendations = _products
          .filter(p => p.category === userCategory)
          .slice(0, 4)
          .map(p => ({
            ...p,
            recommendationReason: 'Matches your business category'
          }));
        setRecommendations(recommendations);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoadingRecs(false);
      }
    };
    loadRecommendations();
  }, [user]);

  if (!user) return null;
  const myOrders = _orders.filter(o => o.shops.includes(user.shopName));
  const totalSaved = myOrders.filter(o=>o.status!=="Pending").reduce((s,o)=>s+o.saving, 0);
  const activeOrders = myOrders.filter(o=>!["Delivered","Rejected"].includes(o.status));
  const pendingCount = _notifications.filter(n=>!n.read).length;

  const statCards = [
    { label:"Total Savings", value:fmt(totalSaved||user.totalSavings||0), icon: IcDollar, color:"#34d399", bg:"rgba(52,211,153,0.08)", border:"rgba(52,211,153,0.2)", sub:"All time" },
    { label:"Active Orders", value:activeOrders.length, icon: IcPackage, color:"#4f7cff", bg:"rgba(79,124,255,0.08)", border:"rgba(79,124,255,0.2)", sub:`${myOrders.length} total` },
    { label:"Collaborations", value:user.collaborations||0, icon: IcHandshake, color:"#a78bfa", bg:"rgba(167,139,250,0.08)", border:"rgba(167,139,250,0.2)", sub:"Partner shops" },
    { label:"Loyalty Points", value:user.loyaltyPoints||0, icon: IcStar, color:"#fbbf24", bg:"rgba(251,191,36,0.08)", border:"rgba(251,191,36,0.2)", sub:`${user.loyaltyTier||'Bronze'} tier` },
  ];

  const tabs = [
    { id:"overview", label:"Overview", icon: IcBarChart },
    { id:"orders", label:"Orders", icon: IcPackage },
    { id:"pool", label:"Pool Activity", icon: IcLayers },
    { id:"notifications", label:"Notifications", icon: IcBell, badge:pendingCount },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>

        {/* Welcome hero */}
        <div style={{ position:"relative", background:"linear-gradient(135deg,rgba(14,24,41,0.9) 0%,rgba(10,18,32,0.95) 100%)", border:"1px solid rgba(30,48,80,0.5)", borderRadius:24, padding:"32px 36px", marginBottom:28, overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, background:"radial-gradient(circle,rgba(79,124,255,0.1) 0%,transparent 70%)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", bottom:-60, left:-40, width:200, height:200, background:"radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%)", borderRadius:"50%" }} />
          <div className="dot-pattern" style={{ position:"absolute", inset:0, opacity:0.2 }} />

          <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:20 }}>
            <div>
              <p style={{ color:"rgba(164,196,255,0.5)", fontSize:14, marginBottom:6 }}>{greeting}</p>
              <h1 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:30, fontWeight:900, color:"#fff", marginBottom:8, letterSpacing:"-1px" }}>{user.shopName}</h1>
              <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}><IcMapPin size={14} color="#7c9cff" /> {user.location} · Member since {user.joinDate}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span className="tag tag-green"><IcCheck size={12} color="#22c55e" /> Verified Shop</span>
                {user.category && <span className="tag tag-blue">{user.category}</span>}
                {user.role === "wholesale" && <span className="tag tag-purple"><IcBuilding size={12} color="#8b5cf6" /> Wholesale Seller</span>}
                <span className="tag tag-amber"><IcUsers size={12} color="#eab308" /> {user.collaborations||0} Collabs</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <button className="btn btn-primary" onClick={() => setScreen("browse")} style={{ padding:"12px 22px", fontSize:14, fontWeight:700, gap:8, display:"flex", alignItems:"center" }}>
                <IcShoppingCart size={16} color="#ffffff" /> Browse Products
              </button>
              <button className="btn btn-outline" onClick={() => setScreen("shops")} style={{ padding:"12px 22px", fontSize:14 }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><IcHandshake size={16} color="currentColor" /> Connect Shops</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:18, marginBottom:32 }}>
          {statCards.map((s,i) => (
            <div key={i} className="hover-lift" style={{ padding:24, borderRadius:20, background:s.bg, border:`1px solid ${s.border}`, animation:`fadeUp 0.5s ease ${i*0.07}s both`, cursor:"default" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <span style={{ color:s.color }}><s.icon size={24} color="currentColor" /></span>
                <span style={{ fontSize:11, color:"rgba(164,196,255,0.4)", fontWeight:500 }}>{s.sub}</span>
              </div>
              <div style={{ fontSize:30, fontWeight:900, color:s.color, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", marginBottom:4, animation:`countUp 0.5s ease ${i*0.1+0.3}s both` }}>{s.value}</div>
              <div style={{ fontSize:13, color:"rgba(164,196,255,0.5)", fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick action banner */}
        <div style={{ background:"linear-gradient(135deg,rgba(79,124,255,0.1),rgba(124,92,252,0.08))", border:"1px solid rgba(79,124,255,0.2)", borderRadius:16, padding:"16px 24px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <IcTrendUp size={22} color="#8fb0ff" />
            <div>
              <p style={{ fontWeight:700, color:"#c8d4f0", fontSize:14 }}>Rice pool is 86% complete!</p>
              <p style={{ color:"rgba(164,196,255,0.5)", fontSize:12 }}>70kg more needed to unlock 21% bulk discount</p>
            </div>
          </div>
          <button className="btn btn-primary" style={{ padding:"9px 20px", fontSize:13, fontWeight:700 }} onClick={() => setScreen("browse")}><span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>Join Pool <IcArrowRight size={14} color="#ffffff" /></span></button>
        </div>

        {/* Product Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:"#c8d4f0", display:"flex", alignItems:"center", gap:8 }}><IcStar size={16} color="#fbbf24" /> Recommended for You</h3>
              <button className="btn btn-ghost" style={{ fontSize:12, padding:"6px 12px" }} onClick={() => setScreen("browse")}>View all</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
              {recommendations.slice(0, 4).map(product => (
                <div key={product._id} className="hover-lift" style={{ borderRadius:16, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:16, cursor:"pointer" }} onClick={() => { setSelectedProduct(product); setScreen("product"); }}>
                  <div style={{ width:"100%", height:120, background:"rgba(10,18,32,0.8)", borderRadius:12, marginBottom:12, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    ) : (
                      <IcPackage size={32} color="rgba(164,196,255,0.3)" />
                    )}
                  </div>
                  <h4 style={{ fontSize:13, fontWeight:600, color:"#c8d4f0", marginBottom:4, lineHeight:1.3 }}>{product.name}</h4>
                  <p style={{ fontSize:11, color:"rgba(164,196,255,0.4)", marginBottom:8 }}>{product.category}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#34d399" }}>₹{product.price}</span>
                    <span className="tag tag-amber" style={{ fontSize:10 }}>{product.recommendationReason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, marginBottom:24, background:"rgba(10,18,32,0.8)", borderRadius:14, padding:4, width:"fit-content", border:"1px solid rgba(30,48,80,0.4)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding:"9px 18px", borderRadius:11, border:"none", background:activeTab===t.id?"linear-gradient(135deg,#4f7cff,#7c5cfc)":"transparent", color:activeTab===t.id?"#fff":"rgba(164,196,255,0.4)", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s", fontFamily:"inherit", position:"relative" }}>
              <t.icon size={14} color="currentColor" /> {t.label}
              {t.badge > 0 && <span style={{ background:"#f87171", color:"#fff", borderRadius:8, padding:"1px 5px", fontSize:10, fontWeight:700 }}>{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:24 }} className="fade-in">
            {/* Pool progress */}
            <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, backdropFilter:"blur(12px)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#c8d4f0", display:"flex", alignItems:"center", gap:8 }}><IcLayers size={16} color="#8fb0ff" /> Active Pool Orders</h3>
                <button className="btn btn-ghost" style={{ fontSize:12, padding:"6px 12px" }} onClick={() => setScreen("browse")}>Browse all</button>
              </div>
              {[...new Set(_poolCart.map(e=>e.productId))].map(pid => {
                const prod = _products.find(p=>(p._id||p.id)===pid||p.id===pid);
                if (!prod) return null;
                const total = _poolCart.filter(e=>e.productId===pid).reduce((s,e)=>s+e.qty, 0);
                const pct2 = Math.min((total/prod.bulkThreshold)*100, 100);
                const unlocked = total >= prod.bulkThreshold;
                return (
                  <div key={pid} style={{ marginBottom:20, padding:20, background:"rgba(6,11,20,0.6)", borderRadius:16, border:`1px solid ${unlocked?"rgba(52,211,153,0.2)":"rgba(30,48,80,0.4)"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                      <span style={{ fontSize:14, fontWeight:600, color:"#c8d4f0" }}>{prod.name}</span>
                      {unlocked ? <span className="tag tag-green"><IcCheck size={12} color="#22c55e" /> Unlocked</span> : <span className="tag tag-amber"><IcLoader size={12} color="#eab308" /> Pooling</span>}
                    </div>
                    <div className="progress-track" style={{ marginBottom:8 }}>
                      <div className="progress-fill" style={{ width:`${pct2}%`, background:unlocked?"linear-gradient(90deg,#34d399,#10b981)":"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(164,196,255,0.4)" }}>
                      <span>{total} / {prod.bulkThreshold} {prod.unit}</span>
                      <span style={{ color:unlocked?"#34d399":"#fbbf24", fontWeight:600 }}>
                        {unlocked ? `Save ${pct(prod.bulkPrice,prod.price)}%` : `${prod.bulkThreshold-total} more needed`}
                      </span>
                    </div>
                  </div>
                );
              })}
              {_products.length === 0 && <p style={{ color:"rgba(164,196,255,0.3)", fontSize:13, textAlign:"center", padding:"20px 0" }}>No active pools · Browse to join one</p>}
            </div>

            {/* Right col */}
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {/* Recent orders */}
              <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:24, backdropFilter:"blur(12px)" }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:18 }}>📋 Recent Orders</h3>
                {myOrders.slice(0,3).map(o => (
                  <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid rgba(15,30,53,0.4)" }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:"#7c9cff" }}>{o.id}</p>
                      <p style={{ fontSize:12, color:"rgba(164,196,255,0.4)", marginTop:2 }}>{o.product.slice(0,22)} · {o.date}</p>
                    </div>
                    <StatusTag status={o.status} />
                  </div>
                ))}
                {myOrders.length === 0 && <p style={{ color:"rgba(164,196,255,0.3)", fontSize:13 }}>No orders yet</p>}
                <button className="btn btn-ghost" style={{ width:"100%", marginTop:12, fontSize:13, padding:"9px" }} onClick={() => setActiveTab("orders")}>View all orders →</button>
              </div>

              {/* Savings chart placeholder */}
              <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"linear-gradient(135deg,rgba(52,211,153,0.05),rgba(14,24,41,0.7))", padding:24, backdropFilter:"blur(12px)" }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:16 }}>💰 Savings This Month</h3>
                <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
                  {[30,55,40,70,85,60,95,78,65,88,72,100].map((h,i) => (
                    <div key={i} style={{ flex:1, height:`${h}%`, background:`rgba(52,211,153,${0.15+h/200})`, borderRadius:"4px 4px 0 0", border:"1px solid rgba(52,211,153,0.2)", transition:"height 1s ease" }} />
                  ))}
                </div>
                <div style={{ marginTop:12, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, color:"rgba(164,196,255,0.3)" }}>Last 12 weeks</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#34d399" }}>{fmt(totalSaved||user.totalSavings||0)} saved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="fade-in" style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", overflow:"hidden" }}>
            <div style={{ padding:"18px 24px", borderBottom:"1px solid rgba(30,48,80,0.4)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0" }}>All Orders ({myOrders.length})</h3>
              <button className="btn btn-primary" style={{ padding:"8px 16px", fontSize:13 }} onClick={() => setScreen("browse")}>+ New Order</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"rgba(6,11,20,0.6)" }}>{["Order ID","Product","Qty","Shops","Savings","Status","Action"].map(h=><th key={h} style={{ padding:"12px 20px", textAlign:"left", fontSize:11, fontWeight:700, color:"rgba(164,196,255,0.3)", letterSpacing:"0.5px", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {myOrders.map(o => (
                    <tr key={o.id} style={{ borderBottom:"1px solid rgba(10,21,37,0.6)" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(79,124,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"14px 20px", fontSize:13, fontWeight:700, color:"#7c9cff" }}>{o.id}</td>
                      <td style={{ padding:"14px 20px", fontSize:13, color:"#c8d4f0" }}>{o.product}</td>
                      <td style={{ padding:"14px 20px", fontSize:13, color:"rgba(164,196,255,0.5)" }}>{o.qty}</td>
                      <td style={{ padding:"14px 20px", fontSize:13, color:"rgba(164,196,255,0.5)" }}>{o.shops.length}</td>
                      <td style={{ padding:"14px 20px", fontSize:13, color:"#34d399", fontWeight:600 }}>{fmt(o.saving)}</td>
                      <td style={{ padding:"14px 20px" }}><StatusTag status={o.status} /></td>
                      <td style={{ padding:"14px 20px" }}><button className="btn btn-outline" style={{ padding:"6px 14px", fontSize:12 }} onClick={() => setScreen("tracking")}>Track</button></td>
                    </tr>
                  ))}
                  {myOrders.length === 0 && <tr><td colSpan={7} style={{ padding:"40px", textAlign:"center", color:"rgba(164,196,255,0.3)", fontSize:14 }}>No orders yet. Browse products to get started.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "pool" && (
          <div className="fade-in" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:18 }}>
            {_poolCart.length === 0 && <p style={{ color:"rgba(164,196,255,0.3)", gridColumn:"1/-1", textAlign:"center", padding:"40px 0" }}>No active pools</p>}
            {[...new Set(_poolCart.map(e=>e.productId))].map(pid => {
              const prod = _products.find(p=>(p._id||p.id)===pid||p.id===pid);
              if (!prod) return null;
              const contribs = _poolCart.filter(e=>e.productId===pid);
              const total = contribs.reduce((s,e)=>s+e.qty, 0);
              const pct2 = Math.min((total/prod.bulkThreshold)*100, 100);
              return (
                <div key={pid} style={{ padding:24, borderRadius:20, border:`1px solid ${pct2>=100?"rgba(52,211,153,0.3)":"rgba(30,48,80,0.5)"}`, background:"rgba(14,24,41,0.7)", backdropFilter:"blur(12px)" }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>{prod.image||"📦"}</div>
                  <h3 style={{ fontWeight:700, color:"#c8d4f0", marginBottom:4 }}>{prod.name}</h3>
                  <p style={{ fontSize:12, color:"rgba(164,196,255,0.4)", marginBottom:16 }}>Bulk price: {fmt(prod.bulkPrice)} at {prod.bulkThreshold} {prod.unit}</p>
                  <div className="progress-track" style={{ marginBottom:8, height:10 }}>
                    <div className="progress-fill" style={{ width:`${pct2}%`, background:pct2>=100?"linear-gradient(90deg,#34d399,#10b981)":"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                  </div>
                  <div style={{ fontSize:12, color:"rgba(164,196,255,0.4)", marginBottom:16 }}>{total} / {prod.bulkThreshold} {prod.unit} — {Math.round(pct2)}% complete</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {contribs.map((c,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <div className="avatar" style={{ width:24, height:24, background:avatarColor(c.shopName), fontSize:10 }}>{initials(c.shopName)}</div>
                          <span style={{ color:"rgba(164,196,255,0.6)" }}>{c.shopName}</span>
                        </div>
                        <span style={{ color:"#4f7cff", fontWeight:600 }}>{c.qty} {prod.unit}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ width:"100%", marginTop:16, padding:"10px", fontSize:13, fontWeight:700 }} onClick={() => setScreen("browse")}>+ Join Pool</button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="fade-in" style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", overflow:"hidden" }}>
            {_notifications.map(n => (
              <div key={n.id} onClick={() => { n.read=true; refresh(); }} style={{ padding:"18px 24px", borderBottom:"1px solid rgba(15,30,53,0.4)", background:n.read?"transparent":"rgba(79,124,255,0.03)", display:"flex", gap:16, alignItems:"flex-start", cursor:"pointer", transition:"background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(79,124,255,0.05)"} onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(79,124,255,0.03)"}>
                <span style={{ marginTop:1, color:n.read?"rgba(164,196,255,0.45)":"#8fb0ff" }}><n.icon size={20} color="currentColor" /></span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, color:n.read?"rgba(164,196,255,0.4)":"rgba(200,212,240,0.9)", lineHeight:1.5 }}>{n.msg}</p>
                  <p style={{ fontSize:12, color:"rgba(42,58,85,0.8)", marginTop:4 }}>{n.time}</p>
                </div>
                {!n.read && <span className="tag tag-blue" style={{ fontSize:10 }}>New</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── BROWSE ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function BrowseScreen({ category, setSelectedCategory, setScreen, setSelectedProduct, addToCart, poolQty, currentUser, logout, cart, notifOpen, setNotifOpen }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const cat = category || "All";
  let prods = cat==="All" ? _products : _products.filter(p=>p.category===cat);
  if (search) prods = prods.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort==="price-asc") prods = [...prods].sort((a,b)=>a.price-b.price);
  if (sort==="price-desc") prods = [...prods].sort((a,b)=>b.price-a.price);
  if (sort==="discount") prods = [...prods].sort((a,b)=>pct(b.bulkPrice,b.price)-pct(a.bulkPrice,a.price));

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={currentUser||_session} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, flexWrap:"wrap", gap:14 }}>
          <div>
            <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-1px" }}>Browse Products</h2>
            <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginTop:4 }}>{prods.length} products available for pooling</p>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <div className="inp-icon" style={{ width:260 }}>
              <span className="icon" style={{ fontSize:14 }}>🔍</span>
              <input className="inp" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select className="inp" style={{ width:160 }} value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)} style={{ padding:"8px 18px", borderRadius:24, border:`1.5px solid ${cat===c?"rgba(79,124,255,0.6)":"rgba(30,48,80,0.5)"}`, background:cat===c?"rgba(79,124,255,0.12)":"transparent", color:cat===c?"#7c9cff":"rgba(164,196,255,0.4)", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>{c}</button>
          ))}
        </div>

        {prods.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0", color:"rgba(164,196,255,0.3)" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
            <h3 style={{ fontSize:20, fontWeight:700, color:"rgba(164,196,255,0.5)", marginBottom:8 }}>No products found</h3>
            <p style={{ fontSize:14 }}>Try a different search or category</p>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:20 }}>
          {prods.map((p,i) => {
            const pooled = poolQty(p._id||p.id);
            const progress = Math.min((pooled/p.bulkThreshold)*100, 100);
            const unlocked = pooled >= p.bulkThreshold;
            const disc = pct(p.bulkPrice, p.price);
            return (
              <div key={p._id||p.id} className="hover-lift" style={{ borderRadius:20, border:`1px solid ${unlocked?"rgba(52,211,153,0.2)":"rgba(30,48,80,0.4)"}`, background:"rgba(14,24,41,0.7)", cursor:"pointer", overflow:"hidden", backdropFilter:"blur(12px)", animation:`fadeUp 0.4s ease ${i*0.03}s both` }} onClick={() => { setSelectedProduct(p); setScreen("product"); }}>
                <div style={{ position:"relative", height:190, overflow:"hidden", background:"linear-gradient(135deg,#0d1a30,#0a1525)" }}>
                  <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s ease" }} onError={e=>{e.target.style.display="none";}} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(6,11,20,0.7) 0%, transparent 50%)" }} />
                  {unlocked ? <div style={{ position:"absolute", top:12, right:12 }} className="tag tag-green">🎉 Bulk!</div> : <div style={{ position:"absolute", top:12, right:12 }} className="tag tag-amber">-{disc}% off</div>}
                  <div style={{ position:"absolute", bottom:12, left:14 }}><span className="tag tag-blue" style={{ fontSize:11 }}>{p.category}</span></div>
                </div>
                <div style={{ padding:"18px 20px 22px" }}>
                  <h3 style={{ fontSize:14, fontWeight:700, color:"#c8d4f0", marginBottom:14, lineHeight:1.4 }}>{p.name}</h3>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
                    <div>
                      <p style={{ fontSize:10, color:"rgba(164,196,255,0.3)", marginBottom:2, fontWeight:500, letterSpacing:"0.5px" }}>REGULAR</p>
                      <p style={{ fontSize:17, fontWeight:800, color:"rgba(164,196,255,0.5)", textDecoration:"line-through", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(p.price)}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:10, color:"#34d399", marginBottom:2, fontWeight:500, letterSpacing:"0.5px" }}>BULK PRICE</p>
                      <p style={{ fontSize:20, fontWeight:900, color:"#34d399", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(p.bulkPrice)}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(164,196,255,0.3)", marginBottom:6 }}>
                      <span>Pool Progress</span>
                      <span>{pooled}/{p.bulkThreshold} {p.unit}</span>
                    </div>
                    <div className="progress-track" style={{ height:6 }}>
                      <div className="progress-fill" style={{ width:`${progress}%`, background:unlocked?"linear-gradient(90deg,#34d399,#10b981)":"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                    </div>
                    {!unlocked && <p style={{ fontSize:11, color:"#fbbf24", marginTop:6, fontWeight:500 }}>⚡ {p.bulkThreshold-pooled} {p.unit} more to unlock {disc}% off</p>}
                  </div>
                  <button className="btn btn-primary" style={{ width:"100%", padding:"11px", fontSize:13, fontWeight:700, borderRadius:12 }} onClick={e=>{e.stopPropagation();addToCart(p);}}>+ Add to Cart</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── PRODUCT DETAIL ───────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function ProductScreen({ product: p, setScreen, addToCart, poolQty, showToast, currentUser, cart, logout, notifOpen, setNotifOpen }) {
  const [qty, setQty] = useState(50);
  if (!p) { setScreen("browse"); return null; }
  const pooled = poolQty(p._id||p.id) + qty;
  const progress = Math.min((pooled/p.bulkThreshold)*100, 100);
  const unlocked = pooled >= p.bulkThreshold;
  const disc = pct(p.bulkPrice, p.price);
  const contributions = _poolCart.filter(e=>e.productId===(p._id||p.id));
  const savings = (p.price - p.bulkPrice) * qty;

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={currentUser||_session} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
        <button className="btn btn-ghost" style={{ marginBottom:24, fontSize:13, padding:"8px 0" }} onClick={() => setScreen("browse")}>← Back to Browse</button>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:32, alignItems:"start" }}>
          {/* Left */}
          <div>
            <div style={{ borderRadius:24, overflow:"hidden", border:"1px solid rgba(30,48,80,0.5)", marginBottom:20 }}>
              <div style={{ height:340, background:"linear-gradient(135deg,#0d1a30,#0a1525)", position:"relative" }}>
                <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{e.target.style.display="none";}} />
                {unlocked && <div style={{ position:"absolute", inset:0, background:"rgba(52,211,153,0.05)", border:"2px solid rgba(52,211,153,0.2)", borderRadius:24, display:"flex", alignItems:"center", justifyContent:"center" }}><span className="tag tag-green" style={{ fontSize:14, padding:"8px 20px" }}>🎉 Bulk Discount Active!</span></div>}
              </div>
              <div style={{ padding:"24px 28px" }}>
                <span className="tag tag-blue" style={{ marginBottom:12, display:"inline-block" }}>{p.category}</span>
                <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>{p.name}</h2>
                <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13 }}>Supplied by {p.supplier}</p>
                <div style={{ display:"flex", gap:4, marginTop:10, alignItems:"center" }}>
                  {"⭐".repeat(Math.floor(p.rating||4))}
                  <span style={{ fontSize:12, color:"rgba(164,196,255,0.4)", marginLeft:4 }}>({p.reviews||0} reviews)</span>
                </div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {[{ v:p.stock?.toLocaleString?.()??p.stock, l:"In Stock", c:"#4f7cff" }, { v:`${p.bulkThreshold} ${p.unit}`, l:"Threshold", c:"#a78bfa" }, { v:`${disc}%`, l:"Max Discount", c:"#34d399" }].map((s,i)=>(
                <div key={i} style={{ padding:16, borderRadius:14, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.6)", textAlign:"center" }}>
                  <p style={{ fontSize:20, fontWeight:800, color:s.c, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{s.v}</p>
                  <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginTop:4, fontWeight:500 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{ borderRadius:24, border:`1px solid ${unlocked?"rgba(52,211,153,0.3)":"rgba(30,48,80,0.5)"}`, background:"rgba(14,24,41,0.7)", padding:28, marginBottom:18, backdropFilter:"blur(12px)" }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:"#c8d4f0", marginBottom:20 }}>🤝 Pool Status</h3>
              <div className="progress-track" style={{ height:12, marginBottom:10 }}>
                <div className="progress-fill" style={{ width:`${progress}%`, background:unlocked?"linear-gradient(90deg,#34d399,#10b981)":"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:20 }}>
                <span style={{ color:"#c8d4f0", fontWeight:600 }}>{pooled} / {p.bulkThreshold} {p.unit}</span>
                <span style={{ color:unlocked?"#34d399":"#fbbf24", fontWeight:700 }}>{unlocked?"✓ Bulk Unlocked!":`${p.bulkThreshold-pooled} more needed`}</span>
              </div>

              {contributions.length > 0 && (
                <div style={{ marginBottom:20 }}>
                  <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginBottom:10, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Contributing Shops</p>
                  {contributions.map((c,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(15,30,53,0.4)" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <div className="avatar" style={{ width:28, height:28, background:avatarColor(c.shopName), fontSize:11 }}>{initials(c.shopName)}</div>
                        <span style={{ fontSize:13, color:"rgba(164,196,255,0.6)" }}>{c.shopName}</span>
                      </div>
                      <span style={{ fontSize:13, fontWeight:600, color:"#4f7cff" }}>{c.qty} {p.unit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Shoppers for Pooling */}
              <div style={{ marginBottom:20 }}>
                <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginBottom:10, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Available Shoppers for Pooling</p>
                {_users.filter(u => u.role === "owner" && u.shopName !== (currentUser?.shopName || _session?.shopName) && !contributions.some(c => c.shopName === u.shopName)).slice(0, 5).map((u,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(15,30,53,0.4)" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div className="avatar" style={{ width:28, height:28, background:avatarColor(u.shopName), fontSize:11 }}>{initials(u.shopName)}</div>
                      <div>
                        <span style={{ fontSize:13, color:"rgba(164,196,255,0.6)", display:"block" }}>{u.shopName}</span>
                        <span style={{ fontSize:11, color:"rgba(164,196,255,0.3)", display:"block" }}>{u.location}</span>
                      </div>
                    </div>
                    <span className="tag tag-blue" style={{ fontSize:10, padding:"4px 8px" }}>Available</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={lblStyle}>Your Quantity ({p.unit})</label>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <button className="btn btn-outline" style={{ padding:"10px 18px", fontSize:18, fontWeight:"bold", borderRadius:12 }} onClick={() => setQty(Math.max(1, qty-10))}>−</button>
                  <input className="inp" type="number" value={qty} onChange={e=>setQty(Math.max(1, parseInt(e.target.value)||1))} style={{ textAlign:"center", fontWeight:700, fontSize:20, borderRadius:14 }} />
                  <button className="btn btn-outline" style={{ padding:"10px 18px", fontSize:18, fontWeight:"bold", borderRadius:12 }} onClick={() => setQty(qty+10)}>+</button>
                </div>
              </div>

              <div style={{ background:"rgba(6,11,20,0.6)", borderRadius:14, padding:18, marginBottom:20, border:"1px solid rgba(30,48,80,0.5)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>Regular cost</span>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.4)", textDecoration:"line-through" }}>{fmt(p.price*qty)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>Bulk cost</span>
                  <span style={{ fontSize:13, color:"#34d399", fontWeight:600 }}>{fmt(p.bulkPrice*qty)}</span>
                </div>
                <div className="divider" style={{ margin:"10px 0" }} />
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#c8d4f0" }}>Your savings</span>
                  <span style={{ fontSize:18, fontWeight:900, color:"#34d399", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(savings)}</span>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width:"100%", padding:"15px", fontSize:15, fontWeight:700, borderRadius:14 }} onClick={() => { addToCart(p, qty); showToast(`Added ${qty} ${p.unit} to cart!`); setScreen("cart"); }}>
                🛒 Add {qty} {p.unit} to Cart
              </button>
            </div>

            <div style={{ borderRadius:20, border:"1px solid rgba(79,124,255,0.15)", background:"rgba(79,124,255,0.04)", padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:"rgba(164,196,255,0.6)" }}>Regular Price</p>
                  <p style={{ fontSize:22, fontWeight:800, color:"rgba(164,196,255,0.4)", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", textDecoration:"line-through" }}>{fmt(p.price)}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:13, fontWeight:600, color:"#34d399" }}>Bulk Price</p>
                  <p style={{ fontSize:28, fontWeight:900, color:"#34d399", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(p.bulkPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── CART ─────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function CartScreen({ cart, setCart, setScreen, showToast, poolQty, currentUser, logout, notifOpen, setNotifOpen }) {
  const user = currentUser || _session;
  if (cart.length === 0) return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:600, margin:"100px auto", textAlign:"center", padding:24 }}>
        <div style={{ fontSize:64, marginBottom:20, opacity:0.2 }}>🛒</div>
        <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:28, color:"#fff", marginBottom:10, fontWeight:800 }}>Your cart is empty</h2>
        <p style={{ color:"rgba(164,196,255,0.4)", marginBottom:32, fontSize:15 }}>Add products and pool with nearby shops to unlock bulk discounts</p>
        <button className="btn btn-primary" style={{ padding:"14px 32px", fontSize:15, fontWeight:700 }} onClick={() => setScreen("browse")}>Browse Products</button>
      </div>
    </div>
  );

  const total = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const bulkTotal = cart.reduce((s,i)=>s+i.bulkPrice*i.qty, 0);
  const savings = total - bulkTotal;
  const tax = Math.round(bulkTotal*0.05);
  const shipping = bulkTotal > 5000 ? 0 : 100;
  const finalTotal = bulkTotal + tax + shipping;

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
        <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:28, fontWeight:900, color:"#fff", marginBottom:4, letterSpacing:"-1px" }}>Your Cart</h2>
        <p style={{ color:"rgba(164,196,255,0.4)", fontSize:14, marginBottom:28 }}>{cart.length} item{cart.length!==1?"s":""} · Pool with other shops to unlock bulk discounts</p>

        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:24, alignItems:"start" }}>
          <div>
            {cart.map((item, idx) => {
              const pooled = poolQty(item._id||item.id) + item.qty;
              const progress = Math.min((pooled/item.bulkThreshold)*100, 100);
              const unlocked = pooled >= item.bulkThreshold;
              return (
                <div key={item._id||item.id} style={{ borderRadius:20, border:`1px solid ${unlocked?"rgba(52,211,153,0.2)":"rgba(30,48,80,0.4)"}`, background:"rgba(14,24,41,0.7)", padding:22, marginBottom:16, backdropFilter:"blur(12px)" }}>
                  <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:14 }}>
                    <img src={item.image} alt={item.name} style={{ width:80, height:80, objectFit:"cover", borderRadius:12 }} onError={e=>{e.target.style.display="none";}} />
                    <div style={{ flex:1 }}>
                      <h4 style={{ color:"#c8d4f0", fontWeight:700, marginBottom:4, fontSize:15 }}>{item.name}</h4>
                      <p style={{ color:"rgba(164,196,255,0.4)", fontSize:12 }}>{item.supplier}</p>
                      <div style={{ display:"flex", gap:8, marginTop:6 }}>
                        {unlocked ? <span className="tag tag-green">✓ BULK ACTIVE</span> : <span className="tag tag-amber">◦ REGULAR PRICE</span>}
                      </div>
                    </div>
                    <button onClick={() => setCart(cart.filter((_,i)=>i!==idx))} style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171", cursor:"pointer", fontSize:16, width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <button className="btn btn-outline" style={{ padding:"6px 14px", fontSize:16, borderRadius:10, fontWeight:"bold" }} onClick={() => setCart(cart.map((c,i)=>i===idx?{...c,qty:Math.max(1,c.qty-10)}:c))}>−</button>
                      <span style={{ fontWeight:700, fontSize:18, minWidth:56, textAlign:"center" }}>{item.qty}</span>
                      <button className="btn btn-outline" style={{ padding:"6px 14px", fontSize:16, borderRadius:10, fontWeight:"bold" }} onClick={() => setCart(cart.map((c,i)=>i===idx?{...c,qty:c.qty+10}:c))}>+</button>
                      <span style={{ fontSize:12, color:"rgba(164,196,255,0.4)" }}>{item.unit}</span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginBottom:2 }}>Subtotal</p>
                      <p style={{ fontSize:18, fontWeight:800, color:unlocked?"#34d399":"#c8d4f0", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt((unlocked?item.bulkPrice:item.price)*item.qty)}</p>
                    </div>
                  </div>
                  <div style={{ background:"rgba(6,11,20,0.5)", borderRadius:12, padding:14, border:"1px solid rgba(30,48,80,0.4)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(164,196,255,0.3)", marginBottom:6 }}>
                      <span>Pool progress (all shops)</span><span>{pooled}/{item.bulkThreshold} {item.unit}</span>
                    </div>
                    <div className="progress-track" style={{ height:6 }}>
                      <div className="progress-fill" style={{ width:`${progress}%`, background:unlocked?"linear-gradient(90deg,#34d399,#10b981)":"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                    </div>
                    {!unlocked && <p style={{ fontSize:11, color:"#fbbf24", marginTop:6 }}>⚡ Need {item.bulkThreshold-pooled} more {item.unit} to unlock {pct(item.bulkPrice,item.price)}% off</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, marginBottom:16, backdropFilter:"blur(12px)", position:"sticky", top:80 }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:"#c8d4f0", marginBottom:22 }}>Order Summary</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>Subtotal</span>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.4)", textDecoration:"line-through" }}>{fmt(total)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"rgba(52,211,153,0.8)" }}>Bulk Discount</span>
                  <span style={{ fontSize:13, color:"#34d399", fontWeight:600 }}>−{fmt(savings)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>GST (5%)</span>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.6)" }}>{fmt(tax)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>Shipping</span>
                  {shipping===0 ? <span style={{ fontSize:13, color:"#34d399", fontWeight:600 }}>FREE</span> : <span style={{ fontSize:13, color:"#fbbf24" }}>{fmt(shipping)}</span>}
                </div>
                <div style={{ height:1, background:"rgba(30,48,80,0.5)", margin:"4px 0" }} />
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:15, fontWeight:700, color:"#c8d4f0" }}>Total</span>
                  <span style={{ fontSize:22, fontWeight:900, color:"#fff", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(finalTotal)}</span>
                </div>
              </div>
              <div style={{ background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.2)", borderRadius:12, padding:14, marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"#34d399", fontWeight:600 }}>YOU SAVE</span>
                  <span style={{ fontSize:20, fontWeight:900, color:"#34d399", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(savings)}</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", padding:"15px", fontSize:15, fontWeight:700, borderRadius:14 }} onClick={() => setScreen("payment")}>Proceed to Payment →</button>
              <button className="btn btn-ghost" style={{ width:"100%", padding:"12px", fontSize:13, marginTop:10 }} onClick={() => setScreen("browse")}>+ Add More Products</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── PAYMENT ──────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function PaymentScreen({ cart, setScreen, showToast, currentUser, setCart }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ address:"", city:"", pincode:"", phone:"" });
  const [orderId, setOrderId] = useState(null);
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const bulkTotal = cart.reduce((s,i)=>s+i.bulkPrice*i.qty, 0);
  const discount = subtotal - bulkTotal;
  const tax = Math.round(bulkTotal*0.05);
  const shipping = bulkTotal > 5000 ? 0 : 100;
  const finalTotal = bulkTotal + tax + shipping;

  const handlePayment = async () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode) { showToast("Complete shipping details","error"); return; }
    setLoading(true);
    try {
      const { openRazorpayCheckout } = await import('./utils/razorpay.js');
      openRazorpayCheckout(finalTotal, currentUser.email, currentUser.ownerName, async (success, paymentData) => {
        if (success) {
          const oid = `BLK-${3000+Math.floor(Math.random()*9999)}`;
          // Simulate order creation for demo
          const newOrder = {
            id: oid,
            product: cart[0]?.name || "Bulk Order",
            qty: cart.reduce((sum, item) => sum + item.qty, 0),
            status: "Confirmed",
            shops: [currentUser.shopName],
            saving: Math.floor(finalTotal * 0.15),
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            totalAmount: finalTotal,
            shopBreakdown: [{ shop: currentUser.shopName, qty: cart.reduce((sum, item) => sum + item.qty, 0), amount: finalTotal }]
          };
          _orders.push(newOrder);
          setOrderId(oid); setStep(4); showToast("Payment successful.");
        } else { showToast("Payment failed. Try again.","error"); }
        setLoading(false);
      });
    } catch(err) { showToast("Payment error: "+err.message,"error"); setLoading(false); }
  };

  const stepBar = (
    <div style={{ display:"flex", gap:8, marginBottom:36 }}>
      {[1,2,3,4].map(s=><div key={s} style={{ flex:1, height:5, borderRadius:3, background:s<=step?"linear-gradient(90deg,#4f7cff,#7c5cfc)":"rgba(30,48,80,0.5)", transition:"all 0.4s" }} />)}
    </div>
  );
  const summaryCard = (
    <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:24, position:"sticky", top:80 }}>
      <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:18 }}>Order Summary</h3>
      {cart.map((item,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:10 }}><span style={{ color:"rgba(164,196,255,0.5)", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name} ×{item.qty}</span><span style={{ color:"#c8d4f0", fontWeight:600 }}>{fmt(item.bulkPrice*item.qty)}</span></div>)}
      <div style={{ height:1, background:"rgba(30,48,80,0.5)", margin:"12px 0" }} />
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:13, color:"rgba(52,211,153,0.8)" }}>Discount</span><span style={{ fontSize:13, color:"#34d399", fontWeight:600 }}>−{fmt(discount)}</span></div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>GST 5%</span><span style={{ fontSize:13, color:"rgba(164,196,255,0.5)" }}>{fmt(tax)}</span></div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}><span style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>Shipping</span><span style={{ fontSize:13, color:shipping===0?"#34d399":"#fbbf24", fontWeight:600 }}>{shipping===0?"FREE":fmt(shipping)}</span></div>
      <div style={{ height:1, background:"rgba(30,48,80,0.5)", margin:"12px 0" }} />
      <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:15, fontWeight:700, color:"#c8d4f0" }}>Total</span><span style={{ fontSize:22, fontWeight:900, color:"#fff", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(finalTotal)}</span></div>
    </div>
  );

  if (step === 4) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#060b14", padding:24 }}>
      <div style={{ textAlign:"center", maxWidth:480, animation:"bounceIn 0.6s ease" }}>
        <div style={{ width:120, height:120, background:"rgba(52,211,153,0.1)", border:"2px solid rgba(52,211,153,0.3)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, margin:"0 auto 28px", animation:"glowPulse 2s infinite" }}>✓</div>
        <h1 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:36, fontWeight:900, color:"#34d399", marginBottom:12 }}>Order Confirmed!</h1>
        <p style={{ color:"rgba(164,196,255,0.4)", marginBottom:32, fontSize:15, lineHeight:1.6 }}>Your payment was successful. Your order has been placed and is being processed.</p>
        <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, marginBottom:28 }}>
          <div style={{ marginBottom:12 }}><p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginBottom:4, textTransform:"uppercase", letterSpacing:"1px" }}>Order ID</p><p style={{ fontSize:20, fontWeight:800, color:"#7c9cff" }}>{orderId}</p></div>
          <div><p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginBottom:4, textTransform:"uppercase", letterSpacing:"1px" }}>Amount Paid</p><p style={{ fontSize:24, fontWeight:900, color:"#34d399", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(finalTotal)}</p></div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button className="btn btn-primary" style={{ flex:1, padding:"14px", fontWeight:700 }} onClick={() => { setCart([]); setScreen("tracking"); }}>Track Order →</button>
          <button className="btn btn-outline" style={{ flex:1, padding:"14px" }} onClick={() => { setCart([]); setScreen("dashboard"); }}>Back Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#060b14", padding:"32px 24px" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        {stepBar}
        {step===1 && (
          <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:28, alignItems:"start" }}>
            <div>
              <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:26, fontWeight:800, color:"#fff", marginBottom:24 }}>Review Cart</h2>
              {cart.map((item,i)=><div key={i} style={{ borderRadius:16, border:"1px solid rgba(30,48,80,0.4)", background:"rgba(14,24,41,0.6)", padding:18, marginBottom:14, display:"flex", gap:14 }}>
                <img src={item.image} alt={item.name} style={{ width:72, height:72, objectFit:"cover", borderRadius:10 }} onError={e=>{e.target.style.display="none";}} />
                <div style={{ flex:1 }}><h4 style={{ color:"#c8d4f0", fontWeight:700, marginBottom:4 }}>{item.name}</h4><p style={{ color:"rgba(164,196,255,0.4)", fontSize:12 }}>Qty: {item.qty} {item.unit}</p><div style={{ display:"flex", gap:8, marginTop:6 }}><span style={{ color:"rgba(164,196,255,0.3)", fontSize:13, textDecoration:"line-through" }}>{fmt(item.price*item.qty)}</span><span style={{ color:"#34d399", fontWeight:700, fontSize:13 }}>{fmt(item.bulkPrice*item.qty)}</span></div></div>
              </div>)}
              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", fontSize:15, fontWeight:700, borderRadius:14, marginTop:8 }} onClick={() => setStep(2)}>Continue to Shipping →</button>
            </div>
            {summaryCard}
          </div>
        )}
        {step===2 && (
          <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:28, alignItems:"start" }}>
            <div>
              <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:26, fontWeight:800, color:"#fff", marginBottom:24 }}>Shipping Address</h2>
              <div className="card-glow" style={{ padding:28 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div><label style={lblStyle}>Delivery Address *</label><textarea className="inp" placeholder="House no, street, area" rows={3} value={shippingInfo.address} onChange={e=>setShippingInfo({...shippingInfo,address:e.target.value})} style={{ minHeight:90 }} /></div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <div><label style={lblStyle}>City *</label><input className="inp" placeholder="Pune" value={shippingInfo.city} onChange={e=>setShippingInfo({...shippingInfo,city:e.target.value})} /></div>
                    <div><label style={lblStyle}>Pincode *</label><input className="inp" placeholder="411001" value={shippingInfo.pincode} onChange={e=>setShippingInfo({...shippingInfo,pincode:e.target.value})} /></div>
                  </div>
                  <div><label style={lblStyle}>Phone</label><input className="inp" placeholder="+91 9876543210" value={shippingInfo.phone} onChange={e=>setShippingInfo({...shippingInfo,phone:e.target.value})} /></div>
                </div>
                <div style={{ display:"flex", gap:12, marginTop:20 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex:1, padding:"14px" }}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)} style={{ flex:2, padding:"14px", fontWeight:700 }}>Continue to Payment →</button>
                </div>
              </div>
            </div>
            {summaryCard}
          </div>
        )}
        {step===3 && (
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:26, fontWeight:800, color:"#fff", marginBottom:8 }}>Payment</h2>
            <p style={{ color:"rgba(164,196,255,0.4)", marginBottom:28 }}>Secure checkout powered by Razorpay</p>
            <div className="card-glow" style={{ padding:32, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, padding:"20px 24px", background:"rgba(79,124,255,0.06)", border:"1px solid rgba(79,124,255,0.15)", borderRadius:16 }}>
                <span style={{ color:"rgba(164,196,255,0.6)", fontSize:15 }}>Amount to Pay</span>
                <span style={{ fontSize:32, fontWeight:900, color:"#4f7cff", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{fmt(finalTotal)}</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24, padding:16, background:"rgba(52,211,153,0.04)", border:"1px solid rgba(52,211,153,0.12)", borderRadius:14 }}>
                {["✓ 256-bit SSL encrypted payment","✓ Razorpay PCI-DSS certified","✓ UPI, Cards, Net Banking & Wallets"].map(t=><p key={t} style={{ fontSize:13, color:"rgba(164,196,255,0.6)" }}>{t}</p>)}
              </div>
              <button className="btn btn-primary" onClick={handlePayment} disabled={loading} style={{ width:"100%", padding:"16px", fontSize:16, fontWeight:700, borderRadius:14, marginBottom:12 }}>
                {loading ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Processing…</span> : `Pay ${fmt(finalTotal)} Securely →`}
              </button>
              <button className="btn btn-ghost" onClick={() => setStep(2)} style={{ width:"100%", padding:"12px" }}>← Change Shipping</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── INVOICE GENERATION ─────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
const generateInvoice = (order) => {
  const invoiceContent = `
BULKBUY INVOICE
===============
Invoice #: INV-${order.id}
Date: ${new Date().toLocaleDateString()}
Status: ${order.status}

ORDER DETAILS
-------------
Product: ${order.product}
Quantity: ${order.qty} units
Total Amount: ${fmt(order.totalAmount)}
Savings: ${fmt(order.saving)}

PARTICIPATING SHOPS
-------------------
${(order.shopBreakdown||[]).map((sb, i) => `
${i+1}. ${sb.shop}
   Quantity: ${sb.qty} units
   Amount: ${fmt(sb.amount)}
`).join('')}

---
Thank you for choosing BulkBuy!
For questions, contact support@bulkbuy.com
  `.trim();

  const blob = new Blob([invoiceContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${order.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ════════════════════════════════════════════════════════════════════
// ─── TRACKING ─────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function TrackingScreen({ setScreen, currentUser, cart, logout, notifOpen, setNotifOpen }) {
  const user = currentUser || _session;
  const [sel, setSel] = useState(_orders[0]?.id);
  const myOrders = user ? _orders.filter(o=>o.shops.includes(user.shopName)) : _orders;
  const order = myOrders.find(o=>o.id===sel) || myOrders[0];

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
        <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:28, fontWeight:900, color:"#fff", marginBottom:28, letterSpacing:"-1px" }}>Order Tracking</h2>
        <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:24 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:"rgba(164,196,255,0.3)", marginBottom:14, textTransform:"uppercase", letterSpacing:"1px" }}>Your Orders</p>
            {myOrders.map(o => (
              <div key={o.id} onClick={() => setSel(o.id)} className="hover-lift" style={{ padding:18, borderRadius:16, marginBottom:10, cursor:"pointer", border:`1.5px solid ${sel===o.id?"rgba(79,124,255,0.5)":"rgba(30,48,80,0.4)"}`, background:sel===o.id?"rgba(79,124,255,0.06)":"rgba(14,24,41,0.6)", transition:"all 0.2s", backdropFilter:"blur(12px)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontWeight:700, color:sel===o.id?"#7c9cff":"#c8d4f0", fontSize:14 }}>{o.id}</span>
                  <StatusTag status={o.status} />
                </div>
                <p style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>{o.product.slice(0,28)}</p>
                <p style={{ fontSize:11, color:"rgba(42,58,85,0.8)", marginTop:4 }}>{o.date} · {o.shops.length} shops · {fmt(o.saving)} saved</p>
              </div>
            ))}
            {myOrders.length === 0 && <p style={{ color:"rgba(164,196,255,0.3)", fontSize:14, padding:"20px 0" }}>No orders yet</p>}
          </div>

          {order && (
            <div>
              <div style={{ borderRadius:24, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:32, marginBottom:20, backdropFilter:"blur(12px)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 }}>
                  <div>
                    <h3 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:22, fontWeight:800, color:"#fff" }}>{order.id}</h3>
                    <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginTop:4 }}>{order.product} · {order.qty} units · {fmt(order.totalAmount)}</p>
                  </div>
                  <StatusTag status={order.status} />
                </div>

                <div style={{ position:"relative", paddingLeft:36 }}>
                  {STATUS_FLOW.map((s,i) => {
                    const curIdx = STATUS_FLOW.indexOf(order.status);
                    const done = i <= curIdx;
                    const active = i === curIdx;
                    return (
                      <div key={s} style={{ position:"relative", paddingBottom:i<STATUS_FLOW.length-1?32:0 }}>
                        {i < STATUS_FLOW.length-1 && <div style={{ position:"absolute", left:-22, top:22, width:2, height:"100%", background:done?"linear-gradient(180deg,#4f7cff,#7c5cfc)":"rgba(30,48,80,0.5)" }} />}
                        <div style={{ position:"absolute", left:-28, top:2, width:16, height:16, borderRadius:"50%", background:active?"linear-gradient(135deg,#4f7cff,#7c5cfc)":done?"#34d399":"rgba(30,48,80,0.8)", border:`2px solid ${active?"#4f7cff":done?"#34d399":"rgba(30,48,80,0.6)"}`, boxShadow:active?"0 0 16px rgba(79,124,255,0.6)":"none", transition:"all 0.3s" }} />
                        <div>
                          <p style={{ fontSize:15, fontWeight:active?700:500, color:active?"#fff":done?"#34d399":"rgba(164,196,255,0.3)" }}>{s}</p>
                          {active && <p style={{ fontSize:12, color:"#4f7cff", marginTop:2, fontWeight:600 }}>● Current Status</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:24, backdropFilter:"blur(12px)" }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:18 }}>🏪 Participating Shops</h3>
                {(order.shopBreakdown||[]).map((sb,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(15,30,53,0.4)" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div className="avatar" style={{ width:32, height:32, background:avatarColor(sb.shop), fontSize:12 }}>{initials(sb.shop)}</div>
                      <span style={{ fontSize:13, color:"rgba(164,196,255,0.6)" }}>{sb.shop}</span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:13, fontWeight:600, color:"#c8d4f0" }}>{fmt(sb.amount)}</p>
                      <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)" }}>{sb.qty} units</p>
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:14, paddingTop:12 }}>
                  <span style={{ fontWeight:700, color:"#c8d4f0", fontSize:15 }}>Total</span>
                  <span style={{ fontWeight:900, color:"#fff", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:18 }}>{fmt(order.totalAmount)}</span>
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => generateInvoice(order)} style={{ width:"100%", padding:"14px", fontSize:14, fontWeight:700, borderRadius:14, marginTop:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <IcFileText size={18} color="#ffffff" /> Download Invoice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── ANALYTICS ────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function AnalyticsScreen({ setScreen, currentUser, cart, logout, notifOpen, setNotifOpen }) {
  const user = currentUser || _session;
  const myOrders = user ? _orders.filter(o=>o.shops.includes(user.shopName)) : _orders;
  const totalSaved = myOrders.filter(o=>o.status!=="Pending").reduce((s,o)=>s+o.saving, 0);
  const avgSavingPerOrder = myOrders.length > 0 ? Math.round(totalSaved/myOrders.length) : 0;
  const deliveredOrders = myOrders.filter(o=>o.status==="Delivered");

  const weeklyData = [12000,18500,14000,22000,19500,28000,24000,32000,27000,35000,30000,42000];
  const savingsData = [800,1200,900,1500,1300,1800,1600,2100,1900,2400,2200,3000];

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-1px", display:"flex", alignItems:"center", gap:10 }}><IcBarChart size={24} color="#8fb0ff" /> Analytics</h2>
            <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginTop:4 }}>Your shop performance & savings overview</p>
          </div>
          <select className="inp" style={{ width:150, padding:"8px 14px" }} onChange={()=>{}}>
            <option>Last 3 months</option><option>Last 6 months</option><option>This year</option>
          </select>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
          {[
            { label:"Total Savings", value:fmt(totalSaved), icon: IcDollar, color:"#34d399", change:"+24%", up:true },
            { label:"Orders Placed", value:myOrders.length, icon: IcPackage, color:"#4f7cff", change:"+8%", up:true },
            { label:"Avg Saving / Order", value:fmt(avgSavingPerOrder), icon: IcTrendUp, color:"#a78bfa", change:"+15%", up:true },
            { label:"Delivered", value:deliveredOrders.length, icon: IcCheckCircle, color:"#fbbf24", change:"100%", up:true },
          ].map((s,i) => (
            <div key={i} style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", backdropFilter:"blur(12px)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <span style={{ color:s.color }}><s.icon size={22} color="currentColor" /></span>
                <span style={{ fontSize:11, fontWeight:700, color:s.up?"#34d399":"#f87171", background:s.up?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)", padding:"3px 8px", borderRadius:6 }}>{s.up?"↑":""}{s.change}</span>
              </div>
              <div style={{ fontSize:26, fontWeight:900, color:s.color, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12, color:"rgba(164,196,255,0.4)", fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:24, marginBottom:24 }}>
          {/* Revenue chart */}
          <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, backdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0" }}>Order Value Trend</h3>
              <div style={{ display:"flex", gap:16, fontSize:12 }}>
                <span style={{ color:"#4f7cff" }}>● Orders</span>
                <span style={{ color:"#34d399" }}>● Savings</span>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:140, marginBottom:8 }}>
              {weeklyData.map((v,i) => {
                const maxVal = Math.max(...weeklyData);
                const h = (v/maxVal)*100;
                const sh = (savingsData[i]/Math.max(...savingsData))*100;
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                    <div style={{ width:"100%", height:`${sh}%`, background:"rgba(52,211,153,0.3)", borderRadius:"3px 3px 0 0", border:"1px solid rgba(52,211,153,0.3)" }} />
                    <div style={{ width:"100%", height:`${h}%`, background:"linear-gradient(to top,rgba(79,124,255,0.6),rgba(124,92,252,0.4))", borderRadius:"3px 3px 0 0", border:"1px solid rgba(79,124,255,0.3)" }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(164,196,255,0.3)" }}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m=><span key={m}>{m}</span>)}
            </div>
          </div>

          {/* Category breakdown */}
          <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, backdropFilter:"blur(12px)" }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:24 }}>Spending by Category</h3>
            {[["Grocery","45%","#34d399"],["Electronics","28%","#4f7cff"],["Stationery","15%","#a78bfa"],["Others","12%","#fbbf24"]].map(([cat,pctVal,color])=>(
              <div key={cat} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                  <span style={{ color:"rgba(164,196,255,0.6)" }}>{cat}</span>
                  <span style={{ color, fontWeight:600 }}>{pctVal}</span>
                </div>
                <div className="progress-track" style={{ height:6 }}>
                  <div className="progress-fill" style={{ width:pctVal, background:`linear-gradient(90deg,${color},${color}88)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings leaderboard */}
        <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, backdropFilter:"blur(12px)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:20 }}>🏆 Top Savings Orders</h3>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(6,11,20,0.5)" }}>{["Rank","Order","Product","Shops","Savings","Status"].map(h=><th key={h} style={{ padding:"12px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"rgba(164,196,255,0.3)", textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>)}</tr></thead>
              <tbody>
                {[...myOrders].sort((a,b)=>b.saving-a.saving).slice(0,5).map((o,i)=>(
                  <tr key={o.id} style={{ borderBottom:"1px solid rgba(15,30,53,0.4)" }}>
                    <td style={{ padding:"14px 18px" }}><span style={{ fontSize:16, fontWeight:800, color:i===0?"#fbbf24":i===1?"#94a3b8":i===2?"#c4793d":"rgba(164,196,255,0.4)" }}>#{i+1}</span></td>
                    <td style={{ padding:"14px 18px", color:"#7c9cff", fontWeight:700, fontSize:13 }}>{o.id}</td>
                    <td style={{ padding:"14px 18px", color:"#c8d4f0", fontSize:13 }}>{o.product}</td>
                    <td style={{ padding:"14px 18px", fontSize:13, color:"rgba(164,196,255,0.5)" }}>{o.shops.length}</td>
                    <td style={{ padding:"14px 18px", color:"#34d399", fontWeight:700, fontSize:14 }}>{fmt(o.saving)}</td>
                    <td style={{ padding:"14px 18px" }}><StatusTag status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── PROFILE ──────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function ProfileScreen({ setScreen, currentUser, setCurrentUser, showToast, cart, logout, notifOpen, setNotifOpen, theme, handleThemeChange }) {
  const user = currentUser || _session;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ownerName:user?.ownerName||"", phone:user?.phone||"", location:user?.location||"", shopName:user?.shopName||"" });

  const save = () => { if (setCurrentUser) setCurrentUser({...user, ...form}); showToast("Profile updated!"); setEditing(false); };

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:800, margin:"0 auto", padding:"32px 24px" }}>
        <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:26, fontWeight:900, color:"#fff", marginBottom:28, letterSpacing:"-0.5px" }}>My Profile</h2>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:24, marginBottom:24 }}>
          {/* Avatar card */}
          <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, textAlign:"center", backdropFilter:"blur(12px)" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${avatarColor(user?.ownerName||"U")},${avatarColor((user?.ownerName||"U")+"x")})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:28, color:"#fff", margin:"0 auto 16px", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", border:"3px solid rgba(79,124,255,0.3)" }}>
              {initials(user?.ownerName||"U")}
            </div>
            <h3 style={{ fontWeight:700, color:"#fff", marginBottom:4, fontSize:16 }}>{user?.ownerName}</h3>
            <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:12 }}>{user?.shopName}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <span className="tag tag-green" style={{ justifyContent:"center" }}>✓ Verified</span>
              {user?.role && <span className={`tag ${user.role==="wholesale"?"tag-purple":"tag-blue"}`} style={{ justifyContent:"center", textTransform:"capitalize" }}>{user.role==="wholesale"?"🏭 Wholesale":"🏪 Shop Owner"}</span>}
            </div>
          </div>

          {/* Details */}
          <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, backdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0" }}>Account Details</h3>
              <button className={`btn ${editing?"btn-success":"btn-outline"}`} style={{ padding:"8px 18px", fontSize:13, fontWeight:700 }} onClick={() => editing ? save() : setEditing(true)}>
                {editing ? "Save Changes ✓" : "Edit Profile"}
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { k:"ownerName", l:"Owner Name", editable:true },
                { k:"email", l:"Email", editable:false, v:user?.email },
                { k:"phone", l:"Phone", editable:true },
                { k:"shopName", l:"Shop Name", editable:true },
                { k:"location", l:"Location", editable:true },
                { k:"category", l:"Category", editable:false, v:user?.category },
                { k:"joinDate", l:"Member Since", editable:false, v:user?.joinDate },
                { k:"role", l:"Account Type", editable:false, v:user?.role==="wholesale"?"Wholesale Seller":"Shop Owner" },
              ].map(({k,l,editable,v}) => (
                <div key={k}>
                  <label style={lblStyle}>{l}</label>
                  {editing && editable ? (
                    <input className="inp" value={form[k]||v||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
                  ) : (
                    <p style={{ color:"#c8d4f0", fontSize:14, fontWeight:500, padding:"12px 0", borderBottom:"1px solid rgba(30,48,80,0.3)" }}>{v||form[k]||user?.[k]||"—"}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {[
            { label:"Total Orders", value:_orders.filter(o=>o.shops.includes(user?.shopName)).length, icon:"📦", color:"#4f7cff" },
            { label:"Total Savings", value:fmt(_orders.filter(o=>o.shops.includes(user?.shopName)&&o.status!=="Pending").reduce((s,o)=>s+o.saving,0)), icon:"💰", color:"#34d399" },
            { label:"Collaborations", value:user?.collaborations||0, icon:"🤝", color:"#a78bfa" },
          ].map(s=>(
            <div key={s.label} style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", textAlign:"center", backdropFilter:"blur(12px)" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:24, fontWeight:800, color:s.color, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize:12, color:"rgba(164,196,255,0.4)", marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Theme Settings */}
        <div style={{ marginTop:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", padding:28, backdropFilter:"blur(12px)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:16 }}>Appearance Settings</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  padding:"12px 20px",
                  borderRadius:12,
                  border:theme===key?"2px solid #4f7cff":"1px solid rgba(30,48,80,0.6)",
                  background:theme===key?"rgba(79,124,255,0.12)":"rgba(14,24,41,0.6)",
                  color:theme===key?"#7c9cff":"rgba(164,196,255,0.6)",
                  fontSize:13,
                  fontWeight:600,
                  cursor:"pointer",
                  transition:"all 0.2s",
                  display:"flex",
                  alignItems:"center",
                  gap:8
                }}
              >
                <div style={{ width:20, height:20, borderRadius:"50%", background:t.background, border:`1px solid ${t.cardBorder}` }} />
                {t.name}
                {theme===key && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── CHAT ─────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function ChatScreen({ setScreen, currentUser, showToast, cart, logout, notifOpen, setNotifOpen }) {
  const user = currentUser || _session;
  const userId = user?._id || user?.id || null;
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(_messages);
  const [threads, setThreads] = useState([
    { threadId: "bulk-order-group", lastMessage: { sender: "Bulk Order Group", text: "Pool orders together", from: "Group" }, unreadCount: 0 }
  ]);
  const [currentThread, setCurrentThread] = useState("bulk-order-group");
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior:"smooth" }), [messages]);

  useEffect(() => {
    // Use local demo messages
    setMessages(_messages);
  }, []);

  const send = async () => {
    if (!msg.trim()) return;
    const newMsg = { id:Date.now(), userId, sender:user?.shopName||"You", text:msg, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), avatar:initials(user?.shopName||"You") };
    setMessages(prev=>[...prev, newMsg]);
    setMsg("");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ borderRadius:24, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", height:"calc(100vh - 180px)", display:"grid", gridTemplateColumns:"280px 1fr", overflow:"hidden", backdropFilter:"blur(12px)" }}>
          {/* Sidebar */}
          <div style={{ borderRight:"1px solid rgba(30,48,80,0.4)", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"18px 16px", borderBottom:"1px solid rgba(30,48,80,0.4)" }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:12 }}>Messages</h3>
              <input className="inp" placeholder="Search…" style={{ fontSize:13 }} />
            </div>
            {/* Group chat thread */}
            <div style={{ padding:"12px 14px", borderBottom:"1px solid rgba(30,48,80,0.3)", cursor:"pointer", background:"rgba(79,124,255,0.06)" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#4f7cff,#7c5cfc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏪</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, color:"#c8d4f0", fontSize:13 }}>Bulk Order Group</p>
                  <p style={{ fontSize:12, color:"rgba(164,196,255,0.3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Pool orders together</p>
                </div>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#34d399", flexShrink:0 }} />
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"8px" }}>
              {threads.map(t=>(
                <div key={t.threadId} style={{ padding:"10px 12px", borderRadius:12, cursor:"pointer", marginBottom:4 }} onClick={()=>setCurrentThread(t.threadId)}>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <div className="avatar" style={{ width:36, height:36, background:avatarColor(t.lastMessage?.from||"U"), fontSize:13 }}>{initials(t.lastMessage?.from||"U")}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:600, color:"#c8d4f0", fontSize:13 }}>{t.lastMessage?.sender||"Chat"}</p>
                      <p style={{ fontSize:12, color:"rgba(164,196,255,0.3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.lastMessage?.text||""}</p>
                    </div>
                    {t.unreadCount > 0 && <span style={{ background:"#f87171", color:"#fff", borderRadius:8, padding:"1px 6px", fontSize:11, fontWeight:700 }}>{t.unreadCount}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"16px 24px", borderBottom:"1px solid rgba(30,48,80,0.4)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(6,11,20,0.4)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#4f7cff,#7c5cfc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏪</div>
                <div><p style={{ fontWeight:700, fontSize:15, color:"#c8d4f0" }}>Bulk Order Group</p><p style={{ fontSize:12, color:"rgba(164,196,255,0.3)" }}>{messages.length} messages</p></div>
              </div>
              <span className="tag tag-green" style={{ animation:"pulse 2s infinite" }}>● Live</span>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:16 }}>
              {messages.map(m => {
                const isMe = m.userId===userId;
                return (
                  <div key={m.id} style={{ display:"flex", flexDirection:isMe?"row-reverse":"row", gap:10, alignItems:"flex-end" }}>
                    {!isMe && <div className="avatar" style={{ width:32, height:32, background:avatarColor(m.sender), fontSize:12, flexShrink:0 }}>{m.avatar}</div>}
                    <div style={{ maxWidth:"68%" }}>
                      {!isMe && <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginBottom:4, fontWeight:600 }}>{m.sender}</p>}
                      <div style={{ background:isMe?"linear-gradient(135deg,rgba(79,124,255,0.3),rgba(124,92,252,0.2))":"rgba(30,48,80,0.4)", border:`1px solid ${isMe?"rgba(79,124,255,0.3)":"rgba(30,48,80,0.4)"}`, borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"11px 16px" }}>
                        <p style={{ fontSize:14, color:"#c8d4f0", lineHeight:1.5 }}>{m.text}</p>
                      </div>
                      <p style={{ fontSize:11, color:"rgba(42,58,85,0.8)", marginTop:4, textAlign:isMe?"right":"left" }}>{m.time}</p>
                    </div>
                  </div>
                );
              })}
              {Object.keys(typingUsers).length > 0 && <p style={{ fontSize:12, color:"rgba(164,196,255,0.3)", fontStyle:"italic" }}>Someone is typing…</p>}
              <div ref={endRef} />
            </div>

            <div style={{ padding:"14px 20px", borderTop:"1px solid rgba(30,48,80,0.4)", display:"flex", gap:10, alignItems:"center" }}>
              <input className="inp" placeholder="Type a message…" value={msg} onChange={e=>{setMsg(e.target.value);try{socketRef.current?.emit("typing",{threadId:currentThread,userId});}catch{}}} onKeyDown={e=>e.key==="Enter"&&send()} style={{ flex:1 }} />
              <button className="btn btn-primary" style={{ padding:"12px 20px", fontWeight:700 }} onClick={send}>Send →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── SHOPS ────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function ShopsScreen({ setScreen, currentUser, showToast, cart, logout, notifOpen, setNotifOpen }) {
  const user = currentUser || _session;
  const [shops, setShops] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("browse");
  const [selectedShop, setSelectedShop] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadShops = async () => {
      try { const data = await apiFetch(`/api/shops/${user?._id}`); if (Array.isArray(data)) setShops(data); } catch {}
    };
    const loadRequests = async () => {
      try { const data = await apiFetch(`/api/collaborations/${user?._id}`); if (Array.isArray(data)) setRequests(data); } catch {}
    };
    loadShops(); loadRequests();
  }, []);

  const sendRequest = async (toShop) => {
    if (!message.trim()) { showToast("Add a message first","error"); return; }
    setLoading(true);
    try {
      const data = await apiFetch("/api/collaborations/request", { method:"POST", body:{ fromId:user?._id, toId:toShop._id, fromShop:user?.shopName, toShop:toShop.shopName, message, poolTarget:"" } });
      if (data.success) { showToast(`Request sent to ${toShop.shopName}.`); setSelectedShop(null); setMessage(""); }
    } catch { showToast("Failed to send request","error"); }
    setLoading(false);
  };

  const respondRequest = async (requestId, status) => {
    try {
      const endpoint = status==="accepted"?"accept":"reject";
      const data = await apiFetch(`/api/collaborations/${requestId}/${endpoint}`, { method:"PUT" });
      if (data.success) { showToast(`Request ${status}!`); const updated = await apiFetch(`/api/collaborations/${user?._id}`); if (Array.isArray(updated)) setRequests(updated); }
    } catch { showToast("Failed to respond","error"); }
  };

  const filtered = shops.filter(s=>s.shopName?.toLowerCase().includes(search.toLowerCase()));
  const received = requests.filter(r=>r.to===user?._id);
  const sent = requests.filter(r=>r.from===user?._id);

  return (
    <div style={{ minHeight:"100vh", background:"#060b14" }}>
      <TopBar user={user} setScreen={setScreen} cart={cart} logout={logout||(() => setScreen("dashboard"))} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-1px", display:"flex", alignItems:"center", gap:10 }}><IcHandshake size={24} color="#8fb0ff" /> Shop Network</h2>
          <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginTop:4 }}>Connect with nearby shop owners to pool bulk orders together</p>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          {[["browse",`Browse (${filtered.length})`],["received",`Received (${received.filter(r=>r.status==="pending").length})`],["sent",`Sent (${sent.filter(r=>r.status==="pending").length})`]].map(([id,label])=>(
            <button key={id} className={`btn ${tab===id?"btn-primary":"btn-outline"}`} style={{ fontSize:13, padding:"10px 20px" }} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === "browse" && (
          <div>
            {selectedShop ? (
              <div style={{ maxWidth:520 }}>
                <button className="btn btn-ghost" style={{ marginBottom:20, fontSize:13, padding:"8px 0" }} onClick={()=>setSelectedShop(null)}><IcArrowLeft size={16} /> Back to Shops</button>
                <div className="card-glow" style={{ padding:32 }}>
                  <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:24 }}>
                    <div className="avatar" style={{ width:56, height:56, background:avatarColor(selectedShop.shopName), fontSize:22 }}>{initials(selectedShop.shopName)}</div>
                    <div>
                      <h3 style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>{selectedShop.shopName}</h3>
                      <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13 }}>{selectedShop.location} · {selectedShop.category}</p>
                      <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginTop:4 }}>Owner: {selectedShop.ownerName}</p>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
                    {[["Orders",selectedShop.orders,"#4f7cff"],["Collabs",selectedShop.collaborations,"#34d399"],["Savings",fmt(selectedShop.totalSavings||0),"#fbbf24"]].map(([l,v,c])=>(
                      <div key={l} style={{ padding:14, borderRadius:12, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(6,11,20,0.5)", textAlign:"center" }}>
                        <p style={{ fontSize:16, fontWeight:800, color:c, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{v}</p>
                        <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginTop:3 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom:20 }}>
                    <label style={lblStyle}>Why do you want to collaborate?</label>
                    <textarea className="inp" placeholder="E.g., I want to pool rice orders together to save on bulk pricing…" value={message} onChange={e=>setMessage(e.target.value)} style={{ minHeight:100 }} />
                  </div>
                  <button className="btn btn-primary" onClick={()=>sendRequest(selectedShop)} disabled={loading} style={{ width:"100%", padding:"14px", fontWeight:700, borderRadius:14 }}>
                    {loading ? "Sending…" : <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><IcSend size={16} color="#ffffff" /> Send Collaboration Request</span>}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="inp-icon" style={{ maxWidth:360, marginBottom:24 }}>
                  <span className="icon"><IcSearch size={14} color="currentColor" /></span>
                  <input className="inp" placeholder="Search shops…" value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
                  {filtered.map(shop=>(
                    <div key={shop._id} className="hover-lift" style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", backdropFilter:"blur(12px)", cursor:"pointer" }} onClick={()=>setSelectedShop(shop)}>
                      <div style={{ display:"flex", gap:12, marginBottom:16, alignItems:"flex-start" }}>
                        <div className="avatar" style={{ width:44, height:44, background:avatarColor(shop.shopName), fontSize:17, flexShrink:0 }}>{initials(shop.shopName)}</div>
                        <div>
                          <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:2 }}>{shop.shopName}</h3>
                          <p style={{ fontSize:12, color:"rgba(164,196,255,0.4)" }}>{shop.location}</p>
                          <span className="tag tag-blue" style={{ marginTop:6, display:"inline-flex", fontSize:10 }}>{shop.category}</span>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                        {[["Orders",shop.orders],["Collabs",shop.collaborations]].map(([l,v])=>(
                          <div key={l} style={{ padding:10, borderRadius:10, border:"1px solid rgba(30,48,80,0.4)", background:"rgba(6,11,20,0.4)", textAlign:"center" }}>
                            <p style={{ fontSize:16, fontWeight:700, color:"#c8d4f0" }}>{v||0}</p>
                            <p style={{ fontSize:10, color:"rgba(164,196,255,0.3)" }}>{l}</p>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-outline" style={{ width:"100%", fontSize:13, padding:"10px", fontWeight:600 }}>View & Connect →</button>
                    </div>
                  ))}
                  {filtered.length === 0 && <p style={{ color:"rgba(164,196,255,0.3)", fontSize:14, gridColumn:"1/-1", textAlign:"center", padding:"40px 0" }}>No shops found matching "{search}"</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "received" && (
          <div style={{ display:"grid", gap:14 }}>
            {received.length === 0 && <div style={{ textAlign:"center", padding:60, color:"rgba(164,196,255,0.3)", fontSize:14 }}>No requests received yet</div>}
            {received.map(req=>(
              <div key={req._id} style={{ padding:24, borderRadius:20, border:`1.5px solid ${req.status==="pending"?"rgba(251,191,36,0.3)":req.status==="accepted"?"rgba(52,211,153,0.3)":"rgba(248,113,113,0.3)"}`, background:"rgba(14,24,41,0.7)", backdropFilter:"blur(12px)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <h3 style={{ fontWeight:700, color:"#c8d4f0", marginBottom:4 }}>From: {req.fromShop}</h3>
                    <p style={{ color:"rgba(164,196,255,0.5)", fontSize:13 }}>{req.message}</p>
                    <p style={{ color:"rgba(164,196,255,0.3)", fontSize:11, marginTop:6 }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusTag status={req.status.charAt(0).toUpperCase()+req.status.slice(1)} />
                </div>
                {req.status==="pending" && (
                  <div style={{ display:"flex", gap:10, marginTop:14 }}>
                    <button className="btn btn-success" style={{ flex:1, padding:"10px", fontWeight:700 }} onClick={()=>respondRequest(req._id,"accepted")}>✓ Accept</button>
                    <button className="btn btn-danger" style={{ flex:1, padding:"10px", fontWeight:700 }} onClick={()=>respondRequest(req._id,"rejected")}>✕ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "sent" && (
          <div style={{ display:"grid", gap:14 }}>
            {sent.length === 0 && <div style={{ textAlign:"center", padding:60, color:"rgba(164,196,255,0.3)", fontSize:14 }}>No requests sent yet</div>}
            {sent.map(req=>(
              <div key={req._id} style={{ padding:24, borderRadius:20, border:`1.5px solid ${req.status==="pending"?"rgba(251,191,36,0.3)":req.status==="accepted"?"rgba(52,211,153,0.3)":"rgba(248,113,113,0.3)"}`, background:"rgba(14,24,41,0.7)", backdropFilter:"blur(12px)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <h3 style={{ fontWeight:700, color:"#c8d4f0", marginBottom:4 }}>To: {req.toShop}</h3>
                    <p style={{ color:"rgba(164,196,255,0.5)", fontSize:13 }}>{req.message}</p>
                    <p style={{ color:"rgba(164,196,255,0.3)", fontSize:11, marginTop:6 }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusTag status={req.status.charAt(0).toUpperCase()+req.status.slice(1)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── AI CHATBOT ───────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function AiChatbot({ open, setOpen, currentUser }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", text:"Hi! I'm your BulkBuy assistant. Ask me about discounts, pooling, or your orders." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior:"smooth" }), [msgs]);

  const SUGGESTIONS = ["How does pooling work?","Check pool status","Best bulk deals today","How much will I save?"];

  const ask = async (q) => {
    if (!q.trim()) return;
    setInput("");
    setMsgs(prev=>[...prev, { role:"user", text:q }]);
    setLoading(true);
    const responses = {
      "pool|pooling": `Pooling is simple. You and nearby shop owners combine orders to reach a bulk threshold. Once the threshold is hit, everyone gets the discounted bulk price.\n\nExample: Rice needs 500kg total. You add 150kg, Priya Mart adds 120kg, Amit adds 80kg = 350kg. Just 150kg more to unlock 21% off.`,
      "discount|save|saving": `BulkBuy offers 15-30% discounts on bulk orders.\n\nCurrent deals:\n• Rice: 21% off at 500kg\n• LED Bulbs: 25% off at 250pcs\n• Sunflower Oil: 21% off at 300L\n\nThe more shops that contribute, the faster you reach the threshold.`,
      "status|current|progress": `Current pool status:\n• Rice: 430/500kg (86%) → Need 70kg more\n• LED Bulbs: 200/250pcs (80%) → Need 50pcs more\n• Oil: 120/300L (40%) → Need 180L more\n\nJoin any pool to help unlock the discount.`,
      "order|orders": `Your orders are in the Orders tab on your dashboard. You can track status from Pending → Approved → Paid → Shipped → Delivered.`,
      "hello|hi|hey|help": `Hi ${currentUser?.ownerName||"there"}! I can help with:\n\n• How pooling works\n• Current discount status\n• Product information\n• Order tracking\n• Savings calculations\n\nWhat would you like to know?`,
      "pay|payment": `Payments are processed securely through Razorpay. You can pay via UPI, credit/debit cards, net banking, or wallets. Your payment is only charged when the pool order is confirmed.`,
      "chat|connect|collab": `Go to the Shops tab to connect with nearby shop owners. Send collaboration requests and work together to pool larger orders for better discounts.`,
    };
    setTimeout(() => {
      const ql = q.toLowerCase();
      let reply = `I didn't quite get that. Try asking about pooling, discounts, your orders, or how to collaborate with other shops.`;
      for (const [k, r] of Object.entries(responses)) { if (k.split("|").some(kw=>ql.includes(kw))) { reply=r; break; } }
      setMsgs(prev=>[...prev, { role:"assistant", text:reply }]);
      setLoading(false);
    }, 500);
  };

  if (!open) return null;
  return (
    <div className="card-glow fade-in" style={{ position:"fixed", bottom:28, right:28, width:380, height:520, display:"flex", flexDirection:"column", zIndex:1001, overflow:"hidden", border:"1px solid rgba(79,124,255,0.3)", boxShadow:"0 24px 80px rgba(0,0,0,0.8)", borderRadius:24 }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(30,48,80,0.4)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(135deg,rgba(79,124,255,0.1),rgba(124,92,252,0.05))" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#4f7cff,#7c5cfc)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}><IcChat size={18} color="#ffffff" /></div>
          <div>
            <p style={{ fontWeight:700, fontSize:14, color:"#c8d4f0" }}>BulkBuy AI</p>
            <p style={{ fontSize:11, color:"#34d399", fontWeight:600 }}>● Online</p>
          </div>
        </div>
        <button onClick={()=>setOpen(false)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(164,196,255,0.5)", cursor:"pointer", fontSize:16, width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"88%", background:m.role==="user"?"linear-gradient(135deg,rgba(79,124,255,0.25),rgba(124,92,252,0.15))":"rgba(30,48,80,0.4)", border:`1px solid ${m.role==="user"?"rgba(79,124,255,0.3)":"rgba(30,48,80,0.5)"}`, borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"11px 15px", fontSize:13, color:"#c8d4f0", lineHeight:1.6, whiteSpace:"pre-wrap" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ display:"flex", gap:6, padding:"12px 16px", background:"rgba(30,48,80,0.4)", border:"1px solid rgba(30,48,80,0.5)", borderRadius:"16px 16px 16px 4px", width:"fit-content" }}>{[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"rgba(164,196,255,0.4)", animation:`pulse 1s ease ${i*0.15}s infinite` }} />)}</div>}
        <div ref={endRef} />
      </div>

      <div style={{ padding:"8px 14px", borderTop:"1px solid rgba(30,48,80,0.4)", display:"flex", gap:6, overflowX:"auto" }}>
        {SUGGESTIONS.map(s=><button key={s} className="btn btn-ghost" style={{ padding:"5px 10px", fontSize:11, whiteSpace:"nowrap", border:"1px solid rgba(30,48,80,0.5)", borderRadius:8, flexShrink:0 }} onClick={()=>ask(s)}>{s}</button>)}
      </div>

      <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(30,48,80,0.4)", display:"flex", gap:8 }}>
        <input className="inp" placeholder="Ask me anything…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask(input)} style={{ flex:1, fontSize:13 }} />
        <button className="btn btn-primary" style={{ padding:"10px 16px", fontSize:13, fontWeight:700 }} onClick={()=>ask(input)}><IcArrowRight size={14} color="#ffffff" /></button>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// ─── ADMIN APP ────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════
function AdminApp({ user, logout, showToast, toast, refresh }) {
  const [tab, setTab] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bulkbuy-theme');
    return saved || 'dark';
  });
  const [, forceUpdate] = useState(0);
  const r = () => forceUpdate(x=>x+1);
  const sideItems = [
    { id:"dashboard", icon:<IcBarChart size={18} />, label:"Dashboard" },
    { id:"products", icon:<IcPackage size={18} />, label:"Products" },
    { id:"orders", icon:<IcFileText size={18} />, label:"Orders" },
    { id:"payments", icon:<IcCreditCard size={18} />, label:"Payments" },
    { id:"delivery", icon:<IcTruck size={18} />, label:"Delivery" },
    { id:"users", icon:<IcUsers size={18} />, label:"Users" },
    { id:"analytics", icon:<IcPieChart size={18} />, label:"Analytics" },
    { id:"settings", icon:<IcSettings size={18} />, label:"Settings" },
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('bulkbuy-theme', newTheme);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--background)" }}>
      <GlobalStyles theme={theme} />
      <div style={{ width:260, background:"var(--card-background)", borderRight:"1px solid var(--card-border)", padding:"24px 16px", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32, paddingLeft:4 }}>
          <BulkBuyMark size={36} />
          <div>
            <p style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:18, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>BulkBuy</p>
            <p style={{ fontSize:10, color:"rgba(164,196,255,0.4)", fontWeight:600, letterSpacing:"2px", textTransform:"uppercase" }}>Admin Panel</p>
          </div>
        </div>
        {sideItems.map(s=>(
          <button key={s.id} onClick={()=>setTab(s.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, border:"none", background:tab===s.id?"rgba(79,124,255,0.15)":"transparent", color:tab===s.id?"#7c9cff":"rgba(164,196,255,0.5)", cursor:"pointer", fontSize:14, fontWeight:tab===s.id?600:500, fontFamily:"inherit", width:"100%", textAlign:"left", marginBottom:2, transition:"all 0.2s", borderLeft:`3px solid ${tab===s.id?"#4f7cff":"transparent"}` }}>
            <span style={{ display:"flex", alignItems:"center", color:tab===s.id?"#4f7cff":"rgba(164,196,255,0.4)" }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
        <div style={{ marginTop:"auto" }}>
          <div style={{ padding:"14px 12px", borderTop:"1px solid var(--card-border)", marginBottom:12 }}>
            <p style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Theme</p>
            <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
          </div>
          <div style={{ padding:"14px 12px", borderTop:"1px solid var(--card-border)", display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div className="avatar" style={{ width:32, height:32, background:"linear-gradient(135deg,#4f7cff,#7c5cfc)", fontSize:12, fontWeight:700 }}>AD</div>
            <div><p style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>Admin</p><p style={{ fontSize:11, color:"var(--text-muted)" }}>admin@bulkbuy.com</p></div>
          </div>
          <button className="btn btn-danger" style={{ width:"100%", fontSize:13, padding:"10px", gap:8 }} onClick={logout}><IcLogout size={16} />Sign Out</button>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
        {tab==="dashboard" && <AdminDashboard setTab={setTab} />}
        {tab==="products" && <AdminProducts showToast={showToast} refresh={r} />}
        {tab==="orders" && <AdminOrders showToast={showToast} refresh={r} />}
        {tab==="payments" && <AdminPayments />}
        {tab==="delivery" && <AdminDelivery showToast={showToast} refresh={r} />}
        {tab==="users" && <AdminUsers />}
        {tab==="analytics" && <AdminAnalytics />}
        {tab==="settings" && <AdminSettings />}
      </div>
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function AdminDashboard({ setTab }) {
  const pending = _orders.filter(o=>o.status==="Pending").length;
  const revenue = _orders.filter(o=>["Paid","Delivered"].includes(o.status)).reduce((s,o)=>s+o.totalAmount,0);
  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:26, fontWeight:900, color:"var(--text)", marginBottom:4 }}>Admin Dashboard</h2>
      <p style={{ color:"var(--text-muted)", marginBottom:28, fontSize:13 }}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:16, marginBottom:32 }}>
        {[
          { label:"Total Orders", value:_orders.length, icon:<IcPackage size={24} />, color:"#4f7cff" },
          { label:"Pending", value:pending, icon:<IcAlertTriangle size={24} />, color:"#fbbf24", alert:pending>0 },
          { label:"Revenue", value:fmt(revenue), icon:<IcDollar size={24} />, color:"#34d399" },
          { label:"Products", value:_products.length, icon:<IcTag size={24} />, color:"#a78bfa" },
          { label:"Users", value:_users.filter(u=>u.role!=="admin").length, icon:<IcUsers size={24} />, color:"#38bdf8" },
          { label:"Total Savings Given", value:fmt(_orders.reduce((s,o)=>s+o.saving,0)), icon:<IcAward size={24} />, color:"#f472b6" },
        ].map((s,i)=>(
          <div key={i} className="hover-lift" style={{ padding:22, borderRadius:18, border:`1px solid ${s.alert?"rgba(251,191,36,0.3)":"var(--card-border)"}`, background:"var(--card-background)", backdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}><span style={{ color:s.color }}>{s.icon}</span>{s.alert&&<span className="tag tag-amber" style={{ animation:"pulse 2s infinite", fontSize:10 }}>Action</span>}</div>
            <div style={{ fontSize:22, fontWeight:900, color:s.color, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)", fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ padding:24, borderRadius:20, border:"1px solid var(--card-border)", background:"var(--card-background)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}><IcAlertTriangle size={18} color="#fbbf24" /> Pending Approvals</h3>
          {_orders.filter(o=>o.status==="Pending").map(o=>(
            <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--card-border)" }}>
              <div><p style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{o.id}</p><p style={{ fontSize:12, color:"var(--text-muted)" }}>{o.product}</p></div>
              <button className="btn btn-outline" style={{ padding:"6px 14px", fontSize:12 }} onClick={()=>setTab("orders")}>Review</button>
            </div>
          ))}
          {pending===0 && <p style={{ color:"var(--text-muted)", fontSize:13, display:"flex", alignItems:"center", gap:6 }}><IcCheckCircle size={16} color="#22c55e" /> All clear! No pending orders</p>}
        </div>
        <div style={{ padding:24, borderRadius:20, border:"1px solid var(--card-border)", background:"var(--card-background)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}><IcTrendUp size={18} color="#4f7cff" /> Pool Activity</h3>
          {[...new Set(_poolCart.map(e=>e.productId))].map(pid => {
            const p = _products.find(pr=>pr.id===pid||(pr._id||"")===pid);
            if (!p) return null;
            const total = _poolCart.filter(e=>e.productId===pid).reduce((s,e)=>s+e.qty,0);
            const prog = Math.min((total/p.bulkThreshold)*100,100);
            return (
              <div key={pid} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                  <span style={{ color:"rgba(164,196,255,0.5)" }}>{p.name?.slice(0,24)}…</span>
                  <span style={{ color:"#4f7cff", fontWeight:600 }}>{Math.round(prog)}%</span>
                </div>
                <div className="progress-track" style={{ height:6 }}>
                  <div className="progress-fill" style={{ width:`${prog}%`, background:prog>=100?"linear-gradient(90deg,#34d399,#10b981)":"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function AdminProducts({ showToast, refresh }) {
  const [form, setForm] = useState({ name:"", category:"Grocery", price:"", bulkPrice:"", bulkThreshold:"", supplier:"", image:"", stock:"", unit:"pcs" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!form.name||!form.price||!form.bulkPrice||!form.bulkThreshold||!form.supplier) { showToast("Fill all required fields","error"); return; }
    setLoading(true);
    try {
      const body = { ...form, price:+form.price, bulkPrice:+form.bulkPrice, bulkThreshold:+form.bulkThreshold, stock:+(form.stock||1000) };
      if (editId) await apiFetch(`/api/products/${editId}`, { method:"PUT", body });
      else await apiFetch("/api/products", { method:"POST", body:{ ...body, rating:4.5, reviews:0 } });
      const all = await apiFetch("/api/products");
      if (Array.isArray(all)) _products = all;
      setShowForm(false); setEditId(null);
      setForm({ name:"", category:"Grocery", price:"", bulkPrice:"", bulkThreshold:"", supplier:"", image:"", stock:"", unit:"pcs" });
      showToast(editId?"Product updated!":"Product added!");
      refresh();
    } catch { showToast("Error saving product","error"); }
    setLoading(false);
  };

  const del = async (id) => {
    try {
      await apiFetch(`/api/products/${id}`, { method:"DELETE" });
      const all = await apiFetch("/api/products");
      if (Array.isArray(all)) _products = all;
      showToast("Product removed"); refresh();
    } catch { showToast("Error deleting","error"); }
  };

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div><h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:900, color:"#fff" }}>📦 Products</h2><p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginTop:3 }}>{_products.length} in catalog</p></div>
        <button className="btn btn-primary" onClick={()=>{setShowForm(!showForm);setEditId(null);setForm({ name:"", category:"Grocery", price:"", bulkPrice:"", bulkThreshold:"", supplier:"", image:"", stock:"", unit:"pcs" });}} style={{ fontWeight:700 }}>{showForm?"✕ Cancel":"+ Add Product"}</button>
      </div>
      {showForm && (
        <div style={{ padding:28, borderRadius:20, border:"1px solid rgba(79,124,255,0.3)", background:"rgba(14,24,41,0.8)", marginBottom:24 }} className="fade-in">
          <h3 style={{ fontSize:16, fontWeight:700, color:"#c8d4f0", marginBottom:20 }}>{editId?"Edit Product":"New Product"}</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ gridColumn:"1/-1" }}><label style={lblStyle}>Name *</label><input className="inp" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Premium Basmati Rice" /></div>
            <div><label style={lblStyle}>Category</label><select className="inp" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lblStyle}>Supplier *</label><input className="inp" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="AgriSupply Co." /></div>
            <div><label style={lblStyle}>Regular Price ₹ *</label><input className="inp" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="2800" /></div>
            <div><label style={lblStyle}>Bulk Price ₹ *</label><input className="inp" type="number" value={form.bulkPrice} onChange={e=>setForm({...form,bulkPrice:e.target.value})} placeholder="2200" /></div>
            <div><label style={lblStyle}>Bulk Threshold *</label><input className="inp" type="number" value={form.bulkThreshold} onChange={e=>setForm({...form,bulkThreshold:e.target.value})} placeholder="500" /></div>
            <div><label style={lblStyle}>Stock</label><input className="inp" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="5000" /></div>
            <div><label style={lblStyle}>Unit</label><input className="inp" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="kg / pcs / L" /></div>
            <div style={{ gridColumn:"1/-1" }}><label style={lblStyle}>Image URL</label><input className="inp" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://images.unsplash.com/…" /></div>
          </div>
          <button className="btn btn-primary" onClick={save} disabled={loading} style={{ width:"100%", padding:"13px", marginTop:20, fontWeight:700 }}>{loading?"Saving…":(editId?"Update Product ✓":"Add Product ✓")}</button>
        </div>
      )}
      <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"rgba(6,11,20,0.5)" }}>{["Image","Product","Category","Regular","Bulk","Disc","Threshold","Stock","Actions"].map(h=><th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"rgba(164,196,255,0.3)", textTransform:"uppercase", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>
              {_products.map(p=>(
                <tr key={p._id||p.id} style={{ borderBottom:"1px solid rgba(15,30,53,0.4)" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(79,124,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"12px 16px" }}><img src={p.image} alt={p.name} style={{ width:44, height:44, borderRadius:8, objectFit:"cover" }} onError={e=>{e.target.style.display="none";}} /></td>
                  <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:"#c8d4f0", minWidth:160 }}>{p.name}</td>
                  <td style={{ padding:"12px 16px" }}><span className="tag tag-blue" style={{ fontSize:10 }}>{p.category}</span></td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(164,196,255,0.4)" }}>{fmt(p.price)}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"#34d399", fontWeight:600 }}>{fmt(p.bulkPrice)}</td>
                  <td style={{ padding:"12px 16px" }}><span className="tag tag-green" style={{ fontSize:10 }}>-{pct(p.bulkPrice,p.price)}%</span></td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(164,196,255,0.4)" }}>{p.bulkThreshold} {p.unit}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(164,196,255,0.4)" }}>{p.stock?.toLocaleString?.()}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn btn-outline" style={{ padding:"5px 12px", fontSize:12 }} onClick={()=>{setForm({name:p.name,category:p.category,price:p.price.toString(),bulkPrice:p.bulkPrice.toString(),bulkThreshold:p.bulkThreshold.toString(),supplier:p.supplier,image:p.image||"",stock:(p.stock||0).toString(),unit:p.unit||"pcs"});setEditId(p._id||p.id);setShowForm(true);}}>Edit</button>
                      <button className="btn btn-danger" style={{ padding:"5px 12px", fontSize:12 }} onClick={()=>del(p._id||p.id)}>Del</button>
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

function AdminOrders({ showToast, refresh }) {
  const updateStatus = (id, status) => {
    const o = _orders.find(o=>o.id===id);
    if (o) { o.status=status; _notifications.unshift({ id:Date.now(), type:"delivery", msg:`Order ${id} updated to ${status}`, time:"Just now", icon: IcPackage, read:false }); showToast(`Order ${id} → ${status}`); refresh(); }
  };
  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:900, color:"#fff", marginBottom:4 }}>Order Management</h2>
      <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:24 }}>{_orders.length} total · {_orders.filter(o=>o.status==="Pending").length} pending approval</p>
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        {["Pending","Approved","Paid","Shipped","Delivered"].map(s=>(
          <div key={s} style={{ padding:"14px 18px", borderRadius:14, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", textAlign:"center", minWidth:100 }}>
            <p style={{ fontSize:22, fontWeight:900, color:s==="Pending"?"#fbbf24":s==="Delivered"?"#34d399":"#4f7cff", fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{_orders.filter(o=>o.status===s).length}</p>
            <p style={{ fontSize:11, color:"rgba(164,196,255,0.3)", marginTop:2 }}>{s}</p>
          </div>
        ))}
      </div>
      <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"rgba(6,11,20,0.5)" }}>{["Order ID","Product","Qty","Shops","Value","Savings","Status","Actions"].map(h=><th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"rgba(164,196,255,0.3)", textTransform:"uppercase", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>
              {_orders.map(o=>(
                <tr key={o.id} style={{ borderBottom:"1px solid rgba(15,30,53,0.4)" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(79,124,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:"#7c9cff" }}>{o.id}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, color:"#c8d4f0", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.product}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, color:"rgba(164,196,255,0.4)" }}>{o.qty}</td>
                  <td style={{ padding:"13px 16px" }}><div style={{ display:"flex" }}>{o.shops.slice(0,3).map((s,i)=><div key={i} className="avatar" style={{ width:24, height:24, background:avatarColor(s), fontSize:10, marginLeft:i>0?-6:0, border:"2px solid #0a1220" }}>{initials(s)}</div>)}</div></td>
                  <td style={{ padding:"13px 16px", fontSize:13, fontWeight:600, color:"#c8d4f0" }}>{fmt(o.totalAmount)}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, fontWeight:600, color:"#34d399" }}>{fmt(o.saving)}</td>
                  <td style={{ padding:"13px 16px" }}><StatusTag status={o.status} /></td>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      {o.status==="Pending"&&<><button className="btn btn-success" style={{ padding:"5px 12px", fontSize:11, fontWeight:700 }} onClick={()=>updateStatus(o.id,"Approved")}>✓ Approve</button><button className="btn btn-danger" style={{ padding:"5px 12px", fontSize:11 }} onClick={()=>updateStatus(o.id,"Rejected")}>✕</button></>}
                      {o.status==="Approved"&&<button className="btn btn-outline" style={{ padding:"5px 12px", fontSize:11 }} onClick={()=>updateStatus(o.id,"Paid")}>Mark Paid</button>}
                      {o.status==="Paid"&&<button className="btn btn-outline" style={{ padding:"5px 12px", fontSize:11 }} onClick={()=>updateStatus(o.id,"Shipped")}>Ship →</button>}
                      {o.status==="Shipped"&&<button className="btn btn-success" style={{ padding:"5px 12px", fontSize:11 }} onClick={()=>updateStatus(o.id,"Delivered")}>✓ Done</button>}
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

function AdminPayments() {
  const payments = _orders.map(o=>({ orderId:o.id, shop:o.shops[0]||"", product:o.product, amount:o.totalAmount, status:["Paid","Delivered"].includes(o.status)?"Paid":"Pending", date:o.date }));
  const paid = payments.filter(p=>p.status==="Paid");
  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:900, color:"#fff", marginBottom:24 }}>💳 Payments</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
        {[{ label:"Collected", value:fmt(paid.reduce((s,p)=>s+p.amount,0)), color:"#34d399", icon:"✅" }, { label:"Pending", value:fmt(payments.filter(p=>p.status==="Pending").reduce((s,p)=>s+p.amount,0)), color:"#fbbf24", icon:"⏳" }, { label:"Transactions", value:payments.length, color:"#4f7cff", icon:"📊" }].map((s,i)=>(
          <div key={i} style={{ padding:22, borderRadius:18, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)" }}>
            <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontSize:24, fontWeight:900, color:s.color, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:12, color:"rgba(164,196,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"rgba(6,11,20,0.5)" }}>{["Order","Shop","Product","Amount","Date","Status"].map(h=><th key={h} style={{ padding:"12px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"rgba(164,196,255,0.3)", textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>)}</tr></thead>
          <tbody>{payments.map((p,i)=><tr key={i} style={{ borderBottom:"1px solid rgba(15,30,53,0.4)" }}><td style={{ padding:"13px 18px", color:"#7c9cff", fontWeight:700, fontSize:13 }}>{p.orderId}</td><td style={{ padding:"13px 18px", color:"rgba(164,196,255,0.5)", fontSize:13 }}>{p.shop}</td><td style={{ padding:"13px 18px", color:"rgba(164,196,255,0.5)", fontSize:13 }}>{p.product}</td><td style={{ padding:"13px 18px", fontWeight:700, color:"#c8d4f0", fontSize:14 }}>{fmt(p.amount)}</td><td style={{ padding:"13px 18px", color:"rgba(164,196,255,0.4)", fontSize:13 }}>{p.date}</td><td style={{ padding:"13px 18px" }}><span className={`tag ${p.status==="Paid"?"tag-green":"tag-amber"}`}>{p.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDelivery({ showToast, refresh }) {
  const active = _orders.filter(o=>["Approved","Paid","Shipped"].includes(o.status));
  const upd = (id, status) => { const o=_orders.find(o=>o.id===id); if(o){o.status=status;showToast(`Order ${id} → ${status}`);refresh();} };
  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:900, color:"#fff", marginBottom:4 }}>🚚 Deliveries</h2>
      <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:24 }}>{active.length} active deliveries</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
        {active.map(o=>(
          <div key={o.id} style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div><p style={{ fontWeight:700, color:"#7c9cff", fontSize:15 }}>{o.id}</p><p style={{ fontSize:13, color:"rgba(164,196,255,0.4)", marginTop:3 }}>{o.product}</p></div>
              <StatusTag status={o.status} />
            </div>
            <div style={{ display:"flex", gap:4, marginBottom:18 }}>
              {STATUS_FLOW.map((s,i)=>{const cur=STATUS_FLOW.indexOf(o.status);return <div key={s} style={{ flex:1, height:3, borderRadius:2, background:i<=cur?"linear-gradient(90deg,#4f7cff,#7c5cfc)":"rgba(30,48,80,0.5)" }} />;})}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {o.status==="Approved"&&<button className="btn btn-outline" style={{ flex:1, padding:"9px", fontSize:12, fontWeight:700 }} onClick={()=>upd(o.id,"Paid")}>Mark Paid</button>}
              {o.status==="Paid"&&<button className="btn btn-outline" style={{ flex:1, padding:"9px", fontSize:12, fontWeight:700 }} onClick={()=>upd(o.id,"Shipped")}>Ship →</button>}
              {o.status==="Shipped"&&<button className="btn btn-success" style={{ flex:1, padding:"9px", fontSize:12, fontWeight:700 }} onClick={()=>upd(o.id,"Delivered")}>✓ Delivered</button>}
            </div>
          </div>
        ))}
        {active.length===0 && <p style={{ color:"rgba(164,196,255,0.3)", fontSize:14, gridColumn:"1/-1", textAlign:"center", padding:"60px 0" }}>No active deliveries</p>}
      </div>
    </div>
  );
}

function AdminUsers() {
  const owners = _users.filter(u=>u.role!=="admin");
  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:800, color:"#fff", marginBottom:4, display:"flex", alignItems:"center", gap:8 }}><IcUsers size={24} /> Users</h2>
      <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:24 }}>{owners.length} registered users</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
        {owners.map(u=>(
          <div key={u._id||u.id} className="hover-lift" style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:16 }}>
              <div className="avatar" style={{ width:44, height:44, background:avatarColor(u.ownerName||"U"), fontSize:16 }}>{initials(u.ownerName||"U")}</div>
              <div>
                <p style={{ fontWeight:700, color:"#c8d4f0", fontSize:15 }}>{u.shopName}</p>
                <p style={{ fontSize:13, color:"rgba(164,196,255,0.4)" }}>{u.ownerName}</p>
                <div style={{ display:"flex", gap:6, marginTop:6 }}>
                  <span className="tag tag-blue" style={{ fontSize:10 }}>{u.category}</span>
                  <span className="tag tag-green" style={{ fontSize:10 }}>✓ Active</span>
                </div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {[
                { icon:<IcMapPin size={14} />, label:u.location },
                { icon:<IcMail size={14} />, label:u.email },
                { icon:<IcPhone size={14} />, label:u.phone },
                { icon:<IcCalendar size={14} />, label:u.joinDate }
              ].map(({icon,label})=>(
                <div key={label} style={{ display:"flex", gap:8, fontSize:12 }}><span style={{ color:"rgba(164,196,255,0.5)" }}>{icon}</span><span style={{ color:"rgba(164,196,255,0.4)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{label}</span></div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, textAlign:"center" }}>
              {[["Orders",u.orders||0,"#4f7cff"],["Collabs",u.collaborations||0,"#a78bfa"],["Saved",fmt(u.totalSavings||0).slice(0,6),"#34d399"]].map(([l,v,c])=>(
                <div key={l}><p style={{ fontSize:14, fontWeight:800, color:c, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{v}</p><p style={{ fontSize:10, color:"rgba(164,196,255,0.3)" }}>{l}</p></div>
              ))}
            </div>
          </div>
        ))}
        {owners.length===0 && <p style={{ color:"rgba(164,196,255,0.3)", fontSize:14, gridColumn:"1/-1", textAlign:"center", padding:"60px 0" }}>No users yet</p>}
      </div>
    </div>
  );
}

function AdminAnalytics() {
  const categoryStats = CATEGORIES.slice(1).map(cat => ({
    category: cat,
    count: _products.filter(p => p.category === cat).length,
    revenue: _orders.filter(o => o.product && _products.find(p => p.name === o.product)?.category === cat).reduce((s,o) => s + o.totalAmount, 0)
  }));

  const monthlyData = [
    { month: 'Jan', orders: 45, revenue: 125000 },
    { month: 'Feb', orders: 52, revenue: 142000 },
    { month: 'Mar', orders: 38, revenue: 98000 },
    { month: 'Apr', orders: 65, revenue: 178000 },
    { month: 'May', orders: 58, revenue: 156000 },
    { month: 'Jun', orders: 72, revenue: 195000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxOrders = Math.max(...monthlyData.map(d => d.orders));

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:800, color:"var(--text)", marginBottom:4, display:"flex", alignItems:"center", gap:8 }}><IcPieChart size={24} /> Analytics</h2>
      <p style={{ color:"var(--text-muted)", fontSize:13, marginBottom:28 }}>Business insights and performance metrics</p>
      
      {/* Key Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
        {[
          { label:"Total Revenue", value:fmt(_orders.reduce((s,o)=>s+o.totalAmount,0)), icon:<IcDollar size={22} />, color:"#34d399", bg:"rgba(52,211,153,0.08)" },
          { label:"Total Orders", value:_orders.length, icon:<IcFileText size={22} />, color:"#4f7cff", bg:"rgba(79,124,255,0.08)" },
          { label:"Active Users", value:_users.filter(u=>u.role!=="admin").length, icon:<IcUsers size={22} />, color:"#a78bfa", bg:"rgba(167,139,250,0.08)" },
          { label:"Total Savings", value:fmt(_orders.reduce((s,o)=>s+o.saving,0)), icon:<IcAward size={22} />, color:"#fbbf24", bg:"rgba(251,191,36,0.08)" },
        ].map((stat,i) => (
          <div key={i} style={{ padding:20, borderRadius:16, border:"1px solid var(--card-border)", background:stat.bg, backdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ color:stat.color }}>{stat.icon}</span>
              <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:600 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:stat.color, fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(400px,1fr))", gap:20, marginBottom:28 }}>
        {/* Revenue Chart */}
        <div style={{ padding:24, borderRadius:20, border:"1px solid var(--card-border)", background:"var(--card-background)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><IcBarChart size={18} color="#4f7cff" /> Monthly Revenue</h3>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:180 }}>
            {monthlyData.map((d,i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ width:"100%", background:"linear-gradient(180deg,#4f7cff,#7c5cfc)", borderRadius:8, height:`${(d.revenue/maxRevenue)*100}%`, minHeight:20, transition:"all 0.3s", position:"relative" }} />
                <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:500 }}>{d.month}</span>
                <span style={{ fontSize:10, color:"#4f7cff" }}>{fmt(d.revenue/1000)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div style={{ padding:24, borderRadius:20, border:"1px solid var(--card-border)", background:"var(--card-background)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><IcPackage size={18} color="#a78bfa" /> Monthly Orders</h3>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:180 }}>
            {monthlyData.map((d,i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ width:"100%", background:"linear-gradient(180deg,#a78bfa,#8b5cf6)", borderRadius:8, height:`${(d.orders/maxOrders)*100}%`, minHeight:20, transition:"all 0.3s" }} />
                <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:500 }}>{d.month}</span>
                <span style={{ fontSize:10, color:"#a78bfa" }}>{d.orders}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20, marginBottom:28 }}>
        <div style={{ padding:24, borderRadius:20, border:"1px solid var(--card-border)", background:"var(--card-background)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}><IcBarChart size={18} color="#4f7cff" /> Revenue by Category</h3>
          {categoryStats.map(cat => (
            <div key={cat.category} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}>
                <span style={{ color:"var(--text-muted)" }}>{cat.category}</span>
                <span style={{ color:"#4f7cff", fontWeight:600 }}>{fmt(cat.revenue)}</span>
              </div>
              <div className="progress-track" style={{ height:8 }}>
                <div className="progress-fill" style={{ width:`${Math.min((cat.revenue/Math.max(...categoryStats.map(c=>c.revenue)))*100,100)}%`, background:"linear-gradient(90deg,#4f7cff,#7c5cfc)" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding:24, borderRadius:20, border:"1px solid var(--card-border)", background:"var(--card-background)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}><IcPackage size={18} color="#a78bfa" /> Product Distribution</h3>
          {categoryStats.map(cat => (
            <div key={cat.category} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--card-border)" }}>
              <span style={{ fontSize:13, color:"var(--text-muted)" }}>{cat.category}</span>
              <span className="tag tag-purple" style={{ fontSize:11 }}>{cat.count} products</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:24, borderRadius:20, border:"1px solid var(--card-border)", background:"var(--card-background)" }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}><IcTrendUp size={18} color="#34d399" /> Order Status Distribution</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
          {[
            { label:"Total Orders", value:_orders.length, icon:<IcFileText size={20} />, color:"#4f7cff" },
            { label:"Completed", value:_orders.filter(o=>o.status==="Delivered").length, icon:<IcCheckCircle size={20} />, color:"#22c55e" },
            { label:"Pending", value:_orders.filter(o=>o.status==="Pending").length, icon:<IcAlertTriangle size={20} />, color:"#fbbf24" },
            { label:"In Transit", value:_orders.filter(o=>o.status==="Shipped").length, icon:<IcTruck size={20} />, color:"#a78bfa" },
          ].map((stat,i) => (
            <div key={i} style={{ padding:16, borderRadius:12, background:"rgba(8,16,32,0.5)", border:"1px solid var(--card-border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ color:stat.color }}>{stat.icon}</span>
                <span style={{ fontSize:12, color:"rgba(164,196,255,0.4)" }}>{stat.label}</span>
              </div>
              <div style={{ fontSize:24, fontWeight:800, color:stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "BulkBuy",
    supportEmail: "support@bulkbuy.com",
    maintenanceMode: false,
    allowRegistrations: true,
    minOrderQty: 50,
    maxOrderQty: 10000
  });

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Manrope','Inter','Helvetica Neue',sans-serif", fontSize:24, fontWeight:800, color:"#fff", marginBottom:4, display:"flex", alignItems:"center", gap:8 }}><IcSettings size={24} /> Settings</h2>
      <p style={{ color:"rgba(164,196,255,0.4)", fontSize:13, marginBottom:28 }}>Configure platform settings and preferences</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(350px,1fr))", gap:20 }}>
        <div style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><IcBuilding size={18} color="#4f7cff" /> General Settings</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ fontSize:12, color:"rgba(164,196,255,0.5)", marginBottom:6, display:"block" }}>Site Name</label>
              <input className="inp" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(164,196,255,0.5)", marginBottom:6, display:"block" }}>Support Email</label>
              <input className="inp" value={settings.supportEmail} onChange={e => setSettings({...settings, supportEmail: e.target.value})} />
            </div>
          </div>
        </div>

        <div style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><IcShield size={18} color="#a78bfa" /> Platform Controls</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(15,30,53,0.4)" }}>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:"#c8d4f0" }}>Maintenance Mode</p>
                <p style={{ fontSize:11, color:"rgba(164,196,255,0.4)" }}>Disable platform for maintenance</p>
              </div>
              <button className={`btn ${settings.maintenanceMode ? "btn-danger" : "btn-success"}`} style={{ padding:"8px 16px", fontSize:12 }}>
                {settings.maintenanceMode ? "Enabled" : "Disabled"}
              </button>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0" }}>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:"#c8d4f0" }}>Allow Registrations</p>
                <p style={{ fontSize:11, color:"rgba(164,196,255,0.4)" }}>Enable new user signups</p>
              </div>
              <button className={`btn ${settings.allowRegistrations ? "btn-success" : "btn-danger"}`} style={{ padding:"8px 16px", fontSize:12 }}>
                {settings.allowRegistrations ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding:24, borderRadius:20, border:"1px solid rgba(30,48,80,0.5)", background:"rgba(14,24,41,0.7)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#c8d4f0", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><IcLayers size={18} color="#34d399" /> Order Limits</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ fontSize:12, color:"rgba(164,196,255,0.5)", marginBottom:6, display:"block" }}>Minimum Order Quantity</label>
              <input className="inp" type="number" value={settings.minOrderQty} onChange={e => setSettings({...settings, minOrderQty: parseInt(e.target.value)})} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(164,196,255,0.5)", marginBottom:6, display:"block" }}>Maximum Order Quantity</label>
              <input className="inp" type="number" value={settings.maxOrderQty} onChange={e => setSettings({...settings, maxOrderQty: parseInt(e.target.value)})} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop:24, display:"flex", justifyContent:"flex-end", gap:12 }}>
        <button className="btn btn-outline">Reset to Defaults</button>
        <button className="btn btn-primary" style={{ gap:8 }}><IcSave size={16} /> Save Changes</button>
      </div>
    </div>
  );
}

