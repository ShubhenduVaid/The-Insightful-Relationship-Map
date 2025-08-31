# High-Level Architecture Document

## Phase 1: The Insightful Relationship Map (MVP)

**Document Details:**

- Version: 1.0
- Status: For Review
- Author: Shubhendu Vaid
- Date: August 31, 2025

## 1. Overview

This document outlines the high-level system architecture for the "Insightful Relationship Map" MVP. The architecture is designed around a single, non-negotiable principle: zero-knowledge security. This means the service provider can never access, decrypt, or read user data. All encryption and decryption operations happen exclusively on the client-side, ensuring absolute user privacy and data ownership.

The system is a client-server model, but with a "thick" client and a "thin" server. The client application handles all complex logic, while the server acts as a simple, untrusted storage layer for encrypted data.

## 2. Architectural Principles

- **Zero-Knowledge**: The server has zero knowledge of the user's master password or the content of their data vault. A server breach would only expose indecipherable encrypted blobs.
- **Client-Side Sovereignty**: All sensitive operations—data processing, Social Network Analysis (SNA), encryption, and decryption—are performed on the user's local device.
- **Stateless Backend**: The backend API is stateless, meaning it does not store session information. Each request is authenticated independently, simplifying scalability and security.
- **Minimalist Server Logic**: The server's role is intentionally minimized to user authentication and the storage/retrieval of a single encrypted data blob per user. This reduces the server-side attack surface.

## 3. System Components Diagram

The architecture consists of three primary components: the Client Application, the Backend API, and the Database.

```
+------------------------------------------------+       +------------------------+       +-----------------+
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

- **Frontend**: React with TypeScript and Vite for modern development experience.
- **State Management**: Zustand for efficient state management with React Context API fallback.
- **Cryptography**: The native Web Crypto API for encryption/decryption and @noble/hashes for robust key derivation.
- **Graph Visualization & Analysis**: Cytoscape.js with TypeScript support for visualization and graph theory algorithms.
- **Backend**: Node.js with Express for familiar, reliable API development.
- **Database**: MongoDB for document-based storage, well-suited for storing user profiles and encrypted data blobs.
- **UI Components**: Radix UI + Tailwind CSS for accessible, professional interface.
- **Testing**: Vitest for unit testing and Playwright for E2E testing.
- **Package Manager**: pnpm for efficient monorepo dependency management.
