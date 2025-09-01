import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../validation/schemas.js';
import { User, CreateUserData } from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, salt, authHash } = validatedData;

    const db = getDB();
    const usersCollection = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const userData: CreateUserData = {
      email,
      salt,
      authHash
    };

    const newUser: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    const token = generateToken(result.insertedId, email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertedId,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, authHash } = validatedData;

    const db = getDB();
    const usersCollection = db.collection<User>('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify auth hash
    if (user.authHash !== authHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id!, email);

    res.json({
      message: 'Login successful',
      token,
      dataBlob: user.dataBlob || null,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
