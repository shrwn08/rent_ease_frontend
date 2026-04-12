import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, removeItem, updateItem } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { EmptyState, Spinner } from "../components/common";
import { FiShoppingBag } from "react-icons/fi";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = async (productId, name) => {
    try {
      await dispatch(removeItem(productId)).unwrap();
      toast.success(`${name} removed`);
    } catch (err) {
      toast.error(err || "Failed to remove");
    }
  };

  const handleTenure = async (productId, tenure) => {
    try { await dispatch(updateItem({ productId, data: { tenure: Number(tenure) } })).unwrap() }
    catch (err) { toast.error(err || 'Update failed') }
  }

  if (loading && !cart) return <Spinner />

  const items = cart?.items || []
  const totalRent    = items.reduce((s, i) => s + (i.product?.monthlyRent || 0) * i.quantity, 0)
  const totalDeposit = items.reduce((s, i) => s + (i.product?.deposit || 0) * i.quantity, 0)


  return (
    <div className="page-container py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">
          Your Selection
        </p>
        <h1 className="section-title">Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="🛍️"
          title="Your cart is empty"
          description="Browse our collection and add items you'd like to rent"
          action={
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiShoppingBag size={16} /> Browse Products
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const p = item.product;
              if (!p) return null;
              return (
                <div
                  key={p._id}
                  className="card p-5 flex gap-4 hover:shadow-luxury transition-shadow"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-ink-50 img-zoom shrink-0">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-0.5">
                          {p.category}
                        </p>
                        <h3 className="font-semibold text-ink-900 text-sm leading-snug">
                          {p.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleRemove(p._id, p.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-ink-300 hover:text-red-500 hover:bg-red-50 transition shrink-0"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                      <div>
                        <p className="text-[11px] text-ink-400 mb-1.5">
                          Rental duration
                        </p>
                        <div className="flex gap-1.5">
                          {[3, 6, 12].map((t) => (
                            <button
                              key={t}
                              onClick={() => handleTenure(p._id, t)}
                              className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                                item.tenure === t
                                  ? "bg-ink-900 text-brand-400 border-ink-900"
                                  : "border-ink-200 text-ink-500 hover:border-ink-400"
                              }`}
                            >
                              {t}mo
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-xl text-ink-900">
                          ₹
                          {(
                            p.monthlyRent * item.tenure +
                            p.deposit
                          ).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-ink-400">
                          ₹{p.monthlyRent.toLocaleString()}/mo · {item.tenure}mo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-20">
              <h2 className="font-display font-bold text-xl text-ink-900 mb-5">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm mb-5">
                {[
                  ["Monthly Rent", `₹${totalRent.toLocaleString()}`],
                  ["Security Deposit", `₹${totalDeposit.toLocaleString()}`],
                  ["Delivery", "Free"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-ink-500">{k}</span>
                    <span
                      className={`font-medium ${v === "Free" ? "text-emerald-600" : "text-ink-800"}`}
                    >
                      {v}
                    </span>
                  </div>
                ))}
                <div className="border-t border-ink-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-ink-800">Total Due</span>
                  <span className="font-display font-bold text-2xl text-ink-900">
                    ₹{(totalRent + totalDeposit).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-ink-400 bg-ink-50 rounded-xl px-3 py-2 mb-5">
                💡 Deposit is fully refundable when you return items
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="btn-gold w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5"
              >
                Proceed to Checkout <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
