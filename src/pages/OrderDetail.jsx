import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOrder } from "../services/api";
import { Spinner, StatusBadge } from "../components/common";
import { FiArrowLeft, FiCalendar, FiMapPin, FiPackage } from "react-icons/fi";

function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.includes("admin");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getOrder(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Spinner />;
  if (!order) return null;

  return (
    <div className="page-container py-12 max-w-3xl">
      {isAdminRoute ? (
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-ink-500 hover:text-ink-900 mb-8 text-sm font-medium transition group"
        >
          <div className="w-8 h-8 border border-ink-200 rounded-full flex items-center justify-center group-hover:border-ink-500 transition">
            <FiArrowLeft size={14} />
          </div>
          Back to Dashboard
        </button>
      ) :(<button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-ink-500 hover:text-ink-900 mb-8 text-sm font-medium transition group"
        >
          <div className="w-8 h-8 border border-ink-200 rounded-full flex items-center justify-center group-hover:border-ink-500 transition">
            <FiArrowLeft size={14} />
          </div>
          Back to Home
        </button>)}

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-1">
            Order Details
          </p>
          <h1 className="font-display font-bold text-3xl text-ink-900">
            #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-ink-500 text-sm mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="card p-6 mb-5">
        <h2 className="font-display font-bold text-lg text-ink-900 mb-5 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-100 border border-brand-200 rounded-xl flex items-center justify-center">
            <FiPackage size={14} className="text-brand-700" />
          </div>
          Rented Items
        </h2>
        <div className="divide-y divide-ink-50">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              {item.product?.imageUrl && (
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-ink-50 shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900">{item.productName}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {item.tenure} months · Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-lg text-ink-900">
                  ₹
                  {(
                    item.monthlyRent * item.tenure +
                    item.deposit
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-ink-400">
                  ₹{item.monthlyRent.toLocaleString()}/mo
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="card p-5">
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2 text-sm">
            <FiMapPin size={14} className="text-brand-600" /> Delivery Address
          </h3>
          <p className="text-sm text-ink-600 leading-relaxed">
            {order.deliveryAddress.street},<br />
            {order.deliveryAddress.city}, {order.deliveryAddress.state}
            <br />
            {order.deliveryAddress.pincode}
          </p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2 text-sm">
            <FiCalendar size={14} className="text-brand-600" /> Schedule
          </h3>
          <div className="space-y-2 text-sm text-ink-600">
            <div className="flex justify-between">
              <span className="text-ink-400">Delivery date</span>
              <span className="font-medium">
                {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-400">Order placed</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-lg text-ink-900 mb-5">
          Payment Summary
        </h2>
        <div className="space-y-3 text-sm">
          {[
            ["Monthly Rent", `₹${order.totalRent?.toLocaleString()}`],
            [
              "Security Deposit (refundable)",
              `₹${order.totalDeposit?.toLocaleString()}`,
            ],
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
            <span className="font-bold text-ink-800 text-base">
              Grand Total
            </span>
            <span className="font-display font-bold text-2xl text-ink-900">
              ₹{order.grandTotal?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="card p-5 mt-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            Special Instructions
          </p>
          <p className="text-sm text-ink-700">{order.notes}</p>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
