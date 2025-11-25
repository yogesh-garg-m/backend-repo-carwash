# API Endpoints Quick Reference

## 🔓 Public Endpoints (No Auth Required)

### Authentication
```
POST   /signup
POST   /signin
GET    /userLogout
```

### Car Shop
```
GET    /getAllCar
```

### Contact
```
POST   /createContactUs
```

---

## 🔒 Protected Endpoints (Bearer Token Required)

### User Operations
```
GET    /user-details              (Cookie-based auth)
GET    /allbookingForUser
```

### Booking Operations
```
POST   /bookingController
PUT    /bookingAcceptRejectByDoctor/:id
```

### Car Shop (Admin)
```
POST   /createShopProduct
GET    /createShopProduct/:id     (Should be /getSingleCar/:id)
```

### Admin Dashboard
```
GET    /countForDash
```

### Admin - Users
```
GET    /allUsers
GET    /singleUserForAdmin/:id
DELETE /deleteUserForAdmin/:id
```

### Admin - Bookings
```
GET    /allbooking
GET    /singlebookingForAdmin/:id
DELETE /deletebookingForAdmin/:id
```

### Admin - Contact Messages
```
GET    /getAllContactUs
GET    /singleGetContactUs/:id
DELETE /deleteSingleContactUs/:id
```

---

## 📋 Request/Response Examples

### POST /signup
**Request:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": 1234567890
}
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "User created succesfully",
  "body": {
    "_id": "...",
    "firstname": "John",
    "email": "john@example.com",
    "token": "jwt_token_here",
    "loginTime": 1234567890
  }
}
```

### POST /signin
**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Login successfully",
  "body": {
    "_id": "...",
    "email": "john@example.com",
    "token": "jwt_token_here",
    "loginTime": 1234567890
  }
}
```

### POST /bookingController
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "carBookingId": "car_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "country": "USA",
  "phoneNumber": 1234567890,
  "state": "California",
  "city": "Los Angeles",
  "address": "123 Main St",
  "zipCode": 90001
}
```

**Response:**
```json
{
  "message": "booking information has been forwarded successfully",
  "error": false,
  "success": true,
  "data": {
    "_id": "...",
    "userId": "user_id_here",
    "carBookingId": "car_id_here",
    "name": "John Doe",
    "status": 0
  }
}
```

### POST /createShopProduct
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "title": "BMW X5",
  "price": "50000",
  "description": "Luxury SUV",
  "image": "https://example.com/image.jpg"
}
```

### GET /countForDash
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "here is all user",
  "body": {
    "userCount": 150,
    "contactUs": 45,
    "appointments": 320
  }
}
```

---

## 🔑 Authentication

### Bearer Token (Most Routes)
Include in request headers:
```
Authorization: Bearer <jwt_token>
```

### Cookie Token (User Details)
Token automatically sent via cookies if using cookie-based auth.

---

## ⚠️ Known Issues

1. **Booking Accept/Reject**: Uses wrong field (`userId` instead of `_id`)
2. **Route Naming**: `/createShopProduct/:id` should be `/getSingleCar/:id`
3. **No Admin Check**: All authenticated users can access admin routes
4. **No Validation**: Missing input validation on all endpoints

---

## 📊 Status Codes

- `0` = Pending
- `1` = Accepted/Active
- `2` = Rejected/Not Accepted

Used in:
- User `status` field
- Booking `status` field
- Car `status` field

---

## 🎭 User Roles

- `0` = Regular User
- `1` = Admin

**Note**: Currently no middleware enforces role-based access control.

