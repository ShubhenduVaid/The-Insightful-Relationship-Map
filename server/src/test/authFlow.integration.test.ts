import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { setupTestDB } from './setup.js'
import authRoutes from '../routes/auth.js'
import dataRoutes from '../routes/data.js'

// Mock database connection
vi.mock('../config/database.js', () => ({
  getDB: vi.fn()
}))

const { getDB } = setupTestDB()

// Setup test app
const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api', dataRoutes)

// Mock the database connection
vi.mocked(await import('../config/database.js')).getDB.mockImplementation(() => getDB())

describe('Authentication Flow Integration', () => {
  const testUser = {
    email: 'integration@example.com',
    salt: 'integration-test-salt-123456789012345678901234567890123456789012345678901234567890',
    authHash: 'integration-test-auth-hash-456'
  }

  describe('Complete Registration to Login Flow', () => {
    it('should complete full registration and login cycle', async () => {
      // Step 1: Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)

      expect(registerResponse.body).toMatchObject({
        message: 'User created successfully',
        token: expect.any(String),
        user: {
          id: expect.any(String),
          email: testUser.email
        }
      })

      const userId = registerResponse.body.user.id
      const registerToken = registerResponse.body.token

      // Step 2: Verify user exists in database
      const usersCollection = getDB().collection('users')
      const storedUser = await usersCollection.findOne({ email: testUser.email })
      
      expect(storedUser).toBeTruthy()
      expect(storedUser?.email).toBe(testUser.email)
      expect(storedUser?.salt).toBe(testUser.salt)
      expect(storedUser?.authHash).toBe(testUser.authHash)
      expect(storedUser?.dataBlob).toBeUndefined()

      // Step 3: Login with same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          authHash: testUser.authHash
        })
        .expect(200)

      expect(loginResponse.body).toMatchObject({
        message: 'Login successful',
        token: expect.any(String),
        dataBlob: null,
        user: {
          id: userId,
          email: testUser.email
        }
      })

      // Tokens should be different (new login = new token)
      expect(loginResponse.body.token).not.toBe(registerToken)
    })

    it('should handle data synchronization after authentication', async () => {
      // Step 1: Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)

      const token = registerResponse.body.token
      const testDataBlob = 'encrypted-test-data-blob-for-integration'

      // Step 2: Sync data using auth token
      const syncResponse = await request(app)
        .put('/api/sync')
        .set('Authorization', `Bearer ${token}`)
        .send({ dataBlob: testDataBlob })
        .expect(200)

      expect(syncResponse.body).toMatchObject({
        message: 'Data synchronized successfully',
        timestamp: expect.any(String)
      })

      // Step 3: Login and verify data is returned
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          authHash: testUser.authHash
        })
        .expect(200)

      expect(loginResponse.body.dataBlob).toBe(testDataBlob)
    })
  })

  describe('Authentication Security', () => {
    it('should reject duplicate registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)

      // Second registration with same email
      const duplicateResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409)

      expect(duplicateResponse.body).toMatchObject({
        error: 'User already exists'
      })
    })

    it('should reject login with wrong auth hash', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)

      // Try login with wrong auth hash
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          authHash: 'wrong-auth-hash'
        })
        .expect(401)

      expect(loginResponse.body).toMatchObject({
        error: 'Invalid credentials'
      })
    })

    it('should reject login for non-existent user', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          authHash: 'any-hash'
        })
        .expect(401)

      expect(loginResponse.body).toMatchObject({
        error: 'Invalid credentials'
      })
    })

    it('should reject data sync without valid token', async () => {
      const syncResponse = await request(app)
        .put('/api/sync')
        .send({ dataBlob: 'test-data' })
        .expect(401)

      expect(syncResponse.body).toMatchObject({
        error: 'Access token required'
      })
    })

    it('should reject data sync with invalid token', async () => {
      const syncResponse = await request(app)
        .put('/api/sync')
        .set('Authorization', 'Bearer invalid-token')
        .send({ dataBlob: 'test-data' })
        .expect(403)

      expect(syncResponse.body).toMatchObject({
        error: 'Invalid or expired token'
      })
    })
  })

  describe('Input Validation', () => {
    it('should validate registration input', async () => {
      const invalidRegistrations = [
        { email: 'invalid-email', salt: 'salt', authHash: 'hash' },
        { email: 'test@example.com', salt: '', authHash: 'hash' },
        { email: 'test@example.com', salt: 'salt', authHash: '' },
        { salt: 'salt', authHash: 'hash' }, // missing email
      ]

      for (const invalidData of invalidRegistrations) {
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidData)
          .expect(400)

        expect(response.body.error).toBe('Validation failed')
      }
    })

    it('should validate login input', async () => {
      const invalidLogins = [
        { email: 'invalid-email', authHash: 'hash' },
        { email: 'test@example.com', authHash: '' },
        { authHash: 'hash' }, // missing email
      ]

      for (const invalidData of invalidLogins) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(invalidData)
          .expect(400)

        expect(response.body.error).toBe('Validation failed')
      }
    })

    it('should validate sync input', async () => {
      // Register and get token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)

      const token = registerResponse.body.token

      const invalidSyncs = [
        { dataBlob: '' }, // empty dataBlob
        {}, // missing dataBlob
      ]

      for (const invalidData of invalidSyncs) {
        const response = await request(app)
          .put('/api/sync')
          .set('Authorization', `Bearer ${token}`)
          .send(invalidData)
          .expect(400)

        expect(response.body.error).toBe('Validation failed')
      }
    })
  })

  describe('Database Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const usersCollection = getDB().collection('users')

      // Initial state: no users
      const initialCount = await usersCollection.countDocuments()
      expect(initialCount).toBe(0)

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)

      // Verify user count increased
      const afterRegisterCount = await usersCollection.countDocuments()
      expect(afterRegisterCount).toBe(1)

      // Verify user data
      const user = await usersCollection.findOne({ email: testUser.email })
      expect(user).toBeTruthy()
      expect(user?.createdAt).toBeInstanceOf(Date)
      expect(user?.updatedAt).toBeInstanceOf(Date)

      // Sync data
      const token = (await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, authHash: testUser.authHash })).body.token

      await request(app)
        .put('/api/sync')
        .set('Authorization', `Bearer ${token}`)
        .send({ dataBlob: 'test-data' })
        .expect(200)

      // Verify data was updated
      const updatedUser = await usersCollection.findOne({ email: testUser.email })
      expect(updatedUser?.dataBlob).toBe('test-data')
      expect(updatedUser?.updatedAt).toBeInstanceOf(Date)
      expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(user!.updatedAt.getTime())
    })
  })
})
