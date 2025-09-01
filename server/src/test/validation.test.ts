import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, syncSchema } from '../validation/schemas.js';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        salt: 'valid-salt-123',
        authHash: 'valid-auth-hash-456'
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        salt: 'valid-salt-123',
        authHash: 'valid-auth-hash-456'
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const invalidData = {
        salt: 'valid-salt-123',
        authHash: 'valid-auth-hash-456'
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty salt', () => {
      const invalidData = {
        email: 'test@example.com',
        salt: '',
        authHash: 'valid-auth-hash-456'
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty authHash', () => {
      const invalidData = {
        email: 'test@example.com',
        salt: 'valid-salt-123',
        authHash: ''
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        authHash: 'valid-auth-hash-456'
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        authHash: 'valid-auth-hash-456'
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing authHash', () => {
      const invalidData = {
        email: 'test@example.com'
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('syncSchema', () => {
    it('should validate correct sync data', () => {
      const validData = {
        dataBlob: 'encrypted-data-blob-123'
      };

      const result = syncSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject empty dataBlob', () => {
      const invalidData = {
        dataBlob: ''
      };

      const result = syncSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing dataBlob', () => {
      const invalidData = {};

      const result = syncSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
