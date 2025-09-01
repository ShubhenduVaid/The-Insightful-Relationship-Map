import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';
import { beforeAll, afterAll, beforeEach } from 'vitest';

// Set environment variables before any imports that might use them
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let db: Db;

export const setupTestDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('test-strategy-engine');
    
    // Set test environment variables
    process.env.MONGO_URI = uri;
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    // Clean up collections before each test
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  });

  return { getDB: () => db, getClient: () => client };
};
