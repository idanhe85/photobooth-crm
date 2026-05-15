'use client'
import { useState } from 'react'
import { X, Phone, Mail, MapPin, Users, Calendar, MessageCircle, Trash2 } from 'lucide-react'
import { Lead, LeadStatus } from '@/lib/types'
import StatusBadge from './StatusBadge'

const statuses: LeadStatus[] = ['new', 'contacted', 'quoted', 'booked', 'lost']
const packages = [
  { value: 'Silver',   label: 'Silver — €300' },
  { value: 'Gold',     label: 'Gold — €400' },
  { value: 'Platinum', label: 'Platinum — Custom' },
]

interface Props {
  lead: Lead
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Lead>) => void
  onDelete: (id: string) => void
}

export default function LeadModal({ lead, onClose, onUpdate, onDelete }: Props) {
  const [notes, setNotes] = useState(lead.notes)
  const [status, setStatus] = useState(lead.status)
  const [pkg, setPkg] = useState(lead.package || '')
  const [price, setPrice] = useState(lead.price?.toString() || '')
  const [assets, setAssets] = useState(lead.assets || {})
  const [venue, setVenue] = useState(lead.venue || '')
  const [guests, setGuests] = useState(lead.guests?.toString() || '')
  const [eventDate, setEventDate] = useState(lead.eventDate || '')

  const handlePackageChange = (val: string) => {
    setPkg(val)
    if (val === 'Silver') setPrice('300')
    else if (val === 'Gold') setPrice('400')
    else if (val === 'Platinum') setPrice('')
  }

  const save = () => {
    onUpdate(lead.id, { notes, status, package: pkg, price: price ? Number(price) : undefined, assets, venue, guests: guests ? Number(guests) : 0, eventDate })
  }

  const handleDelete = () => {
    if (confirm(`Delete lead for ${lead.name}?`)) {
      onDelete(lead.id)
      onClose()
    }
  }

  const whatsappMsg = encodeURIComponent(`Hoi ${lead.name.split(' ')[0]}! Ik ben Idan van The PhotoDUDE. `)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-[#E6E9EF] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E6E9EF]">
          <div>
            <h2 className="text-xl font-bold text-[#333333]">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={status} />
              <span className="text-[#676879] text-sm">{lead.eventType}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9699A6] hover:text-[#333333] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 p-3 bg-[#F5F6F8] border-0 rounded-xl hover:bg-[#F0F0F2] transition-colors group">
              <Phone size={16} className="text-gold" />
              <div>
                <div className="text-[#9699A6] text-xs">Phone</div>
                <div className="text-[#333333] text-sm font-medium">{lead.phone}</div>
              </div>
            </a>
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 p-3 bg-[#F5F6F8] border-0 rounded-xl hover:bg-[#F0F0F2] transition-colors">
              <Mail size={16} className="text-gold" />
              <div>
                <div className="text-[#9699A6] text-xs">Email</div>
                <div className="text-[#333333] text-sm font-medium truncate">{lead.email}</div>
              </div>
            </a>
            <div className="flex items-center gap-2 p-3 bg-[#F5F6F8] border-0 rounded-xl">
              <MapPin size={16} className="text-gold flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[#9699A6] text-xs">Venue</div>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="Venue name..."
                  className="w-full bg-transparent text-[#333333] text-sm font-medium outline-none placeholder-[#9699A6]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[#F5F6F8] border-0 rounded-xl">
              <Users size={16} className="text-gold flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[#9699A6] text-xs">Guests</div>
                <input
                  type="number"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-[#333333] text-sm font-medium outline-none placeholder-[#9699A6]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[#F5F6F8] border-0 rounded-xl col-span-2">
              <Calendar size={16} className="text-gold flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[#9699A6] text-xs">Event Date</div>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full bg-transparent text-[#333333] text-sm font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-[#676879] text-xs block mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    status === s ? 'bg-[#CC9933] text-white' : 'bg-[#F0F0F2] text-[#676879] hover:bg-[#E6E9EF]'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Package & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#676879] text-xs block mb-2">Package</label>
              <select
                value={pkg}
                onChange={e => handlePackageChange(e.target.value)}
                className="w-full bg-[#F5F6F8] border border-[#E6E9EF] rounded-xl px-3 py-2.5 text-[#333333] text-sm outline-none focus:border-[#CC9933]/50"
              >
                <option value="">None</option>
                {packages.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#676879] text-xs block mb-2">Price (€)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-[#F5F6F8] border border-[#E6E9EF] rounded-xl px-3 py-2.5 text-[#333333] text-sm outline-none focus:border-[#CC9933]/50"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[#676879] text-xs block mb-2">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full bg-[#F5F6F8] border border-[#E6E9EF] rounded-xl px-4 py-3 text-[#333333] text-sm outline-none focus:border-[#CC9933]/50 resize-none placeholder-[#9699A6]"
            />
          </div>

          {/* Design Assets */}
          <div>
            <label className="text-[#9699A6] text-xs font-semibold uppercase tracking-wider block mb-3">🎨 Design Assets</label>
            <div className="space-y-2">
              {[
                { key: 'overlay',     label: 'Overlay Design' },
                { key: 'startScreen', label: 'Start Screen' },
                { key: 'gifOverlay',  label: 'GIF Overlay' },
                { key: 'invitation',  label: 'Event Invitation' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[#676879] text-xs w-28 flex-shrink-0">{label}</span>
                  <input
                    type="text"
                    placeholder="Paste link or filename..."
                    value={assets[key as keyof typeof assets] || ''}
                    onChange={e => setAssets({ ...assets, [key]: e.target.value })}
                    className="flex-1 bg-[#F5F6F8] border border-[#E6E9EF] rounded-lg px-3 py-1.5 text-[#333333] text-xs outline-none focus:border-[#CC9933]/50"
                  />
                  {assets[key as keyof typeof assets] && (
                    <a href={assets[key as keyof typeof assets]} target="_blank" rel="noopener noreferrer"
                      className="text-[#CC9933] hover:opacity-80 text-xs">Open</a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366' }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <button
              onClick={save}
              className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#CC9933] text-white hover:bg-[#DDB84D] transition-all"
            >
              Save Changes
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm"
          >
            <Trash2 size={15} />
            Delete Lead
          </button>
        </div>
      </div>
    </div>
  )
}
