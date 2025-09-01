import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState()
      
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('login', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-jwt-token',
        message: 'Login successful'
      }
      
      vi.mocked(authApi.login).mockResolvedValue(mockResponse)
      
      const { login } = useAuthStore.getState()
      await login('test@example.com', 'mock-auth-hash')
      
      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockResponse.user)
      expect(state.token).toBe(mockResponse.token)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials')
      vi.mocked(authApi.login).mockRejectedValue(mockError)
      
      const { login } = useAuthStore.getState()
      
      await expect(login('test@example.com', 'wrong-hash')).rejects.toThrow('Invalid credentials')
      
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Invalid credentials')
    })

    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve
      })
      
      vi.mocked(authApi.login).mockReturnValue(loginPromise)
      
      const { login } = useAuthStore.getState()
      const loginCall = login('test@example.com', 'mock-hash')
      
      // Check loading state is set
      expect(useAuthStore.getState().isLoading).toBe(true)
      
      // Resolve the promise
      resolveLogin!({
        user: { id: '1', email: 'test@example.com' },
        token: 'token',
        message: 'Success'
      })
      
      await loginCall
      
      // Check loading state is cleared
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('register', () => {
    it('should handle successful registration', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-jwt-token',
        message: 'User created successfully'
      }
      
      vi.mocked(authApi.register).mockResolvedValue(mockResponse)
      
      const { register } = useAuthStore.getState()
      await register('test@example.com', 'mock-salt', 'mock-auth-hash')
      
      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockResponse.user)
      expect(state.token).toBe(mockResponse.token)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle registration failure', async () => {
      const mockError = new Error('User already exists')
      vi.mocked(authApi.register).mockRejectedValue(mockError)
      
      const { register } = useAuthStore.getState()
      
      await expect(register('test@example.com', 'salt', 'hash')).rejects.toThrow('User already exists')
      
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe('User already exists')
    })
  })

  describe('logout', () => {
    it('should clear user state on logout', () => {
      // Set some authenticated state
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token',
        isAuthenticated: true
      })
      
      const { logout } = useAuthStore.getState()
      logout()
      
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('utility actions', () => {
    it('should clear error', () => {
      useAuthStore.setState({ error: 'Some error' })
      
      const { clearError } = useAuthStore.getState()
      clearError()
      
      expect(useAuthStore.getState().error).toBeNull()
    })

    it('should set loading state', () => {
      const { setLoading } = useAuthStore.getState()
      
      setLoading(true)
      expect(useAuthStore.getState().isLoading).toBe(true)
      
      setLoading(false)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })
})
