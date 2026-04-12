import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { Spinner } from "../components/common";
import { createOrder } from "../services/api";

const minDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useSelector((s) => s.cart);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    deliveryDate: minDate,
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];
  const totalRent = items.reduce(
    (s, i) => s + (i.product?.monthlyRent || 0),
    0,
  );
  const totalDeposit = items.reduce((s, i) => s + (i.product?.deposit || 0), 0);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.street || !form.city || !form.state || !form.pincode)
      return toast.error('Please fill in all address fields')
    setSubmitting(true)
    try {
      const res = await createOrder({
        deliveryDate:    form.deliveryDate,
        deliveryAddress: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        notes:           form.notes,
      })
      toast.success('Order placed successfully! 🎉')
      navigate(`/orders/${res.data.order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally { setSubmitting(false) }
  }

    if (cartLoading && !cart) return <Spinner />
  if (items.length === 0) { navigate('/cart'); return null }

  const InputGroup = ({
    label,
    name,
    placeholder,
    type = "text",
    required = true,
    maxLength,
    span,
  }) => (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="input-field"
      />
    </div>
  );

  return (
    <div className="page-container py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">
          Final Step
        </p>
        <h1 className="section-title">Checkout</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* ── Left: Address & Date ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Address card */}
          <div className="card p-7">
            <h2 className="font-display font-bold text-xl text-ink-900 mb-6 flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-100 border border-brand-200 rounded-2xl flex items-center justify-center">
                <FiMapPin size={16} className="text-brand-700" />
              </div>
              Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup
                label="Street Address"
                name="street"
                placeholder="House no., Street, Locality"
                span
              />
              <InputGroup label="City" name="city" placeholder="City" />
              <InputGroup label="State" name="state" placeholder="State" />
              <InputGroup
                label="Pincode"
                name="pincode"
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>
          </div>

          {/* Date card */}
          <div className="card p-7">
            <h2 className="font-display font-bold text-xl text-ink-900 mb-6 flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-100 border border-brand-200 rounded-2xl flex items-center justify-center">
                <FiCalendar size={16} className="text-brand-700" />
              </div>
              Preferred Delivery Date
            </h2>
            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              min={minDate}
              onChange={handleChange}
              required
              className="input-field max-w-xs"
            />
            <p className="text-xs text-ink-400 mt-2">
              Delivery available from 2 days onwards
            </p>
          </div>

          {/* Notes */}
          <div className="card p-7">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">
              Special Instructions{" "}
              <span className="text-ink-300 normal-case font-normal">
                (optional)
              </span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special notes for delivery or setup…"
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* ── Right: Summary ── */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="font-display font-bold text-xl text-ink-900 mb-5">
              Summary
            </h2>

            {/* Item thumbnails */}
            <div className="space-y-3 mb-5">
              {items.map(
                (item) =>
                  item.product && (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-ink-50 shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink-800 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-ink-400">
                          {item.tenure} mo · ₹
                          {item.product.monthlyRent.toLocaleString()}/mo
                        </p>
                      </div>
                    </div>
                  ),
              )}
            </div>

            <div className="border-t border-ink-100 pt-4 space-y-2.5 text-sm mb-5">
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
              <div className="border-t border-ink-100 pt-2.5 flex justify-between items-center">
                <span className="font-bold text-ink-800">Total</span>
                <span className="font-display font-bold text-2xl text-ink-900">
                  ₹{(totalRent + totalDeposit).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 shadow-glow"
            >
              <FiCheck size={16} strokeWidth={2.5} />
              {submitting ? "Placing Order…" : "Confirm Order"}
            </button>
            <p className="text-[11px] text-ink-400 text-center mt-3">
              Cash on delivery · No hidden charges
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
