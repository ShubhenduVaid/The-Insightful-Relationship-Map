import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Contact, Interaction, Relationship, UserData } from '../types/data'
import { encryptData, decryptData, deriveEncryptionKey } from '../utils/crypto'
import { dataApi } from '../services/api'
import { useAuthStore } from './authStore'

interface DataState {
  contacts: Contact[]
  interactions: Interaction[]
  relationships: Relationship[]
  isLoading: boolean
  error: string | null
  lastSync: Date | null
}

interface DataActions {
  // Contact management
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
  getContact: (id: string) => Contact | undefined

  // Interaction management
  addInteraction: (interaction: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateInteraction: (id: string, updates: Partial<Interaction>) => void
  deleteInteraction: (id: string) => void
  getInteractionsByContact: (contactId: string) => Interaction[]

  // Relationship management
  addRelationship: (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRelationship: (id: string, updates: Partial<Relationship>) => void
  deleteRelationship: (id: string) => void
  getRelationshipsByContact: (contactId: string) => Relationship[]

  // Data synchronization
  syncData: (password?: string) => Promise<void>
  loadData: (password: string) => Promise<void>
  clearData: () => void
  setError: (error: string | null) => void
}

type DataStore = DataState & DataActions

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // State
      contacts: [],
      interactions: [],
      relationships: [],
      isLoading: false,
      error: null,
      lastSync: null,

      // Contact actions
      addContact: (contactData) => {
        const contact: Contact = {
          ...contactData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        set(state => ({
          contacts: [...state.contacts, contact]
        }))
        
        // Auto-sync after adding
        setTimeout(() => {
          const { token, sessionPassword } = useAuthStore.getState()
          if (token && sessionPassword) {
            get().syncData(sessionPassword).catch(console.warn)
          }
        }, 100)
      },

      updateContact: (id, updates) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contact.id === id
              ? { ...contact, ...updates, updatedAt: new Date() }
              : contact
          )
        }))
        
        // Auto-sync after updating
        setTimeout(() => {
          const { token, sessionPassword } = useAuthStore.getState()
          if (token && sessionPassword) {
            get().syncData(sessionPassword).catch(console.warn)
          }
        }, 100)
      },

      deleteContact: (id) => {
        set(state => ({
          contacts: state.contacts.filter(contact => contact.id !== id),
          interactions: state.interactions.filter(interaction => interaction.contactId !== id),
          relationships: state.relationships.filter(rel => 
            rel.fromContactId !== id && rel.toContactId !== id
          )
        }))
        
        // Auto-sync after deleting
        setTimeout(() => {
          const { token, sessionPassword } = useAuthStore.getState()
          if (token && sessionPassword) {
            get().syncData(sessionPassword).catch(console.warn)
          }
        }, 100)
      },

      getContact: (id) => {
        return get().contacts.find(contact => contact.id === id)
      },

      // Interaction actions
      addInteraction: (interactionData) => {
        const interaction: Interaction = {
          ...interactionData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        set(state => ({
          interactions: [...state.interactions, interaction]
        }))
      },

      updateInteraction: (id, updates) => {
        set(state => ({
          interactions: state.interactions.map(interaction =>
            interaction.id === id
              ? { ...interaction, ...updates, updatedAt: new Date() }
              : interaction
          )
        }))
      },

      deleteInteraction: (id) => {
        set(state => ({
          interactions: state.interactions.filter(interaction => interaction.id !== id)
        }))
      },

      getInteractionsByContact: (contactId) => {
        return get().interactions.filter(interaction => interaction.contactId === contactId)
      },

      // Relationship actions
      addRelationship: (relationshipData) => {
        const relationship: Relationship = {
          ...relationshipData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        set(state => ({
          relationships: [...state.relationships, relationship]
        }))
        
        // Auto-sync after adding
        setTimeout(() => {
          const { token, sessionPassword } = useAuthStore.getState()
          if (token && sessionPassword) {
            get().syncData(sessionPassword).catch(console.warn)
          }
        }, 100)
      },

      updateRelationship: (id, updates) => {
        set(state => ({
          relationships: state.relationships.map(relationship =>
            relationship.id === id
              ? { ...relationship, ...updates, updatedAt: new Date() }
              : relationship
          )
        }))
      },

      deleteRelationship: (id) => {
        set(state => ({
          relationships: state.relationships.filter(relationship => relationship.id !== id)
        }))
      },

      getRelationshipsByContact: (contactId) => {
        return get().relationships.filter(rel => 
          rel.fromContactId === contactId || rel.toContactId === contactId
        )
      },

      // Data synchronization
      syncData: async (password?: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const { token, salt, sessionPassword } = useAuthStore.getState()
          if (!token || !salt) {
            throw new Error('Authentication required')
          }

          // Use provided password or session password
          const syncPassword = password || sessionPassword
          if (!syncPassword) {
            throw new Error('Password required for sync')
          }

          const userData: UserData = {
            contacts: get().contacts,
            interactions: get().interactions,
            relationships: get().relationships,
            lastSync: new Date()
          }

          // Encrypt data before sending
          const encryptionKey = await deriveEncryptionKey(syncPassword, salt)
          const encryptedData = await encryptData(JSON.stringify(userData), encryptionKey)

          await dataApi.sync(encryptedData, token)
          
          set({ 
            lastSync: new Date(),
            isLoading: false 
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sync failed',
            isLoading: false
          })
          throw error
        }
      },

      loadData: async (password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const { salt } = useAuthStore.getState()
          if (!salt) {
            throw new Error('Salt not available')
          }

          // This would typically come from the login response
          const encryptedData = '' // Placeholder
          
          if (encryptedData) {
            const encryptionKey = await deriveEncryptionKey(password, salt)
            const decryptedData = await decryptData(encryptedData, encryptionKey)
            const userData: UserData = JSON.parse(decryptedData)

            set({
              contacts: userData.contacts,
              interactions: userData.interactions,
              relationships: userData.relationships,
              lastSync: userData.lastSync ? new Date(userData.lastSync) : null,
              isLoading: false
            })
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load data',
            isLoading: false
          })
          throw error
        }
      },

      clearData: () => {
        set({
          contacts: [],
          interactions: [],
          relationships: [],
          lastSync: null,
          error: null
        })
      },

      setError: (error) => {
        set({ error })
      }
    }),
    {
      name: 'data-storage',
      partialize: (state) => ({
        contacts: state.contacts,
        interactions: state.interactions,
        relationships: state.relationships,
        lastSync: state.lastSync
      })
    }
  )
)
