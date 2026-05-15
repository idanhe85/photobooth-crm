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

  const handlePackageChange = (val: string) => {
    setPkg(val)
    if (val === 'Silver') setPrice('300')
    else if (val === 'Gold') setPrice('400')
    else if (val === 'Platinum') setPrice('')
  }

  const save = () => {
    onUpdate(lead.id, { notes, status, package: pkg, price: price ? Number(price) : undefined, assets })
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
      <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={status} />
              <span className="text-gray-500 text-sm">{lead.eventType}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors group">
              <Phone size={16} className="text-gold" />
              <div>
                <div className="text-gray-500 text-xs">Phone</div>
                <div className="text-gray-900 text-sm font-medium">{lead.phone}</div>
              </div>
            </a>
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
              <Mail size={16} className="text-gold" />
              <div>
                <div className="text-gray-500 text-xs">Email</div>
                <div className="text-gray-900 text-sm font-medium truncate">{lead.email}</div>
              </div>
            </a>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <MapPin size={16} className="text-gold" />
              <div>
                <div className="text-gray-500 text-xs">Venue</div>
                <div className="text-gray-900 text-sm font-medium">{lead.venue || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <Users size={16} className="text-gold" />
              <div>
                <div className="text-gray-500 text-xs">Guests</div>
                <div className="text-gray-900 text-sm font-medium">{lead.guests}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl col-span-2">
              <Calendar size={16} className="text-gold" />
              <div>
                <div className="text-gray-500 text-xs">Event Date</div>
                <div className="text-gray-900 text-sm font-medium">{lead.eventDate}</div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-500 text-xs block mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    status === s ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              <label className="text-gray-500 text-xs block mb-2">Package</label>
              <select
                value={pkg}
                onChange={e => handlePackageChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-gold/50"
              >
                <option value="">None</option>
                {packages.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-2">Price (€)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-gold/50"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-gray-500 text-xs block mb-2">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none focus:border-gold/50 resize-none placeholder-gray-400"
            />
          </div>

          {/* Design Assets */}
          <div>
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-3">🎨 Design Assets</label>
            <div className="space-y-2">
              {[
                { key: 'overlay',     label: 'Overlay Design' },
                { key: 'startScreen', label: 'Start Screen' },
                { key: 'gifOverlay',  label: 'GIF Overlay' },
                { key: 'invitation',  label: 'Event Invitation' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-28 flex-shrink-0">{label}</span>
                  <input
                    type="text"
                    placeholder="Paste link or filename..."
                    value={assets[key as keyof typeof assets] || ''}
                    onChange={e => setAssets({ ...assets, [key]: e.target.value })}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-xs outline-none focus:border-gold/50"
                  />
                  {assets[key as keyof typeof assets] && (
                    <a href={assets[key as keyof typeof assets]} target="_blank" rel="noopener noreferrer"
                      className="text-gold hover:opacity-80 text-xs">Open</a>
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
              className="flex-1 py-3 rounded-xl font-semibold text-sm bg-gold text-white hover:bg-gold-light transition-all"
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
