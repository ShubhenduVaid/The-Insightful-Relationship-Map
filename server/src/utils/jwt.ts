import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const getJWTSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return JWT_SECRET;
};

export interface JWTPayload {
  userId: string;
  email: string;
}

export const generateToken = (userId: ObjectId, email: string): string => {
  return jwt.sign(
    { userId: userId.toString(), email },
    getJWTSecret(),
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, getJWTSecret()) as JWTPayload;
};
