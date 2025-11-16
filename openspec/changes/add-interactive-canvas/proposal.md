# Proposal: Interactive Canvas (Phase 4)

## Change ID
`add-interactive-canvas`

## Summary
Enable zoom, pan, and entity dragging interactions on the ERD canvas to allow users to explore large diagrams and customize entity positions.

## Why
After Phase 3, users can view complete ERD diagrams with entities and relationships. However, for larger models (20+ entities), users need:
- **Zoom** to focus on specific areas or see the entire diagram
- **Pan** to navigate across large diagrams that exceed the viewport
- **Drag entities** to customize layout and reduce line crossings

Without these interactions, ERD Viewer is limited to small models that fit in a single viewport. This phase is critical for making the tool useful with real-world data models.

Real-world data models often have 50-100+ entities. Without zoom/pan, these diagrams are unusable. Entity dragging allows users to reduce line crossings and create more readable layouts, which is essential for understanding complex relationship structures.

## Scope

### In Scope
1. **Zoom functionality** (mouse wheel, pinch gestures, zoom buttons)
2. **Pan functionality** (click-drag on canvas background)
3. **Entity dragging** (click-drag individual entities)
4. **Transform state management** (zoom level, pan offset, entity positions)
5. **Relationship line updates** (automatically redraw when entities move)
6. **Zoom/pan UI controls** (zoom in/out buttons, reset button)
7. **Coordinate transformations** (screen ↔ canvas coordinate mapping)

### Out of Scope
- Entity selection (deferred to Phase 6)
- Multi-entity dragging (deferred to Phase 6)
- Snap-to-grid or alignment guides (deferred to Phase 7)
- Undo/redo for entity movements (deferred to Phase 9)
- Saving custom entity positions to file (may never implement - read-only viewer)
- Touch/gesture optimizations beyond basic pinch-zoom (defer if needed)

## Proposed Changes

### Spec Deltas

#### 1. canvas-zoom-pan (NEW CAPABILITY)
**Purpose:** Enable zoom and pan interactions for exploring large diagrams

**ADDED Requirements:**
- Zoom In/Out (mouse wheel, buttons)
- Pan canvas (drag background)
- Zoom limits (min 10%, max 500%)
- Transform state management
- Coordinate system transformations
- Reset view button
- Smooth zoom/pan animations

**Related to:** canvas-management (modifies rendering transform)

#### 2. entity-dragging (NEW CAPABILITY)
**Purpose:** Allow users to reposition entities by dragging

**ADDED Requirements:**
- Detect entity click/drag
- Update entity position during drag
- Redraw relationships during drag
- Persist entity positions in session
- Prevent entity overlap detection (optional)
- Drag cursor feedback

**Related to:** entity-rendering, relationship-rendering

### File Changes

**New Files:**
- `src/interactions.ts` - Mouse/touch event handling, zoom/pan/drag logic

**Modified Files:**
- `src/renderer.ts` - Apply canvas transforms, expose entity hit testing
- `src/state.ts` - Store zoom level, pan offset, custom entity positions
- `src/layout.ts` - Return mutable LayoutPosition array for drag updates
- `src/relationships.ts` - Support re-rendering with custom positions
- `index.html` - Add zoom controls UI (zoom in/out/reset buttons)
- `src/styles.css` - Style zoom controls, drag cursors

## Design Decisions

### Decision 1: Canvas Transform API vs Manual Coordinate Mapping
**Choice:** Use Canvas Transform API (`ctx.translate()`, `ctx.scale()`)

**Rationale:**
- Native canvas transforms handle all rendering automatically
- Simpler implementation (no manual coordinate conversion for rendering)
- Better performance (GPU-accelerated in modern browsers)
- Only need coordinate mapping for hit testing

**Alternative Considered:** Manual coordinate mapping - more complex, harder to maintain

### Decision 2: Transform Application Order
**Choice:** Pan first, then zoom (translate → scale)

**Rationale:**
- Zoom centers on pan position
- Standard pattern in canvas applications
- Transform order: `ctx.translate(panX, panY)` then `ctx.scale(zoom, zoom)`

### Decision 3: Entity Position Storage
**Choice:** Store custom positions in state.ts, fall back to grid layout

**Rationale:**
- Session-scoped (positions reset when new file loads)
- Grid layout is default, dragging overrides specific entities
- No file format changes (read-only viewer)
- Positions stored as `Map<entityName, {x, y}>`

### Decision 4: Drag Detection Strategy
**Choice:** Simple bounding box hit testing

**Rationale:**
- Entities are rectangular boxes - simple AABB collision
- Performance adequate for 100+ entities
- More sophisticated hit testing deferred to Phase 6

### Decision 5: Relationship Redraw Strategy
**Choice:** Full diagram re-render on pan/zoom/drag

**Rationale:**
- Canvas rendering is fast enough for 100 entities + relationships
- Simpler than partial updates
- Avoids visual artifacts from partial redraws
- If performance issues arise, can optimize in Phase 9

## Risks & Mitigations

### Risk 1: Performance with large models (100+ entities)
**Impact:** Medium
**Likelihood:** Medium
**Mitigation:**
- Test with 100-entity models
- Throttle drag events (16ms = 60fps)
- Defer expensive optimizations to Phase 9 if needed

### Risk 2: Touch device compatibility
**Impact:** Low
**Likelihood:** Low
**Mitigation:**
- Support basic pinch-zoom with `touchstart`/`touchmove`
- Desktop-first approach (mobile optimizations in Phase 9)

### Risk 3: Coordinate mapping bugs (off-by-one errors)
**Impact:** High (breaks hit testing)
**Likelihood:** Medium
**Mitigation:**
- Unit tests for coordinate conversions
- Visual debugging overlay (show click coordinates)

### Risk 4: User confusion about temporary positions
**Impact:** Low
**Likelihood:** Medium
**Mitigation:**
- Clear "Reset View" button resets to grid layout
- Positions lost on new file load (expected behavior)
- Future: Toast notification "Custom layout will be lost on reload"

## Testing Strategy

### Manual Testing
- Zoom in/out with mouse wheel
- Zoom with buttons
- Pan by dragging canvas
- Drag entities
- Verify relationships redraw correctly
- Test zoom limits (10%-500%)
- Test reset button

### Automated Testing (if time permits)
- Unit tests for coordinate transformations
- Unit tests for hit testing
- Integration test: drag entity → relationships update

## Dependencies
- Phase 3 (Relationship Rendering) must be complete ✅

## Open Questions
None - design decisions finalized based on ROADMAP.md and Phase 4 plan.
