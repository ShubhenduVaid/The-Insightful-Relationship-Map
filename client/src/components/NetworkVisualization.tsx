import { useEffect, useRef, useState } from 'react'
import cytoscape, { Core, NodeSingular } from 'cytoscape'
import type { Contact, Relationship } from '../types/data'

interface NetworkVisualizationProps {
  contacts: Contact[]
  relationships: Relationship[]
  onNodeSelect?: (contactId: string | null) => void
  selectedNodeId?: string | null
}

interface NetworkMetrics {
  centrality: Record<string, number>
  clustering: number
  density: number
}

export default function NetworkVisualization({
  contacts,
  relationships,
  onNodeSelect,
  selectedNodeId
}: NetworkVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null)
  const [layoutType, setLayoutType] = useState<'cose' | 'circle' | 'grid'>('cose')

  // Calculate network metrics
  const calculateMetrics = (cy: Core): NetworkMetrics => {
    const nodes = cy.nodes()
    const edges = cy.edges()
    
    // Calculate betweenness centrality
    const centrality: Record<string, number> = {}
    nodes.forEach(node => {
      centrality[node.id()] = node.degree() / (nodes.length - 1)
    })
    
    // Calculate clustering coefficient
    const clustering = nodes.length > 0 ? 
      nodes.reduce((sum, node) => sum + node.degree(), 0) / nodes.length : 0
    
    // Calculate network density
    const maxEdges = (nodes.length * (nodes.length - 1)) / 2
    const density = maxEdges > 0 ? edges.length / maxEdges : 0
    
    return { centrality, clustering, density }
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Create nodes from contacts with centrality-based sizing
    const nodes = contacts.map(contact => {
      const degree = relationships.filter(r => 
        r.fromContactId === contact.id || r.toContactId === contact.id
      ).length
      
      return {
        data: {
          id: contact.id,
          label: contact.name,
          company: contact.company || '',
          tags: contact.tags.join(', '),
          degree,
          size: Math.max(30, degree * 8)
        }
      }
    })

    // Create edges from relationships
    const edges = relationships.map(rel => ({
      data: {
        id: `${rel.fromContactId}-${rel.toContactId}`,
        source: rel.fromContactId,
        target: rel.toContactId,
        strength: rel.strength,
        type: rel.type
      }
    }))

    // Initialize Cytoscape
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3B82F6',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#1F2937',
            'font-size': '10px',
            'font-weight': 500,
            'width': 'data(size)',
            'height': 'data(size)',
            'border-width': '2px',
            'border-color': '#FFFFFF',
            'text-outline-width': '1px',
            'text-outline-color': '#FFFFFF'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#EF4444',
            'border-color': '#DC2626',
            'border-width': '3px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'mapData(strength, 1, 10, 1, 5)',
            'line-color': '#6B7280',
            'target-arrow-color': '#6B7280',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.7
          }
        },
        {
          selector: 'edge[type="family"]',
          style: {
            'line-color': '#EF4444'
          }
        },
        {
          selector: 'edge[type="friend"]',
          style: {
            'line-color': '#10B981'
          }
        },
        {
          selector: 'edge[type="colleague"]',
          style: {
            'line-color': '#3B82F6'
          }
        },
        {
          selector: 'edge[type="mentor"]',
          style: {
            'line-color': '#8B5CF6'
          }
        },
        {
          selector: 'edge[type="client"]',
          style: {
            'line-color': '#F59E0B'
          }
        }
      ],
      layout: {
        name: layoutType,
        animate: true,
        animationDuration: 1000,
        ...(layoutType === 'cose' && {
          nodeRepulsion: 8000,
          idealEdgeLength: 100,
          edgeElasticity: 100,
          nestingFactor: 1.2,
          gravity: 1,
          numIter: 1000,
          initialTemp: 1000,
          coolingFactor: 0.99,
          minTemp: 1.0
        })
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      selectionType: 'single'
    })

    // Handle node selection
    cyRef.current.on('tap', 'node', (event) => {
      const node = event.target as NodeSingular
      const contactId = node.id()
      onNodeSelect?.(contactId)
    })

    // Handle background tap (deselect)
    cyRef.current.on('tap', (event) => {
      if (event.target === cyRef.current) {
        onNodeSelect?.(null)
      }
    })

    // Calculate and store metrics
    if (cyRef.current) {
      setMetrics(calculateMetrics(cyRef.current))
    }

    return () => {
      cyRef.current?.destroy()
    }
  }, [contacts, relationships, layoutType, onNodeSelect])

  // Update selection when selectedNodeId changes
  useEffect(() => {
    if (!cyRef.current) return

    cyRef.current.nodes().unselect()
    if (selectedNodeId) {
      const node = cyRef.current.getElementById(selectedNodeId)
      if (node.length > 0) {
        node.select()
      }
    }
  }, [selectedNodeId])

  return (
    <div className="relative">
      {/* Layout Controls */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200 z-10">
        <div className="flex gap-2">
          {(['cose', 'circle', 'grid'] as const).map(layout => (
            <button
              key={layout}
              onClick={() => setLayoutType(layout)}
              className={`px-3 py-1 text-xs rounded ${
                layoutType === layout 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="w-full h-96 border border-gray-200 rounded-lg bg-gray-50"
      />
      
      {contacts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">No contacts yet</h3>
            <p className="text-sm text-gray-500">Add some contacts to see your network visualization</p>
          </div>
        </div>
      )}
      
      {/* Network Metrics */}
      {metrics && relationships.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-xs font-medium text-gray-900 mb-2">Network Metrics</h4>
          <div className="space-y-1 text-xs">
            <div>Density: {(metrics.density * 100).toFixed(1)}%</div>
            <div>Avg Connections: {metrics.clustering.toFixed(1)}</div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      {relationships.length > 0 && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-xs font-medium text-gray-900 mb-2">Relationship Types</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span>Family</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span>Friend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>Colleague</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-purple-500"></div>
              <span>Mentor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-yellow-500"></div>
              <span>Client</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
