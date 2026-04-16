import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAllOrders, updateOrderStatus } from "../../services/api";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";
import { Spinner, StatusBadge } from "../../components/common";

const STATUSES = [
  "all",
  "pending",
  "confirmed",
  "delivered",
  "active",
  "returned",
  "cancelled",
];

function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = async (status) => {
    setLoading(true)
    try {
      const params = status !== 'all' ? { status } : {}
      const res = await getAllOrders({ ...params, limit: 50 })
      setOrders(res.data.orders || [])
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

   useEffect(() => { load(filter) }, [filter]);

   const handleStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o))
      toast.success('Status updated')
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setUpdating(null) }
  }

  return (
    <div className="page-container py-12">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-1">
            Management
          </p>
          <h1 className="section-title mb-1">Orders</h1>
          <p className="text-ink-500 text-sm mb-7">
            {orders.length} orders shown
          </p>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold capitalize border transition-all ${
                  filter === s
                    ? "bg-ink-900 text-brand-400 border-ink-900 shadow-sm"
                    : "bg-white border-ink-200 text-ink-600 hover:border-ink-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <Spinner />
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-ink-400">
              No orders found
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="card overflow-hidden">
                  <div
                    className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-ink-50/50 transition"
                    onClick={() =>
                      setExpanded(expanded === order._id ? null : order._id)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <p className="font-mono text-sm font-bold text-ink-700">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-ink-600">
                        {order.user?.name || "Unknown"} · {order.user?.email}
                      </p>
                      <p className="text-xs text-ink-400 mt-0.5">
                        {order.items?.length} item(s) · ₹
                        {order.grandTotal?.toLocaleString()} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div
                      className="shrink-0 flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={(e) =>
                          handleStatus(order._id, e.target.value)
                        }
                        className="text-xs border border-ink-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/50 disabled:opacity-50 cursor-pointer"
                      >
                        {[
                          "pending",
                          "confirmed",
                          "delivered",
                          "active",
                          "returned",
                          "cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown
                        size={15}
                        className={`text-ink-400 transition-transform ${expanded === order._id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {expanded === order._id && (
                    <div className="border-t border-ink-100 bg-ink-50 px-6 py-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                            Delivery Address
                          </p>
                          <p className="text-sm text-ink-700 leading-relaxed">
                            {order.deliveryAddress?.street},{" "}
                            {order.deliveryAddress?.city},{" "}
                            {order.deliveryAddress?.state} –{" "}
                            {order.deliveryAddress?.pincode}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                            Schedule
                          </p>
                          <p className="text-sm text-ink-700">
                            Delivery:{" "}
                            {new Date(order.deliveryDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <p className="text-sm text-ink-700">
                            Ordered:{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3">
                        Items
                      </p>
                      <div className="space-y-2">
                        {order.items?.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-ink-100"
                          >
                            {item.product?.imageUrl && (
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-ink-50 shrink-0">
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
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-ink-800">
                                {item.productName}
                              </p>
                              <p className="text-xs text-ink-400">
                                {item.tenure}mo · ₹
                                {item.monthlyRent?.toLocaleString()}/mo
                              </p>
                            </div>
                            <p className="font-display font-bold text-ink-900">
                              ₹
                              {(
                                item.monthlyRent * item.tenure +
                                item.deposit
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <div className="bg-white border border-ink-100 rounded-2xl px-5 py-2.5 text-sm">
                          <span className="text-ink-500">Grand Total: </span>
                          <span className="font-display font-bold text-ink-900">
                            ₹{order.grandTotal?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
