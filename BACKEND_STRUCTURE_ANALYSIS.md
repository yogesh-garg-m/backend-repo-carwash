# Backend Structure Analysis - Car Booking System

## 📋 Overview
This is a **Node.js/Express** backend application for an **Online Car Booking System**. The application uses **MongoDB** with **Mongoose** for data persistence and implements JWT-based authentication.

---

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB (via Mongoose 8.4.1)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **File Upload**: express-fileupload 1.5.1
- **CORS**: Enabled for frontend communication
- **Environment**: dotenv for configuration

### Project Structure
```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controller/               # Business logic handlers
│   ├── allUsers.js
│   ├── booking.js
│   ├── bookingAcceptReject.js
│   ├── contactUsController.js
│   ├── shopCarController.js
│   ├── updateUser.js
│   ├── userCountForDashboard.js
│   ├── userDetails.js
│   ├── userLogout.js
│   ├── userSignIn.js
│   └── userSignup.js
├── middleware/
│   └── authToken.js          # Cookie-based JWT auth
├── models/                   # Mongoose schemas
│   ├── bookingModel.js
│   ├── contactUsModel.js
│   ├── shopCarModel.js
│   └── userModel.js
├── routes/                   # API route definitions
│   ├── index.js
│   └── contactUsRoutes.js
├── utilis/                   # Utility functions
│   ├── helperFile.js         # Image upload helper (⚠️ has syntax issue)
│   ├── jwtToken.js           # JWT token generation
│   └── middleware.js         # Bearer token auth middleware
└── index.js                  # Application entry point
```

---

## 🗄️ Database Models

### 1. User Model (`userModel.js`)
**Collection**: `users`

**Schema Fields**:
- `firstname` (String, default: "")
- `lastname` (String)
- `email` (String, **unique**, **required**)
- `password` (String, hashed with bcrypt)
- `role` (Number, enum: [0,1], default: 0)
  - `0` = Regular User
  - `1` = Admin
- `status` (Number, enum: [0,1,2], default: 0)
  - `0` = Pending
  - `1` = Accepted
  - `2` = Not Accepted
- `phoneNumber` (Number, default: 0)
- `token` (String) - JWT token stored in DB
- `loginTime` (Number) - Token issued at timestamp
- `isAdmin` (Number, default: 0)
- `timestamps` (createdAt, updatedAt)

### 2. Booking Model (`bookingModel.js`)
**Collection**: `bookings`

**Schema Fields**:
- `userId` (ObjectId, ref: 'user') - Reference to user who made booking
- `carBookingId` (ObjectId, ref: 'shopCar') - Reference to booked car
- `name` (String, default: "")
- `email` (String, default: "")
- `country` (String, default: "")
- `phoneNumber` (Number, default: 0)
- `state` (String, default: "")
- `city` (String, default: "")
- `address` (String, default: "")
- `zipCode` (Number, default: "")
- `status` (Number, enum: [0,1,2], default: 0)
  - `0` = Pending
  - `1` = Accepted
  - `2` = Rejected
- `timestamps` (createdAt, updatedAt)

### 3. Shop Car Model (`shopCarModel.js`)
**Collection**: `shopCars`

**Schema Fields**:
- `title` (String, default: "")
- `price` (String, default: "")
- `description` (String, default: "")
- `image` (String, default: "")
- `status` (Number, enum: [0,1,2], default: 0)
- `timestamps` (createdAt, updatedAt)

**Note**: `userId` field is commented out but used in controller

### 4. Contact Us Model (`contactUsModel.js`)
**Collection**: `contactUs`

**Schema Fields**:
- `name` (String, default: "")
- `email` (String, default: "")
- `phone` (Number, default: 0)
- `subject` (String, default: "")
- `message` (String, default: "")
- `timestamps` (createdAt, updatedAt)

---

## 🔐 Authentication System

### Two Authentication Middlewares

#### 1. `authToken` (Cookie-based)
**Location**: `middleware/authToken.js`
- Reads JWT from **cookies** (`req.cookies.token`)
- Verifies token using `TOKEN_SECRET_KEY`
- Sets `req.userId` from decoded token
- Used for: `/user-details` endpoint

#### 2. `middleware` (Bearer Token)
**Location**: `utilis/middleware.js`
- Reads JWT from **Authorization header** (`Bearer <token>`)
- Verifies token and checks `loginTime` matches user's stored `loginTime`
- Updates user's `loginTime` on each request
- Sets `req.user` with full user object
- Used for: Most protected routes (bookings, admin operations, etc.)

### JWT Token Generation
**Location**: `utilis/jwtToken.js`
- Signs token with user `_id`
- Stores token and `loginTime` (iat) in user document
- Returns token and decoded payload

---

## 🛣️ API Routes

### Base URL: `http://localhost:8080`

### Public Routes (No Authentication)

#### Authentication
- `POST /signup` - User registration
  - Body: `{ firstname, lastname, email, password, phoneNumber }`
  - Returns: User object with JWT token

- `POST /signin` - User login
  - Body: `{ email, password }`
  - Returns: User object with JWT token

- `GET /userLogout` - Logout (clears cookie)

#### Car Shop
- `GET /getAllCar` - Get all available cars
  - Returns: Array of car objects

#### Contact Us
- `POST /createContactUs` - Submit contact form
  - Body: `{ name, email, phone, subject, message }`

### Protected Routes (Require `middleware` - Bearer Token)

#### User Operations
- `GET /user-details` - Get current user details (uses `authToken` middleware)
- `GET /allbookingForUser` - Get all bookings for logged-in user

#### Booking Operations
- `POST /bookingController` - Create a new booking
  - Body: `{ carBookingId, name, email, country, phoneNumber, state, city, address, zipCode }`
  - Automatically sets `userId` from authenticated user

- `PUT /bookingAcceptRejectByDoctor/:id` - Accept/reject booking
  - Body: `{ status: 1 or 2 }`
  - **Note**: Bug - uses `userId` in params but should use booking `_id`

#### Car Shop (Admin)
- `POST /createShopProduct` - Create new car listing
  - Body: `{ title, price, description, image }`
  - Sets `userId` from authenticated user

- `GET /createShopProduct/:id` - Get single car details
  - **Note**: Route naming is confusing (should be `/getSingleCar/:id`)

#### Admin Panel Routes
- `GET /countForDash` - Dashboard statistics
  - Returns: `{ userCount, contactUs, appointments }`

- `GET /allUsers` - Get all users (excludes admins)
- `GET /allbooking` - Get all bookings (with populated user and car)
- `GET /getAllContactUs` - Get all contact messages

- `GET /singleUserForAdmin/:id` - Get single user details
- `GET /singlebookingForAdmin/:id` - Get single booking details
- `GET /singleGetContactUs/:id` - Get single contact message

- `DELETE /deleteUserForAdmin/:id` - Delete user
- `DELETE /deleteSingleContactUs/:id` - Delete contact message
- `DELETE /deletebookingForAdmin/:id` - Delete booking

---

## 🔧 Configuration

### Environment Variables Required
```env
MONGODB_URI=<MongoDB connection string>
TOKEN_SECRET_KEY=<JWT secret key>
FRONTEND_URL=<Frontend URL for CORS>
PORT=8080 (optional, defaults to 8080)
```

### Database Connection
- **File**: `config/db.js`
- Uses Mongoose to connect to MongoDB
- Connection string from `process.env.MONGODB_URI`

### CORS Configuration
- Enabled for frontend origin
- Credentials allowed
- Configured in `index.js`

---

## 🐛 Issues & Observations

### 1. **Critical Bug in `helperFile.js`**
- Uses ES6 `export` syntax but should use CommonJS `module.exports`
- File is not currently used (commented out in userSignup)
- **Fix needed**: Change to `module.exports = { imageUpload }`

### 2. **Route Naming Inconsistency**
- `GET /createShopProduct/:id` should be `GET /getSingleCar/:id`
- Route name suggests POST operation but it's a GET

### 3. **Booking Accept/Reject Bug**
- `bookingAcceptRejectByDoctor` uses `req.params.id` as `userId`
- Should use booking `_id` instead
- Current: `findOneAndUpdate({userId:req.params.id})`
- Should be: `findOneAndUpdate({_id:req.params.id})`

### 4. **Inconsistent Error Handling**
- Some controllers return `res.json()` with status codes
- Some use `res.status().json()`
- Error messages vary in format

### 5. **Missing Validation**
- No input validation middleware
- No email format validation
- No password strength requirements
- No phone number format validation

### 6. **Security Concerns**
- JWT tokens stored in database (unusual practice)
- `loginTime` check prevents token reuse (good) but may cause issues
- No rate limiting on authentication endpoints
- No password reset functionality

### 7. **File Upload Not Implemented**
- `express-fileupload` is configured but not used
- Image upload helper exists but commented out
- Car images stored as strings (likely URLs)

### 8. **Missing Features**
- No email verification
- No password reset
- No admin role verification middleware
- No pagination for list endpoints
- No search/filter functionality

---

## 📊 Data Flow

### User Registration Flow
1. Client sends POST `/signup` with user data
2. Server checks if email exists
3. Password hashed with bcrypt (10 rounds)
4. User created in database
5. JWT token generated and stored in user document
6. Token and user data returned to client

### User Login Flow
1. Client sends POST `/signin` with email/password
2. Server finds user by email
3. Password verified with bcrypt
4. New JWT token generated (updates loginTime)
5. Token and user data returned to client

### Booking Creation Flow
1. Client sends POST `/bookingController` with booking data + Bearer token
2. Middleware verifies token and sets `req.user`
3. Booking created with `userId` from authenticated user
4. Booking saved to database
5. Response returned to client

### Admin Operations Flow
1. Client sends request with Bearer token
2. Middleware verifies token
3. **Note**: No admin role check - any authenticated user can access admin routes
4. Operation performed
5. Response returned

---

## 🎯 Key Features

### Implemented
✅ User registration and authentication  
✅ JWT-based authentication (dual system)  
✅ Car listing (CRUD operations)  
✅ Booking system with status management  
✅ Contact form submission  
✅ Admin dashboard with statistics  
✅ User management (view, delete)  
✅ Booking management (view, accept/reject, delete)  

### Partially Implemented
⚠️ File upload (configured but not used)  
⚠️ Image handling (helper exists but commented)  

### Missing
❌ Admin role verification  
❌ Email verification  
❌ Password reset  
❌ Input validation  
❌ Rate limiting  
❌ Pagination  
❌ Search/filter  
❌ Payment integration (Stripe commented out)  

---

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "status": 200,
  "message": "Operation successful",
  "body": { /* data */ }
}
```

### Error Response
```json
{
  "success": false,
  "status": 400,
  "message": "Error message",
  "body": {}
}
```

**Note**: Some endpoints use different formats:
- `{ data, error, success, message }`
- `{ body, error, success, message }`

---

## 🚀 Server Configuration

### Port
- Default: `8080`
- Can be overridden with `process.env.PORT`

### Middleware Stack (in order)
1. CORS
2. express-fileupload
3. express.json() (body parser)
4. cookie-parser
5. Routes

### Server Start
- Connects to MongoDB first
- Then starts Express server
- Logs connection status

---

## 📝 Recommendations

1. **Fix `helperFile.js`** - Convert to CommonJS
2. **Add admin middleware** - Verify `role === 1` for admin routes
3. **Fix booking accept/reject** - Use booking `_id` not `userId`
4. **Standardize response format** - Use consistent structure
5. **Add input validation** - Use express-validator or joi
6. **Implement file upload** - Complete image upload functionality
7. **Add pagination** - For list endpoints
8. **Add error logging** - Use winston or similar
9. **Add API documentation** - Swagger/OpenAPI
10. **Add unit tests** - Jest or Mocha

---

## 🔗 Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.19.2 | Web framework |
| mongoose | ^8.4.1 | MongoDB ODM |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| express-fileupload | ^1.5.1 | File upload handling |
| cors | ^2.8.5 | CORS middleware |
| cookie-parser | ^1.4.6 | Cookie parsing |
| body-parser | ^1.20.2 | Body parsing |
| dotenv | ^16.4.5 | Environment variables |
| nodemon | ^3.1.2 | Development server |

---

*Analysis completed on: $(date)*
*Backend Version: 1.0.0*

