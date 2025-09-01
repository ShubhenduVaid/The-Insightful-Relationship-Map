import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ContactList from '../components/ContactList'
import { useDataStore } from '../stores/dataStore'
import type { Contact } from '../types/data'

// Mock the data store
vi.mock('../stores/dataStore', () => ({
  useDataStore: vi.fn()
}))

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: vi.fn(),
  writable: true
})

describe('ContactList', () => {
  const mockDeleteContact = vi.fn()
  const mockGetInteractionsByContact = vi.fn()
  const mockOnEditContact = vi.fn()

  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      company: 'Acme Corp',
      position: 'Developer',
      notes: 'Great developer with React expertise',
      tags: ['client', 'important'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      company: 'Tech Solutions',
      tags: ['colleague'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    },
    {
      id: '3',
      name: 'Bob Johnson',
      phone: '987-654-3210',
      notes: 'Met at conference',
      tags: [],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04')
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useDataStore).mockReturnValue({
      deleteContact: mockDeleteContact,
      getInteractionsByContact: mockGetInteractionsByContact,
      contacts: [],
      interactions: [],
      relationships: [],
      isLoading: false,
      error: null,
      lastSync: null,
      addContact: vi.fn(),
      updateContact: vi.fn(),
      getContact: vi.fn(),
      addInteraction: vi.fn(),
      updateInteraction: vi.fn(),
      deleteInteraction: vi.fn(),
      addRelationship: vi.fn(),
      updateRelationship: vi.fn(),
      deleteRelationship: vi.fn(),
      getRelationshipsByContact: vi.fn(),
      syncData: vi.fn(),
      loadData: vi.fn(),
      clearData: vi.fn(),
      setError: vi.fn()
    })

    // Default mock for interactions
    mockGetInteractionsByContact.mockReturnValue([])
  })

  describe('Empty State', () => {
    it('should show empty state when no contacts', () => {
      render(<ContactList contacts={[]} onEditContact={mockOnEditContact} />)
      
      expect(screen.getByText('No contacts found')).toBeInTheDocument()
      expect(screen.getByText('Add your first contact to get started')).toBeInTheDocument()
    })
  })

  describe('Contact Display', () => {
    it('should render all contacts in grid layout', () => {
      render(<ContactList contacts={mockContacts} onEditContact={mockOnEditContact} />)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    it('should display contact information correctly', () => {
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      // Name and position/company
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Developer at Acme Corp')).toBeInTheDocument()
      
      // Contact details
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('123-456-7890')).toBeInTheDocument()
      
      // Tags
      expect(screen.getByText('client')).toBeInTheDocument()
      expect(screen.getByText('important')).toBeInTheDocument()
      
      // Notes (truncated)
      expect(screen.getByText(/Great developer with React expertise/)).toBeInTheDocument()
      
      // Creation date
      expect(screen.getByText('Added 1/1/2024')).toBeInTheDocument()
    })

    it('should handle contacts with missing optional fields', () => {
      render(<ContactList contacts={[mockContacts[2]]} onEditContact={mockOnEditContact} />)
      
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      expect(screen.queryByText('@')).not.toBeInTheDocument() // No email
      expect(screen.getByText('987-654-3210')).toBeInTheDocument()
      expect(screen.getByText('Met at conference')).toBeInTheDocument()
    })

    it('should display company without position', () => {
      render(<ContactList contacts={[mockContacts[1]]} onEditContact={mockOnEditContact} />)
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Tech Solutions')).toBeInTheDocument()
      expect(screen.queryByText('at Tech Solutions')).not.toBeInTheDocument()
    })

    it('should show interaction count', () => {
      // Mock interactions for first contact
      mockGetInteractionsByContact.mockImplementation((contactId) => {
        if (contactId === '1') {
          return [{ id: 'int1' }, { id: 'int2' }, { id: 'int3' }] // 3 interactions
        }
        return []
      })
      
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      expect(screen.getByText('3 interactions')).toBeInTheDocument()
    })

    it('should handle singular interaction count', () => {
      mockGetInteractionsByContact.mockImplementation((contactId) => {
        if (contactId === '1') {
          return [{ id: 'int1' }] // 1 interaction
        }
        return []
      })
      
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      expect(screen.getByText('1 interaction')).toBeInTheDocument()
    })
  })

  describe('Contact Actions', () => {
    it('should call onEditContact when edit button is clicked', () => {
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      const editButton = screen.getByTitle('Edit contact')
      fireEvent.click(editButton)
      
      expect(mockOnEditContact).toHaveBeenCalledWith(mockContacts[0])
    })

    it('should delete contact when confirmed', () => {
      vi.mocked(window.confirm).mockReturnValue(true)
      
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      const deleteButton = screen.getByTitle('Delete contact')
      fireEvent.click(deleteButton)
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete John Doe?')
      expect(mockDeleteContact).toHaveBeenCalledWith('1')
    })

    it('should not delete contact when cancelled', () => {
      vi.mocked(window.confirm).mockReturnValue(false)
      
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      const deleteButton = screen.getByTitle('Delete contact')
      fireEvent.click(deleteButton)
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete John Doe?')
      expect(mockDeleteContact).not.toHaveBeenCalled()
    })
  })

  describe('Visual Elements', () => {
    it('should display contact icons', () => {
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      // Check for SVG icons (email and phone)
      const svgElements = screen.getAllByRole('img', { hidden: true })
      expect(svgElements.length).toBeGreaterThan(0)
    })

    it('should show tags with proper styling', () => {
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      const clientTag = screen.getByText('client')
      const importantTag = screen.getByText('important')
      
      expect(clientTag).toHaveClass('bg-gray-100', 'text-gray-700', 'text-xs', 'rounded-md')
      expect(importantTag).toHaveClass('bg-gray-100', 'text-gray-700', 'text-xs', 'rounded-md')
    })

    it('should apply hover effects to contact cards', () => {
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      const contactCard = screen.getByText('John Doe').closest('div')
      expect(contactCard).toHaveClass('hover:shadow-md', 'transition-shadow')
    })
  })

  describe('Responsive Design', () => {
    it('should use responsive grid classes', () => {
      const { container } = render(<ContactList contacts={mockContacts} onEditContact={mockOnEditContact} />)
      
      const gridContainer = container.firstChild
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      expect(screen.getByTitle('Edit contact')).toBeInTheDocument()
      expect(screen.getByTitle('Delete contact')).toBeInTheDocument()
    })

    it('should have proper semantic structure', () => {
      render(<ContactList contacts={[mockContacts[0]]} onEditContact={mockOnEditContact} />)
      
      // Contact name should be in a heading-like element
      const contactName = screen.getByText('John Doe')
      expect(contactName.tagName).toBe('H3')
    })
  })
})
