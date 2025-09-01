import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  salt: z.string().min(1, 'Salt is required'),
  authHash: z.string().min(1, 'Auth hash is required')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  authHash: z.string().min(1, 'Auth hash is required')
});

export const syncSchema = z.object({
  dataBlob: z.string().min(1, 'Data blob is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SyncInput = z.infer<typeof syncSchema>;
