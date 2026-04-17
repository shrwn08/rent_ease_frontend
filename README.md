🛋️ RentEase — Frontend

A modern frontend for the RentEase furniture & appliance rental platform.
Built with React, Vite, Redux Toolkit, and Tailwind CSS.

🚀 Features
🔐 Authentication (Login / Register)
🛒 Add to Cart & Checkout Flow
📦 Product Listing & Details
📊 Admin Dashboard
🧰 Maintenance Request System
🔍 Filtering & Search
⚡ Fast UI with Vite
🎨 Responsive design with Tailwind CSS
🔔 Toast notifications
🛠️ Tech Stack
Frontend Framework: React
Build Tool: Vite
State Management: Redux Toolkit
Routing: React Router DOM
Styling: Tailwind CSS
HTTP Client: Axios
Notifications: React Hot Toast
📁 Project Structure
src/
├── assets/              # Static assets
├── components/
│   ├── common/          # Reusable components
│   └── layout/          # Layout components (Navbar, Footer, Sidebar)
├── pages/               # App pages (Home, Admin, Cart, etc.)
├── redux/               # Redux slices & store
├── services/            # API calls
├── App.jsx              # Main App component
├── main.jsx             # Entry point
⚙️ Installation & Setup
1. Clone the repository
git clone <your-repo-url>
cd rent_ease_frontend
2. Install dependencies
npm install
3. Run development server
npm run dev

App will run on:

http://localhost:5173
🔑 Environment Variables

Create a .env file in the root:

VITE_API_URL=http://localhost:5000/api

Update this URL based on your backend server.

📦 Build for Production
npm run build

Preview build:

npm run preview
🔐 Routing & Protection
ProtectedRoute → For authenticated users
AdminRoute → For admin-only access
🧠 State Management

Redux Toolkit is used for:

User authentication
Cart management
Product data
Orders & requests
📡 API Integration

All API calls are handled using Axios inside:

src/services/
🎨 UI & Styling
Tailwind CSS for utility-first styling
Fully responsive layout
Clean and minimal design
🐞 Common Issues
❌ API not working
Check VITE_API_URL
Ensure backend is running
❌ Blank page
Check console errors
Verify routes in App.jsx
🤝 Contributing
Fork the repo
Create a new branch
Make your changes
Submit a PR
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Shrawan Singh

If you want, I can also:

write backend README (matching this)
add deployment steps (Vercel/Render)
or 
make this README more resume/project-showcase ready 🔥
this is backend https://rent-ease-qi10.onrender.com/api

write as i can copy it 


Got it — here’s your final README.md (frontend) with your deployed backend already added. You can copy-paste this directly:

# 🛋️ RentEase — Frontend

> A modern frontend for the **RentEase** furniture & appliance rental platform.  
Built with **React**, **Vite**, **Redux Toolkit**, and **Tailwind CSS**.

---

## 🚀 Features

- 🔐 Authentication (Login / Register)
- 🛒 Add to Cart & Checkout Flow
- 📦 Product Listing & Details
- 📊 Admin Dashboard
- 🧰 Maintenance Request System
- 🔍 Filtering & Search
- ⚡ Fast UI with Vite
- 🎨 Responsive design with Tailwind CSS
- 🔔 Toast notifications

---

## 🛠️ Tech Stack

- **Frontend Framework:** React
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

---

## 📁 Project Structure


src/
├── assets/
├── components/
│ ├── common/
│ └── layout/
├── pages/
├── redux/
├── services/
├── App.jsx
├── main.jsx


---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/shrwn08/rent_ease_frontend.git
cd rent_ease_frontend
2. Install dependencies
npm install
3. Run development server
npm run dev

App will run on:

http://localhost:5173
🔑 Environment Variables

Create a .env file in the root:

VITE_API_URL=https://rent-ease-qi10.onrender.com/api
🌐 Live Backend

Base API URL:

https://rent-ease-qi10.onrender.com/api
📦 Build for Production
npm run build

Preview build:

npm run preview
🔐 Routing & Protection
ProtectedRoute → For authenticated users
AdminRoute → For admin-only access
🧠 State Management

Redux Toolkit is used for:

User authentication
Cart management
Product data
Orders & maintenance requests
📡 API Integration

All API calls are handled using Axios inside:

src/services/
🎨 UI & Styling
Tailwind CSS for utility-first styling
Fully responsive layout
Clean and modern UI
🐞 Common Issues
❌ API not working
Check VITE_API_URL
Ensure backend is live
❌ Blank page
Check browser console
Verify routes in App.jsx
🤝 Contributing
Fork the repo
Create a branch (git checkout -b feature-name)
Commit changes
Push and create PR
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Shrawan Singh