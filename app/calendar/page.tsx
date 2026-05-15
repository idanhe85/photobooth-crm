'use client'
import { useState } from 'react'
import { useLeads } from '@/lib/useLeads'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Lead } from '@/lib/types'
import LeadModal from '@/components/LeadModal'

export default function CalendarPage() {
  const { leads, updateLead, deleteLead } = useLeads()
  const [current, setCurrent] = useState(new Date())
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year  = current.getFullYear()
  const month = current.getMonth()
  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1 // Monday start

  const bookedLeads = leads.filter(l => l.status === 'booked')

  const leadsOnDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return bookedLeads.filter(l => l.eventDate === dateStr)
  }

  const monthName = current.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
  const today = new Date()
  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  const dayLeads = selectedDay ? leadsOnDay(selectedDay) : []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-900">Event Calendar</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrent(new Date(year, month - 1))}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gold/40 transition-all">
            <ChevronLeft size={18} />
          </button>
          <span className="text-gray-800 font-semibold capitalize min-w-[140px] text-center">{monthName}</span>
          <button onClick={() => setCurrent(new Date(year, month + 1))}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gold/40 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="py-3 text-center text-gray-400 text-xs font-semibold">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 border-b border-r border-gray-100" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayLeadsArr = leadsOnDay(day)
            const hasEvents = dayLeadsArr.length > 0
            const isSelected = selectedDay === day
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`h-20 border-b border-r border-gray-100 p-2 cursor-pointer transition-all relative ${
                  isSelected ? 'bg-gold/10' : hasEvents ? 'hover:bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-xs font-semibold ${
                  isToday(day) ? 'bg-gold text-white rounded-full w-5 h-5 flex items-center justify-center' : hasEvents ? 'text-gray-800' : 'text-gray-400'
                }`}>{day}</span>
                {hasEvents && (
                  <div className="mt-1 space-y-0.5">
                    {dayLeadsArr.slice(0, 2).map(l => (
                      <div key={l.id} className="text-xs truncate px-1 py-0.5 rounded font-medium"
                        style={{ background: 'rgba(204,153,51,0.15)', color: '#CC9933', fontSize: '10px' }}>
                        {l.name.split(' ')[0]}
                      </div>
                    ))}
                    {dayLeadsArr.length > 2 && (
                      <div className="text-xs px-1" style={{ color: '#CC9933', fontSize: '10px' }}>+{dayLeadsArr.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="bg-white border border-gold/30 shadow-sm rounded-2xl p-5">
          <h2 className="text-gray-900 font-bold mb-4">
            {selectedDay} {current.toLocaleDateString('nl-NL', { month: 'long' })} — {dayLeads.length === 0 ? 'No events' : `${dayLeads.length} event${dayLeads.length > 1 ? 's' : ''}`}
          </h2>
          {dayLeads.length === 0 ? (
            <p className="text-gray-400 text-sm">No booked events on this day.</p>
          ) : (
            <div className="space-y-3">
              {dayLeads.map(lead => (
                <div key={lead.id} onClick={() => setSelectedLead(lead)}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-gold/30 transition-all">
                  <div>
                    <div className="text-gray-900 font-semibold">{lead.name}</div>
                    <div className="text-gray-500 text-sm">{lead.eventType} · {lead.venue} · {lead.guests} guests</div>
                    {lead.package && <div className="text-gold text-xs mt-1">{lead.package} package · €{lead.price}</div>}
                  </div>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank"
                    rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="text-[#25D366] hover:opacity-80 p-2">
                    💬
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)}
          onUpdate={(id, updates) => { updateLead(id, updates); setSelectedLead(null) }}
          onDelete={deleteLead} />
      )}
    </div>
  )
}
