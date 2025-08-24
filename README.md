# Palabritas

[![CI - Angular Build & Coverage](https://github.com/tarrball/palabritas/actions/workflows/ci-angular.yml/badge.svg)](https://github.com/tarrball/palabritas/actions/workflows/ci-angular.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://palabs.app/)
[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![NgRx](https://img.shields.io/badge/NgRx-20-purple)](https://ngrx.io/)

[Palabritas](https://palabs.app/) is a word puzzle game where players unscramble words and discover all the words hidden within them. Built with Angular 20 and NgRx for state management.

## 🎯 How to Play

You're given a scrambled word and must:
1. **Unscramble** the main word
2. **Find** all possible words contained within it

For example, if your word unscrambles to "SECURE", you can also find "CURE", "SURE", "RESCUE", and more!

## 🔤 Word Source

Words are sourced from Webster's Unabridged Dictionary (August 22, 2009) provided by [Project Gutenberg](https://www.gutenberg.org/ebooks/29765). While not perfect, it provides a solid foundation for the game.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Angular CLI** (automatically installed with dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tarrball/palabritas.git
   cd palabritas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser** to `http://localhost:4200`

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm start` | Starts the development server with live reload |
| **Build** | `npm run build` | Builds the app for production |
| **Test** | `npm test` | Runs unit tests with Karma and Jasmine |
| **Lint** | `npm run lint` | Lints code using ESLint with Angular rules |
| **Watch Build** | `npm run watch` | Builds and watches for changes in development mode |

### Development Workflow

```bash
# Start development
npm start

# In another terminal, run tests
npm test

# Lint your code before committing
npm run lint

# Build for production
npm run build
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Angular 20 with Angular Material
- **State Management**: NgRx (Store, Effects, Selectors)
- **Styling**: SASS with Angular Material theming
- **Testing**: Jasmine + Karma with ng-mocks
- **Code Quality**: ESLint with Angular and NgRx rules

### Project Structure

```
src/app/
├── 1. features/          # UI components and feature modules
│   ├── game/            # Main game component
│   └── shared/          # Shared UI components
├── 2. store/            # NgRx state management
│   └── game/            # Game state, actions, reducers, effects
├── 3. services/         # Injectable services
│   └── game.service.ts  # Game logic and data management
└── 4. shared/           # Shared utilities and types
    ├── types/           # TypeScript interfaces
    └── fakers/          # Test data generators
```

### State Management

The app uses NgRx with a clean architecture:
- **Actions**: User interactions (`letterTapped`, `wordSubmitted`, etc.)
- **State**: Immutable game state with Immer for updates
- **Reducers**: Pure functions for state transitions
- **Effects**: Side effects and async operations
- **Selectors**: Memoized state derivations

## 🧪 Testing

### Running Tests

```bash
# Run tests once
npm test

# Run tests with coverage
npm test -- --code-coverage

# View coverage report
open coverage/index.html
```

### Test Coverage

Tests include:
- **Unit tests** for components, services, and NgRx store
- **Mocking** with ng-mocks and @faker-js/faker
- **Coverage reports** generated in `coverage/` directory

## 🤝 Contributing

### Development Setup

1. Follow the installation steps above
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the existing patterns
4. Run tests and linting: `npm test && npm run lint`
5. Build to ensure everything works: `npm run build`
6. Commit with conventional commit messages
7. Push and create a pull request

### Code Standards

- **ESLint**: Configured with Angular and NgRx rules
- **TypeScript**: Strict type checking enabled
- **SASS**: Use kebab-case for component selectors
- **Testing**: Write tests for new features and bug fixes
- **Commits**: Follow [Conventional Commits](https://conventionalcommits.org/)

### Issue Templates

Use our [auto issue template](.github/ISSUE_TEMPLATE/auto.md) for feature requests and bug reports.

## 📝 License

This project is open source. See the repository for license details.

## 📖 Documentation

- **SEO and Metadata**: [docs/seo.md](docs/seo.md) - Complete guide to SEO implementation, social media optimization, and structured data

## 🔗 Links

- **Live Demo**: [palabs.app](https://palabs.app/)
- **Issues**: [GitHub Issues](https://github.com/tarrball/palabritas/issues)
- **Angular Docs**: [angular.io](https://angular.io/)
- **NgRx Docs**: [ngrx.io](https://ngrx.io/)
