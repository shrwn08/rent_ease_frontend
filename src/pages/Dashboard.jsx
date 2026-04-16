import React, { useEffect, useState } from "react";
import { FiEye, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  createRequest,
  getMyOrders,
  getMyRequests,
  getProducts,
} from "../services/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { EmptyState, Spinner } from "../components/common";


const TABS = ['Active Rentals', 'History', 'Maintenance']

function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [maintForm, setMaintForm] = useState({
    productId: "",
    issueType: "repair",
    description: "",
    priority: "medium",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordersRes, maintRes, prodsRes] = await Promise.all([
          getMyOrders(),
          getMyRequests(),
          getProducts({ limit: 100 }),
        ]);
        setOrders(ordersRes.data.orders || []);
        setMaintenance(maintRes.data.requests || []);
        setProducts(prodsRes.data.products || []);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const active = orders.filter((o) =>
    ["pending", "confirmed", "delivered", "active"].includes(o.status),
  );
  const history = orders.filter((o) =>
    ["returned", "cancelled"].includes(o.status),
  );

  const handleMaintSubmit = async (e) => {
    e.preventDefault();
    if (!maintForm.productId || !maintForm.description) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createRequest(maintForm);
      setMaintenance((prev) => [res.data.request, ...prev]);
      toast.success("Request submitted!");
      setShowForm(false);
      setMaintForm({
        productId: "",
        issueType: "repair",
        description: "",
        priority: "medium",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    {
      label: "Active",
      value: active.length,
      icon: "📦",
      bg: "bg-blue-50   border-blue-100",
      val: "text-blue-700",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "🛒",
      bg: "bg-amber-50  border-amber-100",
      val: "text-amber-700",
    },
    {
      label: "Completed",
      value: history.filter((o) => o.status === "returned").length,
      icon: "✅",
      bg: "bg-emerald-50 border-emerald-100",
      val: "text-emerald-700",
    },
    {
      label: "Open Issues",
      value: maintenance.filter((m) => m.status === "open").length,
      icon: "🔧",
      bg: "bg-violet-50 border-violet-100",
      val: "text-violet-700",
    },
  ];

  return (
    <div className="page-container py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">
          Account
        </p>
        <h1 className="section-title mb-1">My Dashboard</h1>
        <p className="text-ink-500 text-sm">
          Welcome back,{" "}
          <span className="font-semibold text-ink-700">{user?.name}</span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white border ${s.bg.split(" ")[1]} rounded-3xl p-5`}
            style={{ boxShadow: "0 2px 12px -4px rgba(26,21,16,0.08)" }}
          >
            <div
              className={`w-10 h-10 ${s.bg} border rounded-2xl flex items-center justify-center text-lg mb-3`}
            >
              {s.icon}
            </div>
            <p className={`text-2xl font-display font-bold ${s.val}`}>
              {s.value}
            </p>
            <p className="text-xs text-ink-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-ink-100 rounded-2xl p-1 mb-8 w-full sm:w-fit">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === i
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {tab === 0 && (
            <OrderList
              orders={active}
              emptyMsg="No active rentals"
              emptyDesc="Start browsing products to rent!"
            />
          )}
          {tab === 1 && (
            <OrderList
              orders={history}
              emptyMsg="No rental history"
              emptyDesc="Your completed rentals will appear here"
            />
          )}
          {tab === 2 && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <p className="text-ink-500 text-sm">
                  {maintenance.length} total requests
                </p>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="btn-primary flex items-center gap-2 rounded-2xl"
                >
                  <FiPlus size={15} /> New Request
                </button>
              </div>

              {showForm && (
                <div className="card p-7 mb-6">
                  <h3 className="font-display font-bold text-xl text-ink-900 mb-5">
                    Raise a Maintenance Request
                  </h3>
                  <form
                    onSubmit={handleMaintSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {[
                      {
                        label: "Product *",
                        name: "productId",
                        type: "select",
                        options: products.map((p) => ({
                          value: p._id,
                          label: p.name,
                        })),
                        placeholder: "Select product…",
                      },
                      {
                        label: "Issue Type *",
                        name: "issueType",
                        type: "select",
                        options: [
                          "repair",
                          "replacement",
                          "cleaning",
                          "installation",
                          "other",
                        ].map((v) => ({
                          value: v,
                          label: v.charAt(0).toUpperCase() + v.slice(1),
                        })),
                      },
                      {
                        label: "Priority",
                        name: "priority",
                        type: "select",
                        options: ["low", "medium", "high"].map((v) => ({
                          value: v,
                          label: v.charAt(0).toUpperCase() + v.slice(1),
                        })),
                      },
                    ].map(({ label, name, type, options, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                          {label}
                        </label>
                        <select
                          value={maintForm[name]}
                          onChange={(e) =>
                            setMaintForm({
                              ...maintForm,
                              [name]: e.target.value,
                            })
                          }
                          className="input-field"
                          required={label.includes("*")}
                        >
                          {placeholder && (
                            <option value="">{placeholder}</option>
                          )}
                          {options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={maintForm.description}
                        rows={3}
                        onChange={(e) =>
                          setMaintForm({
                            ...maintForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the issue clearly…"
                        className="input-field resize-none"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gold rounded-2xl"
                      >
                        {submitting ? "Submitting…" : "Submit Request"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {maintenance.length === 0 ? (
                <EmptyState
                  icon="🔧"
                  title="No maintenance requests"
                  description="Raise a request if any rented item needs service"
                />
              ) : (
                <div className="space-y-3">
                  {maintenance.map((req) => (
                    <div
                      key={req._id}
                      className="card p-5 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 bg-violet-100 border border-violet-200 rounded-2xl flex items-center justify-center shrink-0">
                        <FiTool className="text-violet-600" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-ink-900 text-sm">
                            {req.productName || "Product"}
                          </p>
                          <StatusBadge status={req.status} />
                          <span
                            className={`badge text-[10px] font-bold uppercase tracking-wide ${
                              req.priority === "high"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : req.priority === "medium"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-ink-100 text-ink-600"
                            }`}
                          >
                            {req.priority}
                          </span>
                        </div>
                        <p className="text-xs text-ink-400 capitalize">
                          {req.issueType} ·{" "}
                          {new Date(req.createdAt).toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-sm text-ink-600 mt-1 line-clamp-2">
                          {req.description}
                        </p>
                        {req.adminNotes && (
                          <p className="text-xs text-blue-700 mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                            💬 Admin: {req.adminNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderList({ orders, emptyMsg, emptyDesc }) {
  if (!orders.length)
    return (
      <EmptyState
        icon="📦"
        title={emptyMsg}
        description={emptyDesc}
        action={
          <Link to="/products" className="btn-primary inline-flex">
            Browse Products
          </Link>
        }
      />
    );

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="card p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] text-ink-400 font-medium mb-0.5">
                Order ID
              </p>
              <p className="font-mono text-sm font-bold text-ink-700">
                #{order._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="flex gap-2.5 flex-wrap mb-4">
            {order.items?.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-2 bg-ink-50 border border-ink-100 rounded-2xl px-3 py-2"
              >
                {item.product?.imageUrl && (
                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-ink-100 shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-ink-800 truncate max-w-[120px]">
                    {item.productName}
                  </p>
                  <p className="text-[11px] text-ink-400">
                    {item.tenure} months
                  </p>
                </div>
              </div>
            ))}
            {order.items?.length > 3 && (
              <div className="flex items-center text-xs text-ink-400 px-3 bg-ink-50 rounded-2xl border border-ink-100">
                +{order.items.length - 3} more
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-ink-50">
            <div className="flex gap-5 text-sm">
              <div>
                <p className="text-[11px] text-ink-400">Total</p>
                <p className="font-display font-bold text-ink-900">
                  ₹{order.grandTotal?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-ink-400">Delivery</p>
                <p className="font-medium text-ink-700 text-xs">
                  {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Link
              to={`/orders/${order._id}`}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-600 transition"
            >
              <FiEye size={13} /> View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
