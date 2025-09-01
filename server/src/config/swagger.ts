import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Strategy Engine API',
      version: '1.0.0',
      description: 'Zero-knowledge personal relationship mapping and social network analysis API',
      contact: {
        name: 'Shubhendu Vaid',
        email: 'shubhendu.vaid@gmail.com',
        url: 'https://github.com/ShubhenduVaid/personal-strategy-engine'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            email: { type: 'string', format: 'email', description: 'User email' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'salt', 'authHash'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email' },
            salt: { type: 'string', description: 'Cryptographic salt for key derivation' },
            authHash: { type: 'string', description: 'PBKDF2 hash for authentication' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'authHash'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email' },
            authHash: { type: 'string', description: 'PBKDF2 hash for authentication' }
          }
        },
        SyncRequest: {
          type: 'object',
          required: ['dataBlob'],
          properties: {
            dataBlob: { type: 'string', description: 'Encrypted user data blob (AES-256-GCM)' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string', description: 'JWT token' },
            user: { $ref: '#/components/schemas/User' },
            dataBlob: { type: 'string', nullable: true, description: 'Encrypted user data (login only)' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            details: { type: 'object', description: 'Additional error details' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Path to the API files
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
