# Personal Strategy Engine

![Status](https://img.shields.io/badge/status-MVP%20Complete-brightgreen)
![Contributions](https://img.shields.io/badge/contributions-welcome-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Tech](https://img.shields.io/badge/tech-TypeScript-blue.svg)

The **Personal Strategy Engine** is an open-source application designed to augment your social and strategic intelligence. It's a tool for mapping your personal and professional networks, understanding the dynamics within them, and making more informed decisions to achieve your goals.  

This project is being built entirely in the open, and we welcome contributors of all kinds to help shape its future.

---

## 📖 Table of Contents
- [Core Philosophy](#-core-philosophy)
- [Current Status: Phase 1 MVP - Complete](#-current-status-phase-1-mvp---complete)
- [The Vision & Roadmap](#️-the-vision--roadmap)
- [Key Features (MVP)](#-key-features-mvp)
- [Technology Stack](#-technology-stack)
- [Project Documentation](#-project-documentation)
- [Getting Started (for Developers)](#️-getting-started-for-developers)
- [How to Contribute](#-how-to-contribute)
- [Code of Conduct](#-code-of-conduct)
- [License](#️-license)

---

## 🧠 Core Philosophy
This project is founded on a few key principles:

- **Privacy is Paramount**: Your relationships and personal notes are your most sensitive data. We are building this application on a zero-knowledge architecture. All your data is encrypted and decrypted on your device. We can never access your unencrypted data.  
- **User in Control**: You own your data. You can export or delete it at any time. The tool is designed to augment your intelligence, not replace it.  
- **Transparency Through Open Source**: By building in public, we invite scrutiny and collaboration. Anyone can review the code to verify our security and privacy claims.  
- **Strategic Augmentation, Not Just Memory**: We aim to provide tools that help you understand the structure and dynamics of your network, empowering you to think more strategically.

---

## 🚀 Current Status: Phase 1 MVP - **Complete**
The Phase 1 MVP is now **fully implemented and tested** with all core features working:

**✅ Authentication System Complete**: Zero-knowledge user registration and login with client-side cryptography is fully implemented and tested.

**✅ Data Management Complete**: Full contact management system with CRUD operations, search, filtering, and encrypted storage.

**✅ Network Visualization Complete**: Interactive relationship mapping with Cytoscape.js, Social Network Analysis metrics, and dynamic layouts.

**✅ Auto-Sync Complete**: Seamless automatic data synchronization with session-based password storage for optimal user experience.

**✅ Comprehensive Testing**: 151 tests passing across client and server with full unit and integration test coverage.

The MVP delivers immediate value as a secure, privacy-first relationship management and network analysis tool.

---

## 🗺️ The Vision & Roadmap

**Phase 1: The Insightful Relationship Map (✅ Complete)**  
- A secure, zero-knowledge vault for your relationship data.  
- Powerful network visualization and Social Network Analysis (SNA).  
- Automatic data synchronization with session-based security.

**Phase 2: The Probabilistic Co-Pilot (Next)**  
- Introduce permission-based data enrichment.  
- Implement NLP-based personality trait extraction from notes and logs.  
- Develop on-device, privacy-preserving ML models to provide behavioral insights.  

**Phase 3: The Full Strategy Engine (Future)**  
- AI-driven Decision Support System for scenario simulation and risk analysis.  
- Strategic "Playbooks" for interpersonal challenges (e.g., negotiation, conflict resolution).  

---

## ✨ Key Features (MVP)

### 🔐 Authentication & Security
- **Zero-Knowledge Architecture**: End-to-end encryption with keys only you hold
- **Client-side salt generation** with cryptographically secure random values
- **PBKDF2 key derivation** (600,000 iterations) for authentication hashes
- **AES-256-GCM encryption** for data storage with client-side keys
- **JWT token management** with secure localStorage persistence
- **Session-based auto-sync** with in-memory password storage

### 📊 Data Management
- **Contact Management**: Add, edit, delete contacts with full details
- **Search & Filter**: Real-time search by name, email, or company
- **Tag System**: Organize contacts with custom tags
- **Statistics Dashboard**: View contact counts and insights
- **Automatic Synchronization**: Seamless data sync after every operation
- **Encrypted Storage**: All data encrypted client-side before sync

### 🕸️ Network Visualization & Analysis
- **Interactive Graph Visualization**: Dynamic network mapping with Cytoscape.js
- **Social Network Analysis (SNA)**: Advanced metrics including:
  - *Centrality Analysis*: Identify the most influential people in your network
  - *Clustering Coefficient*: Measure network cohesion and tight-knit groups
  - *Network Density*: Understand overall connectivity patterns
  - *Dynamic Node Sizing*: Nodes scale based on degree centrality (connections)
- **Multiple Layout Options**: Choose from cose, circle, and grid layouts
- **Real-time Metrics**: Live network statistics and relationship insights
- **Relationship Mapping**: Visualize connections between contacts with different relationship types

### 💻 Technical Excellence
- **Professional UI**: Responsive design with Tailwind CSS and Radix UI components
- **Comprehensive Testing**: 151 tests with full coverage (unit + integration)
- **TypeScript**: Full type safety across client and server
- **Modern Architecture**: React with Zustand state management, Node.js backend

---

## 💻 Technology Stack
- **Frontend**: React, TypeScript, Vite  
- **State Management**: Zustand (with React Context API fallback)  
- **Graph Visualization & Analysis**: Cytoscape.js  
- **Backend**: Node.js, Express, TypeScript  
- **Database**: MongoDB  
- **Cryptography**: Web Crypto API + @noble/hashes  
- **UI Components**: Radix UI + Tailwind CSS  
- **Testing**: Vitest (unit), Playwright (E2E)  
- **Package Manager**: pnpm  

---

## 📄 Project Documentation
We believe in building in the open. All planning and specification docs are available in this repo:

- [PRODUCT_REQUIREMENTS.md](docs/PRODUCT_REQUIREMENTS.md) – The "what" and "why" of the MVP.  
- [TECHNICAL_REQUIREMENTS.md](docs/TECHNICAL_REQUIREMENTS.md) – Technical specifications.  
- [ARCHITECTURE_HIGH_LEVEL.md](docs/ARCHITECTURE_HIGH_LEVEL.md) – High-level architecture overview.  
- [ARCHITECTURE_LOW_LEVEL.md](docs/ARCHITECTURE_LOW_LEVEL.md) – Low-level implementation details.  
- [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) – Current implementation status and progress.

---

## 🛠️ Getting Started (for Developers)

### Prerequisites
- Node.js (v18 or later)  
- pnpm (v8 or later)  
- Git  
- MongoDB instance  

### Clone the repository
```bash
git clone https://github.com/ShubhenduVaid/personal-strategy-engine.git
cd personal-strategy-engine
```

### Install dependencies
```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all workspace dependencies
pnpm install
```

### Set up environment variables
Create a `.env` file in `/server` (copy from `.env.example`):

```bash
# /server/.env
MONGO_URI=mongodb://localhost:27017/strategy-engine
JWT_SECRET=your_super_secret_key_here
PORT=5001
NODE_ENV=development
```

### Run the development servers
```bash
pnpm dev
```
- Backend API: [http://localhost:5001](http://localhost:5001)  
- API Documentation: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)
- Client app: [http://localhost:5173](http://localhost:5173)

### Run tests
```bash
# Run all tests (backend + frontend)
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run backend tests only
pnpm --filter server test

# Run frontend tests only  
pnpm --filter client test
```  

---

## 🤝 How to Contribute
We welcome contributions from everyone!  

Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

### General Workflow
1. Find an issue (check `good first issue` or `help wanted`).  
2. Fork the repository.  
3. Create a feature branch (`git checkout -b feature/your-feature`).  
4. Make changes and add tests.  
5. Open a Pull Request against `main`.  

### Areas We Need Help
- Frontend (React/TS)  
- Backend (Node.js/Express)  
- UI/UX Design  
- Documentation & Guides  
- Testing & QA  

Discussions happen in [GitHub Discussions](https://github.com/your-username/personal-strategy-engine/discussions).

---

## 📜 Code of Conduct
We follow a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a safe and inclusive environment.

---

## ⚖️ License
This project is licensed under the [MIT License](LICENSE).
