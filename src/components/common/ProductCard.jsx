import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

function ProductCard({ product }) {
    const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth);

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please sign in to add items'); return }
    try {
      await dispatch(addItem({ productId: product._id, tenure: 3 })).unwrap()
      toast.success(`Added to cart!`)
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    }
  }

    const isAvailable = product.stock > 0

  return (
    <Link to={`/products/${product._id}`}
      className="group block bg-white rounded-3xl border border-ink-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 2px 16px -4px rgba(26,21,16,0.08)' }}>

      {/* Image */}
      <div className="relative h-52 bg-ink-50 overflow-hidden img-zoom">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' }}
        />
        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-ink-600 shadow-sm">
            {product.category}
          </span>
        </div>
        {/* Out of stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-ink-950/60 flex items-center justify-center">
            <span className="bg-white text-ink-800 text-xs font-bold px-4 py-2 rounded-full tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
        {/* Add button - appears on hover */}
        {isAvailable && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-9 h-9 bg-brand-500 hover:bg-brand-400 text-ink-950 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <FiPlus size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.brand && (
          <p className="text-[11px] font-bold text-ink-400 uppercase tracking-widest mb-1">{product.brand}</p>
        )}
        <h3 className="font-semibold text-ink-900 text-sm leading-snug line-clamp-2 mb-3 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-brand-500' : 'text-ink-200'}`}
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-ink-400 ml-0.5">{product.rating?.toFixed(1)}</span>
          <span className="text-ink-200 mx-1 text-[10px]">·</span>
          <span className={`text-[11px] font-medium ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
            {isAvailable ? `${product.stock} left` : 'Unavailable'}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between pt-3 border-t border-ink-50">
          <div>
            <p className="text-[11px] text-ink-400 mb-0.5">Monthly rent</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-ink-900 font-display">₹{product.monthlyRent.toLocaleString()}</span>
              <span className="text-xs text-ink-400">/mo</span>
            </div>
            <p className="text-[11px] text-ink-400 mt-0.5">+ ₹{product.deposit.toLocaleString()} deposit</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="text-xs font-bold px-4 py-2 rounded-full transition-all duration-200
              bg-ink-900 text-brand-400 hover:bg-ink-800 disabled:bg-ink-100 disabled:text-ink-400
              shadow-sm active:scale-95"
          >
            {isAvailable ? 'Add' : 'N/A'}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard