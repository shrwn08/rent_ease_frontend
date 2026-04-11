import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice";
import { Spinner } from "../components/common";
import { FiChevronDown, FiSearch } from "react-icons/fi";

const CATEGORIES = ["All", "Furniture", "Appliances"];
const SORTS = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Price: Low → High", value: "monthlyRent" },
  { label: "Price: High → Low", value: "-monthlyRent" },
  { label: "Top Rated", value: "-rating" },
];

function Products() {
  const { products, loading, total, totalPages, currentPage } = useSelector(
    (s) => s.products,
  );
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    const params = { page, limit: 12, sort };
    if (category !== "All") params.category = category;
    if (search.trim()) params.search = search.trim();
    dispatch(fetchProducts(params));
  }, [dispatch, page, category, sort, search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearchParams(cat !== "All" ? { category: cat } : {});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div className="page-container py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">
          Catalogue
        </p>
        <h1 className="section-title mb-1">Browse Products</h1>
        <p className="text-ink-500 text-sm">
          {total} products available for rent
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <FiSearch
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search furniture, appliances..."
              className="input-field pl-11 bg-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-5 rounded-2xl shadow-sm"
          >
            Search
          </button>
        </form>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="input-field w-full sm:w-52 appearance-none pr-10 bg-white shadow-sm cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
              category === cat
                ? "bg-ink-900 text-brand-400 border-ink-900 shadow-sm"
                : "bg-white border-ink-200 text-ink-600 hover:border-ink-400 hover:text-ink-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="font-display font-bold text-2xl text-ink-800 mb-2">
            No products found
          </h3>
          <p className="text-ink-500 text-sm">
            Try a different search term or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-5 py-2.5 rounded-full border border-ink-200 text-sm font-medium text-ink-600 hover:bg-ink-50 disabled:opacity-40 transition"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className={`w-10 h-10 rounded-full text-sm font-bold transition ${
                pg === currentPage
                  ? "bg-ink-900 text-brand-400 shadow-sm"
                  : "border border-ink-200 text-ink-600 hover:bg-ink-50"
              }`}
            >
              {pg}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-5 py-2.5 rounded-full border border-ink-200 text-sm font-medium text-ink-600 hover:bg-ink-50 disabled:opacity-40 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
