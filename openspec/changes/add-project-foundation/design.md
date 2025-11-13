# Design: Project Foundation

## Context
ERD Viewer is a browser-based visualization tool for relational data models. This is the initial implementation establishing the technical foundation. Key constraints:
- **No backend** - Pure client-side application
- **File-based input** - Users upload .erdv JSON files
- **Simplicity first** - Per project conventions, avoid frameworks until proven necessary
- **Progressive enhancement** - Start minimal, add complexity only when required

## Goals / Non-Goals

### Goals
- Runnable development environment with hot reload
- TypeScript compilation with strict type checking
- Production build optimization (minification, bundling)
- Clear file structure for future feature additions
- Fast iteration cycle for developers

### Non-Goals
- Backend server or API (pure client-side)
- Complex framework integration (React/Vue/etc.) - defer until needed
- CSS framework or component library - use vanilla CSS
- Testing infrastructure (defer to future change when code exists to test)
- CI/CD pipeline (defer to future change)

## Decisions

### Decision: Use Vite as build tool
**Rationale:**
- Modern, fast, excellent TypeScript support out of box
- Minimal configuration required
- Hot module replacement for rapid development
- Optimized production builds with tree-shaking
- Wide adoption and good documentation

**Alternatives considered:**
- Webpack: More complex configuration, slower dev server
- Parcel: Less control, smaller ecosystem
- No bundler: Poor development experience, manual TypeScript compilation

### Decision: Vanilla JavaScript/TypeScript (no framework)
**Rationale:**
- Aligns with project convention: simplicity first, <100 lines per change
- ERD rendering is primarily canvas/SVG manipulation (framework overhead unnecessary)
- Easier to reason about, no framework lock-in
- Can add framework later if complexity demands it

**Alternatives considered:**
- React: Excellent for complex UIs, but overkill for canvas-heavy app
- Vue: Simpler than React, but still unnecessary overhead initially
- Svelte: Compiles to vanilla JS, but adds learning curve

### Decision: TypeScript with strict mode
**Rationale:**
- Catch errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types
- Aligns with erdv_file_spec.json (can generate types from schema)

### Decision: Minimal UI skeleton only
**Rationale:**
- Keep change scope tight (per OpenSpec conventions)
- File upload, ERD rendering, interactions are separate capabilities
- Focus on establishing foundation, not building features

## Project Structure
```
erd-viewer/
├── index.html              # Entry HTML file
├── src/
│   ├── main.ts             # Application entry point
│   ├── styles.css          # Global styles
│   └── types.ts            # TypeScript type definitions (erdv model)
├── public/                 # Static assets (if needed)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── erdv_file_spec.json     # Schema (existing)
└── data_model_example.yaml # Example data (existing)
```

## Technology Stack
- **Runtime:** Browser (ES2020+, modern evergreen browsers)
- **Language:** TypeScript 5.x (strict mode)
- **Build Tool:** Vite 5.x
- **Dev Server:** Vite dev server (HMR enabled)
- **Module System:** ES Modules (native browser support)

## Risks / Trade-offs

### Risk: Vanilla approach may not scale
**Impact:** May need to refactor to framework later if UI complexity grows
**Mitigation:**
- Follow component-like patterns even in vanilla JS
- Isolate DOM manipulation logic
- Use TypeScript for structure and type safety
- Monitor code complexity; propose framework migration if >500 LOC or state management becomes unwieldy

### Risk: No testing infrastructure initially
**Impact:** Potential bugs, harder to refactor confidently
**Mitigation:**
- Accept this risk for MVP foundation
- Add testing in next change after code exists to test
- Manual testing sufficient for basic scaffold

### Trade-off: Vite vs simplicity
**Reasoning:** While a build tool adds complexity, the benefits (TypeScript compilation, dev server, hot reload, production optimization) far outweigh manual setup complexity.

## Migration Plan
N/A - This is the initial implementation with no existing code to migrate.

## Open Questions
None - scope is well-defined and minimal.
