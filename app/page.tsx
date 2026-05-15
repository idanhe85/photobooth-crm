'use client'
import { useState } from 'react'
import { useLeads } from '@/lib/useLeads'
import { Users, Calendar, TrendingUp, Bell, Plus, MessageCircle } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import LeadModal from '@/components/LeadModal'
import AddLeadModal from '@/components/AddLeadModal'
import { Lead } from '@/lib/types'

export default function Dashboard() {
  const { leads, addLead, updateLead, deleteLead } = useLeads()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const booked      = leads.filter(l => l.status === 'booked')
  const newLeads    = leads.filter(l => l.status === 'new')
  const pipeline    = leads.filter(l => ['new','contacted','quoted'].includes(l.status))
  const pipelineVal = pipeline.reduce((sum, l) => sum + (l.price || 0), 0)
  const followUps   = leads.filter(l => {
    const days = Math.floor((new Date(today).getTime() - new Date(l.lastContact).getTime()) / 86400000)
    return days >= 3 && l.status !== 'booked' && l.status !== 'lost'
  })
  const upcoming = booked
    .filter(l => l.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 4)
  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  const stats = [
    { label: 'Total Leads',    value: leads.length,      icon: Users,      color: 'text-blue-400' },
    { label: 'Booked Events',  value: booked.length,     icon: Calendar,   color: 'text-green-400' },
    { label: 'Pipeline Value', value: `€${pipelineVal}`, icon: TrendingUp, color: 'text-gold' },
    { label: 'Follow-ups Due', value: followUps.length,  icon: Bell,       color: 'text-orange-400' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-gold text-white font-bold px-4 py-2.5 rounded-xl hover:bg-gold-light transition-all text-sm">
          <Plus size={16} /> New Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:border-gold/20 transition-all">
            <Icon size={20} className={`${color} mb-3`} />
            <div className="text-2xl font-black text-gray-900">{value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-bold">Recent Leads</h2>
            <a href="/leads" className="text-gold text-xs hover:underline">View all</a>
          </div>
          <div className="space-y-2">
            {recentLeads.map(lead => (
              <div key={lead.id} onClick={() => setSelectedLead(lead)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gold/20">
                <div>
                  <div className="text-gray-900 text-sm font-semibold">{lead.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{lead.eventType} · {lead.eventDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={lead.status} />
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()} className="text-[#25D366] hover:opacity-80">
                    <MessageCircle size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-bold">Upcoming Events</h2>
            <a href="/calendar" className="text-gold text-xs hover:underline">Calendar</a>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No upcoming events</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map(lead => {
                const days = Math.ceil((new Date(lead.eventDate).getTime() - new Date(today).getTime()) / 86400000)
                return (
                  <div key={lead.id} onClick={() => setSelectedLead(lead)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gold/20">
                    <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(204,153,51,0.15)', border: '1px solid rgba(204,153,51,0.3)' }}>
                      <div className="text-gold text-sm font-bold">{new Date(lead.eventDate).toLocaleDateString('nl-NL', { day: 'numeric' })}</div>
                      <div className="text-gold/60 text-xs">{new Date(lead.eventDate).toLocaleDateString('nl-NL', { month: 'short' })}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 text-sm font-semibold truncate">{lead.name}</div>
                      <div className="text-gray-500 text-xs">{lead.eventType} · {lead.venue}</div>
                    </div>
                    <div className="text-gray-400 text-xs flex-shrink-0">in {days}d</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* New leads alert */}
        {newLeads.length > 0 && (
          <div className="lg:col-span-2 bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h2 className="text-gray-900 font-bold mb-3">🆕 New leads to contact ({newLeads.length})</h2>
            <div className="flex flex-wrap gap-2">
              {newLeads.map(lead => (
                <button key={lead.id} onClick={() => setSelectedLead(lead)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm text-gray-700 transition-all">
                  {lead.name} <span className="text-gray-400 text-xs">{lead.eventType}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)}
          onUpdate={(id, updates) => { updateLead(id, updates); setSelectedLead(null) }}
          onDelete={deleteLead} />
      )}
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onAdd={addLead} />}
    </div>
  )
}
