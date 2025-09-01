# Contributing to Personal Strategy Engine

🙏 First of all, thank you for considering contributing!  
This project thrives on community involvement, and we’re excited to build this together.  

We welcome all types of contributions — from bug fixes and feature requests to documentation, design, and testing.  

---

## 📖 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [How to Contribute](#-how-to-contribute)
- [Development Workflow](#-development-workflow)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Areas Where You Can Help](#-areas-where-you-can-help)

---

## 📜 Code of Conduct
We are committed to providing a welcoming and inclusive environment.  
All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).  

---

## 🤝 How to Contribute

### Reporting Issues
- Use the **GitHub Issues** tab to report bugs or request features.  
- Before opening a new issue, please check if it already exists.  
- Include clear steps to reproduce bugs, expected vs actual behavior, and screenshots/logs if possible.  

### Suggesting Features
- Open an issue and tag it as a **feature request**.  
- Provide context on why the feature is valuable and how it should work.  

---

## 🛠️ Development Workflow

1. **Fork the repository**  
   ```bash
   git clone https://github.com/your-username/personal-strategy-engine.git
   cd personal-strategy-engine
   ```

2. **Create a feature branch**  
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**  
   ```bash
   npm install
   ```

4. **Set up environment variables**  
   Follow the setup instructions in [README.md](README.md).

5. **Run the dev environment**  
   ```bash
   npm run dev
   ```

6. **Commit your changes**  
   Follow our [Commit Guidelines](#-commit-guidelines).

7. **Push your branch & open a Pull Request**  
   ```bash
   git push origin feature/your-feature-name
   ```

---

## ✍️ Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.  
This makes it easier to generate changelogs and understand project history.

Format:
```
<type>(scope): short description
```

Examples:
- `feat(auth): add JWT-based authentication`
- `fix(api): resolve crash when MongoDB connection fails`
- `docs(readme): update getting started section`

**Allowed types**:
- `feat` → New feature  
- `fix` → Bug fix  
- `docs` → Documentation only changes  
- `style` → Formatting, whitespace, etc (no code change)  
- `refactor` → Code changes that neither fix a bug nor add a feature  
- `test` → Adding or modifying tests  
- `chore` → Other changes (build, CI, tooling, etc)  

---

## 🔀 Pull Request Process

1. Ensure your PR addresses a specific issue (if applicable).  
2. Update documentation if your changes introduce new features or configs.  
3. Add or update tests when applicable.  
4. Run the test suite and ensure all tests pass:
   ```bash
   # Run all tests
   pnpm test
   
   # Run with coverage
   pnpm test:coverage
   
   # Run specific workspace tests
   pnpm --filter server test
   pnpm --filter client test
   ```  
5. Fill out the PR template with a clear description of your changes.  
6. Be responsive to reviewer feedback.  

---

## 🌟 Areas Where You Can Help

- **Frontend (React/TypeScript)**: UI components, network visualizations.  
- **Backend (Node.js/Express)**: Secure APIs, database integrations.  
- **Security & Cryptography**: Improving end-to-end encryption patterns.  
- **UI/UX Design**: Making complex data intuitive to use.  
- **Documentation**: Writing guides, improving onboarding.  
- **Testing**: Unit, integration, and end-to-end test coverage.
  - Frontend: Vitest + React Testing Library + jsdom
  - Backend: Vitest + Supertest + MongoDB Memory Server  
  - Coverage targets: 85% frontend, 90% backend, 100% crypto functions  

---

## 💬 Questions?

If you have questions, please:  
- Open a [Discussion](https://github.com/your-username/personal-strategy-engine/discussions).  
- Join ongoing conversations in Issues or PRs.  

We look forward to your contributions 🚀  
