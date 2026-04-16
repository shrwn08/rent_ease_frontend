import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAllOrders, getAllRequests, getAllUsers, getProducts } from "../../services/api";
import { FiPackage, FiShoppingBag, FiTool, FiUsers } from "react-icons/fi";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [maint, setMaint] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, maintRes, usersRes, prodsRes] = await Promise.all([
          getAllOrders({ limit: 5 }),
         getAllRequests({ status: 'open' }),
          getAllUsers(),
          getProducts({ limit: 1 }),
        ])
        setOrders(ordersRes.data.orders || [])
        setMaint(maintRes.data.requests || [])
        setStats({
          totalOrders:   ordersRes.data.total,
          openMaint:     maintRes.data.count,
          totalUsers:    usersRes.data.count,
          totalProducts: prodsRes.data.total,
        })
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const cards = stats ? [
    { label: 'Total Orders',    value: stats.totalOrders,   icon: FiShoppingBag, bg: 'bg-blue-50   border-blue-200',   text: 'text-blue-600',   link: '/admin/orders'      },
    { label: 'Open Maintenance',value: stats.openMaint,     icon: FiTool,        bg: 'bg-amber-50  border-amber-200',  text: 'text-amber-600',  link: '/admin/maintenance' },
    { label: 'Users',           value: stats.totalUsers,    icon: FiUsers,       bg: 'bg-emerald-50 border-emerald-200',text: 'text-emerald-600',link: '/admin/users'       },
    { label: 'Products',        value: stats.totalProducts, icon: FiPackage,     bg: 'bg-violet-50 border-violet-200', text: 'text-violet-600', link: '/admin/products'    },
  ] : []

  return (
    <div className="page-container py-12">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">
            Admin
          </p>
          <h1 className="section-title mb-1">Dashboard</h1>
          <p className="text-ink-500 text-sm mb-8">Platform overview</p>

          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.label}
                      to={c.link}
                      className={`bg-white border ${c.bg.split(" ")[1]} rounded-3xl p-5 hover:-translate-y-0.5 transition-all duration-200 group`}
                      style={{
                        boxShadow: "0 2px 12px -4px rgba(26,21,16,0.08)",
                      }}
                    >
                      <div
                        className={`w-10 h-10 ${c.bg} border rounded-2xl flex items-center justify-center mb-3`}
                      >
                        <Icon size={17} className={c.text} />
                      </div>
                      <p className="text-2xl font-display font-bold text-ink-900">
                        {c.value ?? "—"}
                      </p>
                      <p className="text-xs text-ink-400 font-medium mt-0.5">
                        {c.label}
                      </p>
                    </Link>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Recent Orders */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-bold text-lg text-ink-900">
                      Recent Orders
                    </h2>
                    <Link
                      to="/admin/orders"
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      All orders <FiArrowRight size={12} />
                    </Link>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-ink-400 text-sm text-center py-8">
                      No orders yet
                    </p>
                  ) : (
                    <div className="divide-y divide-ink-50">
                      {orders.map((o) => (
                        <div
                          key={o._id}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-semibold text-ink-800">
                              {o.user?.name || "Unknown"}
                            </p>
                            <p className="text-[11px] text-ink-400 font-mono">
                              #{o._id.slice(-6).toUpperCase()} · ₹
                              {o.grandTotal?.toLocaleString()}
                            </p>
                          </div>
                          <StatusBadge status={o.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Open Maintenance */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-bold text-lg text-ink-900">
                      Open Requests
                    </h2>
                    <Link
                      to="/admin/maintenance"
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      All requests <FiArrowRight size={12} />
                    </Link>
                  </div>
                  {maint.length === 0 ? (
                    <p className="text-ink-400 text-sm text-center py-8">
                      No open requests 🎉
                    </p>
                  ) : (
                    <div className="divide-y divide-ink-50">
                      {maint.slice(0, 5).map((m) => (
                        <div
                          key={m._id}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-semibold text-ink-800">
                              {m.productName}
                            </p>
                            <p className="text-[11px] text-ink-400">
                              {m.user?.name} · {m.issueType}
                            </p>
                          </div>
                          <span
                            className={`badge text-[10px] font-bold uppercase tracking-wide ${
                              m.priority === "high"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : m.priority === "medium"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-ink-100 text-ink-600"
                            }`}
                          >
                            {m.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
