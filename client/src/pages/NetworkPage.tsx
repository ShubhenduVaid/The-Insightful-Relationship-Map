import { useState, useMemo } from 'react'
import { useDataStore } from '../stores/dataStore'
import NetworkVisualization from '../components/NetworkVisualization'
import RelationshipForm from '../components/RelationshipForm'
import Navigation from '../components/Navigation'

export default function NetworkPage() {
  const { contacts, relationships } = useDataStore()
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [showRelationshipForm, setShowRelationshipForm] = useState(false)

  const selectedContact = selectedContactId 
    ? contacts.find(c => c.id === selectedContactId)
    : null

  // Calculate advanced network metrics
  const networkStats = useMemo(() => {
    if (contacts.length === 0) return null

    // Calculate degree centrality for each contact
    const contactDegrees = contacts.map(contact => {
      const degree = relationships.filter(r => 
        r.fromContactId === contact.id || r.toContactId === contact.id
      ).length
      return { contact, degree }
    })

    // Find most connected person
    const mostConnected = contactDegrees.reduce((max, current) => 
      current.degree > max.degree ? current : max
    )

    // Calculate relationship type distribution
    const typeDistribution = relationships.reduce((acc, rel) => {
      acc[rel.type] = (acc[rel.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate average relationship strength
    const avgStrength = relationships.length > 0 
      ? relationships.reduce((sum, rel) => sum + rel.strength, 0) / relationships.length
      : 0

    return {
      mostConnected,
      typeDistribution,
      avgStrength,
      totalNodes: contacts.length,
      totalEdges: relationships.length
    }
  }, [contacts, relationships])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Network Visualization</h1>
              <p className="mt-2 text-gray-600">
                Explore your relationship network and discover insights
              </p>
            </div>
            <button
              onClick={() => setShowRelationshipForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Add Relationship
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Network Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <NetworkVisualization
                contacts={contacts}
                relationships={relationships}
                onNodeSelect={setSelectedContactId}
                selectedNodeId={selectedContactId}
              />
            </div>
          </div>

          {/* Contact Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedContact ? 'Contact Details' : 'Network Stats'}
              </h3>
              
              {selectedContact ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedContact.name}</h4>
                    {selectedContact.company && (
                      <p className="text-sm text-gray-600">{selectedContact.company}</p>
                    )}
                    {selectedContact.position && (
                      <p className="text-sm text-gray-600">{selectedContact.position}</p>
                    )}
                  </div>
                  
                  {selectedContact.email && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</span>
                      <p className="text-sm text-gray-900">{selectedContact.email}</p>
                    </div>
                  )}
                  
                  {selectedContact.tags.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tags</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedContact.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedContact.notes && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedContact.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {networkStats && (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{networkStats.totalNodes}</div>
                        <div className="text-sm text-gray-600">Total Contacts</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{networkStats.totalEdges}</div>
                        <div className="text-sm text-gray-600">Relationships</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {networkStats.avgStrength.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Avg Strength</div>
                      </div>

                      {networkStats.mostConnected.degree > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Most Connected
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {networkStats.mostConnected.contact.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {networkStats.mostConnected.degree} connections
                          </div>
                        </div>
                      )}

                      {Object.keys(networkStats.typeDistribution).length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Relationship Types
                          </div>
                          <div className="space-y-1">
                            {Object.entries(networkStats.typeDistribution).map(([type, count]) => (
                              <div key={type} className="flex justify-between text-xs">
                                <span className="capitalize">{type}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Click on a node to view contact details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRelationshipForm && (
        <RelationshipForm
          onClose={() => setShowRelationshipForm(false)}
        />
      )}
    </div>
  )
}
