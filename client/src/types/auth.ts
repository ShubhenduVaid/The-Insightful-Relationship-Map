export interface User {
  id: string
  email: string
}

export interface LoginRequest {
  email: string
  authHash: string
}

export interface RegisterRequest {
  email: string
  salt: string
  authHash: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
  dataBlob?: string | null
}
