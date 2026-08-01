# BulkBuy - Collaborative Wholesale Platform

<div align="center">

![BulkBuy Logo](https://img.shields.io/badge/BulkBuy-Wholesale%20Platform-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**India's Premier Collaborative Wholesale Network**

[Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

BulkBuy is a revolutionary B2B wholesale platform that enables shop owners and retailers to pool their orders together, unlocking bulk discounts of up to 30% on every purchase. Built with modern web technologies, it provides a seamless experience for collaborative purchasing, real-time communication, and efficient order management.

### Key Benefits

- **Cost Savings**: Pool orders with nearby businesses to access wholesale pricing
- **Real-time Collaboration**: Connect with other shop owners instantly
- **Smart Tracking**: Monitor orders from placement to delivery
- **Secure Payments**: Integrated payment gateway with Razorpay
- **Admin Dashboard**: Comprehensive management interface for administrators
- **Multi-theme Support**: Choose from Dark, Light, Ocean Blue, or Royal Purple themes

---

## ✨ Features

### For Shop Owners
- **Order Pooling**: Find and collaborate with other businesses for bulk purchases
- **Real-time Chat**: Communicate with pooling partners instantly
- **Product Catalog**: Browse and search through extensive product listings
- **Wishlist Management**: Save products for future purchases with price alerts
- **Order Tracking**: Monitor order status from approval to delivery
- **Loyalty Points**: Earn rewards for regular purchases and collaborations
- **Recurring Orders**: Set up automated repeat orders for frequently purchased items

### For Administrators
- **Dashboard Analytics**: Comprehensive overview of platform activity
- **User Management**: Manage shop owner accounts and permissions
- **Product Management**: Add, edit, and remove products from the catalog
- **Order Management**: Review, approve, and track all orders
- **Payment Tracking**: Monitor payment status and reconciliation
- **Delivery Management**: Coordinate shipping and delivery logistics
- **Vendor Management**: Manage supplier relationships and performance metrics

### Security & Authentication
- **Two-Factor Authentication**: Enhanced security with OTP verification
- **Role-Based Access Control**: Separate interfaces for owners and admins
- **Secure API**: JWT-based authentication for all API endpoints
- **Data Protection**: Encrypted sensitive data and secure payment processing

### Additional Features
- **Invoice Generation**: Automatic invoice creation for all orders
- **Return/Refund Management**: Handle product returns and refunds efficiently
- **Webhook Integrations**: Connect with external systems and services
- **Multi-theme Support**: Customizable UI themes for better user experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Notifications**: Stay updated with Socket.IO-powered notifications

---

## 🛠 Technology Stack

### Frontend
- **React 18.2.0**: Modern UI library with hooks and context
- **Vite 5.0.0**: Lightning-fast build tool and dev server
- **CSS-in-JS**: Inline styles with CSS custom properties for theming
- **Socket.IO Client**: Real-time bidirectional communication

### Backend
- **Node.js 18.0.0**: JavaScript runtime for server-side logic
- **Express.js**: Fast and minimalist web framework
- **MongoDB 6.0**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling
- **Socket.IO**: Real-time event-driven communication
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing for security
- **Razorpay**: Payment gateway integration

### Development Tools
- **ESLint**: Code quality and consistency
- **Concurrently**: Run multiple npm scripts simultaneously
- **Git**: Version control system

---

## 🏗 Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   User App   │  │  Admin App   │  │  Auth Flow   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Routes  │  │  Socket.IO   │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │   Products   │  │    Orders    │      │
│  │  Collaborations│  │  PooledOrders│  │  Vendors     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Models

**User Schema**
- Owner details, shop information, credentials
- Favorites, collaborations, loyalty points
- Role-based access (owner/admin)

**Product Schema**
- Product details, pricing, stock information
- Bulk pricing thresholds, supplier information
- Product variants, interested users for pooling

**Order Schema**
- Order details, status tracking, payment information
- Shop breakdown, savings calculation
- Return/refund management

**Collaboration Schema**
- Partnership requests and status
- Communication threads, message history

**Pooled Order Schema**
- Multi-participant order management
- Payment tracking per participant
- Conditional tracking visibility

---

## 📦 Installation

### Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 6.0 or higher (local or cloud instance)
- npm or yarn package manager
- Git for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/nanthana2k07-usj/BulkBuy_modified.git
cd BulkBuy_modified
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages for both frontend and backend.

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bulkbuy

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Seed Database (optional)
SEED_DB=true
```

### Step 4: Start MongoDB

**Local MongoDB:**
```bash
# Using MongoDB Community Server
mongod --dbpath /path/to/your/data/directory

# Or using MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### Step 5: Seed Database (Optional)

To populate the database with demo data:

```bash
# Windows (PowerShell)
$env:SEED_DB="true"; node seed.js

# Unix/Linux/Mac
SEED_DB=true node seed.js
```

This will create:
- 10 demo shop owner accounts
- 2 admin accounts
- 92 products with images
- Sample orders and collaborations

---

## ⚙️ Configuration

### Server Configuration

The backend server runs on port 5000 by default. You can modify this in the `.env` file or in `server.js`.

### Frontend Configuration

The frontend is configured to proxy API requests to the backend. Update `vite.config.js` if your backend runs on a different port:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000',
      '/socket.io': {
        target: 'http://127.0.0.1:5000',
        ws: true
      }
    }
  }
})
```

### Theme Configuration

Themes are defined in `src/App.jsx` under the `THEMES` object. You can customize or add new themes by modifying this configuration.

---

## 🚀 Usage Guide

### Development Mode

Start both frontend and backend in development mode:

```bash
npm run dev-full
```

This will:
- Start the backend server on port 5000
- Start the Vite dev server on port 5173
- Enable hot module replacement for frontend changes

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Socket.IO**: ws://localhost:5000

### Demo Accounts

#### Shop Owner Accounts
```
Email: rajesh@shop.com
Password: pass123
Shop: Rajesh General Store
Category: Grocery
```

```
Email: priya@shop.com
Password: pass123
Shop: Priya Mart
Category: Electronics
```

#### Admin Accounts
```
Email: admin@bulkbuy.com
Password: admin123
Role: Administrator
```

```
Email: superadmin@bulkbuy.com
Password: admin123
Role: Super Administrator
```

### Basic Workflow

1. **Login**: Use demo credentials or register a new account
2. **Browse Products**: Explore the product catalog with search and filters
3. **Pool Orders**: Find other shop owners interested in the same products
3. **Send Collaboration Requests**: Connect with potential pooling partners
4. **Create Pooled Orders**: Once collaboration is accepted, create combined orders
5. **Make Payments**: Pay your share using integrated payment gateway
6. **Track Orders**: Monitor order status and delivery progress
7. **Manage Returns**: Handle returns and refunds if needed

---

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/users/register
Register a new shop owner account.

**Request Body:**
```json
{
  "ownerName": "John Doe",
  "email": "john@shop.com",
  "password": "securepassword",
  "phone": "9876543210",
  "shopName": "John's Store",
  "location": "Mumbai, Maharashtra",
  "category": "Electronics"
}
```

#### POST /api/users/login
Initiate login process (generates OTP).

**Request Body:**
```json
{
  "email": "john@shop.com",
  "password": "securepassword"
}
```

#### POST /api/users/login/verify-otp
Complete login with OTP verification.

**Request Body:**
```json
{
  "email": "john@shop.com",
  "otp": "123456"
}
```

### Product Endpoints

#### GET /api/products
Retrieve all products with optional filtering.

**Query Parameters:**
- `category`: Filter by product category
- `search`: Search in product name
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter

#### POST /api/products
Add a new product (admin only).

#### PUT /api/products/:id
Update product details (admin only).

#### DELETE /api/products/:id
Delete a product (admin only).

### Order Endpoints

#### GET /api/orders
Retrieve orders for the authenticated user.

#### POST /api/orders
Create a new order.

#### PUT /api/orders/:id
Update order status or details.

### Pooling Endpoints

#### POST /api/products/:id/interest
Express interest in pooling for a product.

#### GET /api/products/:id/interested-users
Get list of users interested in pooling.

#### POST /api/products/:id/pool-request
Send pooling request to another user.

#### POST /api/products/:id/create-pooled-order
Create a pooled order after collaboration acceptance.

#### POST /api/pooled-orders/:id/payment
Record payment for pooled order share.

### Admin Endpoints

#### GET /api/admin/users
Retrieve all users (admin only).

#### GET /api/admin/analytics
Get platform analytics and statistics (admin only).

#### PUT /api/admin/orders/:id/status
Update order status (admin only).

---

## 🌐 Deployment

### Option 1: Vercel (Recommended - Free)

1. **Prepare for Deployment**
   ```bash
   npm run build
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Click "Deploy"

4. **Backend Deployment**
   - Deploy backend to Render, Railway, or Heroku
   - Update frontend API URLs to point to deployed backend

### Option 2: Netlify (Free)

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub and select repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy"

### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t bulkbuy-backend .
docker run -p 5000:5000 bulkbuy-backend
```

### Option 4: Traditional Hosting

```bash
# Build frontend
npm run build

# Deploy dist folder to any web server
# Deploy backend separately with PM2
pm2 start server.js --name bulkbuy-api
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git fork https://github.com/nanthana2k07-usj/BulkBuy_modified.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run dev-full
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "Add your feature description"
   ```

6. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Describe your changes and submit

### Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 BulkBuy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

### Project Maintainer

- **Name**: BulkBuy Team
- **Email**: support@bulkbuy.com
- **GitHub**: [nanthana2k07-usj](https://github.com/nanthana2k07-usj)

### Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@bulkbuy.com
- Join our Discord community (coming soon)

### Acknowledgments

- Built with [React](https://reactjs.org/)
- Backend powered by [Node.js](https://nodejs.org/)
- Database by [MongoDB](https://mongodb.com/)
- Icons from [Lucide](https://lucide.dev/)
- Payments via [Razorpay](https://razorpay.com/)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the BulkBuy Team

</div>
