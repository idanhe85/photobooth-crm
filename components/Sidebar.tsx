'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, Bell, Menu, X } from 'lucide-react'

const nav = [
  { label: 'Dashboard',  href: '/',           icon: LayoutDashboard },
  { label: 'Leads',      href: '/leads',      icon: Users },
  { label: 'Calendar',   href: '/calendar',   icon: Calendar },
  { label: 'Follow-ups', href: '/follow-ups', icon: Bell },
]

function NavItems({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-gold font-black text-lg tracking-wide">
          THE PHOTO<span className="text-gray-200">DUDE</span>
        </div>
        <div className="text-white/30 text-xs mt-0.5 tracking-widest">CRM SYSTEM</div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gold text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <div className="text-white/25 text-xs">v1.0 · PhotoDUDE NL</div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-[#1F1F3D] shadow-xl fixed h-full z-40">
        <NavItems pathname={pathname} onClose={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E6E9EF] px-4 py-3 flex items-center justify-between">
        <div className="text-gold font-black text-sm tracking-wide">
          THE PHOTO<span className="text-gray-800">DUDE</span>{' '}
          <span className="text-gray-400 font-normal">CRM</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-64 bg-[#1F1F3D] shadow-2xl transition-transform duration-300 ease-in-out ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          <NavItems pathname={pathname} onClose={() => setOpen(false)} />
        </aside>
      </div>
    </>
  )
}
