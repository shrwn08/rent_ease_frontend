import { useEffect, useState } from "react";


import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { fetchProducts } from "../../store/slices/productSlice";
import { Spinner } from "../../components/common";
 
const EMPTY_FORM = {
  name: "",
  category: "Furniture",
  description: "",
  brand: "",
  monthlyRent: "",
  deposit: "",
  stock: "",
  tenureOptions: [3, 6, 12],
  imageUrl: "",
  rating: 4.0,
  isAvailable: true,
};
 
function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);
 
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);   // product being edited
  const [form, setForm]             = useState(EMPTY_FORM);
  const [search, setSearch]         = useState("");
  const [submitting, setSubmitting] = useState(false);
 
  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);
 
  // Modal helpers
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };
 
  const openEdit = (product) => {
    setEditing(product);
    setForm({ ...product });
    setShowModal(true);
  };
 
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };
 
  //  Form change 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
 
  const toggleTenure = (months) => {
    setForm((f) => ({
      ...f,
      tenureOptions: f.tenureOptions.includes(months)
        ? f.tenureOptions.filter((t) => t !== months)
        : [...f.tenureOptions, months].sort((a, b) => a - b),
    }));
  };
 
  //  Submit (create or edit) 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.monthlyRent || !form.deposit || !form.stock) {
      toast.error("Please fill all required fields");
      return;
    }
 
    const payload = {
      ...form,
      monthlyRent: Number(form.monthlyRent),
      deposit:     Number(form.deposit),
      stock:       Number(form.stock),
      rating:      Number(form.rating),
    };
 
    setSubmitting(true);
    try {
      if (editing) {
        await dispatch(editProduct({ id: editing._id, data: payload })).unwrap();
        toast.success("Product updated!");
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success("Product created!");
      }
      closeModal();
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
 
  //  Delete 
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await dispatch(removeProduct(id)).unwrap();
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err || "Failed to delete");
    }
  };
 
  // Filtered list 
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase())
  );
 
  //  Reusable label + input
  const Field = ({ label, name, type = "text", placeholder, required, min, max, step, span, children }) => (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
        {label}{required && " *"}
      </label>
      {children ?? (
        <input
          type={type} name={name} value={form[name]}
          onChange={handleChange} required={required}
          placeholder={placeholder} min={min} max={max} step={step}
          className="input-field"
        />
      )}
    </div>
  );
 
  return (
    <div className="page-container py-12">
      <div className="flex gap-8">
        <AdminSidebar />
 
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-1">
                Inventory
              </p>
              <h1 className="section-title">Products</h1>
              <p className="text-ink-500 text-sm mt-1">{products.length} products in catalogue</p>
            </div>
            <button onClick={openCreate} className="btn-primary flex items-center gap-2 rounded-2xl">
              <FiPlus size={15} /> Add Product
            </button>
          </div>
 
          {/* Search */}
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category or brand…"
            className="input-field mb-6 max-w-sm"
          />
 
          {/* ----- Modal ----- */}
          {showModal && (
            <div className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl w-full max-w-2xl my-4"
                style={{ boxShadow: "0 24px 64px -12px rgba(0,0,0,0.35)" }}>
 
                {/* Modal header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-ink-100">
                  <h2 className="font-display font-bold text-xl text-ink-900">
                    {editing ? "Edit Product" : "New Product"}
                  </h2>
                  <button onClick={closeModal}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-ink-100 text-ink-400 transition">
                    <FiX size={17} />
                  </button>
                </div>
 
                {/* Modal form */}
                <form onSubmit={handleSubmit} className="p-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Product Name" name="name" placeholder="e.g. Premium Sofa Set" required span />
 
                  <Field label="Category" name="category" required>
                    <select name="category" value={form.category} onChange={handleChange} className="input-field">
                      <option value="Furniture">Furniture</option>
                      <option value="Appliances">Appliances</option>
                    </select>
                  </Field>
 
                  <Field label="Brand" name="brand" placeholder="e.g. Godrej" />
                  <Field label="Monthly Rent (₹)" name="monthlyRent" type="number" min="0" required placeholder="999" />
                  <Field label="Security Deposit (₹)" name="deposit" type="number" min="0" required placeholder="2000" />
                  <Field label="Stock" name="stock" type="number" min="0" required placeholder="10" />
                  <Field label="Rating (0–5)" name="rating" type="number" min="0" max="5" step="0.1" placeholder="4.5" />
                  <Field label="Image URL" name="imageUrl" placeholder="https://…" span />
 
                  <Field label="Description" name="description" required span>
                    <textarea
                      name="description" value={form.description}
                      onChange={handleChange} rows={3} required
                      placeholder="Describe the product…"
                      className="input-field resize-none"
                    />
                  </Field>
 
                  {/* Tenure options */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">
                      Tenure Options
                    </label>
                    <div className="flex gap-3">
                      {[3, 6, 12].map((t) => (
                        <button key={t} type="button" onClick={() => toggleTenure(t)}
                          className={`px-5 py-2.5 rounded-2xl text-sm font-bold border-2 transition ${
                            form.tenureOptions.includes(t)
                              ? "border-ink-900 bg-ink-900 text-brand-400"
                              : "border-ink-200 text-ink-500 hover:border-ink-400"
                          }`}>
                          {t} mo
                        </button>
                      ))}
                    </div>
                  </div>
 
                  {/* Available toggle */}
                  <div className="sm:col-span-2 flex items-center gap-2.5">
                    <input
                      type="checkbox" id="isAvailable" name="isAvailable"
                      checked={form.isAvailable} onChange={handleChange}
                      className="w-4 h-4 accent-brand-600"
                    />
                    <label htmlFor="isAvailable" className="text-sm font-medium text-ink-700">
                      Available for rent
                    </label>
                  </div>
 
                  {/* Buttons */}
                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="submit" disabled={submitting}
                      className="btn-gold rounded-2xl flex items-center gap-2">
                      <FiCheck size={15} />
                      {submitting ? "Saving…" : editing ? "Update Product" : "Create Product"}
                    </button>
                    <button type="button" onClick={closeModal} className="btn-ghost">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
 
          {/* ---- Products Table ---- */}
          {loading ? (
            <Spinner />
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 border-b border-ink-100">
                    <tr>
                      <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink-500">Product</th>
                      <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-ink-500 hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-ink-500">Rent/mo</th>
                      <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-ink-500 hidden md:table-cell">Stock</th>
                      <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-ink-500 hidden md:table-cell">Status</th>
                      <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-14 text-ink-400 text-sm">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((p) => (
                        <tr key={p._id} className="hover:bg-ink-50/50 transition">
                          {/* Name + image */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-ink-100 shrink-0">
                                <img src={p.imageUrl} alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = "none"; }} />
                              </div>
                              <div>
                                <p className="font-semibold text-ink-900 truncate max-w-[160px]">{p.name}</p>
                                {p.brand && <p className="text-[11px] text-ink-400">{p.brand}</p>}
                              </div>
                            </div>
                          </td>
 
                          {/* Category */}
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className={`badge text-[11px] font-bold ${
                              p.category === "Furniture"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}>
                              {p.category}
                            </span>
                          </td>
 
                          {/* Rent */}
                          <td className="px-4 py-4 font-bold text-ink-900">
                            ₹{p.monthlyRent.toLocaleString()}
                          </td>
 
                          {/* Stock */}
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className={`font-bold text-sm ${
                              p.stock === 0 ? "text-red-500" :
                              p.stock < 3  ? "text-amber-600" : "text-emerald-600"
                            }`}>
                              {p.stock}
                            </span>
                          </td>
 
                          {/* Status */}
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className={`badge text-[11px] ${
                              p.isAvailable
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-ink-100 text-ink-500"
                            }`}>
                              {p.isAvailable ? "Active" : "Inactive"}
                            </span>
                          </td>
 
                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEdit(p)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl text-ink-400 hover:text-brand-700 hover:bg-brand-50 transition">
                                <FiEdit2 size={14} />
                              </button>
                              <button onClick={() => handleDelete(p._id, p.name)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl text-ink-400 hover:text-red-600 hover:bg-red-50 transition">
                                <FiTrash2 size={14} />
                              </button>
                            </div>
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
 
export default AdminProducts;