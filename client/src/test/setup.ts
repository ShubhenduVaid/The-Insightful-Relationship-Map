import { beforeAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock crypto for tests
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    subtle: {
      importKey: vi.fn().mockResolvedValue({}),
      encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      decrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32))
    }
  }
})

// Mock TextEncoder/TextDecoder
Object.defineProperty(global, 'TextEncoder', {
  value: class TextEncoder {
    encode(str: string) {
      return new Uint8Array(str.split('').map(char => char.charCodeAt(0)))
    }
  }
})

Object.defineProperty(global, 'TextDecoder', {
  value: class TextDecoder {
    decode(arr: Uint8Array) {
      return String.fromCharCode(...arr)
    }
  }
})

// Mock btoa/atob
Object.defineProperty(global, 'btoa', {
  value: (str: string) => Buffer.from(str, 'binary').toString('base64')
})

Object.defineProperty(global, 'atob', {
  value: (str: string) => Buffer.from(str, 'base64').toString('binary')
})

beforeAll(() => {
  // Setup any global test configuration
})

afterEach(() => {
  cleanup()
})
