# ERD Viewer - Implementation Roadmap

This roadmap outlines the planned feature development for ERD Viewer following the OpenSpec-driven development approach.

## Current Status: Phase 2 Complete ✅

**Phase 0: Project Foundation** (Completed)
- ✅ TypeScript + Vite build system
- ✅ Type definitions for .erdv files
- ✅ Basic UI skeleton
- ✅ Browser compatibility checks
- ✅ Documentation and README

**Phase 1: File Upload & Validation** (Completed)
- ✅ Drag-and-drop file upload interface
- ✅ File selection via button
- ✅ JSON Schema validation using ajv (8.17.1)
- ✅ User-friendly error messages for validation failures
- ✅ Metadata display (model name, database, entity count, relationship count)
- ✅ State management for loaded models
- ✅ Comprehensive error handling
- ✅ Loading indicators and visual feedback
- ✅ Accessibility support (ARIA labels, keyboard navigation)

**Implementation Details:**
- Created [src/state.ts](src/state.ts) for application state management
- Created [src/validation.ts](src/validation.ts) with ajv integration
- Created [src/fileUpload.ts](src/fileUpload.ts) for file handling
- Updated [index.html](index.html) with upload UI elements
- Updated [src/styles.css](src/styles.css) with comprehensive styling
- Build size: 135.94 KB (42.83 KB gzipped)

---

## Phase 2: Basic ERD Rendering (Completed ✅)

**Goal:** Render entities (tables) on canvas without relationships

### Capabilities Implemented:
1. ✅ **entity-rendering** - Render tables as boxes with columns
2. ✅ **canvas-management** - Basic canvas setup and initialization

### Features Implemented:
- ✅ Render each entity as a visually distinct box
- ✅ Three sections per entity:
  - Header: table name and schema (blue background)
  - Primary key section: columns with (PK) notation (light blue background)
  - Regular columns section: remaining columns with (FK) notation where applicable (white background)
- ✅ Each column on a separate line with data type
- ✅ Simple grid layout with horizontal centering
- ✅ HTML5 Canvas API for rendering
- ✅ High-DPI display support (retina, 4K)
- ✅ Responsive canvas sizing

### Implementation Details:
- Created [src/renderer.ts](src/renderer.ts) - Canvas management and entity rendering
- Created [src/layout.ts](src/layout.ts) - Grid layout algorithm
- Updated [src/fileUpload.ts](src/fileUpload.ts) - Triggers rendering after validation
- Updated [src/main.ts](src/main.ts) - Canvas initialization
- Updated [index.html](index.html) - Added canvas element
- Updated [src/styles.css](src/styles.css) - Canvas styling

### Acceptance Criteria Met:
- ✅ All entities from uploaded file are rendered
- ✅ Entity boxes have clear visual hierarchy (header, PK section, columns)
- ✅ Primary key columns show (PK) notation
- ✅ Foreign key columns show (FK) notation
- ✅ Entities are readable and properly styled
- ✅ Grid layout centers entities and handles wrapping
- ✅ Canvas clears when uploading new file

---

## Phase 3: Relationship Rendering

**Goal:** Draw relationship lines between entities using crow's foot notation

### Capabilities to Implement:
1. **relationship-rendering** - Draw lines connecting parent/child entities
2. **crows-foot-notation** - Implement crow's foot cardinality symbols

### Features:
- Draw lines from parent entity (primary key) to child entity (foreign key)
- Implement crow's foot notation for cardinality:
  - 0..1, 1..1, 0..N, 1..N
- Support different line styles:
  - Straight lines
  - Rounded lines
  - Orthogonal (right-angle) lines
- Line style selector in UI
- Lines connect to specific columns (or entity edges)

### Acceptance Criteria:
- All relationships are rendered as lines
- Crow's foot notation correctly represents cardinality
- Users can switch between line styles (straight, rounded, orthogonal)
- Lines are visually distinct from entities
- Identifying vs Non-Identifying relationships are visually different (optional enhancement)

### Dependencies:
- Phase 2 (entity rendering) must be complete

### Estimated Effort: 4-5 days

---

## Phase 4: Interactive Canvas

**Goal:** Enable zoom, pan, and drag interactions

### Capabilities to Implement:
1. **canvas-zoom-pan** - Zoom in/out and pan across canvas
2. **entity-dragging** - Drag entities to reposition them
3. **relationship-updates** - Update relationship lines when entities move

### Features:
- Zoom in/out (mouse wheel, buttons, pinch on touch devices)
- Pan across canvas (click-drag on background, or dedicated pan mode)
- Drag individual entities to new positions
- Relationship lines automatically update when entities move
- Maintain entity positions in application state
- Reset view button to return to initial state

### Acceptance Criteria:
- Users can zoom in/out smoothly
- Users can pan across the entire canvas
- Users can drag entities to any position
- Relationship lines stay connected and update dynamically
- Zoom/pan/drag interactions feel smooth and responsive
- Canvas doesn't "jump" or have jarring movements

### Dependencies:
- Phase 3 (relationship rendering) must be complete

### Estimated Effort: 4-5 days

---

## Phase 5: Subject Areas

**Goal:** Support subject area filtering and switching

### Capabilities to Implement:
1. **subject-area-detection** - Parse and detect subject areas from file
2. **subject-area-selection** - UI for selecting subject areas
3. **subject-area-filtering** - Filter entities and relationships by subject area

### Features:
- Detect subject areas at file load time
- Implicit "All" subject area for entities not in any subject area
- Subject area selector dropdown/menu
- On subject area selection:
  - Render only entities in selected subject area
  - Hide relationships to entities outside the subject area
  - Re-render canvas with filtered entities
- Ability to switch subject areas dynamically
- Show entity count per subject area

### Acceptance Criteria:
- Subject areas are detected from uploaded file
- Users can select a subject area from a list
- Only entities in selected subject area are rendered
- Cross-subject-area relationships are hidden
- Users can switch between subject areas seamlessly
- "All" subject area shows all entities

### Dependencies:
- Phase 4 (interactive canvas) must be complete

### Estimated Effort: 3-4 days

---

## Phase 6: Entity Selection

**Goal:** Allow users to select entities for future operations

### Capabilities to Implement:
1. **entity-selection** - Select one, many, all, or none entities
2. **selection-ui** - Visual feedback for selected entities

### Features:
- Click to select/deselect single entity
- Ctrl+Click (Cmd+Click on Mac) for multi-select
- Select All button
- Deselect All button
- Selection rectangle (drag to select multiple)
- Visual highlight for selected entities
- Selection count display

### Acceptance Criteria:
- Users can select individual entities by clicking
- Users can multi-select with Ctrl/Cmd+Click
- Users can select all entities with button
- Users can deselect all entities with button
- Selected entities have clear visual indicator
- Selection state persists during zoom/pan/drag
- Selection respects subject area filtering (only entities in current subject area)

### Dependencies:
- Phase 5 (subject areas) must be complete

### Estimated Effort: 2-3 days

---

## Phase 7: Auto-Layout Algorithms

**Goal:** Provide automatic layout options for organizing entities

### Capabilities to Implement:
1. **layout-algorithms** - Implement multiple layout algorithms
2. **layout-ui** - UI for selecting and applying layouts

### Features:
- Multiple layout algorithms:
  - **Hierarchical**: Top-down tree layout based on relationships
  - **Force-Directed**: Physics-based layout (entities repel, relationships attract)
  - **Circular**: Arrange entities in a circle
  - **Grid**: Simple grid arrangement
- Layout selector dropdown/menu
- "Apply Layout" button
- Animation during layout transition (optional)
- Preserve user-moved entities option (optional)

### Acceptance Criteria:
- Users can choose from multiple layout algorithms
- Applying a layout repositions all entities
- Layouts respect relationship structure (hierarchical, force-directed)
- Layout algorithms work with filtered subject areas
- Layout application is smooth and predictable
- Users can still manually adjust after auto-layout

### Dependencies:
- Phase 6 (entity selection) must be complete
- May require graph layout library (e.g., dagre, elkjs, d3-force)

### Estimated Effort: 5-7 days

---

## Phase 8: Image Export

**Goal:** Allow users to export the ERD as image files

### Capabilities to Implement:
1. **image-export** - Export canvas to PNG, JPG, SVG

### Features:
- Export to PNG format
- Export to JPG format
- Export to SVG format (vector)
- Export button with format selector
- Download file with meaningful filename (e.g., "modelName-ERD.png")
- Export captures current zoom/pan state
- Export only visible area vs entire diagram option

### Acceptance Criteria:
- Users can export to PNG, JPG, and SVG
- Exported images accurately represent the rendered ERD
- Exported files download with appropriate filename
- Image quality is suitable for documentation/sharing
- Export works regardless of zoom level
- SVG export preserves vector quality

### Dependencies:
- Phase 7 (auto-layout) must be complete
- May require html2canvas or canvas toBlob APIs

### Estimated Effort: 2-3 days

---

## Phase 9: Polish & Enhancement

**Goal:** Improve UX, performance, and add nice-to-have features

### Capabilities to Implement:
1. **performance-optimization** - Handle large diagrams efficiently
2. **ux-improvements** - Tooltips, keyboard shortcuts, accessibility
3. **visual-enhancements** - Themes, colors, styling options

### Features:
- Performance optimizations for large models (100+ entities)
- Tooltips on hover (entity details, relationship info)
- Keyboard shortcuts (delete, copy, zoom, pan)
- Accessibility improvements (ARIA labels, keyboard navigation)
- Theme selector (light/dark mode)
- Color customization options
- Minimap for navigation (optional)
- Search/filter entities by name
- Print-friendly mode

### Acceptance Criteria:
- Application performs well with 100+ entity models
- Tooltips provide helpful context
- Common operations have keyboard shortcuts
- Application is accessible to screen readers
- Users can toggle light/dark theme
- Minimap helps with navigation (if implemented)
- Search quickly locates entities

### Dependencies:
- All previous phases complete

### Estimated Effort: 5-7 days

---

## Phase 10: Testing & Documentation

**Goal:** Comprehensive testing and user documentation

### Capabilities to Implement:
1. **automated-testing** - Unit, integration, and E2E tests
2. **user-documentation** - User guide, examples, troubleshooting

### Features:
- Unit tests for core logic (validation, parsing, layout algorithms)
- Integration tests for file upload → rendering pipeline
- Visual regression tests for ERD rendering
- E2E tests for user workflows
- User guide with screenshots
- Example .erdv files
- Troubleshooting guide
- API documentation (if exposing any)

### Acceptance Criteria:
- >80% code coverage with unit tests
- All critical user paths have E2E tests
- Visual regression tests catch rendering issues
- User guide covers all major features
- Example files demonstrate various scenarios
- Troubleshooting guide addresses common issues

### Dependencies:
- All previous phases complete

### Estimated Effort: 7-10 days

---

## Summary Timeline

| Phase | Description | Effort | Dependencies |
|-------|-------------|--------|--------------|
| 0 | Project Foundation | ✅ Complete | - |
| 1 | File Upload & Validation | 2-3 days | Phase 0 |
| 2 | Basic ERD Rendering | 3-4 days | Phase 1 |
| 3 | Relationship Rendering | 4-5 days | Phase 2 |
| 4 | Interactive Canvas | 4-5 days | Phase 3 |
| 5 | Subject Areas | 3-4 days | Phase 4 |
| 6 | Entity Selection | 2-3 days | Phase 5 |
| 7 | Auto-Layout | 5-7 days | Phase 6 |
| 8 | Image Export | 2-3 days | Phase 7 |
| 9 | Polish & Enhancement | 5-7 days | Phase 8 |
| 10 | Testing & Documentation | 7-10 days | Phase 9 |

**Total Estimated Effort:** 38-51 days (roughly 2-2.5 months for a single developer)

---

## Technology Decisions to Make

Before starting each phase, consider:

### Phase 2-4 (Rendering & Canvas):
- **Canvas API vs SVG vs Library?**
  - Canvas API: Better performance, harder to interact with elements
  - SVG: Easier DOM manipulation, better for interactions
  - Library (Konva.js, Fabric.js, D3.js): Faster development, larger bundle
  - **Recommendation:** Start with SVG for easier interactions, optimize to Canvas later if needed

### Phase 3 (Relationships):
- **Line drawing library?**
  - Native SVG paths: Full control, more code
  - Library (e.g., LeaderLine, perfect-arrows): Faster implementation
  - **Recommendation:** Native SVG for orthogonal, library for rounded

### Phase 7 (Auto-Layout):
- **Layout algorithm library?**
  - dagre: Good for hierarchical layouts
  - elkjs: Multiple algorithms, more powerful
  - d3-force: Excellent force-directed layouts
  - **Recommendation:** elkjs for flexibility, or dagre + d3-force combined

### Phase 8 (Image Export):
- **Export library?**
  - Native canvas toBlob: Built-in, no dependencies
  - html2canvas: Easier for complex DOM, larger bundle
  - **Recommendation:** Native if using Canvas/SVG directly

---

## Next Steps

1. **Review and approve this roadmap**
2. **Create OpenSpec proposal for Phase 1** (file upload & validation)
3. **Begin implementation following OpenSpec workflow**
4. **Iterate phase by phase, testing after each**

---

## Notes

- Each phase should follow the OpenSpec proposal → approval → implementation workflow
- Phases can be broken down further into smaller changes if needed
- User feedback after each phase can inform priorities for subsequent phases
- Performance optimizations may be needed earlier if testing with large models
- Consider deploying to GitHub Pages or similar after Phase 3 for early user testing
