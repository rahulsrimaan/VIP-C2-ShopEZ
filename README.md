#  ShopEZ — Full Stack E-Commerce Platform

> A complete, production-ready e-commerce web application built with the MERN Stack (MongoDB, Express.js, React.js, Node.js)



---

##  Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

---

##  About the Project

ShopEZ is a full-stack e-commerce platform that replicates the core functionality of platforms like Amazon and Flipkart. It provides a seamless shopping experience for users and a powerful management system for admins.

Built as a college project to demonstrate proficiency in the MERN stack, ShopEZ covers everything from user authentication to order management, product catalogs, reviews, and an admin dashboard.

---

##  Features

###  User Features
- ✅ User Registration & Login with JWT Authentication
- ✅ Browse products with category filters and search
- ✅ Product specifications, highlights, and customer reviews
- ✅ Star rating system for products
- ✅ Add to cart with quantity management
- ✅ Order placement with payment method selection
- ✅ Order tracking with progress bar (Pending → Processing → Shipped → Delivered)
- ✅ Cancel order feature with automatic stock restoration
- ✅ Profile page with order history
- ✅ Related products section

### Admin Features
- ✅ Separate admin authentication
- ✅ Dashboard with real-time statistics (Revenue, Orders, Products, Users)
- ✅ Add products with multiple images, specifications, and highlights
- ✅ Delete products
- ✅ Update order status
- ✅ View all users
- ✅ Manage advertising banners (Add/Delete)
- ✅ Dynamic stock updates on order placement and cancellation

###  UI/UX Features
- ✅ Fully responsive design
- ✅ Premium white and green color theme
- ✅ Auto-sliding banner carousel
- ✅ Product image gallery with thumbnail navigation
- ✅ Real-time address preview during checkout
- ✅ Loading states and error handling

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI Framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Context API | Global state management |
| Inline Styles | Component styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Mongoose | MongoDB ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password encryption |
| cors | Cross-origin requests |
| dotenv | Environment variables |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | NoSQL Database |
| MongoDB Compass | Database GUI |

### Tools
| Tool | Purpose |
|---|---|
| VS Code | Code editor |
| Postman | API testing |
| Git & GitHub | Version control |
| nodemon | Auto server restart |

---

##  Project Architecture

```
ShopEZ/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── BannerSlider.jsx     # Auto-sliding banner carousel
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # User & Admin login
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── Products.jsx         # Product listing with filters
│   │   │   ├── ProductDetail.jsx    # Amazon-style product page
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Checkout.jsx         # Order checkout
│   │   │   ├── Profile.jsx          # User profile & orders
│   │   │   ├── AdminLogin.jsx       # Admin login page
│   │   │   └── AdminDashboard.jsx   # Admin control panel
│   │   ├── App.jsx                  # Routes configuration
│   │   └── main.jsx                 # App entry point
│   └── package.json
│
└── server/                          # Express Backend
    ├── controllers/
    │   ├── userController.js        # User auth logic
    │   ├── productController.js     # Product CRUD logic
    │   ├── orderController.js       # Order management logic
    │   ├── cartController.js        # Cart management logic
    │   └── adminController.js       # Admin logic
    ├── models/
    │   ├── User.js                  # User schema
    │   ├── Product.js               # Product schema with reviews
    │   ├── Orders.js                # Orders schema
    │   ├── Cart.js                  # Cart schema
    │   └── Admin.js                 # Admin schema with banners
    ├── routes/
    │   ├── userRoutes.js            # /api/users/*
    │   ├── productRoutes.js         # /api/products/*
    │   ├── orderRoutes.js           # /api/orders/*
    │   ├── cartRoutes.js            # /api/cart/*
    │   └── adminRoutes.js           # /api/admin/*
    ├── middleware.js                 # JWT auth middleware
    ├── index.js                     # Server entry point
    └── package.json
```

---

##  Database Schema

### User Schema
```javascript
{
  username: String,      // User's display name
  email: String,         // Unique email address
  password: String,      // Bcrypt hashed password
  timestamps: true       // createdAt, updatedAt
}
```

### Product Schema
```javascript
{
  name: String,          // Product name
  description: String,   // Detailed description
  price: Number,         // Original price
  category: String,      // Product category
  image: String,         // Main image URL
  images: [String],      // Additional image URLs
  stock: Number,         // Available quantity
  discount: Number,      // Discount percentage
  brand: String,         // Brand name
  ratings: Number,       // Average rating (auto-calculated)
  numReviews: Number,    // Total review count
  highlights: [String],  // Key product highlights
  specifications: Map,   // Key-value specifications
  reviews: [ReviewSchema] // Customer reviews array
}
```

### Orders Schema
```javascript
{
  userId: ObjectId,      // Reference to User
  productId: ObjectId,   // Reference to Product
  productName: String,   // Product name at time of order
  price: Number,         // Price at time of order
  quantity: Number,      // Ordered quantity
  address: String,       // Delivery address
  paymentMethod: String, // Payment method selected
  status: String,        // Pending/Processing/Shipped/Delivered/Cancelled
  timestamps: true
}
```

### Cart Schema
```javascript
{
  userId: ObjectId,      // Reference to User
  productId: ObjectId,   // Reference to Product
  productName: String,   // Product name
  price: Number,         // Product price
  quantity: Number,      // Cart quantity
  image: String,         // Product image URL
  timestamps: true
}
```

### Admin Schema
```javascript
{
  username: String,      // Admin name
  email: String,         // Admin email
  password: String,      // Bcrypt hashed password
  banners: [{            // Advertising banners array
    image: String,
    title: String,
    subtitle: String,
    link: String,
    bgColor: String
  }]
}
```

---

##  API Endpoints

### User Routes `/api/users`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user, returns JWT | ❌ |

### Product Routes `/api/products`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get all products (with filters) | ❌ |
| GET | `/:id` | Get single product | ❌ |
| POST | `/add` | Add new product | ✅ |
| DELETE | `/:id` | Delete product | ✅ |
| POST | `/:id/review` | Add product review | ✅ |

### Cart Routes `/api/cart`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get user's cart | ✅ |
| POST | `/add` | Add item to cart | ✅ |
| DELETE | `/:id` | Remove cart item | ✅ |
| DELETE | `/clear/all` | Clear entire cart | ✅ |

### Order Routes `/api/orders`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/place` | Place new order | ✅ |
| GET | `/myorders` | Get user's orders | ✅ |
| GET | `/all` | Get all orders (admin) | ✅ |
| PUT | `/cancel/:id` | Cancel order | ✅ |

### Admin Routes `/api/admin`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register admin | ❌ |
| POST | `/login` | Admin login | ❌ |
| GET | `/orders` | Get all orders | ✅ |
| GET | `/users` | Get all users | ✅ |
| PUT | `/orders/:id` | Update order status | ✅ |
| GET | `/banners` | Get all banners | ❌ |
| POST | `/banners` | Add banner | ✅ |
| DELETE | `/banners/:id` | Delete banner | ✅ |

---

##  Installation & Setup

### Prerequisites
- Node.js v16 or above
- MongoDB (local or Atlas)
- Git

### Step 1 — Clone the repository
```bash
git clone https://github.com/YOURUSERNAME/ShopEZ.git
cd ShopEZ
```

### Step 2 — Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```env
MONGO_URI=mongodb://localhost:27017/shopez
PORT=8000
JWT_SECRET=shopez_secret_key_2024
```

Start the backend:
```bash
npx nodemon index.js
```

### Step 3 — Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

### Step 4 — Start MongoDB
```bash
# Windows
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"

# macOS/Linux
mongod
```

### Step 5 — Create Admin Account
Use Postman to send a POST request:
```
POST http://localhost:8000/api/admin/register
Body: { "username": "Admin", "email": "admin@shopez.com", "password": "admin123" }
```

### Running the App
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Admin Panel | http://localhost:5173/admin |

---

##  Usage

### As a User
1. Register at `/register`
2. Login at `/login`
3. Browse products at `/products`
4. Click any product to see details
5. Add to cart and proceed to checkout
6. View orders at `/profile`

### As an Admin
1. Go to `/login` and click **Admin Login**
2. Login with admin credentials
3. Manage products, orders, users, and banners

---

##  Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Product image upload (Cloudinary)
- [ ] Email notifications for orders
- [ ] Wishlist feature
- [ ] Coupon and discount codes
- [ ] Product comparison feature
- [ ] Advanced analytics dashboard
- [ ] Mobile app with React Native

---

##  Developer
Musiboina Rahul Srimaan
Built using the MERN Stack

**Tech Used:** MongoDB • Express.js • React.js • Node.js • JWT • bcrypt

---

##  License

This project is built for educational purposes as part of a college project.
