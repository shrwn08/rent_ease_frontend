export function Spinner({ size = "md" }) {
  const s = {
    sm: "w-5 h-5 border-2",
    md: "w-9 h-9 border-3",
    lg: "w-14 h-14 border-4",
  }[size];
  return (
    <div className="flex flex-col justify-center items-center py-16 gap-3">
      <div
        className={`${s} border-ink-200 border-t-brand-500 rounded-full animate-spin`}
      />
      <p className="text-xs text-ink-400 font-medium">Loading...</p>
    </div>
  );
}



export function StatusBadge({ status }) {
  const map = {
    pending:       'bg-amber-100 text-amber-800 border border-amber-200',
    confirmed:     'bg-blue-100 text-blue-800 border border-blue-200',
    delivered:     'bg-indigo-100 text-indigo-800 border border-indigo-200',
    active:        'bg-emerald-100 text-emerald-800 border border-emerald-200',
    returned:      'bg-ink-100 text-ink-700 border border-ink-200',
    cancelled:     'bg-red-100 text-red-800 border border-red-200',
    open:          'bg-amber-100 text-amber-800 border border-amber-200',
    'in-progress': 'bg-blue-100 text-blue-800 border border-blue-200',
    resolved:      'bg-emerald-100 text-emerald-800 border border-emerald-200',
    closed:        'bg-ink-100 text-ink-700 border border-ink-200',
  }
  return (
    <span className={`badge capitalize text-[11px] font-semibold tracking-wide ${map[status] || 'bg-ink-100 text-ink-600'}`}>
      {status?.replace('-', ' ')}
    </span>
  )
}


export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      {icon && <div className="text-6xl mb-5 opacity-70">{icon}</div>}
      <h3 className="font-display font-bold text-2xl text-ink-800 mb-2">{title}</h3>
      {description && <p className="text-ink-500 text-sm mb-7 max-w-xs leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}

export function SectionHeader({ eyebrow, title, subtitle, center = false }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3">{eyebrow}</p>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="text-ink-500 mt-2 text-base">{subtitle}</p>}
    </div>
  )
}