# Design: Relationship Rendering

## Context
ERD Viewer has entity rendering complete (Phase 2), but diagrams are incomplete without relationship lines showing foreign key connections. Phase 3 adds relationship visualization using industry-standard crow's foot notation to represent cardinality.

**Constraints:**
- Must work with existing entity positions from Phase 2 grid layout
- Canvas API only (no SVG libraries)
- Support models with 0-100+ relationships
- Lines must not obscure entity boxes (render order matters)
- Must handle edge cases: self-referencing tables, multiple FKs between same entities

**Stakeholders:**
- End users: need to understand table relationships at a glance
- Future developers: will build on this for interactive features (Phase 4: drag entities, Phase 7: auto-layout)

## Goals / Non-Goals

**Goals:**
- Render all relationships as lines with crow's foot notation
- Support all cardinality types (0..1, 1..1, 0..N, 1..N)
- Provide multiple line routing options (straight, rounded, orthogonal)
- Distinguish Identifying vs Non-Identifying relationships visually
- Maintain performance with 50+ relationships

**Non-Goals:**
- Interactive relationship editing (read-only viewer)
- Relationship label text (name, verb phrases) - deferred to Phase 9
- Smart routing to avoid line crossings - deferred to Phase 7
- Relationship selection/highlighting - deferred to Phase 6
- Curved Bezier paths with multiple control points - use simple curves only

## Decisions

### Decision 1: Render Relationships Before Entities
**Choice:** Draw relationship lines first, then entity boxes on top

**Rationale:**
- Keeps entity boxes fully visible and clickable (important for Phase 4 interactions)
- Prevents lines from covering text in entity boxes
- Standard practice in diagram rendering (background layers first)

**Implementation:**
```typescript
function renderModel(model: ERDVModel): void {
  clearCanvas();
  const positions = calculateGridLayout(model.entities, ...);

  // 1. Render relationships (background layer)
  renderRelationships(model.relationships, positions);

  // 2. Render entities (foreground layer)
  for (const [entity, position] of positions) {
    renderEntity(entity, position.x, position.y, model);
  }
}
```

### Decision 2: Connection Points at Entity Edges
**Choice:** Connect lines to the center of entity box edges (not to specific columns)

**Rationale:**
- Simpler calculation than column-specific points
- Works well with grid layout where entities are aligned
- Cleaner visual appearance (fewer overlapping lines at single point)
- Column-specific connections can be added in Phase 9 if needed

**Algorithm:**
```
For relationship from Parent to Child:
  1. Get parent entity center point (px, py)
  2. Get child entity center point (cx, cy)
  3. Calculate angle from parent to child: θ = atan2(cy - py, cx - px)
  4. Determine parent exit side based on θ (right, bottom, left, top)
  5. Calculate parent connection point on that edge
  6. Determine child entry side (opposite of parent exit)
  7. Calculate child connection point on that edge
```

**Edge Midpoint Calculation:**
```typescript
function getEntityEdgePoint(
  entityPos: LayoutPosition,
  side: 'top' | 'right' | 'bottom' | 'left'
): Point {
  const { x, y, width, height } = entityPos;
  switch (side) {
    case 'top':    return { x: x + width/2, y };
    case 'right':  return { x: x + width, y: y + height/2 };
    case 'bottom': return { x: x + width/2, y: y + height };
    case 'left':   return { x, y: y + height/2 };
  }
}
```

### Decision 3: Three Line Routing Styles
**Choice:** Implement straight, rounded, and orthogonal line styles

**Rationale:**
- **Straight**: Simplest, fastest to render, good for simple diagrams
- **Rounded**: More aesthetically pleasing, easier to follow visually
- **Orthogonal**: Professional ERD standard, works best with aligned entities

**Default**: Orthogonal (most common in professional ERD tools)

**Rendering:**
- Straight: Single `lineTo()` call
- Rounded: `quadraticCurveTo()` with single control point
- Orthogonal: Multiple `lineTo()` calls with horizontal/vertical segments

### Decision 4: Crow's Foot Notation Symbols
**Choice:** Standard crow's foot notation with circles and forks

**Visual Design:**
```
0..1 (Optional One):    O—|
1..1 (Required One):     —|
0..N (Optional Many):   O—<
1..N (Required Many):    —<
```

**Symbol Dimensions:**
- Circle radius: 5px
- Crow's foot width: 10px
- Crow's foot height: 8px
- Distance from endpoint: 3px

**Implementation:**
```typescript
function drawCardinality(
  ctx: CanvasRenderingContext2D,
  point: Point,
  angle: number,
  cardinality: Cardinality
): void {
  const { notation } = cardinality;

  // Rotate canvas to match line angle
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(angle);

  // Draw optional indicator (circle)
  if (notation.startsWith('0')) {
    ctx.beginPath();
    ctx.arc(-8, 0, 5, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Draw cardinality indicator
  if (notation.endsWith('1')) {
    // Single: vertical line
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(0, 6);
    ctx.stroke();
  } else {
    // Many: crow's foot (three lines forming a fork)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, -6);
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, 6);
    ctx.stroke();
  }

  ctx.restore();
}
```

### Decision 5: Identifying vs Non-Identifying Visual Distinction
**Choice:** Solid lines for Identifying, dashed lines for Non-Identifying

**Rationale:**
- Industry standard convention
- Easy to implement with `setLineDash()`
- Clear visual distinction without adding clutter

**Styling:**
```typescript
const lineStyle = relationship.relationship_type === 'Identifying'
  ? []          // Solid
  : [5, 5];     // Dashed (5px dash, 5px gap)

ctx.setLineDash(lineStyle);
```

### Decision 6: Orthogonal Line Routing Algorithm
**Choice:** Simple two-segment orthogonal routing (horizontal then vertical, or vice versa)

**Rationale:**
- Simple to implement
- Works well with grid layout
- Professional appearance
- More sophisticated routing (avoiding entities) deferred to Phase 7

**Algorithm:**
```
1. Calculate start point (parent edge)
2. Calculate end point (child edge)
3. Determine routing direction based on relative positions:
   - If parent is left/right of child: horizontal first
   - If parent is above/below child: vertical first
4. Calculate intermediate point
5. Draw three segments: start → intermediate → end
```

**Example:**
```
Parent    Child
  □────┐   □
       │
       └───
```

## Risks / Trade-offs

### Risk 1: Line overlaps and crossings with many relationships
**Impact:** Medium
**Likelihood:** High (models with 20+ relationships)
**Mitigation:**
- Acceptable for Phase 3 (basic rendering)
- Line style selector helps users find clearest view
- Smart routing in Phase 7 will address this systematically
- Orthogonal routing reduces crossings vs straight lines

### Risk 2: Performance with 100+ relationships
**Impact:** Low
**Likelihood:** Low
**Mitigation:**
- Canvas path operations are fast
- Each relationship is ~10-20 path commands
- 100 relationships = ~2000 commands (acceptable)
- If needed, implement canvas layers in Phase 9

### Risk 3: Self-referencing relationships (table → itself)
**Impact:** Medium
**Likelihood:** Medium
**Mitigation:**
- Detect self-referencing: `parent_entity_name === child_entity_name`
- Draw as loop/arc emanating from and returning to same entity
- Use quadratic curve with offset control point
- Test with sample data

### Risk 4: Multiple relationships between same entities
**Impact:** Medium
**Likelihood:** Medium
**Mitigation:**
- Offset connection points slightly for multiple relationships
- Track relationships between each pair of entities
- Distribute connection points evenly along edge
- Visual distinction maintained

## Migration Plan

**No migration needed** - This is a new capability, not modifying existing behavior.

**Rollback:**
- If Phase 3 has critical issues, users can still view entities without relationships (Phase 2 functionality intact)
- Relationship rendering is isolated in `relationships.ts` and can be disabled

## Open Questions

1. **Should we show relationship names on lines?**
   - Proposed: No - defer to Phase 9 (tooltips)
   - Rationale: Keeps visual clutter minimal, names often redundant with FK column names
   - Decision: **No** - defer to Phase 9

2. **How should we handle very long lines (entities far apart)?**
   - Proposed: No special handling in Phase 3
   - Rationale: Grid layout keeps entities reasonably close
   - Auto-layout in Phase 7 will optimize spacing
   - Decision: **No special handling**

3. **Should line style preference persist across sessions?**
   - Proposed: No - default to orthogonal each session
   - Rationale: localStorage persistence deferred to Phase 9
   - Decision: **No persistence** - session-only in Phase 3

4. **What color should relationship lines be?**
   - Proposed: Medium gray (#64748b) - distinct but not dominant
   - Rationale: Entity boxes are the primary visual element
   - Hover effects (brighter color) deferred to Phase 6
   - Decision: **Medium gray** (#64748b)

5. **Should we render verb phrases?**
   - Proposed: No - defer to Phase 9
   - Rationale: Requires text positioning along lines, adds complexity
   - Most users understand relationships from FK column names
   - Decision: **No** - defer to Phase 9
