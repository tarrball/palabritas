# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `ng serve`
- **Build for production**: `npm run build` or `ng build`
- **Run tests**: `npm test` or `ng test`
- **Run tests with coverage**: `npm test -- --no-watch --code-coverage`
- **Lint code**: `npm run lint` or `ng lint`
- **Watch build**: `npm run watch` or `ng build --watch --configuration development`

### Code Coverage

The project maintains 100% test coverage. When running tests with `--code-coverage`, the coverage report summary appears at the end of the test output showing Statements, Branches, Functions, and Lines percentages. Coverage files are generated in `coverage/app/` directory with multiple formats (HTML, LCOV, JSON summary, and text).

## Project Architecture

This is an Angular 18 application implementing "Palabritas", a word puzzle game where players unscramble words and find contained words.

### Folder Structure Pattern

The codebase uses a numbered folder structure for organization:
- `1. features/` - UI components and feature modules
- `2. store/` - NgRx state management
- `3. services/` - Injectable services
- `4. shared/` - Shared types, utilities, and fakers

### State Management (NgRx)

The application uses NgRx for state management with the following stores:

#### Game Store (`2. store/game/`)
- **State**: Defined in `game.state.ts` with interfaces for `GameState`, `Answer`, `Letter`, and `TypedLetter`
- **Actions**: Game actions in `game.actions.ts` (newGameRequested, letterTapped, wordSubmitted)
- **Reducers**: Pure functions in `game.reducer.ts` using Immer for immutable updates
- **Effects**: Side effects in `game.effects.ts` for async operations
- **Selectors**: Memoized selectors in `game.selectors.ts` for derived state

#### Hydration Store (`2. store/hydration/`)
- **State**: Defined in `hydration.state.ts` with `HydrationState` interface (currently empty)
- **Actions**: Hydration actions in `hydration.actions.ts` (`hydrate`, `hydrateSuccess`)
- **Meta-Reducer**: `hydrationMetaReducer` in `hydration.reducer.ts` handles state replacement on successful hydration
- **Effects**: Side effects in `hydration.effects.ts` implementing `OnInitEffects` for automatic initialization
- **LocalStorage Integration**: Uses `LocalStorageService` to persist and retrieve state
- **Note**: No selectors file (hydration operates at the meta-reducer level)

#### Important: Immer Usage in Reducers

**ALWAYS use Immer's `produce` function for state updates in reducers. NEVER use spread operators.**

```typescript
// ❌ WRONG - Don't use spread operators
on(someAction, (state) => ({
  ...state,
  someProperty: newValue
}))

// ✅ CORRECT - Use Immer's produce
on(someAction, (state) =>
  produce(state, (draft) => {
    draft.someProperty = newValue;
  })
)
```

Immer allows you to write "mutative" logic that is actually immutable under the hood. This makes the code more readable and less error-prone than manual spreading.

#### State Hydration System

The application implements automatic state persistence using a hydration system:

**How it Works:**
1. `HydrationEffects` implements `OnInitEffects` to automatically dispatch `hydrate` action on app startup
2. The `hydrate$` effect checks `LocalStorageService.getState()` for saved state
3. If state exists → dispatches `hydrateSuccess` with the saved state
4. If no state exists → dispatches `newGameRequested` to start a fresh game
5. `hydrationMetaReducer` intercepts `hydrateSuccess` actions and replaces entire state
6. State is automatically saved via separate effects when words are found (handled outside hydration store)

**Key Components:**
- `LocalStorageService`: Handles localStorage persistence with JSON serialization/deserialization
- `hydrationMetaReducer`: Meta-reducer that replaces state on successful hydration
- `HydrationEffects`: Manages hydration flow and fallback to new game

**Important Notes:**
- The hydration system operates at the store level, not individual feature stores
- State saving happens automatically when game state changes (via other effects)
- The system gracefully handles corrupted or missing localStorage data
- GameComponent no longer dispatches `newGameRequested` in `ngOnInit` (hydration handles initialization)

### Key Architecture Patterns

1. **Component-Store Pattern**: Components dispatch actions and select from store using observables
2. **Immutable State**: Uses Immer for immutable state updates in reducers
3. **Reactive Programming**: Heavy use of RxJS observables throughout
4. **Angular Material**: UI components from Angular Material library
5. **SASS**: Styling using SASS with kebab-case component selectors

### Testing Setup

- **Framework**: Jasmine with Karma test runner
- **Mocking**: Uses ng-mocks and @faker-js/faker for test data
- **Coverage**: Available in `coverage/` directory after running tests

### Game Data

- Game words are stored in `src/assets/games.en.ts` (from Webster's Unabridged Dictionary)
- `GameService` randomly selects games from this static data

### ESLint Configuration

The project uses ESLint v9 with:
- TypeScript ESLint rules
- Angular ESLint rules with strict component/directive selector patterns
- NgRx ESLint plugin with all rules enabled
- Template accessibility rules