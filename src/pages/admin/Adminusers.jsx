import { useEffect, useState } from "react";
import * as api from "../../services/api";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Spinner } from "../../components/common";
import { FiToggleLeft, FiToggleRight, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
 
function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
 
  useEffect(() => {
    api.getAllUsers()
      .then((res) => setUsers(res.data.users || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);
 
  const handleToggle = async (userId, name, isCurrentlyActive) => {
    try {
      const res = await api.toggleUser(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: res.data.user.isActive } : u
        )
      );
      toast.success(
        `${name} ${res.data.user.isActive ? "activated" : "deactivated"}`
      );
    } catch {
      toast.error("Failed to update user");
    }
  };
 
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <div className="page-container py-12">
      <div className="flex gap-8">
        <AdminSidebar />
 
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-1">
                People
              </p>
              <h1 className="section-title">Users</h1>
              <p className="text-ink-500 text-sm mt-1">
                {users.length} registered users
              </p>
            </div>
 
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email…"
                className="input-field pl-10"
              />
            </div>
          </div>
 
          {loading ? (
            <Spinner />
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 border-b border-ink-100">
                    <tr>
                      {["User", "Phone", "Role", "Joined", "Status", "Action"].map((h) => (
                        <th key={h}
                          className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-14 text-ink-400 text-sm">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user) => (
                        <tr key={user._id} className="border-b border-ink-50 hover:bg-ink-50/50 transition">
 
                          {/* User avatar + name + email */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-brand-100 border border-brand-200 rounded-2xl flex items-center justify-center shrink-0">
                                <span className="text-brand-700 font-bold text-sm">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-ink-900">{user.name}</p>
                                <p className="text-[11px] text-ink-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
 
                          {/* Phone */}
                          <td className="px-5 py-4 text-ink-600">
                            {user.phone || "—"}
                          </td>
 
                          {/* Role badge */}
                          <td className="px-5 py-4">
                            <span className={`badge text-[11px] font-bold capitalize ${
                              user.role === "admin"
                                ? "bg-violet-100 text-violet-700 border border-violet-200"
                                : "bg-ink-100 text-ink-600"
                            }`}>
                              {user.role}
                            </span>
                          </td>
 
                          {/* Joined date */}
                          <td className="px-5 py-4 text-ink-500 text-xs">
                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </td>
 
                          {/* Active status */}
                          <td className="px-5 py-4">
                            <span className={`badge text-[11px] font-bold ${
                              user.isActive !== false
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}>
                              {user.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
 
                          {/* Toggle button — hidden for admins */}
                          <td className="px-5 py-4">
                            {user.role !== "admin" ? (
                              <button
                                onClick={() => handleToggle(user._id, user.name, user.isActive)}
                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                                  user.isActive !== false
                                    ? "border-red-200 text-red-600 hover:bg-red-50 bg-white"
                                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white"
                                }`}>
                                {user.isActive !== false
                                  ? <><FiToggleRight size={14} /> Deactivate</>
                                  : <><FiToggleLeft  size={14} /> Activate</>
                                }
                              </button>
                            ) : (
                              <span className="text-xs text-ink-300 px-3 py-2">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
export default AdminUsers;