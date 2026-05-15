'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, Bell, Menu, X } from 'lucide-react'

const nav = [
  { label: 'Dashboard',   href: '/',            icon: LayoutDashboard },
  { label: 'Leads',       href: '/leads',       icon: Users },
  { label: 'Calendar',    href: '/calendar',    icon: Calendar },
  { label: 'Follow-ups',  href: '/follow-ups',  icon: Bell },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="text-gold font-black text-lg tracking-wide">THE PHOTO<span className="text-gray-800">DUDE</span></div>
        <div className="text-gray-400 text-xs mt-0.5 tracking-widest">CRM SYSTEM</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gold text-white'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="text-gray-400 text-xs">v1.0 · PhotoDUDE NL</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 shadow-sm fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-gold font-black text-sm tracking-wide">THE PHOTO<span className="text-gray-800">DUDE</span> <span className="text-gray-400 font-normal">CRM</span></div>
        <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-gray-800">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-200 shadow-sm">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
