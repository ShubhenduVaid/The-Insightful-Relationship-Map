# Technical Requirements Document: Personal Strategy Engine

## Phase 1: The Insightful Relationship Map (MVP)

**Document Details:**
- Version: 1.0
- Status: Approved for Development
- Author: Shubhendu Vaid
- Date: August 31, 2025

## 1. Introduction

### 1.1. Purpose

This document provides the detailed technical specifications for the development of the "Insightful Relationship Map" MVP. It translates the functional and non-functional requirements outlined in the Product Requirements Document (PRD) into a concrete technical architecture and implementation plan for the engineering team.

### 1.2. Scope

The scope of this document is limited to the technical implementation of the Phase 1 MVP. This includes the client-side application, the backend API for authentication and data storage, the security architecture, and the core Social Network Analysis (SNA) features. All features designated as out-of-scope in the PRD (e.g., automated data enrichment, predictive analytics) are not covered here.

## 2. System Architecture

### 2.1. High-Level Overview

The system will be architected as a client-server model with a strong emphasis on client-side processing to adhere to the core zero-knowledge principle.

- **Client Application**: A Single Page Application (SPA) running in the user's web browser. The client is responsible for all data encryption and decryption, data management, and the computation and rendering of network visualizations.
- **Backend API**: A lightweight, stateless RESTful API. Its sole responsibilities are to handle user authentication and to serve as a storage interface for encrypted data blobs. The backend will have no access to or knowledge of the unencrypted user data.
- **Database**: A document-oriented NoSQL database optimized for storing user account information and unstructured encrypted data blobs.

### 2.2. Zero-Knowledge Principle

The foundational design principle is the zero-knowledge architecture. The server must be treated as an untrusted, "dumb" storage provider. All sensitive user data must be encrypted and decrypted exclusively on the client device. The user's master password, which serves as the root of the encryption key, must never be transmitted to or stored on the server in any form. This ensures that even in the event of a full server breach, user data remains confidential and unreadable.

## 3. Security and Encryption Specification

The security model is the most critical component of the MVP. Its implementation must be precise and adhere to modern cryptographic best practices.

### 3.1. User Authentication and Key Derivation

**Registration:**
1. The user provides an email and a strong master password on the client application.
2. The client generates a cryptographically secure random salt.
3. The client derives an authentication hash from the master password and salt using PBKDF2-SHA256 with a minimum of 600,000 iterations.
4. The client sends the email, salt, and authentication hash to the `/register` API endpoint. The plaintext master password is never transmitted.

**Login:**
1. The user enters their email and master password.
2. The client requests the salt for the given email from the server.
3. The client re-computes the authentication hash using the entered password and the retrieved salt.
4. The client sends the email and the computed authentication hash to the `/login` endpoint for verification against the stored hash.

**Encryption Key Generation:**
- Upon successful login, the client will re-derive a separate 32-byte (256-bit) encryption key from the master password and salt using the same PBKDF2-SHA256 function.
- This encryption key is held only in the client's application memory for the duration of the session and is never transmitted to the server.

### 3.2. Data Encryption and Decryption

**Encryption Algorithm**: All user data will be encrypted using AES-256 in Galois/Counter Mode (GCM). AES-GCM is chosen as it provides both confidentiality and authenticity (tamper-detection).

**Encryption Process:**
1. All user data (contacts, interactions, relationships) will be structured as a single JSON object.
2. This object will be stringified using `JSON.stringify()`.
3. A new, cryptographically secure 12-byte Initialization Vector (IV) will be generated for each encryption operation.
4. The JSON string will be encrypted using AES-256-GCM with the in-memory encryption key and the newly generated IV.
5. The resulting ciphertext, IV, and GCM authentication tag will be combined into a single data blob for storage.

**Decryption Process:**
1. The encrypted data blob is fetched from the server.
2. The IV and authentication tag are extracted from the blob.
3. The ciphertext is decrypted using the in-memory encryption key, IV, and tag.
4. The resulting plaintext is parsed using `JSON.parse()` to reconstruct the user's data object.

### 3.3. Data Storage (Server-Side)

**Database Schema**: A single collection/table named `users` will be used.

**Document Structure**: Each document will contain:
- `_id`: Unique identifier (e.g., MongoDB ObjectID).
- `email`: User's email address (indexed for lookup).
- `salt`: The unique salt for the user's password hashing and key derivation (hex-encoded string).
- `authHash`: The PBKDF2-derived authentication hash (hex-encoded string).
- `dataBlob`: The encrypted user data vault (Base64-encoded string).

### 3.4. Data Transmission

All communication between the client and the backend API must be secured using HTTPS (TLS 1.2 or higher) to prevent man-in-the-middle attacks.

## 4. Backend API Specification

The backend will be a stateless RESTful API. Authentication for protected endpoints will be handled via JSON Web Tokens (JWT).

### API Endpoints

**POST /api/register**
- Body: `{ "email": "...", "salt": "...", "authHash": "..." }`
- Action: Creates a new user document in the database. Fails if the email already exists.
- Response: 201 Created with a JWT.

**POST /api/login**
- Body: `{ "email": "...", "authHash": "..." }`
- Action: Verifies the authHash against the stored hash for the given email.
- Response: 200 OK with a JWT and the user's dataBlob. 401 Unauthorized on failure.

**PUT /api/sync**
- Authorization: Bearer Token (JWT).
- Body: `{ "dataBlob": "..." }`
- Action: Overwrites the dataBlob for the authenticated user.
- Response: 200 OK on success.

## 5. Frontend Specification

### 5.1. Framework and Libraries

- **Core Framework**: React with TypeScript for component-based architecture and type safety.
- **Build Tool**: Vite for fast development and optimized production builds.
- **State Management**: Zustand for efficient state management with React Context API fallback.
- **Cryptography**: The native Web Crypto API for encryption/decryption operations and @noble/hashes for robust PBKDF2 key derivation with better cross-browser compatibility.
- **Graph Visualization & Analysis**: Cytoscape.js provides performant Canvas/WebGL rendering suitable for the target network size and includes built-in graph theory algorithms with excellent TypeScript support.
- **UI Components**: Radix UI + Tailwind CSS for accessible, professional components.
- **Testing**: Vitest for unit testing (better Vite integration) and Playwright for E2E testing.
- **Package Manager**: pnpm for efficient dependency management in monorepo structure.

### 5.2. Data Model (Client-Side, Unencrypted)

The application state will manage a single, unencrypted JSON object representing the user's vault.

```json
{
  "contacts": [
    { "id": "uuid-1", "name": "John Doe", "email": "john@example.com", "notes": "..." }
  ],
  "interactions": [
    { "id": "uuid-2", "contactIds": ["uuid-1"], "timestamp": "2025-08-31T10:00:00Z", "summary": "..." }
  ],
  "relationships": [
    { "source": "uuid-1", "target": "uuid-3", "label": "colleague of" }
  ]
}
```

### 5.3. Social Network Analysis (SNA) Module

This module will be implemented client-side.

**Data Transformation**: A utility function will transform the contacts and relationships arrays from the data model into the elements format required by Cytoscape.js (an array of node and edge objects).

**Metric Calculation:**
- **Tie Strength**: A function will iterate through the interactions log. The strength of a tie (edge) between two contacts (nodes) will be calculated based on the frequency of their shared interactions within a given time window. This numerical value will be stored as a weight attribute on the edge data.
- **Centrality**: The cytoscape.js library's built-in `cy.elements().betweennessCentrality()` algorithm will be used to calculate the betweenness centrality for each node. This value will be stored as a centrality attribute on the node data.

**Visualization Mapping:**
- A Cytoscape.js stylesheet will be defined to map data attributes to visual properties.
- Node width and height will be mapped to the centrality score.
- Edge width will be mapped to the tieStrength score.

## 6. Performance and Scalability

### 6.1. Performance Requirements

- **Initial Load**: The application's initial load time (HTML, CSS, JS) shall be under 2 seconds on a standard broadband connection.
- **Data Decryption**: Decryption of a data blob representing 1000 contacts should complete in under 500ms on a modern desktop browser.
- **Graph Rendering**: The graph view must render a network of 1000 nodes and 2000 edges in under 3 seconds. User interactions (pan, zoom) must maintain a fluid frame rate (>30 FPS).
- **API Response Time**: All backend API endpoints must have a P95 response time of less than 200ms.

### 6.2. Scalability

- **Backend**: The API must be stateless, allowing for horizontal scaling via load balancing.
- **Database**: The chosen NoSQL database should support horizontal scaling/sharding to accommodate a large number of users.

## 7. Testing and Deployment

- **Unit Testing**: All cryptographic functions, SNA calculation logic, and individual React components must have comprehensive unit tests using Vitest.
- **Integration Testing**: End-to-end tests using Playwright must cover the full user flow: registration, login, data creation, data sync, and logout.
- **Security Auditing**: A mandatory third-party security audit of the entire cryptographic implementation and zero-knowledge architecture must be completed before public launch.
- **Deployment**: A CI/CD pipeline will be established for automated testing and deployment of both the frontend and backend applications.