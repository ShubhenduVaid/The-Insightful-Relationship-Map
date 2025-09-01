import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Navigation() {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
              Personal Strategy Engine
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/contacts"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/contacts')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contacts
            </Link>
            <Link
              to="/network"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/network')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Network
            </Link>
            <span className="text-sm text-gray-700">
              Welcome, {user?.email}
            </span>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
