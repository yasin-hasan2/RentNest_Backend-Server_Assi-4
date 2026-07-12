# 🏠 RentNest Backend API

A scalable and secure RESTful API for a rental property marketplace where tenants can browse rental properties, submit rental requests, landlords can manage listings, and administrators can oversee the entire platform.

---

## 🚀 Live API

> https://your-vercel-url.vercel.app

## 📖 API Documentation

> https://documenter.getpostman.com/view/your-postman-doc-link

---

## 📂 GitHub Repository

> https://github.com/your-username/rentnest-backend

---

# ✨ Features

## 👤 Authentication

- User Registration
- User Login
- JWT Authentication
- Role-based Authorization
- Password Hashing using bcrypt

---

## 👥 User Roles

### Tenant

- Browse properties
- Search & filter properties
- View property details
- Submit rental requests
- View own rental requests
- View payment history
- Update own profile

### Landlord

- Create property
- Update own property
- Delete own property
- View rental requests
- Approve/Reject rental requests

### Admin

- View all users
- Ban / Unban users
- View all properties
- View all rental requests

---

# 🏡 Property Management

- Create Property
- Update Property
- Delete Property
- Get All Properties
- Get Single Property
- Search
- Filtering
- Pagination
- Sorting

---

# 📝 Rental Management

- Create Rental Request
- View Own Rental Requests
- View Single Rental Request
- Landlord Rental Management
- Approve / Reject Rental Requests

---

# 💳 Payment

- Stripe Integration (In Progress)
- Payment Intent
- Payment Status Tracking
- Webhook Support

---

# 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Stripe
- Vercel

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/your-username/rentnest-backend.git
```

Move into the project

```bash
cd rentnest-backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=7d

JWT_REFRESH_EXPIRES_IN=30d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Run development server

```bash
npm run dev
```

---

# 📁 Project Structure

```
src
│
├── app.ts
├── server.ts
│
├── config
├── middleware
├── routes
├── utils
├── errors
├── lib
│
└── modules
    ├── auth
    ├── users
    ├── properties
    ├── categories
    ├── rentals
    └── payments

prisma
    └── schema
```

---

# 🔐 Authentication

Most protected routes require a JWT Bearer Token.

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📌 Main API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

## User

| Method | Endpoint |
|---------|----------|
| GET | /api/users/me |
| PATCH | /api/users/me |

---

## Categories

| Method | Endpoint |
|---------|----------|
| GET | /api/categories |
| POST | /api/categories |
| PATCH | /api/categories/:id |
| DELETE | /api/categories/:id |

---

## Properties

### Public

| Method | Endpoint |
|---------|----------|
| GET | /api/properties |
| GET | /api/properties/:id |

### Landlord

| Method | Endpoint |
|---------|----------|
| POST | /api/landlord/properties |
| PUT | /api/landlord/properties/:id |
| DELETE | /api/landlord/properties/:id |

---

## Rental Requests

### Tenant

| Method | Endpoint |
|---------|----------|
| POST | /api/rentals |
| GET | /api/rentals |
| GET | /api/rentals/:id |

### Landlord

| Method | Endpoint |
|---------|----------|
| GET | /api/landlord/requests |
| PATCH | /api/landlord/requests/:id |

---

## Admin

| Method | Endpoint |
|---------|----------|
| GET | /api/admin/users |
| PATCH | /api/admin/users/:id |
| GET | /api/admin/properties |
| GET | /api/admin/rentals |

---

# 📊 Database

Main Models

- User
- Category
- Property
- RentalRequest
- Payment
- Review

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Role-based Authorization
- Ownership Validation
- Centralized Error Handling
- Input Validation

---

# 🌍 Deployment

Backend is deployed on **Vercel**.

---

# 👨‍💻 Author

**Yasin Al Hasan**

GitHub: https://github.com/yasin-hasan2

Email: yasin.steadfast@gmail.com

---

# 📜 License

This project is created for educational purposes.
