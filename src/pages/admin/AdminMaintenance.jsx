import React, { useEffect, useState } from "react";
import { getAllRequests, updateRequest } from "../../services/api";
import toast from "react-hot-toast";
import { FiChevronDown, FiTool } from "react-icons/fi";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Spinner, StatusBadge } from "../../components/common";



const STATUSES = ['all','open','in-progress','resolved','closed']

function AdminMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [notes, setNotes] = useState({});

  const load = async (status) => {
    setLoading(true);
    try {
      const params = status !== "all" ? { status } : {};
      const res = await getAllRequests(params);
      setRequests(res.data.requests || []);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const handleUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await updateRequest(id, { status, adminNotes: notes[id] || undefined });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status, adminNotes: notes[id] } : r,
        ),
      );
      toast.success("Updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setUpdating(null);
    }
  };

  const priorityStyle = {
    high: "bg-red-100 text-red-700 border border-red-200",
    medium: "bg-amber-100 text-amber-700 border border-amber-200",
    low: "bg-ink-100 text-ink-600",
  };
  return (
    <div className="page-container py-12">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-1">
            Support
          </p>
          <h1 className="section-title mb-1">Maintenance</h1>
          <p className="text-ink-500 text-sm mb-7">
            {requests.length} requests shown
          </p>

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
                {s === "in-progress" ? "In Progress" : s}
              </button>
            ))}
          </div>

          {loading ? (
            <Spinner />
          ) : requests.length === 0 ? (
            <div className="text-center py-20">
              <FiTool size={40} className="text-ink-200 mx-auto mb-3" />
              <p className="text-ink-400">No maintenance requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req._id} className="card overflow-hidden">
                  <div
                    className="flex items-start gap-4 px-6 py-5 cursor-pointer hover:bg-ink-50/50 transition"
                    onClick={() =>
                      setExpanded(expanded === req._id ? null : req._id)
                    }
                  >
                    <div className="w-10 h-10 bg-violet-100 border border-violet-200 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
                      <FiTool className="text-violet-600" size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-ink-900 text-sm">
                          {req.productName || "Product"}
                        </p>
                        <StatusBadge status={req.status} />
                        <span
                          className={`badge text-[10px] font-bold uppercase tracking-wide ${priorityStyle[req.priority]}`}
                        >
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-sm text-ink-600">
                        {req.user?.name} · {req.user?.email}
                      </p>
                      <p className="text-xs text-ink-400 mt-0.5 capitalize">
                        {req.issueType} ·{" "}
                        {new Date(req.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div
                      className="shrink-0 flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={req.status}
                        disabled={updating === req._id}
                        onChange={(e) => handleUpdate(req._id, e.target.value)}
                        className="text-xs border border-ink-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/50 disabled:opacity-50 cursor-pointer"
                      >
                        {["open", "in-progress", "resolved", "closed"].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s === "in-progress"
                                ? "In Progress"
                                : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ),
                        )}
                      </select>
                      <FiChevronDown
                        size={15}
                        className={`text-ink-400 transition-transform ${expanded === req._id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {expanded === req._id && (
                    <div className="border-t border-ink-100 bg-ink-50 px-6 py-5 space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                          Description
                        </p>
                        <p className="text-sm text-ink-700 bg-white border border-ink-100 rounded-2xl px-4 py-3">
                          {req.description}
                        </p>
                      </div>
                      {req.adminNotes && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                            Admin Notes
                          </p>
                          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                            {req.adminNotes}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                          Add / Update Notes
                        </p>
                        <textarea
                          value={notes[req._id] || req.adminNotes || ""}
                          onChange={(e) =>
                            setNotes({ ...notes, [req._id]: e.target.value })
                          }
                          rows={2}
                          placeholder="Internal notes…"
                          className="input-field resize-none text-sm"
                        />
                        <button
                          onClick={() => handleUpdate(req._id, req.status)}
                          disabled={updating === req._id}
                          className="btn-primary rounded-2xl text-sm mt-3"
                        >
                          {updating === req._id ? "Saving…" : "Save Notes"}
                        </button>
                      </div>
                      {req.resolvedAt && (
                        <p className="text-xs text-emerald-600 font-medium">
                          ✅ Resolved on{" "}
                          {new Date(req.resolvedAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                      )}
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

export default AdminMaintenance;
