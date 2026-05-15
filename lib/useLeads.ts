'use client'
import { useState, useEffect } from 'react'
import { Lead, LeadStatus } from './types'
import { mockLeads } from './mockData'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('crm-leads')
    setLeads(stored ? JSON.parse(stored) : mockLeads)
  }, [])

  const save = (updated: Lead[]) => {
    setLeads(updated)
    localStorage.setItem('crm-leads', JSON.stringify(updated))
  }

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
    }
    save([newLead, ...leads])
  }

  const updateLead = (id: string, updates: Partial<Lead>) => {
    save(leads.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const updateStatus = (id: string, status: LeadStatus) => {
    save(leads.map(l => l.id === id ? { ...l, status, lastContact: new Date().toISOString().split('T')[0] } : l))
  }

  const deleteLead = (id: string) => {
    save(leads.filter(l => l.id !== id))
  }

  const resetToMock = () => {
    localStorage.removeItem('crm-leads')
    setLeads(mockLeads)
  }

  return { leads, addLead, updateLead, updateStatus, deleteLead, resetToMock }
}
