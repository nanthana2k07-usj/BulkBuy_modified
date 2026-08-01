import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server as IOServer } from 'socket.io';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret_in_prod';

// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: { origin: '*' }
});

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// MongoDB Connection — server starts regardless; routes return 503 if DB is down
let dbReady = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bulkbuy', {
  serverSelectionTimeoutMS: 5000,
})
  .then(async () => {
    dbReady = true;
    console.log('✅ MongoDB connected');
    await ensureAdminUser();
  })
  .catch(err => {
    console.error('⚠️  MongoDB not connected:', err.message);
    console.error('   Server will still start — restart after MongoDB is running.');
  });

// Reconnect on disconnect
mongoose.connection.on('disconnected', () => { dbReady = false; console.warn('MongoDB disconnected'); });
mongoose.connection.on('reconnected', () => { dbReady = true; console.log('MongoDB reconnected'); });

// Middleware: require DB to be ready for data routes
function requireDb(req, res, next) {
  if (!dbReady) return res.status(503).json({ error: 'Database not connected. Please start MongoDB and restart the server.' });
  next();
}

// Inject requireDb into all /api data routes EXCEPT health
app.use('/api/users', requireDb);
app.use('/api/products', requireDb);
app.use('/api/orders', requireDb);
app.use('/api/shops', requireDb);
app.use('/api/collaborations', requireDb);
app.use('/api/payments', requireDb);
app.use('/api/chat', requireDb);
app.use('/api/otp', requireDb);

async function ensureAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bulkbuy.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      const isHashed = typeof existingAdmin.password === 'string' && existingAdmin.password.startsWith('$2');
      if (!isHashed) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await User.updateOne({ _id: existingAdmin._id }, { $set: { password: hashed } });
      }
      return;
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    await new User({
      ownerName: 'Admin',
      email: adminEmail,
      password: hashed,
      phone: '9999999999',
      shopName: 'BulkBuy Admin',
      location: 'HQ',
      category: 'All',
      totalSavings: 0,
      orders: 0,
      collaborations: 0,
      role: 'admin',
      joinDate: new Date().toISOString()
    }).save();

    console.log(`Admin user ready: ${adminEmail}`);
  } catch (err) {
    console.error('Admin user setup error:', err);
  }
}

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
  gstNumber: String,
  panNumber: String,
  aadharNumber: String,
  fssaiNumber: String,
  tradeLicense: String,
  businessType: String,
  yearsInBusiness: String,
  bankAccountNumber: String,
  ifscCode: String,
  annualTurnover: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  // Wishlist with price alerts
  wishlist: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    targetPrice: Number,
    alertTriggered: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }],
  // Loyalty points
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier: { type: String, default: 'bronze' },
  // Two-factor authentication
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  twoFactorBackupCodes: [String],
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
  // Product variants
  variants: [{
    name: String,
    sku: String,
    price: Number,
    stock: Number,
    attributes: {
      size: String,
      color: String,
      weight: String,
      material: String,
      [String]: String
    }
  }],
  hasVariants: { type: Boolean, default: false },
  // Pooling interest tracking
  interestedUsers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shopName: String,
    quantity: Number,
    addedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  action: String,
  entityType: String,
  entityId: String,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
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
  // Invoice fields
  invoiceNumber: String,
  invoiceGenerated: { type: Boolean, default: false },
  invoiceDate: Date,
  // Return/Refund fields
  returnRequested: { type: Boolean, default: false },
  returnReason: String,
  returnStatus: { type: String, default: 'none' },
  refundAmount: Number,
  refundStatus: { type: String, default: 'none' },
  createdAt: { type: Date, default: Date.now }
});

const collaborationSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fromShop: String,
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toShop: String,
  productName: String,
  poolTarget: Number,
  status: { type: String, default: 'pending' },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Collaboration = mongoose.model('Collaboration', collaborationSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
// Messages for real-time chat
const messageSchema = new mongoose.Schema({
  threadId: String, // unique conversation id
  from: { type: mongoose.Schema.Types.Mixed, ref: 'User' },
  to: { type: mongoose.Schema.Types.Mixed, ref: 'User' },
  text: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Product reviews schema
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  rating: { type: Number, min: 1, max: 5 },
  title: String,
  comment: String,
  verified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

// Webhook schema
const webhookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  url: String,
  events: [String],
  secret: String,
  active: { type: Boolean, default: true },
  lastTriggered: Date,
  triggerCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Webhook = mongoose.model('Webhook', webhookSchema);

// Recurring order template schema
const recurringOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  quantity: Number,
  frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly', 'quarterly'] },
  nextOrderDate: Date,
  active: { type: Boolean, default: true },
  totalOrders: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const RecurringOrder = mongoose.model('RecurringOrder', recurringOrderSchema);

// Vendor management schema
const vendorSchema = new mongoose.Schema({
  name: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  gstNumber: String,
  panNumber: String,
  categories: [String],
  paymentTerms: String,
  creditLimit: Number,
  rating: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
const Vendor = mongoose.model('Vendor', vendorSchema);

// Pooled order schema
const pooledOrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shopName: String,
    quantity: Number,
    shareAmount: Number,
    paid: { type: Boolean, default: false },
    paidAt: Date
  }],
  totalQuantity: Number,
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'], default: 'pending' },
  trackingNumber: String,
  trackingUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const PooledOrder = mongoose.model('PooledOrder', pooledOrderSchema);

// ─── ROUTES ────────────────────────────────────────────────────────────────────

// Users
// Register - hashes password and returns JWT
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, ownerName, shopName } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashed, joinDate: new Date().toISOString() });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: { id: newUser._id, email: newUser.email, ownerName, shopName }, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login - verifies password and returns JWT
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isHashed = typeof user.password === 'string' && user.password.startsWith('$2');
    let ok = false;
    if (isHashed) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      ok = user.password === password;
    }

    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!isHashed) {
      const hashed = await bcrypt.hash(password, 10);
      await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
    }

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);
    
    // In production, send OTP via SMS/email
    console.log(`[OTP] Login OTP for ${email}: ${otp}`);
    
    res.json({ 
      success: true, 
      requiresOtp: true,
      message: 'OTP sent to your registered email/phone',
      email: email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP and complete login
app.post('/api/users/login/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP required' });
    }
    
    const storedOtp = otpStore.get(email);
    
    if (!storedOtp || storedOtp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    // Clear OTP after verification
    otpStore.delete(email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      success: true, 
      user: { 
        id: user._id, 
        email: user.email, 
        ownerName: user.ownerName, 
        shopName: user.shopName,
        role: user.role 
      }, 
      token 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth middleware
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/users', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { shopName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Role filter
    if (role) {
      query.role = role;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User management - Update user
app.put('/api/users/:id', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Only admin can update other users
    if (currentUser.role !== 'admin' && req.params.id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { shopName, ownerName, email, phone, location, category } = req.body;
    
    const updateData = {};
    if (shopName) updateData.shopName = shopName;
    if (ownerName) updateData.ownerName = ownerName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (category) updateData.category = category;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User management - Delete user
app.delete('/api/users/:id', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Only admin can delete users
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User management - Suspend/Unsuspend user
app.put('/api/users/:id/suspend', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Only admin can suspend users
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { suspended } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { suspended: suspended },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Wishlist management
app.get('/api/users/wishlist', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist.product');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/wishlist', authenticateJWT, async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const user = await User.findById(req.user.id);
    
    // Check if already in wishlist
    const existing = user.wishlist.find(w => w.product.toString() === productId);
    if (existing) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }
    
    user.wishlist.push({ product: productId, targetPrice, alertTriggered: false });
    await user.save();
    
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/wishlist/:productId', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(w => w.product.toString() !== req.params.productId);
    await user.save();
    
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check price alerts
app.post('/api/wishlist/check-alerts', async (req, res) => {
  try {
    const users = await User.find({ 'wishlist.alertTriggered': false }).populate('wishlist.product');
    
    const alertsTriggered = [];
    
    for (const user of users) {
      for (const item of user.wishlist) {
        if (!item.alertTriggered && item.product && item.product.price <= item.targetPrice) {
          item.alertTriggered = true;
          alertsTriggered.push({
            userId: user._id,
            userEmail: user.email,
            productId: item.product._id,
            productName: item.product.name,
            currentPrice: item.product.price,
            targetPrice: item.targetPrice
          });
        }
      }
      await user.save();
    }
    
    // Send notifications for triggered alerts
    alertsTriggered.forEach(alert => {
      sendEmailNotification(
        alert.userEmail,
        `Price Alert: ${alert.productName}`,
        `Good news! ${alert.productName} is now available at ₹${alert.currentPrice} (your target: ₹${alert.targetPrice})`
      );
    });
    
    res.json({ success: true, alertsTriggered, count: alertsTriggered.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invoice generation
app.post('/api/orders/:id/invoice', authenticateJWT, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.invoiceGenerated) {
      return res.status(400).json({ error: 'Invoice already generated' });
    }
    
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${order._id.toString().slice(-6).toUpperCase()}`;
    
    order.invoiceNumber = invoiceNumber;
    order.invoiceGenerated = true;
    order.invoiceDate = new Date();
    await order.save();
    
    res.json({ 
      success: true, 
      invoiceNumber,
      invoiceDate: order.invoiceDate,
      order 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (!order.invoiceGenerated) {
      return res.status(400).json({ error: 'Invoice not generated yet' });
    }
    
    // Generate invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f5f5f5; }
          .total { text-align: right; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BulkBuy</h1>
          <h2>Invoice</h2>
          <p>Invoice Number: ${order.invoiceNumber}</p>
          <p>Date: ${order.invoiceDate.toDateString()}</p>
        </div>
        <div class="invoice-details">
          <div>
            <h3>Billed To:</h3>
            <p>Shops: ${order.shops.join(', ')}</p>
          </div>
          <div>
            <h3>Order Details:</h3>
            <p>Order ID: ${order._id}</p>
            <p>Date: ${order.date}</p>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${order.product}</td>
              <td>${order.qty}</td>
              <td>₹${(order.totalAmount / order.qty).toFixed(2)}</td>
              <td>₹${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">
          <p>Total Amount: ₹${order.totalAmount.toFixed(2)}</p>
          <p>Savings: ₹${order.saving.toFixed(2)}</p>
        </div>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="invoice_${order.invoiceNumber}.html"`);
    res.send(invoiceHTML);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product reviews
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'shopName')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/:id/reviews', authenticateJWT, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const user = await User.findById(req.user.id);
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      product: req.params.id, 
      user: req.user.id 
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    
    const review = new Review({
      product: req.params.id,
      user: req.user.id,
      userName: user.shopName,
      rating,
      title,
      comment,
      verified: false
    });
    
    await review.save();
    
    // Update product rating
    const reviews = await Review.find({ product: req.params.id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.id, { 
      rating: avgRating.toFixed(1),
      reviews: reviews.length 
    });
    
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order return/refund management
app.post('/api/orders/:id/return', authenticateJWT, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.returnRequested) {
      return res.status(400).json({ error: 'Return already requested' });
    }
    
    if (order.status !== 'Delivered') {
      return res.status(400).json({ error: 'Order must be delivered before return' });
    }
    
    order.returnRequested = true;
    order.returnReason = reason;
    order.returnStatus = 'pending';
    await order.save();
    
    // Notify admin
    io.to('admin').emit('return:request', {
      orderId: order._id,
      productId: order.productId,
      reason
    });
    
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/return/:status', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const { status } = req.params;
    
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid return status' });
    }
    
    order.returnStatus = status;
    
    if (status === 'approved') {
      order.refundStatus = 'processing';
      order.refundAmount = order.totalAmount;
    } else if (status === 'rejected') {
      order.refundStatus = 'none';
      order.refundAmount = 0;
    } else if (status === 'completed') {
      order.refundStatus = 'completed';
    }
    
    await order.save();
    
    // Notify relevant shops
    order.shops.forEach(shopName => {
      io.to(shopName).emit('return:updated', {
        orderId: order._id,
        status
      });
    });
    
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Loyalty points system
app.get('/api/users/loyalty', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate tier based on points
    const tiers = {
      bronze: { min: 0, multiplier: 1 },
      silver: { min: 1000, multiplier: 1.1 },
      gold: { min: 5000, multiplier: 1.25 },
      platinum: { min: 10000, multiplier: 1.5 }
    };
    
    let currentTier = 'bronze';
    for (const [tier, config] of Object.entries(tiers)) {
      if (user.loyaltyPoints >= config.min) {
        currentTier = tier;
      }
    }
    
    user.loyaltyTier = currentTier;
    await user.save();
    
    res.json({ 
      success: true, 
      loyaltyPoints: user.loyaltyPoints,
      loyaltyTier: user.loyaltyTier,
      tierMultiplier: tiers[currentTier].multiplier,
      nextTier: Object.entries(tiers).find(([t, c]) => c.min > user.loyaltyPoints)?.[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/loyalty/redeem', authenticateJWT, async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.user.id);
    
    if (user.loyaltyPoints < points) {
      return res.status(400).json({ error: 'Insufficient loyalty points' });
    }
    
    user.loyaltyPoints -= points;
    await user.save();
    
    res.json({ 
      success: true, 
      loyaltyPoints: user.loyaltyPoints,
      redeemedPoints: points 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Award loyalty points (admin only)
app.post('/api/users/:id/loyalty/award', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { points, reason } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.loyaltyPoints += points;
    await user.save();
    
    // Notify user
    io.to(user.shopName).emit('loyalty:awarded', {
      points,
      reason,
      totalPoints: user.loyaltyPoints
    });
    
    res.json({ success: true, loyaltyPoints: user.loyaltyPoints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook management
app.get('/api/webhooks', authenticateJWT, async (req, res) => {
  try {
    const webhooks = await Webhook.find({ userId: req.user.id });
    res.json({ success: true, webhooks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/webhooks', authenticateJWT, async (req, res) => {
  try {
    const { url, events, secret } = req.body;
    
    if (!url || !events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'URL and events array are required' });
    }
    
    const webhook = new Webhook({
      userId: req.user.id,
      url,
      events,
      secret: secret || crypto.randomBytes(16).toString('hex')
    });
    
    await webhook.save();
    
    res.json({ success: true, webhook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/webhooks/:id', authenticateJWT, async (req, res) => {
  try {
    const webhook = await Webhook.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    
    res.json({ success: true, message: 'Webhook deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger webhooks for events
async function triggerWebhooks(event, data) {
  try {
    const webhooks = await Webhook.find({
      events: event,
      active: true
    }).populate('userId');
    
    for (const webhook of webhooks) {
      try {
        const payload = {
          event,
          data,
          timestamp: new Date(),
          webhookId: webhook._id
        };
        
        // Sign payload if secret exists
        if (webhook.secret) {
          const signature = crypto
            .createHmac('sha256', webhook.secret)
            .update(JSON.stringify(payload))
            .digest('hex');
          payload.signature = signature;
        }
        
        // Send webhook (in production, use proper HTTP client)
        console.log(`[WEBHOOK] Triggering ${event} to ${webhook.url}`);
        
        webhook.lastTriggered = new Date();
        webhook.triggerCount += 1;
        await webhook.save();
      } catch (err) {
        console.error(`[WEBHOOK] Failed to trigger ${webhook._id}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[WEBHOOK] Error triggering webhooks:', err.message);
  }
}

// Two-factor authentication
app.post('/api/users/2fa/setup', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA already enabled' });
    }
    
    // Generate secret (in production, use speakeasy or otpauth)
    const secret = crypto.randomBytes(20).toString('base32');
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
    
    user.twoFactorSecret = secret;
    user.twoFactorBackupCodes = backupCodes;
    await user.save();
    
    res.json({ 
      success: true, 
      secret,
      backupCodes,
      qrCode: `otpauth://totp/BulkBuy:${user.email}?secret=${secret}&issuer=BulkBuy`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/2fa/verify', authenticateJWT, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA not set up' });
    }
    
    // Verify token (in production, use speakeasy or otpauth library)
    // For demo, we'll accept any 6-digit code
    if (!/^\d{6}$/.test(token)) {
      return res.status(400).json({ error: 'Invalid token format' });
    }
    
    user.twoFactorEnabled = true;
    await user.save();
    
    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/2fa/disable', authenticateJWT, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA not enabled' });
    }
    
    // Verify token before disabling
    if (!/^\d{6}$/.test(token)) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twoFactorBackupCodes = [];
    await user.save();
    
    res.json({ success: true, message: '2FA disabled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/2fa/backup', authenticateJWT, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.twoFactorBackupCodes.includes(code)) {
      return res.status(400).json({ error: 'Invalid backup code' });
    }
    
    // Remove used backup code
    user.twoFactorBackupCodes = user.twoFactorBackupCodes.filter(c => c !== code);
    await user.save();
    
    // Generate new backup codes
    const newBackupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
    user.twoFactorBackupCodes = newBackupCodes;
    await user.save();
    
    res.json({ success: true, backupCodes: newBackupCodes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recurring order templates
app.get('/api/recurring-orders', authenticateJWT, async (req, res) => {
  try {
    const recurringOrders = await RecurringOrder.find({ userId: req.user.id })
      .populate('productId')
      .sort({ nextOrderDate: 1 });
    
    res.json({ success: true, recurringOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/recurring-orders', authenticateJWT, async (req, res) => {
  try {
    const { productId, quantity, frequency } = req.body;
    const product = await Product.findById(productId);
    const user = await User.findById(req.user.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Calculate next order date based on frequency
    const nextOrderDate = new Date();
    switch (frequency) {
      case 'weekly': nextOrderDate.setDate(nextOrderDate.getDate() + 7); break;
      case 'biweekly': nextOrderDate.setDate(nextOrderDate.getDate() + 14); break;
      case 'monthly': nextOrderDate.setMonth(nextOrderDate.getMonth() + 1); break;
      case 'quarterly': nextOrderDate.setMonth(nextOrderDate.getMonth() + 3); break;
    }
    
    const recurringOrder = new RecurringOrder({
      userId: req.user.id,
      productId,
      productName: product.name,
      quantity,
      frequency,
      nextOrderDate,
      active: true
    });
    
    await recurringOrder.save();
    
    res.json({ success: true, recurringOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/recurring-orders/:id', authenticateJWT, async (req, res) => {
  try {
    const { quantity, frequency, active } = req.body;
    const recurringOrder = await RecurringOrder.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!recurringOrder) {
      return res.status(404).json({ error: 'Recurring order not found' });
    }
    
    if (quantity) recurringOrder.quantity = quantity;
    if (frequency) {
      recurringOrder.frequency = frequency;
      // Recalculate next order date
      const nextOrderDate = new Date();
      switch (frequency) {
        case 'weekly': nextOrderDate.setDate(nextOrderDate.getDate() + 7); break;
        case 'biweekly': nextOrderDate.setDate(nextOrderDate.getDate() + 14); break;
        case 'monthly': nextOrderDate.setMonth(nextOrderDate.getMonth() + 1); break;
        case 'quarterly': nextOrderDate.setMonth(nextOrderDate.getMonth() + 3); break;
      }
      recurringOrder.nextOrderDate = nextOrderDate;
    }
    if (active !== undefined) recurringOrder.active = active;
    
    await recurringOrder.save();
    
    res.json({ success: true, recurringOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/recurring-orders/:id', authenticateJWT, async (req, res) => {
  try {
    const recurringOrder = await RecurringOrder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!recurringOrder) {
      return res.status(404).json({ error: 'Recurring order not found' });
    }
    
    res.json({ success: true, message: 'Recurring order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process recurring orders (admin/cron job)
app.post('/api/recurring-orders/process', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const dueOrders = await RecurringOrder.find({
      active: true,
      nextOrderDate: { $lte: new Date() }
    }).populate('productId');
    
    const processedOrders = [];
    
    for (const recurringOrder of dueOrders) {
      try {
        // Create order from template
        const newOrder = new Order({
          productId: recurringOrder.productId._id,
          product: recurringOrder.productName,
          qty: recurringOrder.quantity,
          status: 'Pending',
          shops: [User.findById(recurringOrder.userId).then(u => u.shopName)],
          saving: recurringOrder.productId.price - recurringOrder.productId.bulkPrice,
          date: new Date().toISOString(),
          totalAmount: recurringOrder.productId.price * recurringOrder.quantity
        });
        
        await newOrder.save();
        
        // Update next order date
        const nextOrderDate = new Date();
        switch (recurringOrder.frequency) {
          case 'weekly': nextOrderDate.setDate(nextOrderDate.getDate() + 7); break;
          case 'biweekly': nextOrderDate.setDate(nextOrderDate.getDate() + 14); break;
          case 'monthly': nextOrderDate.setMonth(nextOrderDate.getMonth() + 1); break;
          case 'quarterly': nextOrderDate.setMonth(nextOrderDate.getMonth() + 3); break;
        }
        recurringOrder.nextOrderDate = nextOrderDate;
        recurringOrder.totalOrders += 1;
        await recurringOrder.save();
        
        processedOrders.push({
          recurringOrderId: recurringOrder._id,
          orderId: newOrder._id,
          nextOrderDate: recurringOrder.nextOrderDate
        });
      } catch (err) {
        console.error(`Failed to process recurring order ${recurringOrder._id}:`, err.message);
      }
    }
    
    res.json({ 
      success: true, 
      processedCount: processedOrders.length,
      processedOrders 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vendor management
app.get('/api/vendors', authenticateJWT, async (req, res) => {
  try {
    const { search, category, active, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.categories = category;
    }
    
    if (active !== undefined) {
      query.active = active === 'true';
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const vendors = await Vendor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Vendor.countDocuments(query);
    
    res.json({
      success: true,
      vendors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendors', authenticateJWT, async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/vendors/:id', authenticateJWT, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/vendors/:id', authenticateJWT, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({ success: true, message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vendors/:id/performance', authenticateJWT, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Get products from this vendor
    const products = await Product.find({ supplier: vendor.name });
    
    // Get orders for these products
    const orders = await Order.find({
      product: { $in: products.map(p => p.name) }
    });
    
    const performance = {
      vendor: vendor.name,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0,
      onTimeDeliveries: orders.filter(o => o.status === 'Delivered').length,
      pendingOrders: orders.filter(o => o.status === 'Pending').length
    };
    
    res.json({ success: true, performance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pooling interest tracking
app.post('/api/products/:id/interest', authenticateJWT, async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if already interested
    const existing = product.interestedUsers.find(u => u.userId.toString() === req.user.id);
    if (existing) {
      existing.quantity = quantity || existing.quantity;
    } else {
      product.interestedUsers.push({
        userId: req.user.id,
        shopName: user.shopName,
        quantity: quantity || 1
      });
    }
    
    await product.save();
    
    // Notify other interested users
    product.interestedUsers.forEach(interestedUser => {
      if (interestedUser.userId.toString() !== req.user.id) {
        io.to(interestedUser.shopName).emit('pooling:new-interest', {
          productId: product._id,
          productName: product.name,
          shopName: user.shopName,
          quantity
        });
      }
    });
    
    res.json({ success: true, interestedUsers: product.interestedUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id/interested-users', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Return interested users excluding current user
    const otherUsers = product.interestedUsers.filter(u => u.userId.toString() !== req.user.id);
    
    res.json({ success: true, interestedUsers: otherUsers, total: otherUsers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id/interest', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.interestedUsers = product.interestedUsers.filter(u => u.userId.toString() !== req.user.id);
    await product.save();
    
    res.json({ success: true, message: 'Interest removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pooling request system
app.post('/api/products/:id/pool-request', authenticateJWT, async (req, res) => {
  try {
    const { targetUserId, quantity } = req.body;
    const product = await Product.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);
    
    if (!product || !targetUser) {
      return res.status(404).json({ error: 'Product or user not found' });
    }
    
    // Create collaboration request
    const collaboration = new Collaboration({
      from: req.user.id,
      fromShop: currentUser.shopName,
      to: targetUserId,
      toShop: targetUser.shopName,
      productName: product.name,
      poolTarget: quantity,
      status: 'pending',
      message: `${currentUser.shopName} wants to pool with you for ${product.name}`,
      createdAt: new Date()
    });
    
    await collaboration.save();
    
    // Notify target user
    io.to(targetUser.shopName).emit('pooling:request', {
      collaborationId: collaboration._id,
      fromShop: currentUser.shopName,
      productName: product.name,
      quantity
    });
    
    res.json({ success: true, collaboration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/collaborations/:id/accept', authenticateJWT, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }
    
    if (collaboration.to.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    collaboration.status = 'accepted';
    await collaboration.save();
    
    // Notify requester
    io.to(collaboration.fromShop).emit('pooling:accepted', {
      collaborationId: collaboration._id,
      toShop: collaboration.toShop
    });
    
    res.json({ success: true, collaboration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create pooled order after acceptance
app.post('/api/products/:id/create-pooled-order', authenticateJWT, async (req, res) => {
  try {
    const { collaborationId, quantity } = req.body;
    const product = await Product.findById(req.params.id);
    const collaboration = await Collaboration.findById(collaborationId);
    const currentUser = await User.findById(req.user.id);
    const otherUser = await User.findById(collaboration.from.toString() === req.user.id ? collaboration.to : collaboration.from);
    
    if (!product || !collaboration) {
      return res.status(404).json({ error: 'Product or collaboration not found' });
    }
    
    if (collaboration.status !== 'accepted') {
      return res.status(400).json({ error: 'Collaboration not accepted' });
    }
    
    // Calculate equal shares
    const totalQuantity = quantity * 2;
    const totalAmount = product.bulkPrice * totalQuantity;
    const shareAmount = totalAmount / 2;
    
    // Create pooled order
    const pooledOrder = new PooledOrder({
      productId: product._id,
      productName: product.name,
      participants: [
        {
          userId: req.user.id,
          shopName: currentUser.shopName,
          quantity,
          shareAmount,
          paid: false
        },
        {
          userId: otherUser._id,
          shopName: otherUser.shopName,
          quantity,
          shareAmount,
          paid: false
        }
      ],
      totalQuantity,
      totalAmount,
      status: 'pending'
    });
    
    await pooledOrder.save();
    
    // Remove interest from product
    product.interestedUsers = product.interestedUsers.filter(u => 
      u.userId.toString() !== req.user.id && u.userId.toString() !== otherUser._id.toString()
    );
    await product.save();
    
    // Notify both participants
    io.to(currentUser.shopName).emit('pooled-order:created', {
      pooledOrderId: pooledOrder._id,
      shareAmount,
      totalAmount
    });
    io.to(otherUser.shopName).emit('pooled-order:created', {
      pooledOrderId: pooledOrder._id,
      shareAmount,
      totalAmount
    });
    
    res.json({ 
      success: true, 
      pooledOrder,
      yourShare: shareAmount,
      totalAmount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment tracking for pooled orders
app.post('/api/pooled-orders/:id/payment', authenticateJWT, async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    const pooledOrder = await PooledOrder.findById(req.params.id);
    
    if (!pooledOrder) {
      return res.status(404).json({ error: 'Pooled order not found' });
    }
    
    const participant = pooledOrder.participants.find(p => p.userId.toString() === req.user.id);
    if (!participant) {
      return res.status(403).json({ error: 'Not a participant in this order' });
    }
    
    participant.paid = true;
    participant.paidAt = new Date();
    await pooledOrder.save();
    
    // Check if all participants have paid
    const allPaid = pooledOrder.participants.every(p => p.paid);
    
    if (allPaid) {
      pooledOrder.status = 'confirmed';
      await pooledOrder.save();
      
      // Notify all participants that order is confirmed
      pooledOrder.participants.forEach(p => {
        io.to(p.shopName).emit('pooled-order:confirmed', {
          pooledOrderId: pooledOrder._id,
          status: 'confirmed'
        });
      });
    } else {
      // Notify other participants
      pooledOrder.participants.forEach(p => {
        if (p.userId.toString() !== req.user.id) {
          io.to(p.shopName).emit('pooled-order:payment-received', {
            pooledOrderId: pooledOrder._id,
            payerShopName: participant.shopName
          });
        }
      });
    }
    
    res.json({ 
      success: true, 
      pooledOrder,
      allPaid,
      yourPaymentStatus: participant.paid
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pooled orders for user
app.get('/api/pooled-orders', authenticateJWT, async (req, res) => {
  try {
    const pooledOrders = await PooledOrder.find({
      'participants.userId': req.user.id
    }).sort({ createdAt: -1 });
    
    // Filter to only show tracking info if all participants have paid
    const filteredOrders = pooledOrders.map(order => {
      const allPaid = order.participants.every(p => p.paid);
      const orderObj = order.toObject();
      
      if (!allPaid) {
        orderObj.trackingNumber = undefined;
        orderObj.trackingUrl = undefined;
      }
      
      return orderObj;
    });
    
    res.json({ success: true, pooledOrders: filteredOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update tracking (admin only)
app.put('/api/pooled-orders/:id/tracking', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { trackingNumber, trackingUrl, status } = req.body;
    const pooledOrder = await PooledOrder.findById(req.params.id);
    
    if (!pooledOrder) {
      return res.status(404).json({ error: 'Pooled order not found' });
    }
    
    if (trackingNumber) pooledOrder.trackingNumber = trackingNumber;
    if (trackingUrl) pooledOrder.trackingUrl = trackingUrl;
    if (status) pooledOrder.status = status;
    
    await pooledOrder.save();
    
    // Notify all participants
    pooledOrder.participants.forEach(p => {
      io.to(p.shopName).emit('pooled-order:updated', {
        pooledOrderId: pooledOrder._id,
        status: pooledOrder.status,
        trackingNumber: pooledOrder.trackingNumber,
        trackingUrl: pooledOrder.trackingUrl
      });
    });
    
    res.json({ success: true, pooledOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const products = await Product.find(query)
      .populate('uploadedBy', 'shopName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newProduct = new Product({
      ...req.body,
      uploadedBy: user._id,
      uploadedByShopName: user.shopName
    });
    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Favorites
app.post('/api/users/favorites', authenticateJWT, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/favorites/:productId', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/favorites', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's orders
app.get('/api/users/orders', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const orders = await Order.find({ shops: user.shopName }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's collaborations/connected shops
app.get('/api/users/collaborations', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const collaborations = await Collaboration.find({
      $or: [{ from: user._id }, { to: user._id }]
    })
    .populate('from', 'shopName email location')
    .populate('to', 'shopName email location')
    .sort({ createdAt: -1 });
    
    res.json({ success: true, collaborations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile summary
app.get('/api/users/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Get user's orders
    const orders = await Order.find({ shops: user.shopName }).sort({ createdAt: -1 }).limit(10);
    
    // Get user's collaborations
    const collaborations = await Collaboration.find({
      $or: [{ from: user._id }, { to: user._id }]
    })
    .populate('from', 'shopName email location')
    .populate('to', 'shopName email location')
    .sort({ createdAt: -1 })
    .limit(10);
    
    // Get user's favorites
    const userWithFavorites = await User.findById(req.user.id).populate('favorites');
    
    res.json({
      success: true,
      user,
      orders: orders.slice(0, 5),
      totalOrders: orders.length,
      collaborations: collaborations.slice(0, 5),
      totalCollaborations: collaborations.length,
      favorites: userWithFavorites.favorites,
      totalFavorites: userWithFavorites.favorites.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const { search, status, shopName, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { product: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    // Shop filter
    if (shopName) {
      query.shops = shopName;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const orders = await Order.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export data to CSV
app.get('/api/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv' } = req.query;
    
    let data = [];
    let filename = '';
    let headers = [];
    
    if (type === 'products') {
      const products = await Product.find().populate('uploadedBy', 'shopName email');
      data = products.map(p => ({
        ID: p._id,
        Name: p.name,
        Category: p.category,
        Price: p.price,
        'Bulk Price': p.bulkPrice,
        'Bulk Threshold': p.bulkThreshold,
        Supplier: p.supplier,
        Stock: p.stock,
        Unit: p.unit,
        Rating: p.rating,
        'Uploaded By': p.uploadedByShopName || 'N/A'
      }));
      filename = 'products_export';
      headers = ['ID', 'Name', 'Category', 'Price', 'Bulk Price', 'Bulk Threshold', 'Supplier', 'Stock', 'Unit', 'Rating', 'Uploaded By'];
    } else if (type === 'orders') {
      const orders = await Order.find();
      data = orders.map(o => ({
        ID: o.id,
        Product: o.product,
        Quantity: o.qty,
        Status: o.status,
        Shops: o.shops.join(', '),
        'Total Amount': o.totalAmount,
        Savings: o.saving,
        Date: o.createdAt
      }));
      filename = 'orders_export';
      headers = ['ID', 'Product', 'Quantity', 'Status', 'Shops', 'Total Amount', 'Savings', 'Date'];
    } else if (type === 'users') {
      const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
      data = users.map(u => ({
        ID: u._id,
        'Shop Name': u.shopName,
        'Owner Name': u.ownerName,
        Email: u.email,
        Phone: u.phone,
        Location: u.location,
        Category: u.category,
        'Total Orders': u.orders || 0,
        Collaborations: u.collaborations || 0,
        'Total Savings': u.totalSavings || 0
      }));
      filename = 'users_export';
      headers = ['ID', 'Shop Name', 'Owner Name', 'Email', 'Phone', 'Location', 'Category', 'Total Orders', 'Collaborations', 'Total Savings'];
    } else {
      return res.status(400).json({ error: 'Invalid export type' });
    }
    
    if (format === 'csv') {
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}_${Date.now()}.csv"`);
      res.send(csv);
    } else {
      res.json({ data, headers });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inventory management - Low stock alerts
app.get('/api/inventory/low-stock', authenticateJWT, async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 100;
    const lowStockProducts = await Product.find({ stock: { $lt: threshold } })
      .populate('uploadedBy', 'shopName email')
      .sort({ stock: 1 });
    
    res.json({ 
      success: true, 
      products: lowStockProducts,
      count: lowStockProducts.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update stock levels
app.put('/api/products/:id/stock', authenticateJWT, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: parseInt(stock) },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if stock is low after_update
    const threshold = 100;
    if (stock < threshold) {
      // Notify admin via socket
      io.to('admin').emit('inventory:low', {
        productId: product._id,
        productName: product.name,
        currentStock: stock,
        threshold
      });
    }
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product variant management
app.post('/api/products/:id/variants', authenticateJWT, async (req, res) => {
  try {
    const { name, sku, price, stock, attributes } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.variants.push({ name, sku, price, stock, attributes });
    product.hasVariants = true;
    await product.save();
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id/variants/:variantId', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const variant = product.variants.id(req.params.variantId);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    
    Object.assign(variant, req.body);
    await product.save();
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id/variants/:variantId', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.variants.id(req.params.variantId).remove();
    product.hasVariants = product.variants.length > 0;
    await product.save();
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk operations - Delete multiple products
app.delete('/api/products/bulk', authenticateJWT, async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }
    
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk operations - Update multiple products
app.put('/api/products/bulk', authenticateJWT, async (req, res) => {
  try {
    const { productIds, updates } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updates
    );
    
    res.json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk operations - Update multiple orders status
app.put('/api/orders/bulk/status', authenticateJWT, async (req, res) => {
  try {
    const { orderIds, status } = req.body;
    
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: 'Invalid order IDs' });
    }
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { status }
    );
    
    // Notify relevant parties
    const updatedOrders = await Order.find({ _id: { $in: orderIds } });
    updatedOrders.forEach(order => {
      order.shops.forEach(shopName => {
        io.to(shopName).emit('order:updated', {
          orderId: order._id,
          status
        });
      });
    });
    
    res.json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detailed reporting and analytics
app.get('/api/reports/summary', authenticateJWT, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }
    
    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalSavings: { $sum: '$saving' }
        }
      }
    ]);
    
    // Get product statistics
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);
    
    // Get user statistics
    const userStats = await User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalOrders: { $sum: '$orders' },
          totalSavings: { $sum: '$totalSavings' }
        }
      }
    ]);
    
    // Revenue trends (last 7 days)
    const revenueTrends = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      orderStats,
      productStats,
      userStats,
      revenueTrends
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Audit logging middleware
const logAudit = (action, entityType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        AuditLog.create({
          userId: req.user.id,
          userName: req.user.shopName || req.user.ownerName,
          action,
          entityType,
          entityId: req.params.id || req.body._id,
          details: {
            method: req.method,
            path: req.path,
            body: req.body
          },
          ipAddress: req.ip || req.connection.remoteAddress
        }).catch(err => console.error('Audit log error:', err));
      }
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Get audit logs
app.get('/api/audit-logs', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Only admin can view audit logs
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { action, entityType, userId, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const logs = await AuditLog.find(query)
      .populate('userId', 'shopName email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AuditLog.countDocuments(query);
    
    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email notification system (placeholder - requires email service integration)
const notificationQueue = [];

function sendEmailNotification(to, subject, body) {
  // Queue email notification for processing
  notificationQueue.push({
    to,
    subject,
    body,
    timestamp: new Date(),
    status: 'pending'
  });
  
  // In production, this would integrate with services like:
  // - SendGrid, Mailgun, AWS SES, or Nodemailer with SMTP
  console.log(`[EMAIL QUEUED] To: ${to}, Subject: ${subject}`);
  
  // Simulate async email sending
  setTimeout(() => {
    const notification = notificationQueue.find(n => n.to === to && n.subject === subject);
    if (notification) {
      notification.status = 'sent';
      notification.sentAt = new Date();
      console.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}`);
    }
  }, 2000);
}

// Send notification on key events
app.post('/api/notifications/send', authenticateJWT, async (req, res) => {
  try {
    const { to, subject, body, type } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get recipient email if userId provided
    let recipientEmail = to;
    if (to.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await User.findById(to);
      if (user) recipientEmail = user.email;
    }
    
    sendEmailNotification(recipientEmail, subject, body);
    
    res.json({ success: true, message: 'Notification queued' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notification queue status (admin only)
app.get('/api/notifications/queue', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json({
      success: true,
      queue: notificationQueue,
      total: notificationQueue.length,
      pending: notificationQueue.filter(n => n.status === 'pending').length,
      sent: notificationQueue.filter(n => n.status === 'sent').length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── COLLABORATION REQUESTS ───────────────────────────────────────────────────

// Get all shops (excluding current user)
app.get('/api/shops/:userId', async (req, res) => {
  try {
    const shops = await User.find({ _id: { $ne: req.params.userId }, role: { $ne: 'admin' } }).select('-password');
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send collaboration request
app.post('/api/collaborations/request', async (req, res) => {
  try {
    const { fromId, toId, fromShop, toShop, productName, poolTarget, message } = req.body;
    const request = new Collaboration({
      from: fromId,
      to: toId,
      fromShop,
      toShop,
      productName,
      poolTarget,
      message,
      status: 'pending'
    });
    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get collaboration requests for a user
app.get('/api/collaborations/:userId', async (req, res) => {
  try {
    const requests = await Collaboration.find({
      $or: [{ from: req.params.userId }, { to: req.params.userId }]
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept collaboration request
app.put('/api/collaborations/:requestId/accept', async (req, res) => {
  try {
    const collab = await Collaboration.findByIdAndUpdate(
      req.params.requestId,
      { status: 'accepted' },
      { new: true }
    );
    // Increment collaborations count for both users
    await User.findByIdAndUpdate(collab.from, { $inc: { collaborations: 1 } });
    await User.findByIdAndUpdate(collab.to, { $inc: { collaborations: 1 } });
    res.json({ success: true, collab });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject collaboration request
app.put('/api/collaborations/:requestId/reject', async (req, res) => {
  try {
    const collab = await Collaboration.findByIdAndUpdate(
      req.params.requestId,
      { status: 'rejected' },
      { new: true }
    );
    res.json({ success: true, collab });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PAYMENT ROUTES (Razorpay) ─────────────────────────────────────────────────

// Create Razorpay Order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || 'order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Verify Payment
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order status if an order with this receipt exists
      try {
        const updated = await Order.findOneAndUpdate(
          { _id: orderId, razorpayOrderId: razorpay_order_id },
          { $set: { status: 'paid', razorpayPaymentId: razorpay_payment_id, paymentVerifiedAt: new Date() } },
          { new: true }
        );
        
        if (updated) {
          // Notify admin clients via socket
          io.to('admin').emit('payment:received', { 
            orderId: updated._id, 
            totalAmount: updated.totalAmount,
            product: updated.product,
            shops: updated.shops,
            status: 'paid'
          });
          
          // Notify shop owners involved in the order
          updated.shops.forEach(shopName => {
            io.to(shopName).emit('order:paid', { 
              orderId: updated._id,
              product: updated.product,
              status: 'paid'
            });
          });
        }
      } catch (e) {
        console.error('Error updating order after payment:', e.message);
      }

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed - signature mismatch' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── OTP ─────────────────────────────────────────────────────────────────────
// In-memory OTP store (use Redis in production)
const otpStore = new Map(); // key: email, value: { otp, expiresAt }

app.post('/api/otp/send', async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    // Check if email already registered (for register purpose)
    if (purpose === 'register') {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(email, { otp, expiresAt });

    // Log OTP to console (replace with real email in production)
    console.log(`\n🔐 OTP for ${email}: ${otp} (expires in 10 min)\n`);

    res.json({ success: true, message: `OTP sent to ${email}`, debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/otp/verify', (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });
    // Accept any OTP without validation
    otpStore.delete(email);
    res.json({ success: true, message: 'OTP accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat: fetch messages for a thread
app.get('/api/chat/messages/:threadId', async (req, res) => {
  try {
    const { threadId } = req.params;
    const msgs = await Message.find({ threadId }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chat threads for a user: returns threadId, participants, lastMessage, unreadCount
app.get('/api/chat/threads/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const threads = await Message.aggregate([
      { $match: { $or: [ { from: mongoose.Types.ObjectId.isValid(userId) ? mongoose.Types.ObjectId(userId) : userId }, { to: mongoose.Types.ObjectId.isValid(userId) ? mongoose.Types.ObjectId(userId) : userId } ] } },
      { $group: { _id: '$threadId', lastMessage: { $last: '$$ROOT' }, unread: { $sum: { $cond: [ { $and: [ { $eq: ['$threadId', '$threadId'] }, { $eq: ['$to', mongoose.Types.ObjectId.isValid(userId) ? mongoose.Types.ObjectId(userId) : userId ] }, { $eq: ['$read', false] } ] }, 1, 0 ] } } } },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]).allowDiskUse(true);
    res.json(threads.map(t => ({ threadId: t._id, lastMessage: t.lastMessage, unreadCount: t.unread || 0 })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark messages in a thread as read for a specific user
app.put('/api/chat/messages/:threadId/read', async (req, res) => {
  try {
    const { threadId } = req.params;
    const { userId } = req.body;
    const filter = { threadId, to: mongoose.Types.ObjectId.isValid(userId) ? mongoose.Types.ObjectId(userId) : userId, read: false };
    const upd = await Message.updateMany(filter, { $set: { read: true } });
    // notify thread participants
    io.to(threadId).emit('read', { threadId, userId });
    res.json({ success: true, modified: upd.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a chat message (from frontend fallback)
app.post('/api/chat/messages', async (req, res) => {
  try {
    const { threadId = 'bulk-order-group', from, to, text, userId, sender } = req.body;
    const authorId = from ?? userId ?? sender ?? 'guest';
    const msg = new Message({ threadId, from: authorId, to, text, createdAt: new Date(), read: false });
    await msg.save();
    // emit to thread via socket
    io.to(threadId).emit('message', msg);
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin-Collaborator specific chat endpoints
// Get admin-collaborator threads for a user
app.get('/api/chat/admin-collaborator/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // If user is admin, get all threads with collaborators
    // If user is collaborator, get threads with admins
    let filter;
    if (user.role === 'admin') {
      filter = { from: { $ne: userId }, 'from.role': 'owner' };
    } else {
      filter = { $or: [{ from: userId, 'to.role': 'admin' }, { to: userId, 'from.role': 'admin' }] };
    }

    const threads = await Message.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message to admin (for collaborators)
app.post('/api/chat/admin', authenticateJWT, async (req, res) => {
  try {
    const { text, subject } = req.body;
    const sender = await User.findById(req.user.id);
    
    // Find admin users
    const admins = await User.find({ role: 'admin' });
    if (admins.length === 0) return res.status(404).json({ error: 'No admins found' });

    // Create thread ID for admin communication
    const threadId = `admin-${sender._id}`;
    
    // Send message to all admins
    const messages = admins.map(admin => {
      return new Message({
        threadId,
        from: sender._id,
        to: admin._id,
        text: subject ? `[${subject}] ${text}` : text,
        createdAt: new Date(),
        read: false
      });
    });

    await Message.insertMany(messages);
    
    // Notify admins via socket
    io.to('admin').emit('admin:message', {
      threadId,
      from: sender.shopName,
      fromId: sender._id,
      text,
      subject
    });

    res.json({ success: true, message: 'Message sent to admins' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message to collaborator (for admins)
app.post('/api/chat/collaborator', authenticateJWT, async (req, res) => {
  try {
    const { text, collaboratorId } = req.body;
    const admin = await User.findById(req.user.id);
    
    if (admin.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can send this message' });
    }

    const collaborator = await User.findById(collaboratorId);
    if (!collaborator) return res.status(404).json({ error: 'Collaborator not found' });

    const threadId = `admin-${collaboratorId}`;
    
    const msg = new Message({
      threadId,
      from: admin._id,
      to: collaborator._id,
      text,
      createdAt: new Date(),
      read: false
    });

    await msg.save();
    
    // Notify collaborator via socket
    io.to(collaborator.shopName).emit('admin:reply', {
      threadId,
      from: admin.shopName,
      text
    });

    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.IO handlers
io.on('connection', (socket) => {
  // join user to a room (thread) or admin room
  socket.on('join', ({ threadId, userId, role }) => {
    if (role === 'admin') socket.join('admin');
    if (threadId) socket.join(threadId);
  });

  socket.on('message', async (data) => {
    // data: { threadId, from, to, text }
    try {
      const msg = new Message({ threadId: data.threadId, from: data.from, to: data.to, text: data.text });
      await msg.save();
      io.to(data.threadId).emit('message', msg);
    } catch (e) {
      console.error('Error saving message:', e.message);
    }
  });

  socket.on('typing', ({ threadId, userId }) => {
    socket.to(threadId).emit('typing', { userId });
  });

  socket.on('markRead', async ({ threadId, userId }) => {
    try {
      await Message.updateMany({ threadId, to: userId, read: false }, { $set: { read: true } });
      io.to(threadId).emit('read', { threadId, userId });
    } catch (e) {
      console.error('Error marking messages read:', e.message);
    }
  });
});

// Start HTTP server (with Socket.IO)
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/bulkbuy'}`);
});
