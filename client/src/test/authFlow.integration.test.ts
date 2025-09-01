import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../stores/authStore'
import { generateSalt, deriveAuthHash } from '../utils/crypto'
import { authApi } from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn()
  }
}))

describe('Authentication Flow Integration', () => {
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
    localStorage.clear()
  })

  describe('Complete Registration Flow', () => {
    it('should complete full registration with crypto operations', async () => {
      const email = 'test@example.com'
      const password = 'testpassword123'
      
      // Mock successful registration response
      const mockResponse = {
        user: { id: '1', email },
        token: 'mock-jwt-token',
        message: 'User created successfully'
      }
      vi.mocked(authApi.register).mockResolvedValue(mockResponse)
      
      // Simulate registration flow
      const salt = generateSalt()
      const authHash = await deriveAuthHash(password, salt)
      
      const { register } = useAuthStore.getState()
      await register(email, salt, authHash)
      
      // Verify state after registration
      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockResponse.user)
      expect(state.token).toBe(mockResponse.token)
      expect(state.salt).toBe(salt)
      expect(state.isAuthenticated).toBe(true)
      expect(state.error).toBeNull()
      
      // Verify API was called with correct parameters
      expect(authApi.register).toHaveBeenCalledWith({
        email,
        salt,
        authHash
      })
      
      // Verify persistence
      const persistedData = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      expect(persistedData.state.salt).toBe(salt)
      expect(persistedData.state.isAuthenticated).toBe(true)
    })
  })

  describe('Complete Login Flow', () => {
    it('should complete login flow using stored salt', async () => {
      const email = 'test@example.com'
      const password = 'testpassword123'
      const storedSalt = 'stored-salt-from-registration'
      
      // Setup: User has previously registered (salt is stored)
      useAuthStore.setState({
        salt: storedSalt,
        isAuthenticated: false
      })
      
      // Mock successful login response
      const mockResponse = {
        user: { id: '1', email },
        token: 'mock-jwt-token',
        message: 'Login successful'
      }
      vi.mocked(authApi.login).mockResolvedValue(mockResponse)
      
      // Simulate login flow
      const authHash = await deriveAuthHash(password, storedSalt)
      
      const { login } = useAuthStore.getState()
      await login(email, authHash)
      
      // Verify state after login
      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockResponse.user)
      expect(state.token).toBe(mockResponse.token)
      expect(state.isAuthenticated).toBe(true)
      expect(state.error).toBeNull()
      
      // Verify API was called with correct auth hash
      expect(authApi.login).toHaveBeenCalledWith({
        email,
        authHash
      })
    })

    it('should handle login without stored salt (demo mode)', async () => {
      const email = 'test@example.com'
      const password = 'testpassword123'
      
      // No stored salt (new user trying to login)
      expect(useAuthStore.getState().salt).toBeNull()
      
      // Mock successful login response
      const mockResponse = {
        user: { id: '1', email },
        token: 'mock-jwt-token',
        message: 'Login successful'
      }
      vi.mocked(authApi.login).mockResolvedValue(mockResponse)
      
      // Simulate fallback salt derivation (as done in LoginPage)
      const fallbackSalt = Array.from(new TextEncoder().encode(email))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .substring(0, 64)
        .padEnd(64, '0')
      
      const authHash = await deriveAuthHash(password, fallbackSalt)
      
      const { login } = useAuthStore.getState()
      await login(email, authHash)
      
      // Verify login succeeded with fallback salt
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(mockResponse.user)
    })
  })

  describe('Registration to Login Flow', () => {
    it('should allow login after registration using stored salt', async () => {
      const email = 'test@example.com'
      const password = 'testpassword123'
      
      // Step 1: Registration
      const salt = generateSalt()
      const authHash = await deriveAuthHash(password, salt)
      
      vi.mocked(authApi.register).mockResolvedValue({
        user: { id: '1', email },
        token: 'register-token',
        message: 'User created successfully'
      })
      
      const { register } = useAuthStore.getState()
      await register(email, salt, authHash)
      
      // Verify registration stored salt
      expect(useAuthStore.getState().salt).toBe(salt)
      
      // Step 2: Logout (simulate user closing app)
      const { logout } = useAuthStore.getState()
      logout()
      
      // Verify logout cleared auth but salt persists
      const stateAfterLogout = useAuthStore.getState()
      expect(stateAfterLogout.isAuthenticated).toBe(false)
      expect(stateAfterLogout.user).toBeNull()
      expect(stateAfterLogout.token).toBeNull()
      expect(stateAfterLogout.salt).toBe(salt) // Salt persists for future logins
      
      // Step 3: Simulate app restart - restore from localStorage
      const persistedData = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      expect(persistedData.state.salt).toBe(salt) // Salt should be persisted
      
      // Restore the persisted state (simulating app restart)
      useAuthStore.setState({
        ...useAuthStore.getState(),
        salt: persistedData.state.salt,
        user: persistedData.state.user,
        token: persistedData.state.token,
        isAuthenticated: persistedData.state.isAuthenticated
      })
      
      const storedSalt = useAuthStore.getState().salt
      expect(storedSalt).toBe(salt)
      
      const loginAuthHash = await deriveAuthHash(password, storedSalt!)
      
      const { login } = useAuthStore.getState()
      await login(email, loginAuthHash)
      
      // Verify successful login
      const finalState = useAuthStore.getState()
      expect(finalState.isAuthenticated).toBe(true)
      expect(finalState.user?.email).toBe(email)
      expect(finalState.token).toBe('mock-jwt-token')
    })
  })

  describe('Error Handling', () => {
    it('should handle registration errors gracefully', async () => {
      const email = 'existing@example.com'
      const password = 'testpassword123'
      
      vi.mocked(authApi.register).mockRejectedValue(new Error('User already exists'))
      
      const salt = generateSalt()
      const authHash = await deriveAuthHash(password, salt)
      
      const { register } = useAuthStore.getState()
      
      await expect(register(email, salt, authHash)).rejects.toThrow('User already exists')
      
      // Verify error state
      const state = useAuthStore.getState()
      expect(state.error).toBe('User already exists')
      expect(state.isAuthenticated).toBe(false)
      expect(state.salt).toBeNull()
    })

    it('should handle login errors gracefully', async () => {
      const email = 'test@example.com'
      const password = 'wrongpassword'
      
      vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'))
      
      const salt = generateSalt()
      const authHash = await deriveAuthHash(password, salt)
      
      const { login } = useAuthStore.getState()
      
      await expect(login(email, authHash)).rejects.toThrow('Invalid credentials')
      
      // Verify error state
      const state = useAuthStore.getState()
      expect(state.error).toBe('Invalid credentials')
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
    })
  })
})
