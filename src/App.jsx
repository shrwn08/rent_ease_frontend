import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";

function App() {
  const { user } = useSelector((s) => s.auth);

  return (
    <Routes>
      <Route element={<Layout /> }>
        <Route path="/" element={<Home />} />
         <Route path="/register" element={user ? <Navigate to="/" replace />: <Register /> } />
          <Route path="/login" element={user ? <Navigate to="/" replace />: <Login /> } />
      </Route>
     
    </Routes>
  );
}

export default App;
