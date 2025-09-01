# Personal Strategy Engine

![Status](https://img.shields.io/badge/status-MVP%20Development-brightgreen)
![Contributions](https://img.shields.io/badge/contributions-welcome-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Tech](https://img.shields.io/badge/tech-TypeScript-blue.svg)

The **Personal Strategy Engine** is an open-source application designed to augment your social and strategic intelligence. It's a tool for mapping your personal and professional networks, understanding the dynamics within them, and making more informed decisions to achieve your goals.  

This project is being built entirely in the open, and we welcome contributors of all kinds to help shape its future.

---

## 📖 Table of Contents
- [Core Philosophy](#-core-philosophy)
- [Current Status: Phase 1 MVP - The Insightful Relationship Map](#-current-status-phase-1-mvp---the-insightful-relationship-map)
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

## 🚀 Current Status: Phase 1 MVP - *The Insightful Relationship Map*
The project is currently in the first phase of development, focused on building a **Minimum Viable Product (MVP)** that delivers immediate and unique value.  

The goal is to create a secure foundation and a powerful visualization tool that is useful on its own and sets the stage for future capabilities.

---

## 🗺️ The Vision & Roadmap

**Phase 1: The Insightful Relationship Map (Current Focus)**  
- A secure, zero-knowledge vault for your relationship data.  
- Powerful network visualization and Social Network Analysis (SNA).  

**Phase 2: The Probabilistic Co-Pilot**  
- Introduce permission-based data enrichment.  
- Implement NLP-based personality trait extraction from notes and logs.  
- Develop on-device, privacy-preserving ML models to provide behavioral insights.  

**Phase 3: The Full Strategy Engine**  
- AI-driven Decision Support System for scenario simulation and risk analysis.  
- Strategic "Playbooks" for interpersonal challenges (e.g., negotiation, conflict resolution).  

---

## ✨ Key Features (MVP)

- **Zero-Knowledge Security**: End-to-end encryption with keys only you hold.  
- **Manual Relationship Logging**: Add contacts, log interactions, and record notes.  
- **Interactive Network Visualization**: See your network as a dynamic graph.  
- **Client-Side Social Network Analysis (SNA)**: Metrics include:  
  - *Centrality*: Identify the most influential people.  
  - *Tie Strength*: See which relationships are strongest.  
  - *Structural Holes*: Discover opportunities to bridge disconnected parts of your network.  

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
