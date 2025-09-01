import { describe, it, expect, beforeAll } from 'vitest';
import { ObjectId } from 'mongodb';
import { generateToken, verifyToken } from '../utils/jwt.js';

describe('JWT Utilities', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = new ObjectId();
      const email = 'test@example.com';
      
      const token = generateToken(userId, email);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const userId = new ObjectId();
      const email = 'test@example.com';
      
      const token = generateToken(userId, email);
      const payload = verifyToken(token);
      
      expect(payload).toMatchObject({
        userId: userId.toString(),
        email: email
      });
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';
      
      expect(() => verifyToken(malformedToken)).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => verifyToken('')).toThrow();
    });
  });

  describe('token roundtrip', () => {
    it('should maintain data integrity through generate/verify cycle', () => {
      const userId = new ObjectId();
      const email = 'roundtrip@example.com';
      
      const token = generateToken(userId, email);
      const payload = verifyToken(token);
      
      expect(payload.userId).toBe(userId.toString());
      expect(payload.email).toBe(email);
      expect(payload).toHaveProperty('iat'); // issued at
      expect(payload).toHaveProperty('exp'); // expires at
    });
  });
});
