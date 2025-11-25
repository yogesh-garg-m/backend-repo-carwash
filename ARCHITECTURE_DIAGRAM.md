# System Architecture Diagram

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Frontend)                     │
│                    React Application                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │ (CORS Enabled)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    EXPRESS SERVER                            │
│                  (Port 8080)                                 │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Middleware Stack                        │    │
│  │  1. CORS                                            │    │
│  │  2. express-fileupload                              │    │
│  │  3. express.json()                                  │    │
│  │  4. cookie-parser                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                  Routes                             │    │
│  │  • /routes/index.js                                │    │
│  │  • /routes/contactUsRoutes.js                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Authentication                         │    │
│  │  • Cookie-based (authToken)                        │    │
│  │  • Bearer Token (middleware)                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                Controllers                          │    │
│  │  • User Management                                 │    │
│  │  • Booking Management                              │    │
│  │  • Car Shop Management                             │    │
│  │  • Contact Management                              │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Mongoose ODM
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    MONGODB DATABASE                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    users     │  │   bookings   │  │  shopCars    │     │
│  │              │  │              │  │              │     │
│  │ • email      │  │ • userId ────┼──┼─► users      │     │
│  │ • password   │  │ • carId ─────┼──┼─► shopCars   │     │
│  │ • role       │  │ • status     │  │ • title      │     │
│  │ • token      │  │ • address    │  │ • price      │     │
│  │ • loginTime  │  │              │  │ • image      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐                                          │
│  │  contactUs   │                                          │
│  │              │                                          │
│  │ • name       │                                          │
│  │ • email      │                                          │
│  │ • message    │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Relationships

```
┌─────────────┐
│    User     │
│             │
│ • _id       │◄──────┐
│ • email     │       │
│ • role      │       │
│ • token     │       │
└─────────────┘       │
                      │
                      │ userId (ref)
                      │
┌─────────────┐       │
│  Booking    │       │
│             │       │
│ • userId ───┼───────┘
│ • carId ────┼───┐
│ • status    │   │
│ • address   │   │
└─────────────┘   │
                  │ carBookingId (ref)
                  │
┌─────────────┐   │
│  ShopCar    │   │
│             │   │
│ • _id ──────┼───┘
│ • title     │
│ • price     │
│ • image     │
└─────────────┘

┌─────────────┐
│ ContactUs   │
│             │
│ • name      │  (Standalone - no relationships)
│ • email     │
│ • message   │
└─────────────┘
```

---

## 🔐 Authentication Flow

### Registration Flow
```
Client
  │
  ├─ POST /signup
  │   { email, password, ... }
  │
  ▼
Server
  │
  ├─ Check email exists?
  │   ├─ Yes → Return error
  │   └─ No  → Continue
  │
  ├─ Hash password (bcrypt)
  │
  ├─ Create user in DB
  │
  ├─ Generate JWT token
  │   └─ Store in user.token
  │
  └─ Return user + token
```

### Login Flow
```
Client
  │
  ├─ POST /signin
  │   { email, password }
  │
  ▼
Server
  │
  ├─ Find user by email
  │   ├─ Not found → Return error
  │   └─ Found → Continue
  │
  ├─ Verify password (bcrypt.compare)
  │   ├─ Invalid → Return error
  │   └─ Valid → Continue
  │
  ├─ Generate new JWT token
  │   └─ Update user.token & user.loginTime
  │
  └─ Return user + token
```

### Protected Route Flow
```
Client
  │
  ├─ Request with Bearer token
  │   Authorization: Bearer <token>
  │
  ▼
Middleware (utilis/middleware.js)
  │
  ├─ Extract token from header
  │
  ├─ Verify JWT signature
  │   ├─ Invalid → Return 401
  │   └─ Valid → Continue
  │
  ├─ Check loginTime matches DB
  │   ├─ Mismatch → Return 404 (token expired)
  │   └─ Match → Continue
  │
  ├─ Update user.loginTime
  │
  ├─ Set req.user = user object
  │
  └─ next() → Continue to controller
```

---

## 📊 Request Flow Example: Create Booking

```
1. Client Request
   POST /bookingController
   Headers: { Authorization: "Bearer <token>" }
   Body: { carBookingId, name, email, ... }

2. Express Router
   routes/index.js
   → Apply middleware

3. Authentication Middleware
   utilis/middleware.js
   → Verify token
   → Set req.user

4. Controller
   controller/booking.js
   → Extract req.user._id
   → Create booking with userId
   → Save to database

5. Database
   MongoDB
   → Insert booking document
   → Populate userId and carBookingId refs

6. Response
   → Return booking object
   → Client receives confirmation
```

---

## 🗂️ File Organization Pattern

```
Request Flow:
  index.js (Entry Point)
    │
    ├─ Routes (routes/index.js)
    │   │
    │   ├─ Middleware Check
    │   │   ├─ authToken (cookie)
    │   │   └─ middleware (bearer)
    │   │
    │   └─ Controller
    │       └─ controller/*.js
    │           │
    │           └─ Model
    │               └─ models/*.js
    │                   │
    │                   └─ MongoDB
```

---

## 🔧 Utility Functions

```
utilis/
├── jwtToken.js
│   └─ jwtTokenSign(id)
│       → Generate JWT
│       → Store in DB
│       → Return token
│
├── middleware.js
│   └─ middleware(req, res, next)
│       → Verify Bearer token
│       → Check loginTime
│       → Set req.user
│
└── helperFile.js (⚠️ Not used)
    └─ imageUpload(file, folder)
        → Generate filename
        → Save file
        → Return filename
```

---

## 🎯 Role-Based Access (Current State)

```
┌─────────────────────────────────────────┐
│  Current Implementation                 │
│                                         │
│  ❌ No role verification                │
│  ✅ Authentication required              │
│  ⚠️  Any authenticated user = Admin     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Recommended Implementation             │
│                                         │
│  ✅ Authentication required              │
│  ✅ Role verification (role === 1)      │
│  ✅ Separate user/admin routes           │
└─────────────────────────────────────────┘
```

---

## 📦 Module Dependencies

```
index.js
  ├─ express
  ├─ cors
  ├─ cookie-parser
  ├─ body-parser
  ├─ dotenv
  ├─ express-fileupload
  │
  ├─ config/db.js
  │   └─ mongoose
  │
  └─ routes/
      ├─ index.js
      │   ├─ controller/*.js
      │   │   ├─ models/*.js
      │   │   │   └─ mongoose
      │   │   ├─ bcryptjs
      │   │   └─ utilis/jwtToken.js
      │   │       └─ jsonwebtoken
      │   └─ utilis/middleware.js
      │       └─ jsonwebtoken
      │
      └─ contactUsRoutes.js
          └─ controller/contactUsController.js
              └─ models/contactUsModel.js
```

---

## 🚨 Security Layers

```
┌─────────────────────────────────────┐
│  Layer 1: CORS                      │
│  - Restricts origin                 │
│  - Allows credentials               │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Layer 2: Authentication            │
│  - JWT token verification            │
│  - loginTime validation             │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Layer 3: Password Security          │
│  - bcrypt hashing (10 rounds)        │
│  - Never stored in plain text        │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Layer 4: Database                   │
│  - Mongoose validation               │
│  - Unique constraints                │
└─────────────────────────────────────┘
```

---

## 🔄 State Management (Status Fields)

```
User Status:
  0 ──► Pending
  1 ──► Accepted
  2 ──► Not Accepted

Booking Status:
  0 ──► Pending
  1 ──► Accepted
  2 ──► Rejected

Car Status:
  0 ──► (Default - likely Inactive)
  1 ──► (Likely Active)
  2 ──► (Likely Deleted/Archived)
```

---

*Architecture documentation for Car Booking System Backend*

