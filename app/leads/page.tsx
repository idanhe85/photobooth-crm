'use client'
import { useState } from 'react'
import { useLeads } from '@/lib/useLeads'
import { Plus, MessageCircle, Phone } from 'lucide-react'
import { Lead, LeadStatus } from '@/lib/types'
import LeadModal from '@/components/LeadModal'
import AddLeadModal from '@/components/AddLeadModal'

const columns: { id: LeadStatus; label: string; emoji: string }[] = [
  { id: 'new',       label: 'New',       emoji: '🆕' },
  { id: 'contacted', label: 'Contacted', emoji: '📞' },
  { id: 'quoted',    label: 'Quoted',    emoji: '💬' },
  { id: 'booked',    label: 'Booked',    emoji: '✅' },
]

export default function LeadsPage() {
  const { leads, addLead, updateLead, updateStatus, deleteLead } = useLeads()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.eventType.toLowerCase().includes(search.toLowerCase()) ||
    l.venue.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Leads Pipeline</h1>
          <p className="text-gray-500 text-sm mt-0.5">{leads.length} leads total</p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 text-sm outline-none focus:border-gold/50 placeholder-gray-400 w-48"
          />
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-gold text-white font-bold px-4 py-2.5 rounded-xl hover:bg-gold-light transition-all text-sm">
            <Plus size={16} /> New Lead
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map(col => {
          const colLeads = filtered.filter(l => l.status === col.id)
          return (
            <div key={col.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span>{col.emoji}</span>
                  <span className="text-gray-800 font-bold text-sm">{col.label}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{colLeads.length}</span>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {colLeads.map(lead => (
                  <div key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="text-gray-900 font-semibold text-sm mb-1">{lead.name}</div>
                    <div className="text-gray-500 text-xs mb-3">{lead.eventType} · {lead.eventDate}</div>
                    {lead.venue && <div className="text-gray-400 text-xs mb-3">📍 {lead.venue}</div>}
                    {lead.price && (
                      <div className="text-gold text-xs font-bold mb-3">€{lead.price} · {lead.package}</div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {columns.filter(c => c.id !== lead.status).map(c => (
                          <button key={c.id}
                            onClick={e => { e.stopPropagation(); updateStatus(lead.id, c.id) }}
                            className="text-gray-300 hover:text-gold text-xs px-1.5 py-0.5 rounded hover:bg-gold/10 transition-all"
                            title={`Move to ${c.label}`}>
                            → {c.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                          className="text-gray-400 hover:text-gray-700 transition-colors">
                          <Phone size={14} />
                        </a>
                        <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank"
                          rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="text-[#25D366]/60 hover:text-[#25D366] transition-colors">
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl">
                    <span className="text-gray-300 text-xs">No leads</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
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
