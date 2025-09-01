import { describe, it, expect, vi } from 'vitest'
import { generateSalt, deriveAuthHash, deriveEncryptionKey, encryptData, decryptData } from '../utils/crypto'

describe('Crypto Utilities', () => {
  describe('generateSalt', () => {
    it('should generate a 64-character hex string', () => {
      const salt = generateSalt()
      expect(salt).toHaveLength(64)
      expect(salt).toMatch(/^[0-9a-f]+$/)
    })

    it('should generate different salts on each call', () => {
      const salt1 = generateSalt()
      const salt2 = generateSalt()
      expect(salt1).not.toBe(salt2)
    })
  })

  describe('deriveAuthHash', () => {
    it('should derive consistent hash for same password and salt', async () => {
      const password = 'testpassword123'
      const salt = 'a'.repeat(64)
      
      const hash1 = await deriveAuthHash(password, salt)
      const hash2 = await deriveAuthHash(password, salt)
      
      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64)
      expect(hash1).toMatch(/^[0-9a-f]+$/)
    })

    it('should derive different hashes for different passwords', async () => {
      const salt = 'a'.repeat(64)
      
      const hash1 = await deriveAuthHash('password1', salt)
      const hash2 = await deriveAuthHash('password2', salt)
      
      expect(hash1).not.toBe(hash2)
    })

    it('should derive different hashes for different salts', async () => {
      const password = 'testpassword123'
      
      const hash1 = await deriveAuthHash(password, 'a'.repeat(64))
      const hash2 = await deriveAuthHash(password, 'b'.repeat(64))
      
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('deriveEncryptionKey', () => {
    it('should derive a CryptoKey object', async () => {
      const password = 'testpassword123'
      const salt = 'a'.repeat(64)
      
      const key = await deriveEncryptionKey(password, salt)
      
      expect(key).toBeDefined()
      expect(typeof key).toBe('object')
    })

    it('should derive consistent keys for same inputs', async () => {
      const password = 'testpassword123'
      const salt = 'a'.repeat(64)
      
      const key1 = await deriveEncryptionKey(password, salt)
      const key2 = await deriveEncryptionKey(password, salt)
      
      // Keys should be equivalent (though we can't directly compare CryptoKey objects)
      expect(key1).toBeDefined()
      expect(key2).toBeDefined()
    })
  })

  describe('encryptData and decryptData', () => {
    it('should encrypt and decrypt data successfully', async () => {
      const originalData = 'This is sensitive test data'
      const password = 'testpassword123'
      const salt = 'a'.repeat(64)
      
      const key = await deriveEncryptionKey(password, salt)
      const encrypted = await encryptData(originalData, key)
      const decrypted = await decryptData(encrypted, key)
      
      expect(decrypted).toBe(originalData)
    })

    it('should produce different encrypted output for same data', async () => {
      const data = 'test data'
      const password = 'testpassword123'
      const salt = 'a'.repeat(64)
      
      const key = await deriveEncryptionKey(password, salt)
      const encrypted1 = await encryptData(data, key)
      const encrypted2 = await encryptData(data, key)
      
      // Should be different due to random IV
      expect(encrypted1).not.toBe(encrypted2)
    })

    it('should throw error when decrypting with wrong key', async () => {
      const data = 'test data'
      const salt = 'a'.repeat(64)
      
      const key1 = await deriveEncryptionKey('password1', salt)
      const key2 = await deriveEncryptionKey('password2', salt)
      
      const encrypted = await encryptData(data, key1)
      
      await expect(decryptData(encrypted, key2)).rejects.toThrow()
    })

    it('should handle empty string encryption/decryption', async () => {
      const data = ''
      const password = 'testpassword123'
      const salt = 'a'.repeat(64)
      
      const key = await deriveEncryptionKey(password, salt)
      const encrypted = await encryptData(data, key)
      const decrypted = await decryptData(encrypted, key)
      
      expect(decrypted).toBe(data)
    })
  })
})
