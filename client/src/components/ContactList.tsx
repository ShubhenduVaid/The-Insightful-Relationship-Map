import { useDataStore } from '../stores/dataStore'
import type { Contact } from '../types/data'

interface ContactListProps {
  contacts: Contact[]
  onEditContact: (contact: Contact) => void
}

export default function ContactList({ contacts, onEditContact }: ContactListProps) {
  const { deleteContact, getInteractionsByContact } = useDataStore()

  const handleDeleteContact = (contact: Contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      deleteContact(contact.id)
    }
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No contacts found</div>
        <div className="text-gray-400">Add your first contact to get started</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map(contact => {
        const interactions = getInteractionsByContact(contact.id)
        
        return (
          <div key={contact.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {contact.name}
                </h3>
                {contact.position && contact.company && (
                  <p className="text-sm text-gray-600 mb-2">
                    {contact.position} at {contact.company}
                  </p>
                )}
                {contact.company && !contact.position && (
                  <p className="text-sm text-gray-600 mb-2">{contact.company}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEditContact(contact)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit contact"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteContact(contact)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete contact"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {contact.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contact.email}
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {contact.phone}
                </div>
              )}
            </div>

            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{interactions.length} interaction{interactions.length !== 1 ? 's' : ''}</span>
              <span>Added {new Date(contact.createdAt).toLocaleDateString()}</span>
            </div>

            {contact.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-2">{contact.notes}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
