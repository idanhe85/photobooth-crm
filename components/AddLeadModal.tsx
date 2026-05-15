'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Lead } from '@/lib/types'

const eventTypes = ['Wedding', 'Bar/Bat Mitzvah', 'Birthday Party', 'Corporate Event', 'Conference / Expo', 'Other']

interface Props {
  onClose: () => void
  onAdd: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>) => void
}

export default function AddLeadModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', eventType: 'Wedding',
    eventDate: '', venue: '', guests: 50, status: 'new' as const,
    notes: '', package: '', price: undefined as number | undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(form)
    onClose()
  }

  const field = (label: string, content: React.ReactNode) => (
    <div>
      <label className="text-gray-600 text-xs block mb-1.5">{label}</label>
      {content}
    </div>
  )

  const inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm outline-none focus:border-gold/50 placeholder-gray-400" />
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field('Full Name *', inp({ required: true, placeholder: 'Emma de Vries', value: form.name, onChange: e => setForm({ ...form, name: e.target.value }) }))}
            {field('Phone *', inp({ required: true, placeholder: '+31 6 12345678', value: form.phone, onChange: e => setForm({ ...form, phone: e.target.value }) }))}
          </div>
          {field('Email', inp({ type: 'email', placeholder: 'email@example.com', value: form.email, onChange: e => setForm({ ...form, email: e.target.value }) }))}
          <div className="grid grid-cols-2 gap-3">
            {field('Event Type', (
              <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm outline-none focus:border-gold/50">
                {eventTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            ))}
            {field('Event Date', inp({ type: 'date', value: form.eventDate, onChange: e => setForm({ ...form, eventDate: e.target.value }) }))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Venue / City', inp({ placeholder: 'Amsterdam', value: form.venue, onChange: e => setForm({ ...form, venue: e.target.value }) }))}
            {field('Guests', inp({ type: 'number', placeholder: '100', value: form.guests, onChange: e => setForm({ ...form, guests: Number(e.target.value) }) }))}
          </div>
          {field('Notes', (
            <textarea rows={3} placeholder="Special requests..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm outline-none focus:border-gold/50 resize-none placeholder-gray-400" />
          ))}
          <button type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-gold text-white hover:bg-gold-light transition-all">
            Add Lead
          </button>
        </form>
      </div>
    </div>
  )
}
