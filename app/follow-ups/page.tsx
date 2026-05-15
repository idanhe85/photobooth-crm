'use client'
import { useState } from 'react'
import { useLeads } from '@/lib/useLeads'
import { MessageCircle, Phone, CheckCircle } from 'lucide-react'
import { Lead } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import LeadModal from '@/components/LeadModal'

export default function FollowUpsPage() {
  const { leads, updateLead, deleteLead } = useLeads()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const followUps = leads
    .filter(l => l.status !== 'booked' && l.status !== 'lost')
    .map(l => ({
      ...l,
      daysSince: Math.floor((new Date(today).getTime() - new Date(l.lastContact).getTime()) / 86400000),
    }))
    .sort((a, b) => b.daysSince - a.daysSince)

  const urgent   = followUps.filter(l => l.daysSince >= 5)
  const moderate = followUps.filter(l => l.daysSince >= 3 && l.daysSince < 5)
  const ok       = followUps.filter(l => l.daysSince < 3)

  const markContacted = (id: string) => {
    updateLead(id, { lastContact: today })
  }

  const LeadRow = ({ lead, urgency }: { lead: typeof followUps[0]; urgency: 'urgent' | 'moderate' | 'ok' }) => (
    <div
      onClick={() => setSelectedLead(lead)}
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
        urgency === 'urgent'   ? 'bg-red-50 border-red-200 hover:border-red-300' :
        urgency === 'moderate' ? 'bg-orange-50 border-orange-200 hover:border-orange-300' :
                                 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`text-center w-12 flex-shrink-0 ${
          urgency === 'urgent' ? 'text-red-400' : urgency === 'moderate' ? 'text-orange-400' : 'text-gray-400'
        }`}>
          <div className="text-lg font-black">{lead.daysSince}d</div>
          <div className="text-xs opacity-70">ago</div>
        </div>
        <div className="min-w-0">
          <div className="text-gray-900 font-semibold text-sm truncate">{lead.name}</div>
          <div className="text-gray-500 text-xs">{lead.eventType} · {lead.eventDate} · {lead.venue}</div>
          {lead.notes && <div className="text-gray-400 text-xs mt-0.5 truncate">📝 {lead.notes}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        <StatusBadge status={lead.status} />
        <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
          className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
          <Phone size={15} />
        </a>
        <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank"
          rel="noopener noreferrer" onClick={e => e.stopPropagation()}
          className="p-2 text-[#25D366]/60 hover:text-[#25D366] transition-colors">
          <MessageCircle size={15} />
        </a>
        <button
          onClick={e => { e.stopPropagation(); markContacted(lead.id) }}
          className="p-2 text-gray-300 hover:text-green-400 transition-colors" title="Mark as contacted today">
          <CheckCircle size={15} />
        </button>
      </div>
    </div>
  )

  const Section = ({ title, items, urgency, color }: {
    title: string; items: typeof followUps; urgency: 'urgent'|'moderate'|'ok'; color: string
  }) => items.length === 0 ? null : (
    <div className="mb-8">
      <h2 className={`text-sm font-bold mb-3 ${color}`}>{title} ({items.length})</h2>
      <div className="space-y-2">
        {items.map(l => <LeadRow key={l.id} lead={l} urgency={urgency} />)}
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Follow-ups</h1>
        <p className="text-gray-500 text-sm mt-0.5">{followUps.length} active leads · sorted by urgency</p>
      </div>

      {followUps.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-gray-900 font-bold">All caught up!</div>
          <div className="text-gray-500 text-sm mt-1">No active leads to follow up on.</div>
        </div>
      ) : (
        <>
          <Section title="🔴 Urgent — 5+ days no contact" items={urgent} urgency="urgent" color="text-red-400" />
          <Section title="🟠 Moderate — 3-4 days no contact" items={moderate} urgency="moderate" color="text-orange-400" />
          <Section title="🟢 On track — contacted recently" items={ok} urgency="ok" color="text-green-400" />
        </>
      )}

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)}
          onUpdate={(id, updates) => { updateLead(id, updates); setSelectedLead(null) }}
          onDelete={deleteLead} />
      )}
    </div>
  )
}
