import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '../components/ContactForm'
import { useDataStore } from '../stores/dataStore'
import type { Contact } from '../types/data'

// Mock the data store
vi.mock('../stores/dataStore', () => ({
  useDataStore: vi.fn()
}))

describe('ContactForm', () => {
  const mockAddContact = vi.fn()
  const mockUpdateContact = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useDataStore).mockReturnValue({
      addContact: mockAddContact,
      updateContact: mockUpdateContact,
      contacts: [],
      interactions: [],
      relationships: [],
      isLoading: false,
      error: null,
      lastSync: null,
      deleteContact: vi.fn(),
      getContact: vi.fn(),
      addInteraction: vi.fn(),
      updateInteraction: vi.fn(),
      deleteInteraction: vi.fn(),
      getInteractionsByContact: vi.fn(),
      addRelationship: vi.fn(),
      updateRelationship: vi.fn(),
      deleteRelationship: vi.fn(),
      getRelationshipsByContact: vi.fn(),
      syncData: vi.fn(),
      loadData: vi.fn(),
      clearData: vi.fn(),
      setError: vi.fn()
    })
  })

  describe('Add Contact Mode', () => {
    it('should render add contact form', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      expect(screen.getByRole('heading', { name: 'Add Contact' })).toBeInTheDocument()
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Phone/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Company/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Position/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Tags/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Notes/)).toBeInTheDocument()
    })

    it('should add a new contact on form submission', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/Name/), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByLabelText(/Email/), {
        target: { value: 'john@example.com' }
      })
      fireEvent.change(screen.getByLabelText(/Company/), {
        target: { value: 'Acme Corp' }
      })
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Add Contact/ }))
      
      await waitFor(() => {
        expect(mockAddContact).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '',
          company: 'Acme Corp',
          position: '',
          notes: '',
          tags: []
        })
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('should require name field', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      // Try to submit without name
      fireEvent.click(screen.getByRole('button', { name: /Add Contact/ }))
      
      // Form should not submit
      expect(mockAddContact).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should handle tag management', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      const tagInput = screen.getByPlaceholderText('Add tag...')
      const addTagButton = screen.getByText('Add')
      
      // Add a tag
      fireEvent.change(tagInput, { target: { value: 'client' } })
      fireEvent.click(addTagButton)
      
      expect(screen.getByText('client')).toBeInTheDocument()
      expect(tagInput).toHaveValue('')
      
      // Remove a tag
      const removeButton = screen.getAllByText('×')[0]
      fireEvent.click(removeButton)
      
      expect(screen.queryByText('client')).not.toBeInTheDocument()
    })

    it('should prevent duplicate tags', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      const tagInput = screen.getByPlaceholderText('Add tag...')
      const addTagButton = screen.getByText('Add')
      
      // Add a tag
      fireEvent.change(tagInput, { target: { value: 'client' } })
      fireEvent.click(addTagButton)
      
      // Try to add the same tag again
      fireEvent.change(tagInput, { target: { value: 'client' } })
      fireEvent.click(addTagButton)
      
      // Should only have one instance
      const clientTags = screen.getAllByText('client')
      expect(clientTags).toHaveLength(1)
    })
  })

  describe('Edit Contact Mode', () => {
    const mockContact: Contact = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      company: 'Acme Corp',
      position: 'Developer',
      notes: 'Great developer',
      tags: ['client', 'important'],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    it('should render edit contact form with existing data', () => {
      render(<ContactForm contact={mockContact} onClose={mockOnClose} />)
      
      expect(screen.getByText('Edit Contact')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Developer')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Great developer')).toBeInTheDocument()
      expect(screen.getByText('client')).toBeInTheDocument()
      expect(screen.getByText('important')).toBeInTheDocument()
    })

    it('should update existing contact on form submission', async () => {
      render(<ContactForm contact={mockContact} onClose={mockOnClose} />)
      
      // Update the name
      const nameInput = screen.getByDisplayValue('John Doe')
      fireEvent.change(nameInput, { target: { value: 'John Smith' } })
      
      // Submit the form
      fireEvent.click(screen.getByText('Update Contact'))
      
      await waitFor(() => {
        expect(mockUpdateContact).toHaveBeenCalledWith('1', {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '123-456-7890',
          company: 'Acme Corp',
          position: 'Developer',
          notes: 'Great developer',
          tags: ['client', 'important']
        })
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  describe('Form Interactions', () => {
    it('should close form when close button is clicked', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should close form when cancel button is clicked', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should handle empty tag input gracefully', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      const addTagButton = screen.getByText('Add')
      
      // Try to add empty tag
      fireEvent.click(addTagButton)
      
      // Should not add any tags
      expect(screen.queryByText('×')).not.toBeInTheDocument()
    })

    it('should trim whitespace from tags', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      const tagInput = screen.getByPlaceholderText('Add tag...')
      const addTagButton = screen.getByText('Add')
      
      // Add tag with whitespace
      fireEvent.change(tagInput, { target: { value: '  client  ' } })
      fireEvent.click(addTagButton)
      
      expect(screen.getByText('client')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      expect(screen.getByLabelText(/Name \*/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Phone/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Company/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Position/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Tags/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Notes/)).toBeInTheDocument()
    })

    it('should have required field marked', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Name \*/)
      expect(nameInput).toHaveAttribute('required')
    })

    it('should have proper input types', () => {
      render(<ContactForm onClose={mockOnClose} />)
      
      expect(screen.getByLabelText(/Email/)).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText(/Phone/)).toHaveAttribute('type', 'tel')
    })
  })
})
