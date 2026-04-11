import { useEffect } from "react";
import { FiArrowRight, FiCheck, FiHeadphones, FiRefreshCw, FiShield, FiTruck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import { Link } from "react-router-dom";
import { SectionHeader, Spinner } from "../components/common";


const features = [
  { icon: <FiTruck size={20} />, title: 'Free Delivery', desc: 'Delivered & installed at your door' },
  { icon: <FiRefreshCw size={20} />, title: 'Easy Returns', desc: 'Return any time, no questions' },
  { icon: <FiShield size={20} />, title: 'Damage Cover', desc: 'Accidental damage protection' },
  { icon: <FiHeadphones size={20} />, title: '24/7 Support', desc: 'Service whenever you need it' },
];


const stats = [
  { value: '50,000+', label: 'Happy Renters' },
  { value: '200+',    label: 'Products' },
  { value: '4.8★',    label: 'Average Rating' },
  { value: '48hr',    label: 'Delivery' },
]

function Home () {

    const dispatch = useDispatch();

    const { products, loading } = useSelector((s) => s.products);

    useEffect(() => { dispatch(fetchProducts({ limit: 8 })) }, [dispatch])



    return (
    <div>
      {/* ----- HERO ----- */}
      <section className="relative bg-ink-950 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Gold gradient orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-800/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="page-container relative py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-700/50 bg-brand-500/10 text-brand-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              Monthly Rentals · Zero Ownership Stress
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
              Your Home,<br />
              <span className="text-shimmer">Beautifully Furnished</span>
            </h1>

            <p className="text-ink-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Rent premium furniture and appliances monthly. No large deposits, free installation, and effortless returns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-gold text-base px-8 py-4 rounded-full shadow-glow">
                Browse Collection <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-outline border-ink-600 text-ink-300 hover:text-white hover:border-ink-400 text-base px-8 py-4">
                Create Free Account
              </Link>
            </div>

            {/* ----- Trust chips ----- */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              {['No credit check', 'Free cancellation', 'Insured products'].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-ink-500">
                  <FiCheck size={12} className="text-brand-600" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ----- Stats bar ----- */}
        <div className="border-t border-ink-800">
          <div className="page-container py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-2xl text-brand-400">{s.value}</p>
                <p className="text-xs text-ink-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----- CATEGORIES ----- */}
      <section className="page-container py-20">
        <SectionHeader eyebrow="Shop by Category" title="What are you looking for?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              name: 'Furniture', emoji: '🛋️',
              desc: 'Sofas, beds, dining sets, wardrobes & more',
              gradient: 'from-amber-50 to-orange-50',
              border: 'border-amber-200',
              accent: 'text-amber-700',
            },
            {
              name: 'Appliances', emoji: '❄️',
              desc: 'AC, TV, washing machine, refrigerator & more',
              gradient: 'from-blue-50 to-cyan-50',
              border: 'border-blue-200',
              accent: 'text-blue-700',
            },
          ].map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              className={`group relative bg-linear-to-br ${cat.gradient} border ${cat.border} rounded-3xl p-8 flex items-center gap-6 hover:shadow-xl transition-all duration-300 overflow-hidden`}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.6), transparent 60%)' }} />
              <span className="text-6xl shrink-0 relative">{cat.emoji}</span>
              <div className="relative">
                <h3 className="font-display font-bold text-2xl text-ink-900 mb-1 group-hover:text-brand-800 transition-colors">{cat.name}</h3>
                <p className="text-ink-500 text-sm">{cat.desc}</p>
                <div className={`inline-flex items-center gap-1 text-xs font-bold mt-3 ${cat.accent}`}>
                  Browse all <FiArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ----- FEATURED PRODUCTS ----- */}
      <section className="page-container pb-20">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader eyebrow="Featured" title="Top Picks for Your Home" />
          <Link to="/products" className="btn-outline hidden sm:flex items-center gap-1.5 shrink-0 mb-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
            {products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
        <div className="text-center mt-8 sm:hidden">
          <Link to="/products" className="btn-outline inline-flex items-center gap-2">View All Products <FiArrowRight /></Link>
        </div>
      </section>

      {/* ----- HOW IT WORKS ----- */}
      <section className="bg-ink-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="page-container py-20 relative">
          <SectionHeader eyebrow="Process" title="How RentEase Works" subtitle="Simple steps to a furnished home" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 stagger">
            {[
              { step: '01', icon: '🔍', title: 'Browse & Choose', desc: 'Pick from 200+ premium furniture and appliances across categories.' },
              { step: '02', icon: '📦', title: 'Select Tenure', desc: 'Choose a 3, 6, or 12-month rental plan that fits your needs.' },
              { step: '03', icon: '🚚', title: 'Delivered & Setup', desc: 'Free delivery, installation, and 24/7 maintenance support included.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-ink-900 border border-ink-800 rounded-3xl p-7">
                <p className="font-display text-5xl font-bold text-ink-800 leading-none mb-4">{item.step}</p>
                <p className="text-4xl mb-4">{item.icon}</p>
                <h3 className="font-display font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----- WHY US ----- */}
      <section className="page-container py-20">
        <SectionHeader eyebrow="Benefits" title="Why Choose RentEase?" center />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 stagger">
          {features.map((f) => (
            <div key={f.title} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600">
                {f.icon}
              </div>
              <h4 className="font-bold text-ink-900 mb-2 text-sm">{f.title}</h4>
              <p className="text-ink-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------- CTA ------- */}
      <section className="page-container pb-20">
        <div className="relative bg-ink-950 rounded-3xl overflow-hidden px-8 md:px-16 py-16 text-center">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-4">Start Today</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Ready to Rent?</h2>
            <p className="text-ink-400 mb-8 max-w-md mx-auto">Join thousands of happy customers who chose to rent smart.</p>
            <Link to="/register" className="btn-gold text-base px-10 py-4 rounded-full shadow-glow inline-flex items-center gap-2">
              Get Started Free <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;