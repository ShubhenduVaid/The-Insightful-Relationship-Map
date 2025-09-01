import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { syncSchema } from '../validation/schemas.js';
import { User } from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * /api/sync:
 *   put:
 *     summary: Synchronize encrypted user data
 *     description: Updates the user's encrypted data blob on the server
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SyncRequest'
 *           example:
 *             dataBlob: "encrypted_aes_256_gcm_data_blob..."
 *     responses:
 *       200:
 *         description: Data synchronized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data synchronized successfully"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Access token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
