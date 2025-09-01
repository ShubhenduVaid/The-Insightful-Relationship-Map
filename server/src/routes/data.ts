import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { syncSchema } from '../validation/schemas.js';
import { User } from '../models/User.js';

const router = express.Router();

// PUT /api/sync - Update user's encrypted data blob
router.put('/sync', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = syncSchema.parse(req.body);
    const { dataBlob } = validatedData;
    const userId = req.user!.userId;

    const db = getDB();
    const usersCollection = db.collection<User>('users');

    // Update user's data blob
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          dataBlob,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Data synchronized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
