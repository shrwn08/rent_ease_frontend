# 🛋️ RentEase — Full Stack Rental Platform

> A complete furniture & appliance rental platform built with the **MERN Stack (MongoDB, Express, React, Node.js)**.  
Users can rent products, manage orders, and raise maintenance requests, while admins control the platform.

---

## 🌐 Live Demo

- 🔗 Frontend: https://rentease-shrawan.netlify.app/
- 🔗 Backend API: https://rent-ease-qi10.onrender.com/api

---

## 🚀 Features

### 👤 User Features
- 🔐 Authentication (Login / Register)
- 🛒 Add to Cart & Checkout
- 📦 Browse Products & View Details
- 📅 Rent Items with Flexible Tenure
- 📦 Track Orders
- 🧰 Raise Maintenance Requests

### 🛠️ Admin Features
- 📊 Admin Dashboard
- 📦 Manage Products (CRUD)
- 👥 Manage Users
- 📦 Manage Orders
- 🧰 Handle Maintenance Requests

---

## 🏗️ Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

## 📁 Project Structure


rent-ease/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ └── index.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── services/
│ │ └── App.jsx
│ └── package.json


---

## ⚙️ Backend Setup

```bash
cd backend
npm install

Create .env file:

PORT=8080
NODE_ENV=development
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

Run backend:

npm run dev
⚙️ Frontend Setup
cd frontend
npm install

Create .env:

VITE_API_URL=https://rent-ease-qi10.onrender.com/api

Run frontend:

npm run dev
📡 API Overview
Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/auth/profile
Products
GET /api/products
GET /api/products/:id
POST /api/products (admin)
PUT /api/products/:id (admin)
DELETE /api/products/:id (admin)
Cart
GET /api/cart
POST /api/cart
PUT /api/cart/:productId
DELETE /api/cart/:productId
DELETE /api/cart/clear
Orders
POST /api/orders
GET /api/orders
GET /api/orders/:id
GET /api/orders/admin/all
PUT /api/orders/:id/status
Maintenance
POST /api/maintenance
GET /api/maintenance
GET /api/maintenance/admin/all
PUT /api/maintenance/:id
🔐 Authentication

Use JWT token:

Authorization: Bearer <token>
📊 Order Flow
pending → confirmed → delivered → active → returned / cancelled
🐞 Common Issues
Render Cold Start
Backend may take ~30–60 seconds on first request
API Not Working
Check VITE_API_URL
Ensure backend is live

🚀 Deployment
Frontend: Netlify
Backend: Render

🤝 Contributing
Fork the repo
Create a branch (git checkout -b feature-name)
Commit changes
Push and create PR


👨‍💻 Author

Shrawan Singh