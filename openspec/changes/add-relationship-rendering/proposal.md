# Change: Add Relationship Rendering (Phase 3)

## Why
Phase 2 renders entities on the canvas, but without relationship lines, users cannot see how tables are connected. To complete the core ERD visualization, we need to render relationship lines between entities using standard crow's foot notation to show foreign key relationships and cardinality.

## What Changes
- **Relationship Line Rendering**: Draw lines connecting parent and child entities
- **Crow's Foot Notation**: Implement visual cardinality symbols at line endpoints
  - `0..1` - Optional single (circle + line)
  - `1..1` - Required single (line only)
  - `0..N` - Optional multiple (circle + crow's foot)
  - `1..N` - Required multiple (crow's foot only)
- **Connection Points**: Calculate connection points on entity boxes (edges or specific column positions)
- **Line Styles**: Support for straight, rounded, and orthogonal (right-angle) line routing
- **Line Style Selector**: UI control to switch between line styles
- **Relationship Types**: Visual distinction between Identifying and Non-Identifying relationships (optional)
- **Render Order**: Draw relationships before entities to keep entity boxes on top

## Impact
- **New Capabilities**:
  - `relationship-rendering` - Draw lines connecting entities
  - `crows-foot-notation` - Visual cardinality representation
- **Affected Specs**:
  - NEW: `specs/relationship-rendering/spec.md`
  - NEW: `specs/crows-foot-notation/spec.md`
- **Affected Code**:
  - NEW: `src/relationships.ts` - Relationship line drawing and crow's foot rendering
  - MODIFIED: `src/renderer.ts` - Call relationship rendering before entities
  - MODIFIED: `src/layout.ts` - Track entity positions for relationship connections
  - MODIFIED: `src/state.ts` - Add line style preference state
  - MODIFIED: `index.html` - Add line style selector UI
  - MODIFIED: `src/styles.css` - Style line selector control
- **Dependencies**: Phase 2 (entity rendering) complete ✅
- **Breaking Changes**: None
