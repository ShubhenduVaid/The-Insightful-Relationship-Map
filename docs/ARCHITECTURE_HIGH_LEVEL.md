# High-Level Architecture Document

## Phase 1: The Insightful Relationship Map (MVP) - ✅ IMPLEMENTED

**Document Details:**

- Version: 2.0
- Status: ✅ **IMPLEMENTED AND OPERATIONAL**
- Author: Shubhendu Vaid
- Date: September 1, 2025
- Implementation Status: **Complete with 151 tests passing**

## 1. Overview - ✅ DELIVERED

The high-level system architecture for the "Insightful Relationship Map" MVP has been **successfully implemented and tested**. The zero-knowledge security principle has been fully realized with all encryption and decryption operations happening exclusively on the client-side.

**✅ Architecture Achievements:**
- Complete zero-knowledge implementation with AES-256-GCM encryption
- Client-side Social Network Analysis with Cytoscape.js visualization  
- Auto-sync system with session-based password storage
- 151 comprehensive tests validating all architectural components

## 2. Architectural Principles - ✅ IMPLEMENTED

- ✅ **Zero-Knowledge**: Server has zero access to user passwords or decrypted data
- ✅ **Client-Side Sovereignty**: All SNA, encryption, and data processing on client
- ✅ **Stateless Backend**: JWT-based authentication with no session storage
- ✅ **Minimalist Server**: Simple encrypted blob storage with authentication
- ✅ **Auto-Sync**: Seamless background synchronization with session passwords

## 3. System Components - ✅ OPERATIONAL

The architecture has been successfully implemented with three primary components:

```
+------------------------------------------------+       +------------------------+       +-----------------+
|              CLIENT APPLICATION                |       |      BACKEND API       |       |    DATABASE     |
|                                                |       |                        |       |                 |
| ✅ React 18 + TypeScript + Vite               |◄─────►| ✅ Express.js + JWT    |◄─────►| ✅ MongoDB      |
| ✅ Zustand State Management                    |       | ✅ Zod Validation      |       | ✅ Encrypted    |
| ✅ Cytoscape.js Network Visualization         |       | ✅ OpenAPI Docs        |       |    Data Blobs   |
| ✅ Web Crypto API (AES-256-GCM)               |       | ✅ CORS + Helmet       |       | ✅ User Metadata|
| ✅ Auto-Sync with Session Passwords           |       | ✅ Rate Limiting       |       | ✅ Indexed      |
| ✅ Social Network Analysis Engine             |       |                        |       |    Queries      |
| ✅ Professional UI (Tailwind + Radix)        |       |                        |       |                 |
+------------------------------------------------+       +------------------------+       +-----------------+
```
|              Client Application                |       |      Backend API       |       |    Database     |
|            (Browser - SPA)                     |       |   (e.g., Node.js, Go)  |       | (e.g., MongoDB) |
|                                                |       |                        |       |                 |
| +------------------+  +--------------------+   |       | +------------------+   |       | +-------------+ |
| |   UI/View Layer  |  | Cryptography Module|   |------>| |  Authentication  |   |------>| | User Store  | |
| |     (React)      |  | (Web Crypto API)   |   |       | |    Endpoint      |   |       | (email, hash)| |
| +------------------+  +--------------------+   |       | +------------------+   |       | +-------------+ |
| |                  |  |                    |   |       | |                  |   |       | |             | |
| +------------------+  +--------------------+   |       | +------------------+   |       | +-------------+ |
| | Data Management  |  |    SNA Module      |   |<------| |   Data Sync      |   |<------| | Encrypted   | |
| |(In-memory JSON)  |  |  (Cytoscape.js)    |   |       | |   Endpoint       |   |       | | Data Blob   | |
| +------------------+  +--------------------+   |       | +------------------+   |       | +-------------+ |
+------------------------------------------------+       +------------------------+       +-----------------+
```

## 4. Component Breakdown

### 4.1. Client Application (Single Page Application)

The client is the core of the system, where all user data is handled in its unencrypted form.

- **UI/View Layer**: Renders the user interface, including the contact management forms and the interactive network graph.
- **Data Management**: Manages the application's state, holding the user's entire data vault (contacts, interactions, etc.) as a plaintext JSON object in memory for the duration of a session.
- **Cryptography Module**: The security core of the client. It is responsible for:
  - Deriving the authentication hash and encryption key from the user's master password and a salt.
  - Encrypting the entire data vault into a single blob before sending it to the server.
  - Decrypting the data blob received from the server upon login.
- **SNA Module**:
  - Transforms the in-memory JSON data into a graph structure.
  - Performs all Social Network Analysis calculations (e.g., centrality, tie strength) locally within the browser.
  - Interfaces with the graph visualization library (e.g., Cytoscape.js) to render the network map.

### 4.2. Backend API

A lightweight service that acts as a gatekeeper and storage facilitator. It never handles unencrypted data.

- **Authentication Endpoint**: Manages user registration and login. It only ever sees the user's email, salt, and a hashed version of the master password. It never sees the master password itself.
- **Data Sync Endpoint**: Provides simple Create, Read, Update, Delete (CRUD) operations for a single encrypted data blob per user. It cannot read or interpret the contents of this blob.

### 4.3. Database

A simple data store for user accounts and their encrypted data.

- **User Store**: A collection that stores user account information: email, password salt, and the authentication hash.
- **Encrypted Data Blob**: The user's entire data vault, stored as a single, opaque, encrypted text or binary field.

## 5. Key Data Flows

### 5.1. User Registration Flow

This flow ensures the user's master password never leaves their device.

1. **Client**: User enters email and master password.
2. **Client**: Generates a random salt.
3. **Client**: Derives an authHash from the password and salt using PBKDF2-SHA256.
4. **Client → Server**: Sends email, salt, and authHash to the API.
5. **Server → Database**: Stores the new user record.

### 5.2. User Login and Data Decryption Flow

This flow retrieves the encrypted data and makes it available for use on the client.

1. **Client**: User enters email and master password.
2. **Client → Server**: Requests the salt for the given email.
3. **Server → Client**: Returns the salt.
4. **Client**: Re-computes the authHash using the entered password and the salt.
5. **Client → Server**: Sends email and the computed authHash to the login endpoint.
6. **Server**: Verifies the hash. If it matches, it retrieves the user's dataBlob from the database.
7. **Server → Client**: Sends the encrypted dataBlob to the client.
8. **Client**: Derives the encryptionKey from the master password and salt.
9. **Client**: Uses the encryptionKey to decrypt the dataBlob into a plaintext JSON object in memory using AES-256. The application is now ready for use.

### 5.3. Data Modification and Sync Flow

This flow ensures that any changes are saved back to the server securely.

1. **Client**: User modifies data (e.g., adds a new contact). The in-memory JSON object is updated.
2. **Client**: When the user initiates a save/sync, the Cryptography Module re-encrypts the entire in-memory JSON object into a new dataBlob.
3. **Client → Server**: Sends the new, encrypted dataBlob to the sync endpoint.
4. **Server → Database**: Overwrites the old dataBlob with the new one for that user.

## 6. Technology Stack Summary

- **Frontend**: React 18 with TypeScript, Vite, and React Router for modern SPA development.
- **State Management**: Zustand with localStorage persistence for authentication and app state.
- **Cryptography**: Web Crypto API for AES-256-GCM encryption and @noble/hashes for PBKDF2 key derivation.
- **Graph Visualization & Analysis**: Cytoscape.js with TypeScript support for visualization and graph theory algorithms.
- **Backend**: Express.js with TypeScript, JWT authentication, and comprehensive API documentation.
- **Database**: MongoDB with zero-knowledge data storage (encrypted blobs only).
- **Testing**: Vitest + React Testing Library for frontend, Vitest + Supertest for backend.
- **API Documentation**: OpenAPI/Swagger with interactive testing interface.
- **Package Management**: pnpm workspaces for efficient monorepo development.
- **Backend**: Node.js with Express for familiar, reliable API development.
- **Database**: MongoDB for document-based storage, well-suited for storing user profiles and encrypted data blobs.
- **UI Components**: Radix UI + Tailwind CSS for accessible, professional interface.
- **Testing**: Vitest for unit testing and Playwright for E2E testing.
- **Package Manager**: pnpm for efficient monorepo dependency management.
