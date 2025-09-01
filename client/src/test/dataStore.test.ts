import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDataStore } from '../stores/dataStore'
import { dataApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'

// Mock dependencies
vi.mock('../services/api', () => ({
  dataApi: {
    sync: vi.fn()
  }
}))

vi.mock('../stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn()
  }
}))

describe('Data Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useDataStore.setState({
      contacts: [],
      interactions: [],
      relationships: [],
      isLoading: false,
      error: null,
      lastSync: null
    })
    vi.clearAllMocks()
  })

  describe('Contact Management', () => {
    it('should add a new contact', () => {
      const { addContact } = useDataStore.getState()
      
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        tags: ['client']
      }
      
      addContact(contactData)
      
      const state = useDataStore.getState()
      expect(state.contacts).toHaveLength(1)
      expect(state.contacts[0]).toMatchObject(contactData)
      expect(state.contacts[0].id).toBeDefined()
      expect(state.contacts[0].createdAt).toBeInstanceOf(Date)
      expect(state.contacts[0].updatedAt).toBeInstanceOf(Date)
    })

    it('should update an existing contact', () => {
      const { addContact, updateContact } = useDataStore.getState()
      
      // Add a contact first
      addContact({
        name: 'John Doe',
        email: 'john@example.com',
        tags: []
      })
      
      const contactId = useDataStore.getState().contacts[0].id
      const originalUpdatedAt = useDataStore.getState().contacts[0].updatedAt
      
      // Wait a bit to ensure different timestamp
      setTimeout(() => {
        updateContact(contactId, {
          name: 'John Smith',
          company: 'New Corp'
        })
        
        const state = useDataStore.getState()
        expect(state.contacts[0].name).toBe('John Smith')
        expect(state.contacts[0].company).toBe('New Corp')
        expect(state.contacts[0].email).toBe('john@example.com') // Should preserve
        expect(state.contacts[0].updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      }, 1)
    })

    it('should delete a contact and related data', () => {
      const { addContact, addInteraction, addRelationship, deleteContact } = useDataStore.getState()
      
      // Add contacts
      addContact({ name: 'John Doe', tags: [] })
      addContact({ name: 'Jane Smith', tags: [] })
      
      const johnId = useDataStore.getState().contacts[0].id
      const janeId = useDataStore.getState().contacts[1].id
      
      // Add interaction for John
      addInteraction({
        contactId: johnId,
        type: 'meeting',
        title: 'Project Discussion',
        date: new Date(),
        tags: []
      })
      
      // Add relationship between John and Jane
      addRelationship({
        fromContactId: johnId,
        toContactId: janeId,
        type: 'colleague',
        strength: 5
      })
      
      // Delete John
      deleteContact(johnId)
      
      const state = useDataStore.getState()
      expect(state.contacts).toHaveLength(1)
      expect(state.contacts[0].name).toBe('Jane Smith')
      expect(state.interactions).toHaveLength(0) // John's interaction should be deleted
      expect(state.relationships).toHaveLength(0) // Relationship should be deleted
    })

    it('should get contact by id', () => {
      const { addContact, getContact } = useDataStore.getState()
      
      addContact({
        name: 'John Doe',
        email: 'john@example.com',
        tags: []
      })
      
      const contactId = useDataStore.getState().contacts[0].id
      const contact = getContact(contactId)
      
      expect(contact).toBeDefined()
      expect(contact?.name).toBe('John Doe')
      expect(contact?.email).toBe('john@example.com')
      
      const nonExistentContact = getContact('non-existent-id')
      expect(nonExistentContact).toBeUndefined()
    })
  })

  describe('Interaction Management', () => {
    it('should add a new interaction', () => {
      const { addContact, addInteraction } = useDataStore.getState()
      
      // Add a contact first
      addContact({ name: 'John Doe', tags: [] })
      const contactId = useDataStore.getState().contacts[0].id
      
      const interactionData = {
        contactId,
        type: 'meeting' as const,
        title: 'Project Discussion',
        description: 'Discussed project requirements',
        date: new Date(),
        duration: 60,
        tags: ['project']
      }
      
      addInteraction(interactionData)
      
      const state = useDataStore.getState()
      expect(state.interactions).toHaveLength(1)
      expect(state.interactions[0]).toMatchObject(interactionData)
      expect(state.interactions[0].id).toBeDefined()
    })

    it('should get interactions by contact', () => {
      const { addContact, addInteraction, getInteractionsByContact } = useDataStore.getState()
      
      // Add contacts
      addContact({ name: 'John Doe', tags: [] })
      addContact({ name: 'Jane Smith', tags: [] })
      
      const johnId = useDataStore.getState().contacts[0].id
      const janeId = useDataStore.getState().contacts[1].id
      
      // Add interactions
      addInteraction({
        contactId: johnId,
        type: 'meeting',
        title: 'Meeting 1',
        date: new Date(),
        tags: []
      })
      
      addInteraction({
        contactId: johnId,
        type: 'call',
        title: 'Call 1',
        date: new Date(),
        tags: []
      })
      
      addInteraction({
        contactId: janeId,
        type: 'email',
        title: 'Email 1',
        date: new Date(),
        tags: []
      })
      
      const johnInteractions = getInteractionsByContact(johnId)
      const janeInteractions = getInteractionsByContact(janeId)
      
      expect(johnInteractions).toHaveLength(2)
      expect(janeInteractions).toHaveLength(1)
      expect(johnInteractions[0].title).toBe('Meeting 1')
      expect(johnInteractions[1].title).toBe('Call 1')
      expect(janeInteractions[0].title).toBe('Email 1')
    })

    it('should update and delete interactions', () => {
      const { addContact, addInteraction, updateInteraction, deleteInteraction } = useDataStore.getState()
      
      // Add contact and interaction
      addContact({ name: 'John Doe', tags: [] })
      const contactId = useDataStore.getState().contacts[0].id
      
      addInteraction({
        contactId,
        type: 'meeting',
        title: 'Original Title',
        date: new Date(),
        tags: []
      })
      
      const interactionId = useDataStore.getState().interactions[0].id
      
      // Update interaction
      updateInteraction(interactionId, {
        title: 'Updated Title',
        duration: 90
      })
      
      let state = useDataStore.getState()
      expect(state.interactions[0].title).toBe('Updated Title')
      expect(state.interactions[0].duration).toBe(90)
      
      // Delete interaction
      deleteInteraction(interactionId)
      
      state = useDataStore.getState()
      expect(state.interactions).toHaveLength(0)
    })
  })

  describe('Relationship Management', () => {
    it('should add and manage relationships', () => {
      const { addContact, addRelationship, getRelationshipsByContact } = useDataStore.getState()
      
      // Add contacts
      addContact({ name: 'John Doe', tags: [] })
      addContact({ name: 'Jane Smith', tags: [] })
      addContact({ name: 'Bob Johnson', tags: [] })
      
      const contacts = useDataStore.getState().contacts
      const johnId = contacts[0].id
      const janeId = contacts[1].id
      const bobId = contacts[2].id
      
      // Add relationships
      addRelationship({
        fromContactId: johnId,
        toContactId: janeId,
        type: 'colleague',
        strength: 8,
        notes: 'Work together on projects'
      })
      
      addRelationship({
        fromContactId: johnId,
        toContactId: bobId,
        type: 'friend',
        strength: 9
      })
      
      const johnRelationships = getRelationshipsByContact(johnId)
      const janeRelationships = getRelationshipsByContact(janeId)
      
      expect(johnRelationships).toHaveLength(2)
      expect(janeRelationships).toHaveLength(1) // Jane is in one relationship
      expect(johnRelationships[0].type).toBe('colleague')
      expect(johnRelationships[0].strength).toBe(8)
    })

    it('should update and delete relationships', () => {
      const { addContact, addRelationship, updateRelationship, deleteRelationship } = useDataStore.getState()
      
      // Add contacts and relationship
      addContact({ name: 'John Doe', tags: [] })
      addContact({ name: 'Jane Smith', tags: [] })
      
      const contacts = useDataStore.getState().contacts
      const johnId = contacts[0].id
      const janeId = contacts[1].id
      
      addRelationship({
        fromContactId: johnId,
        toContactId: janeId,
        type: 'colleague',
        strength: 5
      })
      
      const relationshipId = useDataStore.getState().relationships[0].id
      
      // Update relationship
      updateRelationship(relationshipId, {
        type: 'friend',
        strength: 9,
        notes: 'Became close friends'
      })
      
      let state = useDataStore.getState()
      expect(state.relationships[0].type).toBe('friend')
      expect(state.relationships[0].strength).toBe(9)
      expect(state.relationships[0].notes).toBe('Became close friends')
      
      // Delete relationship
      deleteRelationship(relationshipId)
      
      state = useDataStore.getState()
      expect(state.relationships).toHaveLength(0)
    })
  })

  describe('Data Synchronization', () => {
    it('should handle sync data success', async () => {
      const { addContact, syncData } = useDataStore.getState()
      
      // Mock auth state
      vi.mocked(useAuthStore.getState).mockReturnValue({
        token: 'mock-token',
        salt: 'mock-salt',
        user: null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
        setLoading: vi.fn()
      })
      
      // Mock successful sync
      vi.mocked(dataApi.sync).mockResolvedValue({
        message: 'Data synchronized successfully',
        timestamp: '2024-01-01T00:00:00.000Z'
      })
      
      // Add some data
      addContact({ name: 'John Doe', tags: [] })
      
      await syncData()
      
      const state = useDataStore.getState()
      expect(state.lastSync).toBeInstanceOf(Date)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
      expect(dataApi.sync).toHaveBeenCalled()
    })

    it('should handle sync data failure', async () => {
      const { syncData } = useDataStore.getState()
      
      // Mock auth state
      vi.mocked(useAuthStore.getState).mockReturnValue({
        token: 'mock-token',
        salt: 'mock-salt',
        user: null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
        setLoading: vi.fn()
      })
      
      // Mock sync failure
      vi.mocked(dataApi.sync).mockRejectedValue(new Error('Network error'))
      
      await expect(syncData()).rejects.toThrow('Network error')
      
      const state = useDataStore.getState()
      expect(state.error).toBe('Network error')
      expect(state.isLoading).toBe(false)
    })

    it('should handle missing authentication', async () => {
      const { syncData } = useDataStore.getState()
      
      // Mock missing auth
      vi.mocked(useAuthStore.getState).mockReturnValue({
        token: null,
        salt: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
        setLoading: vi.fn()
      })
      
      await expect(syncData()).rejects.toThrow('Authentication required')
      
      const state = useDataStore.getState()
      expect(state.error).toBe('Authentication required')
    })
  })

  describe('Utility Functions', () => {
    it('should clear all data', () => {
      const { addContact, addInteraction, clearData } = useDataStore.getState()
      
      // Add some data
      addContact({ name: 'John Doe', tags: [] })
      const contactId = useDataStore.getState().contacts[0].id
      
      addInteraction({
        contactId,
        type: 'meeting',
        title: 'Test Meeting',
        date: new Date(),
        tags: []
      })
      
      // Clear data
      clearData()
      
      const state = useDataStore.getState()
      expect(state.contacts).toHaveLength(0)
      expect(state.interactions).toHaveLength(0)
      expect(state.relationships).toHaveLength(0)
      expect(state.lastSync).toBeNull()
      expect(state.error).toBeNull()
    })

    it('should set error state', () => {
      const { setError } = useDataStore.getState()
      
      setError('Test error message')
      
      const state = useDataStore.getState()
      expect(state.error).toBe('Test error message')
      
      setError(null)
      expect(useDataStore.getState().error).toBeNull()
    })
  })
})
