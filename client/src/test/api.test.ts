import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authApi, dataApi, ApiError } from '../services/api'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('authApi', () => {
    describe('login', () => {
      it('should make POST request to /api/auth/login', async () => {
        const mockResponse = {
          user: { id: '1', email: 'test@example.com' },
          token: 'mock-token',
          message: 'Login successful'
        }

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })

        const result = await authApi.login({
          email: 'test@example.com',
          authHash: 'mock-hash'
        })

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'test@example.com',
              authHash: 'mock-hash'
            })
          }
        )

        expect(result).toEqual(mockResponse)
      })

      it('should throw ApiError on HTTP error', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Invalid credentials' })
        })

        await expect(authApi.login({
          email: 'test@example.com',
          authHash: 'wrong-hash'
        })).rejects.toThrow(ApiError)

        try {
          await authApi.login({
            email: 'test@example.com',
            authHash: 'wrong-hash'
          })
        } catch (error) {
          expect(error).toBeInstanceOf(ApiError)
          expect((error as ApiError).status).toBe(401)
          expect((error as ApiError).message).toBe('Invalid credentials')
        }
      })
    })

    describe('register', () => {
      it('should make POST request to /api/auth/register', async () => {
        const mockResponse = {
          user: { id: '1', email: 'test@example.com' },
          token: 'mock-token',
          message: 'User created successfully'
        }

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })

        const result = await authApi.register({
          email: 'test@example.com',
          salt: 'mock-salt',
          authHash: 'mock-hash'
        })

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'test@example.com',
              salt: 'mock-salt',
              authHash: 'mock-hash'
            })
          }
        )

        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('dataApi', () => {
    describe('sync', () => {
      it('should make PUT request to /api/sync with auth header', async () => {
        const mockResponse = {
          message: 'Data synchronized successfully',
          timestamp: '2024-01-01T00:00:00.000Z'
        }

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })

        const result = await dataApi.sync('encrypted-data-blob', 'mock-token')

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/sync',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer mock-token'
            },
            body: JSON.stringify({
              dataBlob: 'encrypted-data-blob'
            })
          }
        )

        expect(result).toEqual(mockResponse)
      })

      it('should throw ApiError on unauthorized request', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Access token required' })
        })

        await expect(dataApi.sync('data', 'invalid-token')).rejects.toThrow(ApiError)
      })
    })
  })

  describe('error handling', () => {
    it('should throw ApiError with network error on fetch failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(authApi.login({
        email: 'test@example.com',
        authHash: 'hash'
      })).rejects.toThrow(ApiError)

      try {
        await authApi.login({
          email: 'test@example.com',
          authHash: 'hash'
        })
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).status).toBe(0)
        expect((error as ApiError).message).toBe('Network error')
      }
    })

    it('should handle response without error message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      })

      try {
        await authApi.login({
          email: 'test@example.com',
          authHash: 'hash'
        })
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).message).toBe('Request failed')
      }
    })
  })
})
