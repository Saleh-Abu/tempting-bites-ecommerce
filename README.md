# 🎂 Tempting Bites

**Tempting Bites** is a full-stack cake ordering and delivery web application designed to provide customers with a smooth, modern, and secure online cake-ordering experience.

The platform allows customers to browse cakes, customize their orders, authenticate using Google or mobile OTP, place orders, and track their order journey in real time.

It also includes an admin dashboard for managing cakes, availability, pricing, customer orders, and order statuses.

## 🌐 Live Demo

### 🛍️ Frontend (Vercel)
https://tempting-bites-ecommerce.vercel.app

### ⚙️ Backend API (Render)
https://tempting-bites-api.onrender.com

---

## ✨ Features

### 👤 Customer Authentication

- Google Sign-In using Firebase Authentication
- Mobile number authentication using OTP
- Persistent customer login
- Secure backend authentication using JWT
- Authenticated customer-specific order history

### 🎂 Cake Browsing

- Modern and responsive cake catalogue
- Cake categories
- Best Sellers
- New Arrivals
- Today's Exclusive cakes
- Featured and trending products
- Different cake weights and pricing
- Eggless / With Egg customization
- Personalized cake messages

### 🛒 Shopping Cart

- Add cakes to cart
- Update quantities
- Remove items
- Cart drawer
- Dynamic price calculations
- Order summary
- Responsive cart experience

### 📍 Checkout & Delivery

- Customer delivery information
- Delivery address
- Delivery date selection
- Delivery time-slot selection
- Promo-code support
- Discount calculation
- Delivery-charge calculation
- Cash on Delivery support
- Cake customization details

Currently, delivery is restricted to the supported service area:

```text
PIN Code: 410206
```

### 📦 Customer Orders

Every authenticated order is linked securely to the customer's account.

Customers can:

- View their orders
- View current order status
- See previous orders
- View delivery information
- View payment information
- Track active orders

### 🚚 Order Tracking

The customer can follow the complete order journey:

```text
Order Placed
     ↓
Confirmed
     ↓
Baking
     ↓
Out for Delivery
     ↓
Delivered
```

Order tracking automatically reflects status updates made through the admin dashboard.

### 🛠️ Admin Dashboard

The admin dashboard provides functionality for:

- Add new cakes
- Upload cake images
- Edit cake information
- Update cake prices
- Manage availability
- Mark cakes as out of stock
- Delete cakes
- Manage customer orders
- Update order status
- Mark Today's Exclusive cakes
- Mark Featured cakes
- Mark Trending cakes
- Manage Best Sellers / Most Ordered cakes

---

## 🧰 Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- React Router
- Redux Toolkit
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication

### Database

- MongoDB
- Mongoose

### Authentication

- Firebase Authentication
- Google Authentication
- Mobile OTP Authentication
- JWT-based backend authentication

### Image Management

- Cloudinary

### Development Tools

- Git
- GitHub
- Visual Studio Code
- npm
- Nodemon

---

## 🏗️ Project Architecture

```text
tempting-bites/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── features/
│   │   ├── store/
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔐 Authentication Flow

```text
Google Sign-In / Mobile OTP
            ↓
Firebase Authentication
            ↓
Firebase ID Token
            ↓
Node.js / Express Backend
            ↓
Firebase Admin Verification
            ↓
MongoDB Customer Account
            ↓
Application JWT
            ↓
Authenticated Requests
```

---

## 📦 Order Flow

```text
Customer Login
      ↓
Browse Cakes
      ↓
Select Cake
      ↓
Add to Cart
      ↓
Checkout
      ↓
Delivery Validation
      ↓
Place Order
      ↓
Authenticated Backend Request
      ↓
Order Stored in MongoDB
      ↓
Order Linked to Customer
      ↓
My Orders
      ↓
Order Tracking
```

---

## 🚚 Order Status Flow

The application currently supports the following order states:

```text
placed
confirmed
baking
out-for-delivery
delivered
cancelled
```

The admin can update the order status, and the customer can view the latest status from the **My Orders** section.

---

## 💳 Payment Support

Currently supported:

- Cash on Delivery (COD)

The backend order architecture is also prepared for:

- Razorpay online payments

Razorpay integration is planned as an upcoming enhancement.

---

## 🧪 Testing

Automated testing is planned using:

### Playwright

For modern end-to-end testing of:

- Homepage
- Cake browsing
- Cart
- Checkout
- Authentication
- Orders
- Order tracking

### Selenium

A separate automation testing suite is planned using:

- Java
- Selenium WebDriver
- Maven
- TestNG
- Page Object Model (POM)

---

## 🔒 Environment Variables

Sensitive configuration files are **not included in this repository**.

Examples include:

```text
.env
Firebase Admin credentials
MongoDB credentials
Cloudinary API secrets
JWT secrets
```

Create your own environment configuration when running the project locally.

Never commit production credentials or Firebase service-account private keys to GitHub.

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone <repository-url>
```

Then:

```bash
cd tempting-bites
```

---

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

The backend normally runs at:

```text
http://localhost:5000
```

---

## 🔮 Planned Enhancements

Future development includes:

- Razorpay online payment integration
- Customer notifications
- Improved mobile admin dashboard
- Saved customer addresses
- Customer profile management
- Persistent account-based wishlist
- Enhanced admin authentication
- Playwright automated testing
- Selenium + Java + Maven automation suite
- Production deployment
- Custom domain integration

---

## 🎯 Project Objective

Tempting Bites is being developed as a practical full-stack application rather than only a static portfolio project.

The objective is to create a complete cake ordering platform covering:

- Customer experience
- Authentication
- Product management
- Cart and checkout
- Order management
- Delivery validation
- Order tracking
- Admin operations
- Automated testing
- Production deployment

---

## 👨‍💻 Developer

**Abu Saleh**

B.Tech — Computer Science & Engineering

Full-Stack Development | React | Node.js | MongoDB | Software Testing

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐.