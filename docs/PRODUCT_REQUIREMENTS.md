# Product Requirements Document: Personal Strategy Engine

## Phase 1: The Insightful Relationship Map (MVP)

**Document Details:**

- Version: 1.0
- Status: Draft
- Author: Shubhendu Vaid
- Date: August 31, 2025

## 1. Introduction

### 1.1. Problem Statement

High-stakes professionals (founders, managers, lawyers, etc.) manage complex networks where understanding relationship dynamics is critical to success. Existing Personal CRM tools act as simple digital address books, helping users remember contacts and dates but offering no strategic insight. They are systems of record, not systems of strategy. This leaves a significant gap for professionals who need to understand the underlying structure and dynamics of their personal and professional networks to make better strategic decisions.

### 1.2. Proposed Solution

The "Insightful Relationship Map" is the Minimum Viable Product (MVP) for the Personal Strategy Engine. It is a secure, private, and offline-first application that serves as the foundational layer for all future strategic capabilities. Phase 1 focuses on two core value propositions:

- **A Secure Data Vault**: Providing a private, encrypted space for users to manually log rich, qualitative data about their relationships.
- **Immediate Strategic Insight**: Transforming that data into a visual, interactive network map that reveals hidden structures and dynamics through Social Network Analysis (SNA).

### 1.3. Vision

The long-term vision is to create a comprehensive Personal Strategy Engine that augments a user's social and strategic intelligence. This MVP is the critical first step, establishing the core data foundation and delivering immediate, unique value that differentiates it from any product on the market. It will build the "data flywheel" necessary to power future predictive and strategic features.

## 2. Goals and Objectives

### 2.1. Product Goals

- **Establish Trust**: Launch a product with a privacy-first, zero-knowledge architecture as its core, non-negotiable feature to build foundational user trust.
- **Deliver Immediate Value**: Provide users with novel, actionable insights into their network structure through SNA visualizations, a feature absent in current Personal CRMs.
- **Drive Data Input**: Create an intuitive and compelling user experience for manual data entry (contacts, interactions, notes) that users find valuable enough to engage with consistently.
- **Validate Core Concept**: Validate the market demand for a tool that goes beyond simple contact management and offers deeper, structural analysis of personal networks.

### 2.2. Success Metrics

- **Activation Rate**: Percentage of new sign-ups who create at least 10 contacts and 5 relationships within the first week.
- **Engagement**: Average number of new interaction logs per active user per week.
- **Retention**: 30-day and 90-day retention rates for activated users.
- **User Feedback**: Qualitative feedback from early adopters on the utility and clarity of the SNA visualizations.

## 3. Target Audience

### 3.1. Primary User Persona: "The Strategic Professional"

**Description**: A founder, investor, senior manager, lawyer, or other professional whose success is highly dependent on navigating complex interpersonal dynamics. They are analytical, goal-oriented, and view their network as a strategic asset.

**Needs & Pains**:

- Feels overwhelmed trying to keep track of the nuances of hundreds of important relationships.
- Uses a combination of spreadsheets, note-taking apps, and memory, but finds it inefficient and non-insightful.
- Intuitively understands their network is important but lacks the tools to visualize its structure and identify key opportunities or risks.
- Is highly concerned with data privacy and would never use a tool that could expose their sensitive relationship data.

## 4. Features and Requirements (MVP)

### 4.1. Epic: Secure User Account and Data Vault

This epic covers the foundational security architecture of the application. All user data must be private and inaccessible to anyone but the user, including the service provider.

| ID    | User Story                                                                                | Acceptance Criteria                                                                                                                                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-101 | As a new user, I want to create an account with a single, strong master password.         | - Account creation requires only an email and a master password.<br>- The master password must meet minimum complexity requirements.<br>- The master password is never transmitted to the server.                                                                 |
| F-102 | As a user, I want all my data to be encrypted on my device before being stored or synced. | - All data (contacts, notes, logs, etc.) is encrypted locally using an industry-standard algorithm (e.g., AES-256) derived from my master password.<br>- The application follows a zero-knowledge architecture; the server only ever stores encrypted data blobs. |
| F-103 | As a user, I must be clearly informed that my master password cannot be recovered.        | - During onboarding, a clear, unmissable warning explains that a forgotten password means permanent data loss.<br>- The user must acknowledge this warning to proceed.                                                                                            |

### 4.2. Epic: Core Relationship Management

This epic covers the essential Personal CRM functionalities for manual data entry. The user interface must be clean, fast, and optimized for quick logging of information.

| ID    | User Story                                                        | Acceptance Criteria                                                                                                                                                                                                                                          |
| ----- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F-201 | As a user, I want to create, view, edit, and delete contacts.     | - I can add a new contact with standard fields (Name, Company, Title, Email, Phone).<br>- I can add custom fields and notes to a contact profile (e.g., "How we met," "Family details," "Key interests").<br>- I can view all contacts in a searchable list. |
| F-202 | As a user, I want to log interactions with my contacts.           | - I can create a new log entry associated with one or more contacts.<br>- The log entry should support free-form text for summaries of calls, meetings, or message threads.<br>- Each log entry must be automatically timestamped.                           |
| F-203 | As a user, I want to add qualitative notes and tags to a contact. | - I can add unstructured notes or tags to a contact's profile to capture my assessment of their traits (e.g., "risk-averse," "prefers direct communication").                                                                                                |
| F-204 | As a user, I want to define relationships between contacts.       | - I can select two contacts and create a labeled, directed link between them (e.g., Contact A "is the manager of" Contact B).<br>- I can view a contact's defined relationships from their profile page.                                                     |

### 4.3. Epic: Network Visualization and Analysis

This epic covers the core differentiating feature of the MVP: transforming the user's data into an interactive and insightful network graph.

| ID    | User Story                                                           | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-301 | As a user, I want to view my entire network as an interactive graph. | - All contacts are displayed as nodes, and defined relationships are displayed as edges.<br>- I can pan, zoom, and click on nodes to view contact details.<br>- The visualization should be performant and usable for networks of up to 1000 nodes.                                                                                                                                                                                                                                                                                      |
| F-302 | As a user, I want the graph to visually represent key SNA metrics.   | - The application should automatically calculate and visualize:<br> - **Tie Strength**: Edge thickness or color should represent the strength of a tie (calculated from interaction frequency).<br> - **Centrality**: Node size should represent its calculated centrality (e.g., betweenness centrality) to highlight influential individuals.<br> - **Structural Holes & Bridges**: The layout should make it easy to visually identify clusters, the gaps between them (structural holes), and the nodes that connect them (bridges). |
| F-303 | As a user, I want to filter and query the graph to find insights.    | - I can filter the view to show only contacts with specific tags.<br>- I can highlight the direct and indirect paths between any two nodes in the network.                                                                                                                                                                                                                                                                                                                                                                               |

## 5. Non-Functional Requirements

- **Security & Privacy**: The application must be built on a zero-knowledge architecture. No unencrypted user data should ever be stored on company servers. All encryption/decryption must happen client-side.
- **Performance**: The user interface must be fast and responsive. Graph rendering and interaction should remain fluid for networks of up to 1000 nodes and 2000 edges.
- **Usability**: The application must be intuitive for non-technical users. The value of SNA metrics should be explained in simple terms through tooltips or an integrated help system.
- **Platform**: The initial release will be a web application accessible on modern desktop browsers (Chrome, Firefox, Safari, Edge).

## 6. Technical Stack Recommendations

- **Frontend Framework**: React with TypeScript for modern, component-based architecture with type safety.
- **Build Tool**: Vite for fast development experience and optimized production builds.
- **State Management**: React Context API for simple, built-in state management.
- **Backend/Database**: Node.js with Express for high-performance API and MongoDB for document-based storage of encrypted data blobs.
- **Encryption Libraries**: Native Web Crypto API for secure, hardware-accelerated cryptographic operations.
- **Graph Visualization Library**: Cytoscape.js for performant network visualization with built-in SNA algorithms and TypeScript support.
- **UI Components**: Radix UI + Tailwind CSS for accessible, professional interface components.
- **Package Manager**: pnpm for efficient monorepo dependency management.

## 7. Out of Scope for Phase 1

The following features are explicitly excluded from the MVP to ensure a focused and achievable initial release. They will be prioritized for future phases.

- Automated data import or enrichment (e.g., from LinkedIn, Gmail).
- Mobile-native applications (iOS/Android).
- Team collaboration and data sharing features.
- All predictive analytics (personality trait extraction, behavioral prediction).
- All strategic recommendation features (scenario simulation, communication advice).
- Automated reminders or notifications.
