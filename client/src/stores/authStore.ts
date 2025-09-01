import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../services/api'
import type { User } from '../types/auth'

interface AuthState {
  user: User | null
  token: string | null
  salt: string | null // Store salt for login
  sessionPassword?: string | null // Store password in memory for auto-sync
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, authHash: string, password?: string) => Promise<void>
  register: (email: string, salt: string, authHash: string, password?: string) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      salt: null,
      sessionPassword: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, authHash: string, password?: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApi.login({ email, authHash })
          
          set({
            user: response.user,
            token: response.token,
            sessionPassword: password, // Store for auto-sync
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          })
          throw error
        }
      },

      register: async (email: string, salt: string, authHash: string, password?: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApi.register({ email, salt, authHash })
          
          set({
            user: response.user,
            token: response.token,
            salt, // Store salt for future logins
            sessionPassword: password, // Store for auto-sync
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
            salt: null
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          sessionPassword: null, // Clear password from memory
          isAuthenticated: false,
          error: null
          // Keep salt for future logins
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        salt: state.salt,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
