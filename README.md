# 🧠 Thought Nest API (Backend)

Thought Nest is a simple backend API that allows users to save, manage, and organize their ideas and thoughts. It is built for authentication-based CRUD operations where each user can securely manage their own thoughts.

This backend powers the Thought Nest frontend application.

---

## ✨ Features

- 🔐 User authentication (register, login, logout)
- 🛡️ JWT-based protected routes
- 📝 Create, read, update, delete thoughts
- 👤 User-specific data isolation
- ⚡ RESTful API design
- 🔄 Secure middleware-based access control

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Jose
- Bcrypt (password hashing)
- CORS

---

## 🔐 Authentication Flow

- Users register with email and password
- Passwords are hashed before storage
- Login returns a JWT token
- Token is required for protected routes
- Middleware validates token and attaches user to request

---

## 📌 API Endpoints

### Auth Routes

- `POST /api/auth/register` – Create a new user
- `POST /api/auth/login` – Authenticate user and return token
- `GET /api/auth/logout` – Logout current user

---

### Thought Routes

- `GET /api/thoughts` – Get all thoughts
- `GET /api/thoughts/:id` – Get single thought
- `POST /api/thoughts` – Create a new thought (protected)
- `PUT /api/thoughts/:id` – Update a thought (protected, owner only)
- `DELETE /api/thoughts/:id` – Delete a thought (protected, owner only)

---

## 🧠 Data Model (Example)

### User

- email
- password (hashed)
- createdAt

### Thought

- title
- summary
- description
- tags
- user (reference to User)
- createdAt

---

## 🔒 Authorization Rules

- Users can only access their own thoughts
- All create/update/delete actions require authentication
- Ownership is verified using user ID matching

---

## 🚀 Getting Started

### 1. Install dependencies

npm install
