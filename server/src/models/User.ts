import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  salt: string;
  authHash: string;
  dataBlob?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  salt: string;
  authHash: string;
}

export interface LoginData {
  email: string;
  authHash: string;
}

export interface SyncData {
  dataBlob: string;
}
