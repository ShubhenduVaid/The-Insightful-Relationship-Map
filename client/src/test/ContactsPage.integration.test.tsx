import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactsPage from '../pages/ContactsPage'
import { useDataStore } from '../stores/dataStore'
import type { Contact } from '../types/data'

// Mock the data store
vi.mock('../stores/dataStore', () => ({
  useDataStore: vi.fn()
}))

describe('ContactsPage Integration', () => {
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      position: 'Developer',
      tags: ['client', 'important'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@techsolutions.com',
      company: 'Tech Solutions',
      tags: ['colleague'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Bob Johnson',
      company: 'Startup Inc',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockStoreState = {
    contacts: mockContacts,
    interactions: [],
    relationships: [],
    isLoading: false,
    error: null,
    lastSync: null,
    addContact: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
    getContact: vi.fn(),
    addInteraction: vi.fn(),
    updateInteraction: vi.fn(),
    deleteInteraction: vi.fn(),
    getInteractionsByContact: vi.fn().mockReturnValue([]),
    addRelationship: vi.fn(),
    updateRelationship: vi.fn(),
    deleteRelationship: vi.fn(),
    getRelationshipsByContact: vi.fn(),
    syncData: vi.fn(),
    loadData: vi.fn(),
    clearData: vi.fn(),
    setError: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDataStore).mockReturnValue(mockStoreState)
  })

  describe('Page Layout and Navigation', () => {
    it('should render contacts page with header and stats', () => {
      render(<ContactsPage />)
      
      expect(screen.getByText('Contacts')).toBeInTheDocument()
      expect(screen.getByText('Add Contact')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search contacts...')).toBeInTheDocument()
      
      // Stats cards
      expect(screen.getByText('Total Contacts')).toBeInTheDocument()
      expect(screen.getByText('With Company')).toBeInTheDocument()
      expect(screen.getByText('Tagged')).toBeInTheDocument()
    })

    it('should display correct statistics', () => {
      render(<ContactsPage />)
      
      expect(screen.getByText('3')).toBeInTheDocument() // Total contacts
      expect(screen.getByText('3')).toBeInTheDocument() // With company (all have company)
      expect(screen.getByText('2')).toBeInTheDocument() // Tagged (John and Jane have tags)
    })

    it('should show loading state', () => {
      vi.mocked(useDataStore).mockReturnValue({
        ...mockStoreState,
        isLoading: true
      })
      
      render(<ContactsPage />)
      
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument() // Loading spinner
    })

    it('should show error state', () => {
      vi.mocked(useDataStore).mockReturnValue({
        ...mockStoreState,
        error: 'Failed to load contacts'
      })
      
      render(<ContactsPage />)
      
      expect(screen.getByText('Failed to load contacts')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('should filter contacts by name', () => {
      render(<ContactsPage />)
      
      const searchInput = screen.getByPlaceholderText('Search contacts...')
      fireEvent.change(searchInput, { target: { value: 'john' } })
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })

    it('should filter contacts by email', () => {
      render(<ContactsPage />)
      
      const searchInput = screen.getByPlaceholderText('Search contacts...')
      fireEvent.change(searchInput, { target: { value: 'techsolutions' } })
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })

    it('should filter contacts by company', () => {
      render(<ContactsPage />)
      
      const searchInput = screen.getByPlaceholderText('Search contacts...')
      fireEvent.change(searchInput, { target: { value: 'startup' } })
      
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('should be case insensitive', () => {
      render(<ContactsPage />)
      
      const searchInput = screen.getByPlaceholderText('Search contacts...')
      fireEvent.change(searchInput, { target: { value: 'JOHN' } })
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should show all contacts when search is cleared', () => {
      render(<ContactsPage />)
      
      const searchInput = screen.getByPlaceholderText('Search contacts...')
      
      // Search for specific contact
      fireEvent.change(searchInput, { target: { value: 'john' } })
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      
      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } })
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })
  })

  describe('Contact Form Integration', () => {
    it('should open add contact form', () => {
      render(<ContactsPage />)
      
      const addButton = screen.getByText('Add Contact')
      fireEvent.click(addButton)
      
      expect(screen.getByText('Add Contact')).toBeInTheDocument()
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
    })

    it('should open edit contact form', () => {
      render(<ContactsPage />)
      
      const editButton = screen.getAllByTitle('Edit contact')[0]
      fireEvent.click(editButton)
      
      expect(screen.getByText('Edit Contact')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    })

    it('should close form when requested', async () => {
      render(<ContactsPage />)
      
      // Open form
      const addButton = screen.getByText('Add Contact')
      fireEvent.click(addButton)
      
      expect(screen.getByText('Add Contact')).toBeInTheDocument()
      
      // Close form
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      await waitFor(() => {
        expect(screen.queryByLabelText(/Name/)).not.toBeInTheDocument()
      })
    })
  })

  describe('Contact Management Actions', () => {
    it('should handle contact deletion', () => {
      // Mock window.confirm to return true
      Object.defineProperty(window, 'confirm', {
        value: vi.fn(() => true),
        writable: true
      })
      
      render(<ContactsPage />)
      
      const deleteButton = screen.getAllByTitle('Delete contact')[0]
      fireEvent.click(deleteButton)
      
      expect(mockStoreState.deleteContact).toHaveBeenCalledWith('1')
    })

    it('should handle contact editing', () => {
      render(<ContactsPage />)
      
      const editButton = screen.getAllByTitle('Edit contact')[0]
      fireEvent.click(editButton)
      
      // Form should open with contact data
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no contacts', () => {
      vi.mocked(useDataStore).mockReturnValue({
        ...mockStoreState,
        contacts: []
      })
      
      render(<ContactsPage />)
      
      expect(screen.getByText('No contacts found')).toBeInTheDocument()
      expect(screen.getByText('Add your first contact to get started')).toBeInTheDocument()
    })

    it('should show empty state when search has no results', () => {
      render(<ContactsPage />)
      
      const searchInput = screen.getByPlaceholderText('Search contacts...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
      
      expect(screen.getByText('No contacts found')).toBeInTheDocument()
    })
  })

  describe('Statistics Updates', () => {
    it('should update stats when contacts change', () => {
      const { rerender } = render(<ContactsPage />)
      
      // Initial stats
      expect(screen.getByText('3')).toBeInTheDocument() // Total contacts
      
      // Update store with fewer contacts
      vi.mocked(useDataStore).mockReturnValue({
        ...mockStoreState,
        contacts: [mockContacts[0]] // Only one contact
      })
      
      rerender(<ContactsPage />)
      
      expect(screen.getByText('1')).toBeInTheDocument() // Updated total
    })

    it('should calculate company stats correctly', () => {
      // Test with contacts without company
      const contactsWithoutCompany = [
        { ...mockContacts[0], company: undefined },
        mockContacts[1], // Has company
        { ...mockContacts[2], company: undefined }
      ]
      
      vi.mocked(useDataStore).mockReturnValue({
        ...mockStoreState,
        contacts: contactsWithoutCompany
      })
      
      render(<ContactsPage />)
      
      expect(screen.getByText('1')).toBeInTheDocument() // Only Jane has company
    })

    it('should calculate tagged stats correctly', () => {
      // Test with different tag configurations
      const contactsWithTags = [
        mockContacts[0], // Has tags
        { ...mockContacts[1], tags: [] }, // No tags
        mockContacts[2] // No tags
      ]
      
      vi.mocked(useDataStore).mockReturnValue({
        ...mockStoreState,
        contacts: contactsWithTags
      })
      
      render(<ContactsPage />)
      
      expect(screen.getByText('1')).toBeInTheDocument() // Only John has tags
    })
  })

  describe('Responsive Behavior', () => {
    it('should have responsive grid layout', () => {
      const { container } = render(<ContactsPage />)
      
      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('should have responsive stats layout', () => {
      const { container } = render(<ContactsPage />)
      
      const statsContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3')
      expect(statsContainer).toBeInTheDocument()
    })
  })
})
