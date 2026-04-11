import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-400 mt-20">
      {/* Top strip */}
      <div className="border-t border-brand-600/40 h-px w-full" />

      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-ink-950 font-bold font-display text-base">
                  R
                </span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                RentEase
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-500 max-w-xs">
              Premium furniture & appliances on monthly rental. Zero ownership
              hassle — just quality living.
            </p>
            <div className="flex gap-3 mt-6">
              {["₹0 Setup", "Free Install", "Easy Return"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-ink-700 text-ink-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-600 mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-brand-400 transition"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-brand-400 transition"
                >
                  My Rentals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-600 mb-4">
              Categories
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/products?category=Furniture"
                  className="hover:text-brand-400 transition"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Appliances"
                  className="hover:text-brand-400 transition"
                >
                  Appliances
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-600 mb-4">
              Account
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-brand-400 transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-brand-400 transition"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-900">
        <div className="page-container py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-ink-600">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </p>
          <p className="text-xs text-ink-700">Crafted with care · India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
