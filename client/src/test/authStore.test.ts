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
      salt: null,
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
      expect(state.salt).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('register', () => {
    it('should handle successful registration and store salt', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-jwt-token',
        message: 'User created successfully'
      }
      
      vi.mocked(authApi.register).mockResolvedValue(mockResponse)
      
      const { register } = useAuthStore.getState()
      await register('test@example.com', 'test-salt-123', 'mock-auth-hash')
      
      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockResponse.user)
      expect(state.token).toBe(mockResponse.token)
      expect(state.salt).toBe('test-salt-123')
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle registration failure and clear salt', async () => {
      const mockError = new Error('User already exists')
      vi.mocked(authApi.register).mockRejectedValue(mockError)
      
      const { register } = useAuthStore.getState()
      
      await expect(register('test@example.com', 'salt', 'hash')).rejects.toThrow('User already exists')
      
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.salt).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe('User already exists')
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
  })

  describe('logout', () => {
    it('should clear all user state including salt on logout', () => {
      // Set some authenticated state with salt
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token',
        salt: 'stored-salt',
        isAuthenticated: true
      })
      
      const { logout } = useAuthStore.getState()
      logout()
      
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.salt).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('persistence', () => {
    it('should persist salt in localStorage', () => {
      const testState = {
        user: { id: '1', email: 'test@example.com' },
        token: 'test-token',
        salt: 'test-salt',
        isAuthenticated: true
      }
      
      useAuthStore.setState(testState)
      
      // Check that salt is included in persisted state
      const persistedData = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      expect(persistedData.state.salt).toBe('test-salt')
      expect(persistedData.state.user).toEqual(testState.user)
      expect(persistedData.state.token).toBe(testState.token)
      expect(persistedData.state.isAuthenticated).toBe(true)
    })
  })
})
