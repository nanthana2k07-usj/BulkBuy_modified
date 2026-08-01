import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bulkbuy')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ─── SCHEMAS ───────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  ownerName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  shopName: String,
  location: String,
  category: String,
  totalSavings: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  collaborations: { type: Number, default: 0 },
  role: { type: String, default: 'owner' },
  joinDate: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  bulkPrice: Number,
  bulkThreshold: Number,
  supplier: String,
  rating: Number,
  reviews: Number,
  image: String,
  stock: Number,
  unit: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedByShopName: String,
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  product: String,
  qty: Number,
  status: String,
  shops: [String],
  saving: Number,
  date: String,
  totalAmount: Number,
  shopBreakdown: Array,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// ─── DEMO DATA ─────────────────────────────────────────────────────────────────

const demoUsers = [
  { id: 1, ownerName: "Rajesh Kumar", email: "rajesh@shop.com", password: "pass123", phone: "9876543210", shopName: "Rajesh General Store", location: "MG Road, Pune", category: "Grocery", totalSavings: 4200, orders: 12, collaborations: 5, role: "owner", joinDate: "Jan 2024" },
  { id: 2, ownerName: "Priya Sharma", email: "priya@shop.com", password: "pass123", phone: "9812345678", shopName: "Priya Mart", location: "FC Road, Pune", category: "Grocery", totalSavings: 2800, orders: 8, collaborations: 3, role: "owner", joinDate: "Feb 2024" },
  { id: 3, ownerName: "Amit Patel", email: "amit@shop.com", password: "pass123", phone: "9823456789", shopName: "Amit Electronics", location: "Kothrud, Pune", category: "Electronics", totalSavings: 6100, orders: 15, collaborations: 7, role: "owner", joinDate: "Dec 2023" },
  { id: 4, ownerName: "Suresh Reddy", email: "suresh@shop.com", password: "pass123", phone: "9834567890", shopName: "Suresh Wholesale", location: "Camp, Pune", category: "Grocery", totalSavings: 5400, orders: 18, collaborations: 8, role: "owner", joinDate: "Mar 2024" },
  { id: 5, ownerName: "Anita Desai", email: "anita@shop.com", password: "pass123", phone: "9845678901", shopName: "Anita Textiles", location: "Laxmi Road, Pune", category: "Clothes", totalSavings: 3200, orders: 10, collaborations: 4, role: "owner", joinDate: "Jan 2024" },
  { id: 6, ownerName: "Vikram Singh", email: "vikram@shop.com", password: "pass123", phone: "9856789012", shopName: "Vikram Stationery", location: "Deccan, Pune", category: "Stationery", totalSavings: 1900, orders: 6, collaborations: 2, role: "owner", joinDate: "Apr 2024" },
  { id: 7, ownerName: "Meena Joshi", email: "meena@shop.com", password: "pass123", phone: "9867890123", shopName: "Meena Cosmetics", location: "Koregaon Park, Pune", category: "Cosmetics", totalSavings: 4100, orders: 14, collaborations: 6, role: "owner", joinDate: "Feb 2024" },
  { id: 8, ownerName: "Rahul Mehta", email: "rahul@shop.com", password: "pass123", phone: "9878901234", shopName: "Rahul Electronics", location: "Shivaji Nagar, Pune", category: "Electronics", totalSavings: 7300, orders: 22, collaborations: 9, role: "owner", joinDate: "Nov 2023" },
  { id: 9, ownerName: "Kavita Nair", email: "kavita@shop.com", password: "pass123", phone: "9889012345", shopName: "Kavita General Store", location: "Bibvewadi, Pune", category: "Grocery", totalSavings: 3600, orders: 11, collaborations: 5, role: "owner", joinDate: "Mar 2024" },
  { id: 10, ownerName: "Deepak Verma", email: "deepak@shop.com", password: "pass123", phone: "9890123456", shopName: "Deepak Hardware", location: "Narhe, Pune", category: "Electronics", totalSavings: 5800, orders: 17, collaborations: 7, role: "owner", joinDate: "Jan 2024" },
  { id: 98, ownerName: "Super Admin", email: "superadmin@bulkbuy.com", password: "admin123", phone: "8888888888", shopName: "BulkBuy Super Admin", location: "HQ", category: "All", totalSavings: 0, orders: 0, collaborations: 0, role: "admin", joinDate: "Jan 2024" },
  { id: 99, ownerName: "Admin", email: "admin@bulkbuy.com", password: "admin123", phone: "9999999999", shopName: "BulkBuy Admin", location: "HQ", category: "All", totalSavings: 0, orders: 0, collaborations: 0, role: "admin", joinDate: "Jan 2024" },
];

const demoProducts = [
  { name: "Premium Basmati Rice (50kg)", category: "Grocery", price: 2800, bulkPrice: 2200, bulkThreshold: 500, supplier: "AgriSupply Co.", rating: 4.7, reviews: 128, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop", stock: 5000, unit: "kg" },
  { name: "Refined Sunflower Oil (15L)", category: "Grocery", price: 1650, bulkPrice: 1300, bulkThreshold: 300, supplier: "PureOil Ltd.", rating: 4.5, reviews: 94, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop", stock: 3000, unit: "L" },
  { name: "Cotton T-Shirts Bundle (50pcs)", category: "Clothes", price: 4500, bulkPrice: 3200, bulkThreshold: 200, supplier: "TextilePro", rating: 4.3, reviews: 67, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop", stock: 2000, unit: "pcs" },
  { name: "A4 Paper Reams (10 packs)", category: "Stationery", price: 850, bulkPrice: 620, bulkThreshold: 100, supplier: "PaperWorld", rating: 4.6, reviews: 201, image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&h=300&fit=crop", stock: 10000, unit: "packs" },
  { name: "LED Bulbs Pack (50pcs)", category: "Electronics", price: 3200, bulkPrice: 2400, bulkThreshold: 250, supplier: "LightTech", rating: 4.4, reviews: 88, image: "https://images.unsplash.com/photo-1565814636199-ae8133055a1c?w=400&h=300&fit=crop", stock: 4000, unit: "pcs" },
  { name: "Face Cream Wholesale (100pcs)", category: "Cosmetics", price: 6800, bulkPrice: 5100, bulkThreshold: 400, supplier: "GlowCo", rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=300&fit=crop", stock: 2000, unit: "pcs" },
  { name: "Wheat Flour (25kg)", category: "Grocery", price: 950, bulkPrice: 720, bulkThreshold: 400, supplier: "FreshMill", rating: 4.6, reviews: 310, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop", stock: 8000, unit: "kg" },
  { name: "Sugar (50kg)", category: "Grocery", price: 2200, bulkPrice: 1750, bulkThreshold: 600, supplier: "SweetFarm", rating: 4.4, reviews: 190, image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=300&fit=crop", stock: 6000, unit: "kg" },
  { name: "Notebook Bundle (100pcs)", category: "Stationery", price: 3200, bulkPrice: 2300, bulkThreshold: 200, supplier: "WriteRight", rating: 4.5, reviews: 142, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop", stock: 5000, unit: "pcs" },
  { name: "Mobile Chargers (20pcs)", category: "Electronics", price: 2800, bulkPrice: 1900, bulkThreshold: 150, supplier: "TechHub", rating: 4.2, reviews: 76, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop", stock: 3000, unit: "pcs" },
  { name: "Shampoo Wholesale (200ml×50)", category: "Cosmetics", price: 4500, bulkPrice: 3400, bulkThreshold: 300, supplier: "CareMore", rating: 4.6, reviews: 112, image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=300&fit=crop", stock: 4000, unit: "pcs" },
  { name: "Denim Jeans Bundle (30pcs)", category: "Clothes", price: 9000, bulkPrice: 6500, bulkThreshold: 150, supplier: "FashionBulk", rating: 4.3, reviews: 58, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop", stock: 1500, unit: "pcs" },
  { name: "Toothpaste Wholesale (100pcs)", category: "Cosmetics", price: 2800, bulkPrice: 2100, bulkThreshold: 200, supplier: "DentalCare", rating: 4.4, reviews: 89, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=300&fit=crop", stock: 3000, unit: "pcs" },
  { name: "Biscuits Pack (50 boxes)", category: "Grocery", price: 1500, bulkPrice: 1100, bulkThreshold: 250, supplier: "SnackTime", rating: 4.5, reviews: 167, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop", stock: 4500, unit: "boxes" },
  { name: "Plastic Containers (50pcs)", category: "Household", price: 2200, bulkPrice: 1600, bulkThreshold: 180, supplier: "HomeEssentials", rating: 4.2, reviews: 73, image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop", stock: 2500, unit: "pcs" },
  { name: "Detergent Powder (50kg)", category: "Household", price: 3500, bulkPrice: 2600, bulkThreshold: 300, supplier: "CleanHome", rating: 4.6, reviews: 145, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop", stock: 4000, unit: "kg" },
  { name: "Cooking Oil (20L)", category: "Grocery", price: 2100, bulkPrice: 1650, bulkThreshold: 400, supplier: "OilMasters", rating: 4.5, reviews: 198, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop", stock: 5500, unit: "L" },
  { name: "Pens Box (100pcs)", category: "Stationery", price: 1200, bulkPrice: 850, bulkThreshold: 150, supplier: "WritePro", rating: 4.3, reviews: 112, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop", stock: 6000, unit: "pcs" },
  { name: "Soap Bars (100pcs)", category: "Cosmetics", price: 1800, bulkPrice: 1300, bulkThreshold: 250, supplier: "FreshFeel", rating: 4.4, reviews: 134, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop", stock: 3500, unit: "pcs" },
  { name: "Tea Powder (25kg)", category: "Grocery", price: 4200, bulkPrice: 3200, bulkThreshold: 350, supplier: "TeaGarden", rating: 4.7, reviews: 178, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop", stock: 2800, unit: "kg" },
  { name: "Coffee Powder (20kg)", category: "Grocery", price: 5600, bulkPrice: 4200, bulkThreshold: 200, supplier: "CoffeeBean", rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop", stock: 2200, unit: "kg" },
  { name: "Power Banks (50pcs)", category: "Electronics", price: 7500, bulkPrice: 5500, bulkThreshold: 100, supplier: "ChargeMaster", rating: 4.5, reviews: 89, image: "https://images.unsplash.com/photo-1609592808586-88d5c5e33f9f?w=400&h=300&fit=crop", stock: 1800, unit: "pcs" },
  { name: "Bluetooth Speakers (30pcs)", category: "Electronics", price: 12000, bulkPrice: 9000, bulkThreshold: 80, supplier: "SoundPro", rating: 4.6, reviews: 67, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop", stock: 1200, unit: "pcs" },
  { name: "Hand Towels (100pcs)", category: "Household", price: 2400, bulkPrice: 1800, bulkThreshold: 200, supplier: "TextileHome", rating: 4.3, reviews: 98, image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop", stock: 3000, unit: "pcs" },
  { name: "Glass Cups (50pcs)", category: "Household", price: 2800, bulkPrice: 2000, bulkThreshold: 150, supplier: "GlassWare", rating: 4.4, reviews: 76, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop", stock: 2000, unit: "pcs" },
  { name: "Socks Bundle (100 pairs)", category: "Clothes", price: 3800, bulkPrice: 2800, bulkThreshold: 250, supplier: "SockWorld", rating: 4.2, reviews: 54, image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=300&fit=crop", stock: 4000, unit: "pairs" },
  { name: "Lipstick Set (50pcs)", category: "Cosmetics", price: 5200, bulkPrice: 3800, bulkThreshold: 180, supplier: "BeautyPlus", rating: 4.7, reviews: 123, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop", stock: 2500, unit: "pcs" },
  { name: "Screwdriver Set (20pcs)", category: "Household", price: 3200, bulkPrice: 2400, bulkThreshold: 120, supplier: "ToolMaster", rating: 4.5, reviews: 87, image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop", stock: 1500, unit: "pcs" },
  { name: "Mops (30pcs)", category: "Household", price: 2700, bulkPrice: 2000, bulkThreshold: 100, supplier: "CleanTools", rating: 4.3, reviews: 65, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop", stock: 1200, unit: "pcs" },
  { name: "Chips Pack (100 bags)", category: "Grocery", price: 2200, bulkPrice: 1600, bulkThreshold: 300, supplier: "SnackWorld", rating: 4.4, reviews: 189, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop", stock: 5000, unit: "bags" },
  { name: "Water Bottles (50pcs)", category: "Household", price: 3500, bulkPrice: 2600, bulkThreshold: 200, supplier: "HydraLife", rating: 4.6, reviews: 145, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop", stock: 3000, unit: "pcs" },
  { name: "Mouse Pads (100pcs)", category: "Electronics", price: 1800, bulkPrice: 1300, bulkThreshold: 250, supplier: "DeskPro", rating: 4.2, reviews: 78, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop", stock: 4000, unit: "pcs" },
  { name: "USB Cables (100pcs)", category: "Electronics", price: 1500, bulkPrice: 1100, bulkThreshold: 200, supplier: "CablePro", rating: 4.3, reviews: 92, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", stock: 5000, unit: "pcs" },
  { name: "HDMI Cables (50pcs)", category: "Electronics", price: 3200, bulkPrice: 2400, bulkThreshold: 100, supplier: "ConnectMax", rating: 4.5, reviews: 68, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop", stock: 2500, unit: "pcs" },
  { name: "Memory Cards (50pcs)", category: "Electronics", price: 4500, bulkPrice: 3400, bulkThreshold: 80, supplier: "StoragePro", rating: 4.6, reviews: 84, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop", stock: 2000, unit: "pcs" },
  { name: "Headphones (30pcs)", category: "Electronics", price: 8500, bulkPrice: 6200, bulkThreshold: 60, supplier: "AudioMax", rating: 4.7, reviews: 112, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", stock: 1500, unit: "pcs" },
  { name: "Keyboard (50pcs)", category: "Electronics", price: 6800, bulkPrice: 5000, bulkThreshold: 100, supplier: "TypeMaster", rating: 4.4, reviews: 95, image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=400&h=300&fit=crop", stock: 2200, unit: "pcs" },
  { name: "Webcams (30pcs)", category: "Electronics", price: 9200, bulkPrice: 6900, bulkThreshold: 50, supplier: "VisionPro", rating: 4.5, reviews: 73, image: "https://images.unsplash.com/photo-1587825140608-a67e5b5bec91?w=400&h=300&fit=crop", stock: 1200, unit: "pcs" },
  { name: "Tablet Stands (40pcs)", category: "Electronics", price: 3800, bulkPrice: 2800, bulkThreshold: 120, supplier: "StandPro", rating: 4.3, reviews: 58, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop", stock: 1800, unit: "pcs" },
  { name: "Laptop Bags (30pcs)", category: "Electronics", price: 7200, bulkPrice: 5400, bulkThreshold: 70, supplier: "BagMaster", rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", stock: 1400, unit: "pcs" },
  { name: "Screen Protectors (100pcs)", category: "Electronics", price: 2200, bulkPrice: 1600, bulkThreshold: 200, supplier: "ScreenGuard", rating: 4.2, reviews: 134, image: "https://images.unsplash.com/photo-1565814636199-ae8133055a1c?w=400&h=300&fit=crop", stock: 4500, unit: "pcs" },
  { name: "Dry Fruits Mix (25kg)", category: "Grocery", price: 8500, bulkPrice: 6400, bulkThreshold: 150, supplier: "NutriFresh", rating: 4.8, reviews: 167, image: "https://images.unsplash.com/photo-1596597615978-2c3a866d1a5c?w=400&h=300&fit=crop", stock: 3000, unit: "kg" },
  { name: "Spices Box (50 packs)", category: "Grocery", price: 3200, bulkPrice: 2400, bulkThreshold: 200, supplier: "SpiceWorld", rating: 4.5, reviews: 145, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop", stock: 4000, unit: "packs" },
  { name: "Honey (20L)", category: "Grocery", price: 6800, bulkPrice: 5100, bulkThreshold: 100, supplier: "BeePure", rating: 4.7, reviews: 98, image: "https://images.unsplash.com/photo-1587049352886-4f222e3448c1?w=400&h=300&fit=crop", stock: 2000, unit: "L" },
  { name: "Peanut Butter (50 jars)", category: "Grocery", price: 4500, bulkPrice: 3400, bulkThreshold: 180, supplier: "SpreadMax", rating: 4.4, reviews: 112, image: "https://images.unsplash.com/photo-1612196808214-b8e1d4145b8c?w=400&h=300&fit=crop", stock: 3500, unit: "jars" },
  { name: "Jam (100 bottles)", category: "Grocery", price: 3800, bulkPrice: 2800, bulkThreshold: 250, supplier: "FruitFresh", rating: 4.3, reviews: 87, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop", stock: 5000, unit: "bottles" },
  { name: "Oats (50kg)", category: "Grocery", price: 2800, bulkPrice: 2100, bulkThreshold: 300, supplier: "GrainGood", rating: 4.5, reviews: 156, image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop", stock: 6000, unit: "kg" },
  { name: "Cornflakes (100 boxes)", category: "Grocery", price: 3200, bulkPrice: 2400, bulkThreshold: 200, supplier: "BreakfastPro", rating: 4.4, reviews: 134, image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop", stock: 4500, unit: "boxes" },
  { name: "Towels (50pcs)", category: "Household", price: 4200, bulkPrice: 3100, bulkThreshold: 150, supplier: "SoftTouch", rating: 4.5, reviews: 98, image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop", stock: 2800, unit: "pcs" },
  { name: "Bed Sheets (30pcs)", category: "Household", price: 8500, bulkPrice: 6400, bulkThreshold: 80, supplier: "ComfortHome", rating: 4.6, reviews: 76, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop", stock: 1800, unit: "pcs" },
  { name: "Pillows (40pcs)", category: "Household", price: 5600, bulkPrice: 4200, bulkThreshold: 100, supplier: "SleepWell", rating: 4.4, reviews: 89, image: "https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=400&h=300&fit=crop", stock: 2200, unit: "pcs" },
  { name: "Curtains (20 sets)", category: "Household", price: 9200, bulkPrice: 6900, bulkThreshold: 50, supplier: "DrapeStyle", rating: 4.3, reviews: 67, image: "https://images.unsplash.com/photo-1616486338824-4d1b6e9e7b9c?w=400&h=300&fit=crop", stock: 1200, unit: "sets" },
  { name: "Blankets (25pcs)", category: "Household", price: 7800, bulkPrice: 5800, bulkThreshold: 60, supplier: "WarmCozy", rating: 4.7, reviews: 112, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop", stock: 1500, unit: "pcs" },
  { name: "Masks (500pcs)", category: "Household", price: 2500, bulkPrice: 1800, bulkThreshold: 400, supplier: "SafeGuard", rating: 4.2, reviews: 234, image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=300&fit=crop", stock: 8000, unit: "pcs" },
  { name: "Gloves (100 pairs)", category: "Household", price: 1800, bulkPrice: 1300, bulkThreshold: 200, supplier: "HandProtect", rating: 4.3, reviews: 145, image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop", stock: 4000, unit: "pairs" },
  { name: "Sponges (200pcs)", category: "Household", price: 1200, bulkPrice: 900, bulkThreshold: 300, supplier: "CleanSponge", rating: 4.1, reviews: 89, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop", stock: 6000, unit: "pcs" },
  { name: "Buckets (50pcs)", category: "Household", price: 3200, bulkPrice: 2400, bulkThreshold: 120, supplier: "BucketPro", rating: 4.4, reviews: 76, image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop", stock: 2500, unit: "pcs" },
  { name: "Mugs (100pcs)", category: "Household", price: 2800, bulkPrice: 2100, bulkThreshold: 200, supplier: "MugWorld", rating: 4.5, reviews: 134, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop", stock: 4500, unit: "pcs" },
  { name: "Plates (100pcs)", category: "Household", price: 3500, bulkPrice: 2600, bulkThreshold: 180, supplier: "PlatePro", rating: 4.3, reviews: 98, image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop", stock: 4000, unit: "pcs" },
  { name: "Bowls (100pcs)", category: "Household", price: 3200, bulkPrice: 2400, bulkThreshold: 200, supplier: "BowlMaster", rating: 4.4, reviews: 87, image: "https://images.unsplash.com/photo-1578985043833-19aa737e6603?w=400&h=300&fit=crop", stock: 4200, unit: "pcs" },
  { name: "Sneakers (50 pairs)", category: "Clothes", price: 12500, bulkPrice: 9400, bulkThreshold: 80, supplier: "SneakerPro", rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", stock: 2000, unit: "pairs" },
  { name: "Sweatshirts (40pcs)", category: "Clothes", price: 8800, bulkPrice: 6600, bulkThreshold: 100, supplier: "WearComfort", rating: 4.5, reviews: 112, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop", stock: 1800, unit: "pcs" },
  { name: "Jackets (30pcs)", category: "Clothes", price: 15000, bulkPrice: 11200, bulkThreshold: 60, supplier: "JacketWorld", rating: 4.7, reviews: 89, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop", stock: 1400, unit: "pcs" },
  { name: "Caps (100pcs)", category: "Clothes", price: 2800, bulkPrice: 2100, bulkThreshold: 250, supplier: "CapStyle", rating: 4.3, reviews: 134, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop", stock: 5000, unit: "pcs" },
  { name: "Belts (100pcs)", category: "Clothes", price: 4200, bulkPrice: 3100, bulkThreshold: 200, supplier: "BeltMaster", rating: 4.4, reviews: 98, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", stock: 4000, unit: "pcs" },
  { name: "Wallets (50pcs)", category: "Clothes", price: 5600, bulkPrice: 4200, bulkThreshold: 120, supplier: "WalletPro", rating: 4.5, reviews: 76, image: "https://images.unsplash.com/photo-1627123424574-724756594e93?w=400&h=300&fit=crop", stock: 2200, unit: "pcs" },
  { name: "Sunglasses (50pcs)", category: "Clothes", price: 7200, bulkPrice: 5400, bulkThreshold: 80, supplier: "ShadeStyle", rating: 4.6, reviews: 87, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop", stock: 1800, unit: "pcs" },
  { name: "Watches (40pcs)", category: "Clothes", price: 18500, bulkPrice: 13800, bulkThreshold: 50, supplier: "TimeMaster", rating: 4.8, reviews: 145, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop", stock: 1500, unit: "pcs" },
  { name: "Perfume (50 bottles)", category: "Cosmetics", price: 9800, bulkPrice: 7300, bulkThreshold: 100, supplier: "ScentPro", rating: 4.7, reviews: 167, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop", stock: 2500, unit: "bottles" },
  { name: "Nail Polish (100 bottles)", category: "Cosmetics", price: 3200, bulkPrice: 2400, bulkThreshold: 250, supplier: "ColorGlam", rating: 4.4, reviews: 134, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop", stock: 5000, unit: "bottles" },
  { name: "Hair Oil (100 bottles)", category: "Cosmetics", price: 4500, bulkPrice: 3400, bulkThreshold: 200, supplier: "HairCare", rating: 4.5, reviews: 156, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop", stock: 4500, unit: "bottles" },
  { name: "Body Lotion (100 bottles)", category: "Cosmetics", price: 5200, bulkPrice: 3900, bulkThreshold: 180, supplier: "SoftSkin", rating: 4.6, reviews: 189, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop", stock: 4000, unit: "bottles" },
  { name: "Face Wash (100 bottles)", category: "Cosmetics", price: 3800, bulkPrice: 2800, bulkThreshold: 220, supplier: "FaceFresh", rating: 4.4, reviews: 145, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop", stock: 4800, unit: "bottles" },
  { name: "Hair Gel (100 tubes)", category: "Cosmetics", price: 2800, bulkPrice: 2100, bulkThreshold: 250, supplier: "StyleGel", rating: 4.3, reviews: 112, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop", stock: 5200, unit: "tubes" },
  { name: "Deodorant (100 cans)", category: "Cosmetics", price: 4200, bulkPrice: 3100, bulkThreshold: 200, supplier: "FreshScent", rating: 4.5, reviews: 178, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=300&fit=crop", stock: 4500, unit: "cans" },
  { name: "Comb (100pcs)", category: "Cosmetics", price: 1200, bulkPrice: 900, bulkThreshold: 300, supplier: "HairTool", rating: 4.2, reviews: 89, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop", stock: 6000, unit: "pcs" },
  { name: "Mirror (50pcs)", category: "Cosmetics", price: 2400, bulkPrice: 1800, bulkThreshold: 150, supplier: "MirrorPro", rating: 4.3, reviews: 67, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop", stock: 2800, unit: "pcs" },
  { name: "Brush Set (50 sets)", category: "Cosmetics", price: 5600, bulkPrice: 4200, bulkThreshold: 100, supplier: "BrushPro", rating: 4.6, reviews: 98, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop", stock: 2200, unit: "sets" },
  { name: "Erasers (100pcs)", category: "Stationery", price: 800, bulkPrice: 600, bulkThreshold: 400, supplier: "ErasePro", rating: 4.1, reviews: 145, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop", stock: 8000, unit: "pcs" },
  { name: "Sharpeners (100pcs)", category: "Stationery", price: 600, bulkPrice: 450, bulkThreshold: 500, supplier: "SharpEdge", rating: 4.0, reviews: 134, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop", stock: 10000, unit: "pcs" },
  { name: "Rulers (100pcs)", category: "Stationery", price: 700, bulkPrice: 525, bulkThreshold: 450, supplier: "MeasurePro", rating: 4.2, reviews: 98, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", stock: 9000, unit: "pcs" },
  { name: "Geometry Box (50pcs)", category: "Stationery", price: 1800, bulkPrice: 1350, bulkThreshold: 150, supplier: "GeoMaster", rating: 4.4, reviews: 112, image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop", stock: 3500, unit: "pcs" },
  { name: "Calculator (50pcs)", category: "Stationery", price: 3200, bulkPrice: 2400, bulkThreshold: 120, supplier: "CalcPro", rating: 4.5, reviews: 87, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop", stock: 2800, unit: "pcs" },
  { name: "Stapler (100pcs)", category: "Stationery", price: 1400, bulkPrice: 1050, bulkThreshold: 250, supplier: "StaplePro", rating: 4.3, reviews: 134, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", stock: 5500, unit: "pcs" },
  { name: "Paper Clips (500pcs)", category: "Stationery", price: 500, bulkPrice: 375, bulkThreshold: 600, supplier: "ClipPro", rating: 4.1, reviews: 189, image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop", stock: 12000, unit: "pcs" },
  { name: "Glue (100 bottles)", category: "Stationery", price: 1000, bulkPrice: 750, bulkThreshold: 350, supplier: "GlueMaster", rating: 4.2, reviews: 98, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", stock: 7000, unit: "bottles" },
  { name: "Scissors (50pcs)", category: "Stationery", price: 2200, bulkPrice: 1650, bulkThreshold: 150, supplier: "CutPro", rating: 4.4, reviews: 76, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", stock: 3200, unit: "pcs" },
  { name: "Highlighters (100pcs)", category: "Stationery", price: 1600, bulkPrice: 1200, bulkThreshold: 300, supplier: "HighlightPro", rating: 4.3, reviews: 145, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop", stock: 6500, unit: "pcs" },
  { name: "File Folders (100pcs)", category: "Stationery", price: 1800, bulkPrice: 1350, bulkThreshold: 280, supplier: "FileMaster", rating: 4.2, reviews: 112, image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&h=300&fit=crop", stock: 6000, unit: "pcs" },
  { name: "Envelopes (500pcs)", category: "Stationery", price: 1200, bulkPrice: 900, bulkThreshold: 500, supplier: "EnvelopePro", rating: 4.1, reviews: 167, image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop", stock: 11000, unit: "pcs" },
  { name: "Adhesive Tape (100 rolls)", category: "Stationery", price: 1500, bulkPrice: 1125, bulkThreshold: 320, supplier: "TapePro", rating: 4.3, reviews: 134, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", stock: 7500, unit: "rolls" },
];

const demoOrders = [
  { product: "Premium Basmati Rice (50kg)", qty: 600, status: "completed", shops: ["Rajesh General Store", "Priya Mart", "Suresh Wholesale"], saving: 360000, date: "2024-01-15", totalAmount: 1320000, shopBreakdown: [{ shop: "Rajesh General Store", qty: 200, amount: 440000 }, { shop: "Priya Mart", qty: 200, amount: 440000 }, { shop: "Suresh Wholesale", qty: 200, amount: 440000 }] },
  { product: "LED Bulbs Pack (50pcs)", qty: 300, status: "completed", shops: ["Amit Electronics", "Rahul Electronics"], saving: 240000, date: "2024-02-20", totalAmount: 720000, shopBreakdown: [{ shop: "Amit Electronics", qty: 150, amount: 360000 }, { shop: "Rahul Electronics", qty: 150, amount: 360000 }] },
  { product: "Cotton T-Shirts Bundle (50pcs)", qty: 250, status: "completed", shops: ["Anita Textiles"], saving: 325000, date: "2024-03-10", totalAmount: 800000, shopBreakdown: [{ shop: "Anita Textiles", qty: 250, amount: 800000 }] },
  { product: "Refined Sunflower Oil (15L)", qty: 450, status: "pending", shops: ["Rajesh General Store", "Kavita General Store"], saving: 157500, date: "2024-04-05", totalAmount: 585000, shopBreakdown: [{ shop: "Rajesh General Store", qty: 225, amount: 292500 }, { shop: "Kavita General Store", qty: 225, amount: 292500 }] },
  { product: "A4 Paper Reams (10 packs)", qty: 200, status: "completed", shops: ["Vikram Stationery"], saving: 46000, date: "2024-03-25", totalAmount: 124000, shopBreakdown: [{ shop: "Vikram Stationery", qty: 200, amount: 124000 }] },
  { product: "Face Cream Wholesale (100pcs)", qty: 500, status: "completed", shops: ["Meena Cosmetics", "Anita Textiles"], saving: 850000, date: "2024-02-15", totalAmount: 2550000, shopBreakdown: [{ shop: "Meena Cosmetics", qty: 250, amount: 1275000 }, { shop: "Anita Textiles", qty: 250, amount: 1275000 }] },
  { product: "Wheat Flour (25kg)", qty: 800, status: "completed", shops: ["Rajesh General Store", "Priya Mart", "Suresh Wholesale", "Kavita General Store"], saving: 184000, date: "2024-01-28", totalAmount: 576000, shopBreakdown: [{ shop: "Rajesh General Store", qty: 200, amount: 144000 }, { shop: "Priya Mart", qty: 200, amount: 144000 }, { shop: "Suresh Wholesale", qty: 200, amount: 144000 }, { shop: "Kavita General Store", qty: 200, amount: 144000 }] },
  { product: "Mobile Chargers (20pcs)", qty: 200, status: "pending", shops: ["Deepak Hardware", "Amit Electronics"], saving: 180000, date: "2024-04-12", totalAmount: 380000, shopBreakdown: [{ shop: "Deepak Hardware", qty: 100, amount: 190000 }, { shop: "Amit Electronics", qty: 100, amount: 190000 }] },
  { product: "Shampoo Wholesale (200ml×50)", qty: 400, status: "completed", shops: ["Meena Cosmetics"], saving: 440000, date: "2024-03-18", totalAmount: 1360000, shopBreakdown: [{ shop: "Meena Cosmetics", qty: 400, amount: 1360000 }] },
  { product: "Sugar (50kg)", qty: 700, status: "completed", shops: ["Rajesh General Store", "Priya Mart", "Suresh Wholesale"], saving: 315000, date: "2024-02-08", totalAmount: 1225000, shopBreakdown: [{ shop: "Rajesh General Store", qty: 234, amount: 409500 }, { shop: "Priya Mart", qty: 233, amount: 407750 }, { shop: "Suresh Wholesale", qty: 233, amount: 407750 }] },
  { product: "Notebook Bundle (100pcs)", qty: 300, status: "completed", shops: ["Vikram Stationery", "Rajesh General Store"], saving: 270000, date: "2024-03-05", totalAmount: 690000, shopBreakdown: [{ shop: "Vikram Stationery", qty: 150, amount: 345000 }, { shop: "Rajesh General Store", qty: 150, amount: 345000 }] },
  { product: "Denim Jeans Bundle (30pcs)", qty: 180, status: "pending", shops: ["Anita Textiles", "Kavita General Store"], saving: 450000, date: "2024-04-18", totalAmount: 1170000, shopBreakdown: [{ shop: "Anita Textiles", qty: 90, amount: 585000 }, { shop: "Kavita General Store", qty: 90, amount: 585000 }] },
];

// ─── SEED DATABASE (optional) ─────────────────────────────────────────────────
// This script will seed demo data only when SEED_DB=true is set in the environment.
async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Insert demo data
    const users = await User.insertMany(demoUsers);
    console.log('Users inserted:', demoUsers.length);

    // Assign random uploaders to products
    const shopOwners = users.filter(u => u.role === 'owner');
    const productsWithUploaders = demoProducts.map(product => {
      const randomUploader = shopOwners[Math.floor(Math.random() * shopOwners.length)];
      return {
        ...product,
        uploadedBy: randomUploader._id,
        uploadedByShopName: randomUploader.shopName
      };
    });

    await Product.insertMany(productsWithUploaders);
    console.log('Products inserted:', productsWithUploaders.length);

    await Order.insertMany(demoOrders);
    console.log('Orders inserted:', demoOrders.length);

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
}

if (process.env.SEED_DB === 'true') {
  seedDatabase();
} else {
  console.log('SEED_DB not set. Skipping database seeding.');
}
