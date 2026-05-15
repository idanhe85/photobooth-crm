import { LeadStatus } from '@/lib/types'

const config: Record<LeadStatus, { label: string; bg: string; text: string }> = {
  new:       { label: 'New',       bg: 'bg-blue-100',   text: 'text-blue-700' },
  contacted: { label: 'Contacted', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  quoted:    { label: 'Quoted',    bg: 'bg-orange-100', text: 'text-orange-700' },
  booked:    { label: 'Booked',   bg: 'bg-green-100',  text: 'text-green-700' },
  lost:      { label: 'Lost',     bg: 'bg-red-100',    text: 'text-red-700' },
}

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const { label, bg, text } = config[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  )
}
