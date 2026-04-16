import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute() {
const { user } = useSelector((s) => s.auth);
if (!user) return <Navigate to="/login" replace />;

if (user.role !== "admin") return <Navigate to="/" replace />;

return <Outlet />;
}

export default AdminRoute