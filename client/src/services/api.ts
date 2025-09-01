import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Request failed')
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, 'Network error')
  }
}

function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`
  }
}

export const authApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const dataApi = {
  async sync(dataBlob: string, token: string): Promise<{ message: string; timestamp: string }> {
    return apiRequest('/api/sync', {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataBlob }),
    })
  }
}

export { ApiError }
