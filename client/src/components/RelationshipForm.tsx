import { useState } from 'react'
import { useDataStore } from '../stores/dataStore'
import type { Relationship } from '../types/data'

interface RelationshipFormProps {
  onClose: () => void
  relationship?: Relationship | null
}

export default function RelationshipForm({ onClose, relationship }: RelationshipFormProps) {
  const { contacts, addRelationship, updateRelationship } = useDataStore()
  
  const [formData, setFormData] = useState({
    fromContactId: relationship?.fromContactId || '',
    toContactId: relationship?.toContactId || '',
    type: relationship?.type || 'colleague' as const,
    strength: relationship?.strength || 5,
    notes: relationship?.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fromContactId || !formData.toContactId) return
    if (formData.fromContactId === formData.toContactId) return

    if (relationship) {
      updateRelationship(relationship.id, formData)
    } else {
      addRelationship(formData)
    }
    
    onClose()
  }

  const availableContacts = contacts.filter(contact => 
    contact.id !== formData.fromContactId
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {relationship ? 'Edit Relationship' : 'Add Relationship'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Contact
            </label>
            <select
              value={formData.fromContactId}
              onChange={(e) => setFormData(prev => ({ ...prev, fromContactId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select contact...</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Contact
            </label>
            <select
              value={formData.toContactId}
              onChange={(e) => setFormData(prev => ({ ...prev, toContactId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select contact...</option>
              {availableContacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="friend">Friend</option>
              <option value="colleague">Colleague</option>
              <option value="family">Family</option>
              <option value="mentor">Mentor</option>
              <option value="client">Client</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strength (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.strength}
              onChange={(e) => setFormData(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 mt-1">
              {formData.strength}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Optional notes about this relationship..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            >
              {relationship ? 'Update' : 'Add'} Relationship
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
