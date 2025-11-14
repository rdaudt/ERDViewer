# Design: Basic ERD Rendering

## Context
ERD Viewer needs to render validated data models as visual diagrams. Phase 2 focuses on rendering entities without relationships (relationships deferred to Phase 3). This is a foundational change that establishes the rendering architecture for all future visualization features.

**Constraints:**
- Must work with existing validation and state management from Phase 1
- Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No external rendering libraries in Phase 2 (use native Canvas or SVG)
- Must handle models with 1-100+ entities
- Canvas must be responsive to window resizing

**Stakeholders:**
- End users: data practitioners who need to visualize their ERD models
- Future developers: will build on this rendering foundation for relationships, interactions, and auto-layout

## Goals / Non-Goals

**Goals:**
- Render all entities from a loaded model as visual boxes
- Clearly distinguish entity sections (header, primary keys, columns)
- Establish scalable rendering architecture for future phases
- Provide clear visual hierarchy and readability
- Handle responsive canvas sizing

**Non-Goals:**
- Relationship rendering (deferred to Phase 3)
- Interactive features like drag, zoom, pan (deferred to Phase 4)
- Auto-layout algorithms beyond simple grid (deferred to Phase 7)
- Subject area filtering (deferred to Phase 5)
- Performance optimization for 500+ entities (acceptable at this phase)

## Decisions

### Decision 1: Canvas vs SVG
**Choice:** Use HTML5 Canvas API for rendering

**Rationale:**
- Better performance for large diagrams (100+ entities)
- Simpler mental model for initial implementation
- Easier to implement custom rendering logic
- Sufficient for Phase 2 (no interactions yet)
- Can be replaced with SVG later if interactive features require DOM-based manipulation

**Alternatives considered:**
- SVG: Better for interactions (easier event handling), but more complex for initial rendering
- Rendering library (Konva.js, Fabric.js): Adds bundle size, premature for Phase 2

**Trade-offs:**
- Canvas requires manual hit detection for future interactions (acceptable for Phase 2)
- SVG would be easier for future drag-and-drop (can refactor in Phase 4 if needed)

### Decision 2: Grid Layout Algorithm
**Choice:** Simple row-based grid layout with fixed entity width and dynamic height

**Rationale:**
- Simplest algorithm to implement (<50 lines)
- Predictable, consistent layout
- Works well for 1-50 entities
- Good foundation for Phase 7 auto-layout algorithms
- Users know where to look (top-left to bottom-right)

**Algorithm:**
```
1. Define fixed entity width (e.g., 250px)
2. Calculate entity heights based on column count
3. Arrange entities left-to-right with padding
4. When row width exceeds canvas width, wrap to next row
5. Center the grid horizontally on canvas
```

**Alternatives considered:**
- Random placement: Poor UX, entities may overlap
- Circular layout: Overkill for Phase 2, better suited for Phase 7
- Force-directed layout: Requires relationships (Phase 3+)

### Decision 3: Entity Styling
**Choice:** Three-section box with distinct visual hierarchy

**Visual Design:**
```
┌─────────────────────────┐
│ TableName (dbo)         │ ← Header (darker bg, bold text)
├─────────────────────────┤
│ column1 (PK) int        │ ← Primary key section (light bg)
│ column2 (PK) varchar    │
├─────────────────────────┤
│ column3 varchar         │ ← Regular columns (white bg)
│ column4 (FK) int        │
│ column5 datetime        │
└─────────────────────────┘
```

**Styling Constants:**
- Entity width: 250px (fixed)
- Row height: 24px per column
- Header height: 32px
- Padding: 8px horizontal, 4px vertical
- Border: 1px solid #cbd5e1
- Header background: #3b82f6 (blue)
- PK section background: #e0f2fe (light blue)
- Regular section background: #ffffff (white)
- Text color: #1e293b (dark gray)

**Rationale:**
- Clear visual hierarchy matches common ERD conventions
- Distinct sections help users quickly identify primary keys
- (FK) notation makes foreign keys visible even without relationship lines (Phase 2)
- Colors align with existing design system (CSS variables from Phase 1)

### Decision 4: Foreign Key Detection
**Choice:** Compare column names with relationship definitions from model

**Algorithm:**
```
For each column in entity:
  1. Check if column.name appears in any relationship.child_foreign_key_column
  2. If yes, render with (FK) notation
  3. If also in primary_key_columns, render with (PK, FK) notation
```

**Rationale:**
- Accurate FK detection using model data
- Simple lookup in relationships array
- Handles composite foreign keys correctly
- Handles columns that are both PK and FK

**Alternatives considered:**
- Naming convention heuristics (e.g., column ends with "_id"): Inaccurate, unreliable
- No FK notation in Phase 2: Removes valuable information for users

### Decision 5: Text Overflow Handling
**Choice:** Truncate long column names with ellipsis (...)

**Rationale:**
- Prevents entity boxes from becoming too wide
- Maintains consistent entity width (250px)
- User can identify column by first N characters
- Full column details can be shown in tooltips (Phase 9)

**Algorithm:**
```
Max column text width: 230px (250px - 2*8px padding - space for notation)
If text width exceeds max:
  - Truncate text
  - Append "..."
  - Render within bounds
```

**Alternatives considered:**
- Word wrap: Makes entity boxes very tall for long names
- Horizontal scrolling: Not supported in Canvas
- Variable width entities: Complicates grid layout

### Decision 6: Rendering Pipeline
**Choice:** Sequential rendering triggered by file validation success

**Pipeline:**
```
1. User uploads file
2. File validation succeeds (Phase 1)
3. Model stored in state (Phase 1)
4. Trigger renderModel() function
5. Clear canvas
6. Run grid layout algorithm → calculate positions
7. Render each entity at calculated position
8. Show success message with entity count
```

**Rationale:**
- Automatic rendering improves UX (no extra button click)
- Clear separation between validation (Phase 1) and rendering (Phase 2)
- Modular design allows easy integration of future layout algorithms (Phase 7)

**Error Handling:**
- Rendering errors logged to console
- User sees error message: "Rendering failed. See console for details."
- Upload interface remains functional (user can try different file)

## Risks / Trade-offs

### Risk 1: Canvas performance with 100+ entities
**Impact:** Medium
**Likelihood:** Low (Phase 2 targets <50 entities)
**Mitigation:**
- Acceptable for Phase 2; optimization deferred to Phase 9
- If performance issues arise, implement canvas layer rendering
- Consider switching to SVG for smaller models (<20 entities)

### Risk 2: Fixed entity width limits long column names
**Impact:** Low
**Likelihood:** High
**Mitigation:**
- Truncate with ellipsis (Decision 5)
- Plan for tooltips in Phase 9 to show full names
- Users can see enough characters to identify columns (tested with 230px max width)

### Risk 3: Grid layout becomes cluttered with 50+ entities
**Impact:** Medium
**Likelihood:** Medium
**Mitigation:**
- Acceptable for Phase 2 (focus is on basic rendering, not optimal layout)
- Phase 7 will introduce advanced auto-layout algorithms
- Phase 4 (zoom/pan) will help navigate large diagrams
- Phase 5 (subject areas) will filter entity count

### Risk 4: Canvas doesn't support accessibility (screen readers)
**Impact:** High
**Likelihood:** High
**Mitigation:**
- Add ARIA labels to canvas element
- Provide text-based entity list in DOM (hidden visually, accessible to screen readers)
- Plan for comprehensive accessibility in Phase 9

## Migration Plan

**No migration needed** - This is a new capability, not modifying existing behavior.

**Rollback:**
- If Phase 2 has critical issues, users can still upload and validate files (Phase 1 functionality remains)
- Rendering code is isolated in new modules (renderer.ts, layout.ts) and can be disabled without affecting validation

## Open Questions

1. **Should we show schema name in entity header?**
   - Proposed: Yes - show as `TableName (schema)` in header
   - Rationale: Helps distinguish entities with same name in different schemas
   - Decision: **Yes** - include schema in header

2. **Should we render entities with zero columns (schema-only tables)?**
   - Edge case: Some models may have malformed entities
   - Proposed: Skip rendering if entity has no columns, log warning
   - Decision: **Yes** - skip and log warning

3. **Should we center the grid on the canvas?**
   - Proposed: Yes - center horizontally, align top vertically
   - Rationale: Better aesthetics, easier to see all entities
   - Decision: **Yes** - center horizontally

4. **What should be the default canvas size?**
   - Proposed: Fill the available space below the upload section
   - Min height: 600px
   - Max height: 90vh (90% of viewport height)
   - Width: 100% of container
   - Decision: **Yes** - responsive sizing with these constraints
