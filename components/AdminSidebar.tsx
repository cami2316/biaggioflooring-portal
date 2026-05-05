'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Estimates', href: '/admin/dashboard', icon: '📋' },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾' },
  { label: 'Calendar', href: '/admin/calendar', icon: '📅' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#212121] text-white flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-white/10">
        <span className="text-[#46C038] font-bold text-lg tracking-tight">Biaggio Admin</span>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map(({ label, href, icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#46C038] text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <form action="/api/session/logout" method="POST">
          <button
            type="submit"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
