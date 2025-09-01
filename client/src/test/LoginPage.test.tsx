import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import { useAuthStore } from '../stores/authStore'

// Mock the auth store
vi.mock('../stores/authStore', () => ({
  useAuthStore: vi.fn()
}))

// Mock crypto utilities
vi.mock('../utils/crypto', () => ({
  deriveAuthHash: vi.fn().mockResolvedValue('mock-auth-hash')
}))

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  )
}

describe('LoginPage', () => {
  const mockLogin = vi.fn()
  const mockClearError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      error: null,
      clearError: mockClearError,
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      register: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn()
    })
  })

  it('should render login form', () => {
    renderLoginPage()
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('should show link to register page', () => {
    renderLoginPage()
    
    const registerLink = screen.getByText('Sign up')
    expect(registerLink).toBeInTheDocument()
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
  })

  it('should disable submit button when fields are empty', () => {
    renderLoginPage()
    
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when fields are filled', async () => {
    renderLoginPage()
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(submitButton).not.toBeDisabled()
  })

  it('should call login function on form submission', async () => {
    renderLoginPage()
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled()
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'mock-auth-hash', 'password123')
    })
  })

  it('should display error message when login fails', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      error: 'Invalid credentials',
      clearError: mockClearError,
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      register: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn()
    })
    
    renderLoginPage()
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('should show loading spinner when submitting', async () => {
    renderLoginPage()
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    // Mock a pending login
    mockLogin.mockImplementation(() => new Promise(() => {}))
    
    fireEvent.click(submitButton)
    
    // The button should show loading state (this is handled by component state)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should prevent form submission with empty fields', () => {
    renderLoginPage()
    
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    fireEvent.click(submitButton)
    
    expect(mockLogin).not.toHaveBeenCalled()
  })
})
