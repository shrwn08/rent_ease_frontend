import React from 'react'
import { FiGrid, FiPackage, FiShoppingBag, FiTool, FiUsers } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'



const links = [
  { to: '/admin',             icon: FiGrid,        label: 'Dashboard',  end: true },
  { to: '/admin/products',    icon: FiPackage,     label: 'Products'          },
  { to: '/admin/orders',      icon: FiShoppingBag, label: 'Orders'            },
  { to: '/admin/maintenance', icon: FiTool,        label: 'Maintenance'       },
  { to: '/admin/users',       icon: FiUsers,       label: 'Users'             },
]

function AdminSidebar() {
 return (
    <aside className="hidden lg:flex flex-col w-52 shrink-0">
      <div className="bg-ink-950 rounded-3xl p-3 sticky top-20">
        <p className="text-[10px] font-bold text-ink-600 uppercase tracking-[0.2em] px-3 mb-3 mt-1">Management</p>
        <nav className="space-y-0.5">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500 text-ink-950 font-bold shadow-sm'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`
              }>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default AdminSidebar