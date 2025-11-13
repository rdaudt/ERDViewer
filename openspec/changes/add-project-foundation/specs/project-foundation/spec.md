# Capability: Project Foundation

## ADDED Requirements

### Requirement: Development Environment Setup
The project SHALL provide a development environment that enables rapid iteration with TypeScript compilation, hot module replacement, and a local development server.

#### Scenario: Developer starts development server
- **WHEN** developer runs `npm install` followed by `npm run dev`
- **THEN** a development server starts on `http://localhost:5173`
- **AND** the application loads in the browser without errors
- **AND** changes to source files trigger automatic browser refresh

#### Scenario: TypeScript compilation errors are caught
- **WHEN** developer writes TypeScript code with type errors
- **THEN** the development server displays compilation errors in the terminal
- **AND** the browser shows an error overlay with the issue
- **AND** no invalid JavaScript is executed

### Requirement: Production Build System
The project SHALL provide a production build command that generates optimized, deployable assets.

#### Scenario: Production build succeeds
- **WHEN** developer runs `npm run build`
- **THEN** a `dist/` directory is created with optimized assets
- **AND** JavaScript is minified and bundled
- **AND** TypeScript is compiled to browser-compatible JavaScript
- **AND** no build errors or warnings are present

#### Scenario: Production build is deployable
- **WHEN** production build completes
- **THEN** the `dist/` directory contains all necessary files
- **AND** files can be served by any static web server
- **AND** the application loads without requiring a build process

### Requirement: TypeScript Type Safety
The project SHALL use TypeScript with strict mode enabled to ensure type safety throughout the codebase.

#### Scenario: Strict type checking is enforced
- **WHEN** TypeScript code is compiled
- **THEN** strict mode options are enabled (noImplicitAny, strictNullChecks, etc.)
- **AND** type errors prevent compilation
- **AND** all code must have explicit or inferred types

#### Scenario: ERDV file types are defined
- **WHEN** the application needs to work with .erdv file structure
- **THEN** TypeScript interfaces exist matching the erdv_file_spec.json schema
- **AND** these types are available for import throughout the codebase
- **AND** type definitions include metadata, entities, relationships, and subject areas

### Requirement: Application Structure
The project SHALL follow a clear, organized file structure that supports future feature development.

#### Scenario: File organization is logical
- **WHEN** a developer explores the project structure
- **THEN** source code is located in `src/` directory
- **AND** the entry point is `src/main.ts`
- **AND** type definitions are in `src/types.ts`
- **AND** styles are in `src/styles.css`
- **AND** the HTML entry is `index.html` at the project root

#### Scenario: Configuration files are present
- **WHEN** the project is opened
- **THEN** `package.json` exists with project metadata and scripts
- **AND** `tsconfig.json` exists with TypeScript configuration
- **AND** `vite.config.ts` exists with build configuration
- **AND** all configuration files are properly formatted and valid

### Requirement: Minimal User Interface Skeleton
The application SHALL provide a basic HTML structure with placeholders for future features.

#### Scenario: Application loads with basic UI
- **WHEN** the application is opened in a browser
- **THEN** a header is visible with the application name "ERD Viewer"
- **AND** a main canvas area is present for future ERD rendering
- **AND** a placeholder area exists indicating where file upload will be
- **AND** the page uses semantic HTML5 elements
- **AND** basic styling makes the layout clear and usable

#### Scenario: No console errors on load
- **WHEN** the application loads in the browser
- **THEN** no JavaScript errors appear in the console
- **AND** no TypeScript compilation errors exist
- **AND** all resources load successfully

### Requirement: Browser Compatibility
The application SHALL target modern evergreen browsers with ES2020+ support.

#### Scenario: Modern browser features are available
- **WHEN** the application runs in a modern browser
- **THEN** ES2020 features (optional chaining, nullish coalescing) are supported
- **AND** native ES modules work correctly
- **AND** File API is available for future file upload
- **AND** Canvas API is available for future rendering

#### Scenario: Unsupported browsers show guidance
- **WHEN** the application is opened in an outdated browser
- **THEN** a clear message indicates modern browser requirement
- **AND** suggested browsers are listed (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Requirement: Development Workflow Scripts
The project SHALL provide npm scripts for common development tasks.

#### Scenario: Available npm scripts work correctly
- **WHEN** developer runs `npm run dev`
- **THEN** development server starts with hot reload
- **WHEN** developer runs `npm run build`
- **THEN** production bundle is created in `dist/`
- **WHEN** developer runs `npm run preview`
- **THEN** production build is served locally for testing

#### Scenario: Dependencies are properly managed
- **WHEN** developer runs `npm install`
- **THEN** all required dependencies are installed
- **AND** dependency versions are locked in `package-lock.json`
- **AND** no security vulnerabilities are present in dependencies
