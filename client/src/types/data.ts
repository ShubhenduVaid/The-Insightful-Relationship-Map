export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  notes?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Interaction {
  id: string
  contactId: string
  type: 'meeting' | 'call' | 'email' | 'message' | 'event' | 'other'
  title: string
  description?: string
  date: Date
  location?: string
  duration?: number // in minutes
  notes?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Relationship {
  id: string
  fromContactId: string
  toContactId: string
  type: 'friend' | 'colleague' | 'family' | 'mentor' | 'client' | 'other'
  strength: number // 1-10 scale
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserData {
  contacts: Contact[]
  interactions: Interaction[]
  relationships: Relationship[]
  lastSync: Date
}
