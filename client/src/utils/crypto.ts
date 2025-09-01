import { pbkdf2 } from '@noble/hashes/pbkdf2'
import { sha256 } from '@noble/hashes/sha256'

const PBKDF2_ITERATIONS = 600000
const SALT_LENGTH = 32
const KEY_LENGTH = 32

/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt(): string {
  const salt = new Uint8Array(SALT_LENGTH)
  crypto.getRandomValues(salt)
  return Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Derive authentication hash from password and salt using PBKDF2
 */
export async function deriveAuthHash(password: string, salt: string): Promise<string> {
  const saltBytes = new Uint8Array(salt.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))
  const hash = pbkdf2(sha256, password, saltBytes, { c: PBKDF2_ITERATIONS, dkLen: KEY_LENGTH })
  return Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Derive encryption key from password and salt using PBKDF2
 */
export async function deriveEncryptionKey(password: string, salt: string): Promise<CryptoKey> {
  const saltBytes = new Uint8Array(salt.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))
  const keyMaterial = pbkdf2(sha256, password, saltBytes, { c: PBKDF2_ITERATIONS, dkLen: KEY_LENGTH })
  
  return crypto.subtle.importKey(
    'raw',
    new Uint8Array(keyMaterial),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for GCM
  const encodedData = new TextEncoder().encode(data)
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  )
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  try {
    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    )
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )
    
    return new TextDecoder().decode(decrypted)
  } catch (error) {
    throw new Error('Failed to decrypt data. Invalid key or corrupted data.')
  }
}
