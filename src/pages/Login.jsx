import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, loginUser } from "../store/slices/authSlice";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import toast from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await dispatch(loginUser(form)).unwrap();

      toast.success(`Welcome back ${user.name}`);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {}
  };

  return (
  <div className="min-h-screen flex flex-col lg:flex-row">
    {/* Left panel */}
    <div className="hidden lg:flex lg:w-1/2 bg-ink-950 items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl" />

      <div className="relative text-center px-8 xl:px-12">
        <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
          <span className="text-ink-950 font-bold font-display text-2xl">
            R
          </span>
        </div>

        <h2 className="font-display text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
          Rent Smarter.
          <br />
          Live Better.
        </h2>

        <p className="text-ink-400 max-w-xs mx-auto text-sm xl:text-base">
          Premium furniture & appliances delivered to your door, monthly.
        </p>

        <div className="mt-8 space-y-3">
          {[
            "Free delivery & installation",
            "24/7 maintenance support",
            "Easy cancellation anytime",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3 text-ink-400 text-sm">
              <div className="w-5 h-5 bg-brand-500/20 border border-brand-600/40 rounded-full flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
              </div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right panel */}
    <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12 bg-ink-50">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <span className="text-ink-950 font-bold font-display text-sm">
              R
            </span>
          </div>
          <span className="font-display font-bold text-lg text-ink-900">
            RentEase
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-900 mb-1">
          Welcome back
        </h1>
        <p className="text-ink-500 text-sm mb-6 sm:mb-8">
          Sign in to your account to continue
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-field pl-11"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-field pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400"
              >
                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3.5 text-sm font-bold rounded-2xl mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand-700 font-bold hover:text-brand-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  </div>
);
}

export default Login;
