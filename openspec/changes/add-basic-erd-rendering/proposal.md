# Change: Add Basic ERD Rendering (Phase 2)

## Why
Phase 1 provides file upload and validation, but users cannot yet visualize their data models. To fulfill the core purpose of ERD Viewer, we need to render entities (tables) as visual boxes on a canvas, enabling users to see the structure of their database models.

## What Changes
- **Canvas Infrastructure**: Set up HTML canvas element and coordinate system for rendering
- **Entity Rendering**: Render each entity as a box with three sections:
  - Header section with table name and schema
  - Primary key section with (PK) notation
  - Regular columns section with (FK) notation for foreign keys
- **Simple Grid Layout**: Position entities in a basic grid layout (auto-layout algorithms deferred to Phase 7)
- **Responsive Canvas**: Canvas adapts to browser window size
- **Render Trigger**: Automatically render after successful file validation
- **Clear/Reset**: Clear canvas when uploading new file

## Impact
- **New Capabilities**:
  - `entity-rendering` - Render entities as styled boxes with columns
  - `canvas-management` - Manage canvas lifecycle and coordinate system
- **Affected Specs**:
  - NEW: `specs/entity-rendering/spec.md`
  - NEW: `specs/canvas-management/spec.md`
- **Affected Code**:
  - NEW: `src/renderer.ts` - Canvas management and rendering logic
  - NEW: `src/layout.ts` - Grid layout algorithm
  - MODIFIED: `src/fileUpload.ts` - Trigger rendering after validation
  - MODIFIED: `src/state.ts` - Add canvas state management
  - MODIFIED: `index.html` - Add canvas element
  - MODIFIED: `src/styles.css` - Add canvas and entity box styles
- **Dependencies**: None (builds on Phase 1)
- **Breaking Changes**: None
