Personal Strategy Engine
!(https://img.shields.io/badge/status-MVP%20Development-brightgreen)

!(https://img.shields.io/badge/License-MIT-yellow.svg)
!(https://img.shields.io/badge/tech-TypeScript-blue.svg)

The Personal Strategy Engine is an open-source application designed to augment your social and strategic intelligence. It's a tool for mapping your personal and professional networks, understanding the dynamics within them, and making more informed decisions to achieve your goals. This project is being built entirely in the open, and we welcome contributors of all kinds to help shape its future.

📖 Table of Contents
Core Philosophy
-(#-current-status-phase-1-mvp---the-insightful-relationship-map)
-(#️-the-vision--roadmap)


-(#-technology-stack)
-(#-project-documentation)
-(#️-getting-started-for-developers)


🧠 Core Philosophy
This project is founded on a few key principles that guide its development and vision :

Privacy is Paramount: Your relationships and personal notes are your most sensitive data. We are building this application on a zero-knowledge architecture. All your data is encrypted and decrypted on your device. We, the service providers, can never access your unencrypted data. Your data is for your eyes only.

User in Control: You own your data. You can export or delete it at any time. The tool is designed to augment your intelligence, not replace it. You are always the final decision-maker.

Transparency Through Open Source: By building in public, we invite scrutiny and collaboration. Anyone can review the code to verify our security and privacy claims, ensuring we are held accountable.

Strategic Augmentation, Not Just Memory: We aim to go beyond simple contact management. Our goal is to provide tools that help you understand the structure and dynamics of your network, empowering you to think more strategically.

🚀 Current Status: Phase 1 MVP - "The Insightful Relationship Map"
The project is currently in the first phase of development, focused on building a Minimum Viable Product (MVP) that delivers immediate and unique value. The goal of this phase is to create a secure foundation and a powerful visualization tool that is useful on its own and sets the stage for future capabilities.

🗺️ The Vision & Roadmap
Our long-term vision is to create a comprehensive strategic co-pilot for your interpersonal world.

Phase 1: The Insightful Relationship Map (Current Focus)

A secure, zero-knowledge vault for your relationship data.

Powerful network visualization and Social Network Analysis (SNA).

Phase 2: The Probabilistic Co-Pilot

Introduce permission-based data enrichment.

Implement NLP-based personality trait extraction from your notes and logs.

Develop on-device, privacy-preserving machine learning models to provide probabilistic behavioral insights.

Phase 3: The Full Strategy Engine

Build a full AI-driven Decision Support System for scenario simulation and risk analysis.

Introduce a library of strategic "Playbooks" for common interpersonal challenges (e.g., negotiation, conflict resolution).

✨ Key Features (MVP)
The Phase 1 MVP will include the following core features:

Zero-Knowledge Security: All your data is end-to-end encrypted with keys that only you hold. The server only stores an unreadable encrypted blob.

Manual Relationship Logging: A clean, fast interface to add contacts, log interactions (meetings, calls, emails), and record important notes and traits.

Interactive Network Visualization: See your network as a dynamic graph. Understand relationships, identify key connectors, and discover the hidden structure of your social world.

Client-Side Social Network Analysis (SNA): All analysis happens on your device. The MVP will calculate and visualize key metrics like :

Centrality: Identify the most influential people in your network.

Tie Strength: See which relationships are strongest based on interaction frequency.

Structural Holes: Discover opportunities to bridge disconnected parts of your network.

💻 Technology Stack
This project is being built with a modern, full-stack TypeScript approach.

Frontend: React, TypeScript, Vite

State Management: Redux Toolkit

Graph Visualization & Analysis: Cytoscape.js

Backend: Node.js, Express, TypeScript

Database: MongoDB

Cryptography: Native Web Crypto API for all client-side encryption.

📄 Project Documentation
We believe in building in the open. All our planning and specification documents are available in this repository for review and feedback. This transparency is core to our mission.

/docs/PRODUCT_REQUIREMENTS.md: The "what" and "why" of the Phase 1 MVP.

/docs/TECHNICAL_REQUIREMENTS.md: The detailed technical specifications for implementation.

/docs/ARCHITECTURE_HIGH_LEVEL.md: A high-level overview of the system architecture.

/docs/ARCHITECTURE_LOW_LEVEL.md: A granular, implementation-focused view of the architecture.

🛠️ Getting Started (for Developers)
Interested in running the project locally? Follow these steps:

Prerequisites:

Node.js (v18 or later)

npm / yarn

Git

A running MongoDB instance.

Clone the repository:

Install dependencies:
This project is a monorepo containing the client and server packages. Installing from the root directory will set up both.

Set up environment variables:
You will need to create a .env file in the /server directory.

Navigate to /server and copy .env.example to a new file named .env.

Update the .env file with your local configuration, such as your MongoDB connection string and a secret for signing JWTs.

Run the development servers:
This command will start both the client (React) and server (Express) concurrently.

You should now have the backend API running on http://localhost:5001 and the client application on http://localhost:5173 (or another port specified by Vite).

🤝 How to Contribute
We welcome contributions from everyone! This project thrives on community involvement. Whether you're fixing a bug, proposing a new feature, or improving our documentation, your help is valued.

Please read our (CONTRIBUTING.md) file for detailed guidelines on our development process, coding standards, and pull request workflow.

General Contribution Workflow:

Find an issue: Check the  for tasks. Look for issues tagged good first issue if you're new, or help wanted for well-defined tasks.

Fork the repository: Create your own copy of the project to work on.

Create a branch: Make a new branch for your feature or bug fix (git checkout -b feature/your-feature-name).

Make your changes: Write your code and add tests where applicable.

Submit a Pull Request: Push your changes to your fork and open a Pull Request against our main branch. Please provide a clear description of the changes you've made.

What we need help with:

Frontend Developers (React/TS): Help build beautiful, intuitive UI components and improve the user experience.

Backend Developers (Node.js/Express): Assist in building out our secure, scalable API.

UI/UX Designers: We need help designing a user-friendly interface that makes complex data easy to understand.

Documentation & Technical Writers: Help us improve our documentation and write guides for users and developers.

Testers: Help us find bugs and ensure the application is stable and reliable.

If you have any questions, please open a discussion in the().

📜 Code of Conduct
To ensure a safe and inclusive environment for everyone, this project adheres to a Code of Conduct. All contributors are expected to follow it. Please read the (CODE_OF_CONDUCT.md) before participating.

⚖️ License
This project is licensed under the MIT License. See the (LICENSE) file for details.
