import { Routes, Route, Navigate } from "react-router-dom";

//pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import OrderDetail from "./pages/OrderDetail";
import Cart from "./pages/Cart";

function App() {
  const { user } = useSelector((s) => s.auth);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        //auth
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
      </Route>


      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
