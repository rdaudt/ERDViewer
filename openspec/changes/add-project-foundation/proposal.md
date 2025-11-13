# Change: Add Project Foundation

## Why
ERD Viewer needs a baseline web application structure to enable all future features. Currently, there is no runnable application—only requirements documentation and file specifications. This change establishes the minimal technical foundation required to build upon.

## What Changes
- Initialize vanilla HTML/CSS/JavaScript project with TypeScript support
- Set up build tooling (Vite for fast development and bundling)
- Create basic application structure (index.html, main entry point)
- Configure TypeScript with strict mode
- Add development server with hot reload
- Establish file structure conventions for future features
- Create minimal UI skeleton (header, main canvas area, file upload placeholder)

**Technical Decisions:**
- **No framework** - Start with vanilla JavaScript/TypeScript per project conventions (simplicity first)
- **Vite** - Lightweight, fast, modern build tool with excellent TypeScript support
- **Single-file start** - Keep components in single files until complexity demands separation
- **Browser-native APIs** - Use standard File API, Canvas API without libraries initially

## Impact
- **Affected specs:** `project-foundation` (new capability)
- **Affected code:** New files only (no existing code)
- **Dependencies:** Node.js/npm required for development
- **Breaking:** None (first implementation)

## Success Criteria
- `npm run dev` starts development server
- Application loads in browser at `http://localhost:5173`
- TypeScript compiles without errors
- Basic UI skeleton visible with placeholder for file upload
- `npm run build` produces optimized production bundle
