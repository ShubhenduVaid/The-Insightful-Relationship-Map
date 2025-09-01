// Simple test script to verify server setup
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing server configuration...');
console.log('PORT:', process.env.PORT || '5001');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

if (!process.env.MONGO_URI) {
  console.log('\n⚠️  Please create a .env file in the server directory with:');
  console.log('MONGO_URI=mongodb://localhost:27017/strategy-engine');
  console.log('JWT_SECRET=your_super_secret_key_here');
  console.log('PORT=5001');
  console.log('NODE_ENV=development');
}
