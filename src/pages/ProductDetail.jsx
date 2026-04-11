import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../store/slices/productSlice';
import toast from 'react-hot-toast';
import { addItem } from '../store/slices/cartSlice';
import { Spinner } from '../components/common';

function ProductDetail() {

    const { id } = useParams() ;
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { currentProduct: product, loading } = useSelector((s) => s.products);
    const { user } = useSelector((s) => s.auth);
    const [tenure, setTenure] = useState(3);
    const [adding, setAdding] = useState(false);


    useEffect(() => { dispatch(fetchProduct(id)) }, [id, dispatch]);

      const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in first'); navigate('/login'); return }
    setAdding(true)
    try {
      await dispatch(addItem({ productId: product._id, tenure })).unwrap()
      toast.success('Added to cart!')
    } catch (err) { toast.error(err || 'Failed') }
    finally { setAdding(false) }
  }

    if (loading || !product) return <Spinner />

  const total = product.monthlyRent * tenure + product.deposit

  return (
    <div className="page-container py-10">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-ink-500 hover:text-ink-900 mb-8 text-sm font-medium transition group">
        <div className="w-8 h-8 border border-ink-200 rounded-full flex items-center justify-center group-hover:border-ink-400 transition">
          <FiArrowLeft size={14} />
        </div>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-ink-50 rounded-3xl overflow-hidden h-80 lg:h-130 img-zoom border border-ink-100">
          <img src={product.imageUrl} alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' }} />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            {product.brand && <p className="text-xs font-bold uppercase tracking-widest text-ink-400">{product.brand}</p>}
            <span className="badge text-[11px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
              {product.category}
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
            {product.name}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-ink-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-brand-500' : 'text-ink-200'}`}
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-ink-500 ml-1 font-medium">{product.rating?.toFixed(1)}</span>
            </div>
            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
            </span>
          </div>

          <p className="text-ink-600 text-sm leading-relaxed mb-7">{product.description}</p>

          {/* Tenure selector */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-3">Rental Duration</p>
            <div className="flex gap-3">
              {product.tenureOptions?.map((t) => (
                <button key={t} onClick={() => setTenure(t)}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
                    tenure === t
                      ? 'border-ink-900 bg-ink-900 text-brand-400 shadow-sm'
                      : 'border-ink-200 text-ink-600 hover:border-ink-400 bg-white'
                  }`}>
                  {t} mo
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-ink-50 border border-ink-200 rounded-3xl p-5 mb-6 space-y-3">
            {[
              ['Monthly Rent', `₹${product.monthlyRent.toLocaleString()}/mo`],
              ['Security Deposit', `₹${product.deposit.toLocaleString()} (refundable)`],
              ['Duration', `${tenure} months`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-ink-500">{k}</span>
                <span className="font-semibold text-ink-800">{v}</span>
              </div>
            ))}
            <div className="border-t border-ink-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-ink-700">Total for {tenure} months</span>
              <span className="font-display font-bold text-2xl text-ink-900">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-2 mb-7">
            {['Free delivery & installation','Maintenance support included','Easy cancellation','Deposit refunded on return'].map((i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-ink-600">
                <div className="w-5 h-5 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center shrink-0">
                  <FiCheck size={11} className="text-emerald-600" strokeWidth={3} />
                </div>
                {i}
              </div>
            ))}
          </div>

          <button onClick={handleAddToCart} disabled={product.stock === 0 || adding}
            className="btn-gold py-4 rounded-2xl text-base font-bold shadow-glow w-full flex items-center justify-center gap-2.5">
            <FiShoppingBag size={18} />
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail