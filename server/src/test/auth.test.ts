import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { setupTestDB } from './setup.js';
import authRoutes from '../routes/auth.js';

// Mock database connection
vi.mock('../config/database.js', () => ({
  getDB: vi.fn()
}));

const { getDB } = setupTestDB();

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock the database connection
vi.mocked(await import('../config/database.js')).getDB.mockImplementation(() => getDB());

describe('Authentication Routes', () => {
  const testUser = {
    email: 'test@example.com',
    salt: 'test-salt-123',
    authHash: 'test-auth-hash-456'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'User created successfully',
        token: expect.any(String),
        user: {
          id: expect.any(String),
          email: testUser.email
        }
      });
    });

    it('should return 409 if user already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body).toMatchObject({
        error: 'User already exists'
      });
    });

    it('should return 400 for invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for missing fields', async () => {
      const incompleteUser = { email: testUser.email };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register user before login tests
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: testUser.email,
        authHash: testUser.authHash
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Login successful',
        token: expect.any(String),
        dataBlob: null,
        user: {
          id: expect.any(String),
          email: testUser.email
        }
      });
    });

    it('should return 401 for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        authHash: testUser.authHash
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Invalid credentials'
      });
    });

    it('should return 401 for incorrect auth hash', async () => {
      const loginData = {
        email: testUser.email,
        authHash: 'wrong-auth-hash'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Invalid credentials'
      });
    });

    it('should return 400 for invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        authHash: testUser.authHash
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });
});
