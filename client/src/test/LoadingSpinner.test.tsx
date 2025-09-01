import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('w-8', 'h-8', 'animate-spin')
  })

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('w-4', 'h-4')
  })

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    
    const container = screen.getByTestId('loading-container')
    expect(container).toHaveClass('custom-class')
  })

  it('should have proper accessibility attributes', () => {
    render(<LoadingSpinner />)
    
    const container = screen.getByTestId('loading-container')
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen')
  })
})
