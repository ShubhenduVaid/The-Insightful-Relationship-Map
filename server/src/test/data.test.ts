import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { setupTestDB } from './setup.js';
import authRoutes from '../routes/auth.js';
import dataRoutes from '../routes/data.js';

// Mock database connection
vi.mock('../config/database.js', () => ({
  getDB: vi.fn()
}));

const { getDB } = setupTestDB();

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);

// Mock the database connection
vi.mocked(await import('../config/database.js')).getDB.mockImplementation(() => getDB());

describe('Data Sync Routes', () => {
  const testUser = {
    email: 'test@example.com',
    salt: 'test-salt-123',
    authHash: 'test-auth-hash-456'
  };

  let authToken: string;

  beforeEach(async () => {
    // Register and login to get auth token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    authToken = registerResponse.body.token;
  });

  describe('PUT /api/sync', () => {
    it('should sync data successfully with valid token', async () => {
      const syncData = {
        dataBlob: 'encrypted-test-data-blob-123'
      };

      const response = await request(app)
        .put('/api/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send(syncData)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Data synchronized successfully',
        timestamp: expect.any(String)
      });
    });

    it('should return 401 without auth token', async () => {
      const syncData = {
        dataBlob: 'encrypted-test-data-blob-123'
      };

      const response = await request(app)
        .put('/api/sync')
        .send(syncData)
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Access token required'
      });
    });

    it('should return 403 with invalid token', async () => {
      const syncData = {
        dataBlob: 'encrypted-test-data-blob-123'
      };

      const response = await request(app)
        .put('/api/sync')
        .set('Authorization', 'Bearer invalid-token')
        .send(syncData)
        .expect(403);

      expect(response.body).toMatchObject({
        error: 'Invalid or expired token'
      });
    });

    it('should return 400 for missing dataBlob', async () => {
      const response = await request(app)
        .put('/api/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for empty dataBlob', async () => {
      const syncData = {
        dataBlob: ''
      };

      const response = await request(app)
        .put('/api/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send(syncData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should verify data persistence after sync', async () => {
      const syncData = {
        dataBlob: 'encrypted-test-data-blob-123'
      };

      // Sync data
      await request(app)
        .put('/api/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send(syncData)
        .expect(200);

      // Login again to verify data was saved
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          authHash: testUser.authHash
        })
        .expect(200);

      expect(loginResponse.body.dataBlob).toBe(syncData.dataBlob);
    });
  });
});
