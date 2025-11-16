# Design: Interactive Canvas

## Context
ERD Viewer currently renders static diagrams. Users cannot zoom, pan, or rearrange entities. For models with 20+ entities, this makes the tool impractical.

**Constraints:**
- Canvas API only (no SVG libraries per project conventions)
- Must work with existing entity and relationship rendering from Phase 2 & 3
- Session-scoped interactions (no persistence to file)
- Performance target: 100 entities with smooth 60fps interactions
- Desktop-first (mobile gestures nice-to-have)

**Stakeholders:**
- End users: Need to navigate large diagrams
- Future developers: Will build on this for entity selection (Phase 6), auto-layout (Phase 7)

## Goals / Non-Goals

**Goals:**
- Zoom in/out smoothly (mouse wheel, buttons, pinch gesture)
- Pan across canvas (drag background)
- Drag individual entities to custom positions
- Relationships automatically update when entities move
- Reset button to restore grid layout
- Zoom limits to prevent excessive zoom in/out

**Non-Goals:**
- Entity selection highlighting (Phase 6)
- Multi-entity drag (Phase 6)
- Snap-to-grid (Phase 7)
- Undo/redo (Phase 9)
- Persist custom positions to file (may never implement)
- Advanced touch gestures beyond basic pinch-zoom

## Decisions

### Decision 1: Canvas Transform Strategy
**Choice:** Use `ctx.setTransform()` for zoom and pan

**Rationale:**
- Native canvas transforms handle rendering automatically
- Apply transform before rendering: `ctx.setTransform(zoom, 0, 0, zoom, panX, panY)`
- All entity and relationship rendering code works unchanged
- Only need inverse transform for hit testing (screen → canvas coordinates)

**Implementation:**
```typescript
interface CanvasTransform {
  zoom: number;    // 0.1 to 5.0 (10% to 500%)
  panX: number;    // pixels
  panY: number;    // pixels
}

function applyTransform(ctx: CanvasRenderingContext2D, transform: CanvasTransform): void {
  ctx.setTransform(
    transform.zoom, 0,
    0, transform.zoom,
    transform.panX, transform.panY
  );
}

// Before rendering
applyTransform(ctx, transform);
renderRelationships(...);
renderEntities(...);
```

### Decision 2: Coordinate Mapping
**Choice:** Inverse transform for screen → canvas coordinate conversion

**Rationale:**
- Need to convert mouse clicks to canvas coordinates for hit testing
- Formula: `canvasX = (screenX - panX) / zoom`, `canvasY = (screenY - panY) / zoom`

**Algorithm:**
```typescript
function screenToCanvas(
  screenX: number,
  screenY: number,
  transform: CanvasTransform
): { x: number; y: number } {
  return {
    x: (screenX - transform.panX) / transform.zoom,
    y: (screenY - transform.panY) / transform.zoom,
  };
}

function canvasToScreen(
  canvasX: number,
  canvasY: number,
  transform: CanvasTransform
): { x: number; y: number } {
  return {
    x: canvasX * transform.zoom + transform.panX,
    y: canvasY * transform.zoom + transform.panY,
  };
}
```

### Decision 3: Entity Hit Testing
**Choice:** Simple AABB (axis-aligned bounding box) collision detection

**Rationale:**
- Entities are rectangles
- Fast and simple: check if click point is inside entity bounds
- Adequate performance for 100+ entities

**Algorithm:**
```typescript
function findEntityAtPoint(
  canvasX: number,
  canvasY: number,
  entities: Entity[],
  positions: LayoutPosition[]
): Entity | null {
  // Iterate in reverse order (top entity = last rendered)
  for (let i = entities.length - 1; i >= 0; i--) {
    const entity = entities[i];
    const pos = positions[i];

    if (
      canvasX >= pos.x &&
      canvasX <= pos.x + pos.width &&
      canvasY >= pos.y &&
      canvasY <= pos.y + pos.height
    ) {
      return entity;
    }
  }
  return null;
}
```

### Decision 4: Drag Interaction State Machine
**Choice:** Three-state FSM: IDLE → DRAGGING_ENTITY | PANNING_CANVAS → IDLE

**Rationale:**
- Clear separation between entity drag and canvas pan
- Pan only starts if click is NOT on an entity

**State Transitions:**
```
IDLE:
  - mousedown on entity → DRAGGING_ENTITY
  - mousedown on background → PANNING_CANVAS

DRAGGING_ENTITY:
  - mousemove → update entity position, re-render
  - mouseup → IDLE

PANNING_CANVAS:
  - mousemove → update panX/panY, re-render
  - mouseup → IDLE
```

**Implementation:**
```typescript
type InteractionState =
  | { mode: 'idle' }
  | { mode: 'dragging_entity'; entityIndex: number; startX: number; startY: number }
  | { mode: 'panning'; startX: number; startY: number; startPanX: number; startPanY: number };

let interactionState: InteractionState = { mode: 'idle' };

canvas.addEventListener('mousedown', (e) => {
  const canvasCoords = screenToCanvas(e.clientX, e.clientY, transform);
  const entity = findEntityAtPoint(canvasCoords.x, canvasCoords.y, ...);

  if (entity) {
    interactionState = { mode: 'dragging_entity', entityIndex, startX: e.clientX, startY: e.clientY };
  } else {
    interactionState = { mode: 'panning', startX: e.clientX, startY: e.clientY, startPanX: transform.panX, startPanY: transform.panY };
  }
});
```

### Decision 5: Zoom Behavior
**Choice:** Zoom toward mouse cursor position (zoom-to-point)

**Rationale:**
- Industry standard behavior (Google Maps, Figma, etc.)
- Users expect to zoom toward where they're pointing
- Requires adjusting pan offset to keep point under cursor

**Algorithm:**
```typescript
function zoomToPoint(
  screenX: number,
  screenY: number,
  zoomDelta: number,
  transform: CanvasTransform
): CanvasTransform {
  const oldZoom = transform.zoom;
  const newZoom = Math.max(0.1, Math.min(5.0, oldZoom * zoomDelta));

  // Canvas point under cursor (before zoom)
  const canvasX = (screenX - transform.panX) / oldZoom;
  const canvasY = (screenY - transform.panY) / oldZoom;

  // Adjust pan to keep same canvas point under cursor (after zoom)
  const newPanX = screenX - canvasX * newZoom;
  const newPanY = screenY - canvasY * newZoom;

  return { zoom: newZoom, panX: newPanX, panY: newPanY };
}
```

### Decision 6: Entity Position Override Strategy
**Choice:** Store custom positions in Map, fall back to grid layout

**Rationale:**
- Grid layout is default (from layout.ts)
- Dragging an entity stores override position
- Relationship rendering uses override positions if available

**Data Structure:**
```typescript
interface CanvasState {
  transform: CanvasTransform;
  entityPositionOverrides: Map<string, { x: number; y: number }>;  // entityName → position
}

function getEntityPosition(
  entity: Entity,
  gridPosition: LayoutPosition,
  overrides: Map<string, { x: number; y: number }>
): { x: number; y: number } {
  const override = overrides.get(entity.name);
  if (override) {
    return override;
  }
  return { x: gridPosition.x, y: gridPosition.y };
}
```

### Decision 7: Zoom Controls UI Placement
**Choice:** Fixed-position overlay in bottom-right corner

**Rationale:**
- Standard position for map-style controls
- Doesn't obscure diagram content
- Easy to find without searching

**Layout:**
```
┌────────────────────────────────┐
│                                │
│    Canvas Area                 │
│                                │
│                                │
│                    ┌──┐        │
│                    │ + │ Zoom In│
│                    ├──┤        │
│                    │ − │ Zoom Out
│                    ├──┤        │
│                    │⟲ │ Reset  │
│                    └──┘        │
└────────────────────────────────┘
```

## Risks / Trade-offs

### Risk 1: Performance degradation with frequent re-renders
**Impact:** Medium
**Likelihood:** Low
**Mitigation:**
- Throttle mousemove events to 16ms (60fps)
- Profile with 100-entity test model
- Defer optimizations (layer caching, dirty regions) to Phase 9 if needed

### Risk 2: Complex coordinate mapping bugs
**Impact:** High (breaks interactions)
**Likelihood:** Medium
**Mitigation:**
- Unit tests for screenToCanvas / canvasToScreen
- Visual debug mode showing transformed coordinates
- Test with various zoom levels

### Risk 3: User confusion about temporary positions
**Impact:** Low
**Likelihood:** Medium
**Mitigation:**
- "Reset View" button clearly restores grid layout
- Positions are session-scoped (lost on file reload)
- Future: Add toast notification on drag "Custom layout will be lost on reload"

### Risk 4: Mobile touch event compatibility
**Impact:** Low (desktop-first app)
**Likelihood:** Medium
**Mitigation:**
- Basic pinch-zoom support with TouchEvent API
- Full mobile optimization deferred to Phase 9

## Migration Plan

**No migration needed** - This is a new capability, existing functionality unchanged.

**Rollback:**
- If Phase 4 has critical issues, users can still view diagrams without interactions (Phase 3 functionality intact)
- Interaction code is isolated in `interactions.ts` and can be disabled

## Open Questions

1. **Should zoom controls be always visible or only when diagram is loaded?**
   - Proposed: Only show when diagram is loaded
   - Rationale: Controls are useless without a diagram
   - Decision: **Only when loaded**

2. **Should we limit pan to keep diagram in viewport?**
   - Proposed: No - allow free panning
   - Rationale: Users may want to pan to create workspace
   - Decision: **No limits** - free panning

3. **Should entities snap back if dragged off-canvas?**
   - Proposed: No - allow off-canvas positioning
   - Rationale: Users may want to organize entities with spacing
   - Decision: **No snap-back** - users can use Reset if needed

4. **Should we show a minimap for navigation?**
   - Proposed: No - defer to Phase 9
   - Rationale: Adds complexity, not critical for MVP
   - Decision: **No minimap** - defer to Phase 9

5. **Should zoom level persist across file reloads?**
   - Proposed: No - reset to 100% on new file load
   - Rationale: Each diagram may have different optimal zoom
   - Decision: **Reset on file load**

All questions resolved.
