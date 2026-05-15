export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'booked' | 'lost'

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  eventType: string
  eventDate: string
  venue: string
  guests: number
  status: LeadStatus
  notes: string
  createdAt: string
  lastContact: string
  package?: string
  price?: number
  assets?: {
    overlay?: string
    startScreen?: string
    gifOverlay?: string
    invitation?: string
  }
}
