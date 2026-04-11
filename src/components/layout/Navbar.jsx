import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { clearCartState } from "../../store/slices/cartSlice";
import { FiChevronDown, FiMenu, FiShoppingBag, FiUser, FiX } from "react-icons/fi";

function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cart?.items?.length || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    toast.success("See you soon!");
    navigate("/");
    setMenuOpen(false);
    setDropOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ink-950/95 backdrop-blur-lg shadow-2xl" : "bg-ink-950"
      }`}
    >
      <div className="page-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-ink-950 text-sm font-bold font-display">
              R
            </span>
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            RentEase
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/products", label: "All Products" },
            { to: "/products?category=Furniture", label: "Furniture" },
            { to: "/products?category=Appliances", label: "Appliances" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "text-brand-400 bg-white/5"
                    : "text-ink-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl hover:bg-white/10 transition text-ink-300 hover:text-white"
              >
                <FiShoppingBag size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-ink-950 text-[10px] w-4.5 h-4.5 w-5 h-5 rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-ink-200 max-w-[90px] truncate">
                    {user.name}
                  </span>
                  <FiChevronDown
                    size={13}
                    className={`text-ink-400 transition-transform ${dropOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-ink-900 rounded-2xl shadow-2xl border border-ink-800 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-ink-800 mb-1">
                      <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-white truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-300 hover:text-white hover:bg-white/5 transition"
                    >
                      <FiUser size={14} /> My Rentals
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <FiSettings size={14} /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-ink-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                      >
                        <FiLogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-ghost text-ink-300 hover:text-white hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-gold text-sm px-5 py-2.5">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-ink-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}

        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-ink-950 border-t border-ink-800 px-4 py-5 flex flex-col gap-1">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/products", label: "All Products" },
            { to: "/products?category=Furniture", label: "Furniture" },
            { to: "/products?category=Appliances", label: "Appliances" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "text-brand-400 bg-white/5"
                    : "text-ink-300 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-ink-800 mt-2 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 text-sm text-ink-300 hover:text-white"
                >
                  🛍 Cart ({cartCount})
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 text-sm text-ink-300 hover:text-white"
                >
                  My Rentals
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 text-sm text-ink-300 hover:text-white"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2.5 text-sm text-red-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-ghost w-full justify-start text-ink-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gold w-full justify-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
