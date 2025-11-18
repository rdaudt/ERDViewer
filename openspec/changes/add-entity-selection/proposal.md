# Proposal: Add Entity Selection

## Overview
Enable users to select entities (tables) on the ERD canvas for future operations. This phase establishes the foundation for features like focused viewing, bulk operations, and export of selected entities.

## Motivation
Users need to:
- Click entities to select/deselect them
- Select multiple entities using Ctrl/Cmd+Click
- Select all or deselect all entities with buttons
- See clear visual feedback for selected entities
- Maintain selection state during zoom, pan, and drag operations

This capability is essential for future features like:
- Exporting selected entities only
- Hiding/showing selected entities
- Copying entity names to clipboard
- Focusing on selected entities and their relationships

## Scope

### In Scope
- Single entity selection via click
- Multi-select with Ctrl/Cmd+Click modifier
- Select All / Deselect All buttons
- Visual highlight for selected entities
- Selection count display
- Selection persistence during interactions (zoom, pan, drag)
- Selection respects subject area filtering (can only select visible entities)
- Keyboard support (Ctrl+A for select all, Escape for deselect all)

### Out of Scope
- Selection rectangle (drag to select multiple) - deferred to future phase
- Operations on selected entities (export, hide, etc.) - future phases
- Selection-based relationship filtering - future phase
- Undo/redo for selection changes - not needed for MVP
- Selection persistence across file loads - intentionally session-scoped

## What Changes

See [specs/](specs/) for detailed requirements organized by capability:
- [entity-selection/spec.md](specs/entity-selection/spec.md) - Core selection logic and state management
- [selection-ui/spec.md](specs/selection-ui/spec.md) - Visual feedback and UI controls

## Dependencies
- Phase 5 (Subject Area Filtering) must be complete ✅
- Requires existing entity rendering in [src/renderer.ts](src/renderer.ts)
- Uses existing interaction system in [src/interactions.ts](src/interactions.ts)
- Extends state management in [src/state.ts](src/state.ts)

## Technical Approach

### Selection State Management
- Add `selectedEntityNames: Set<string>` to application state
- Store entity names (not indices) for stability across filtering/reordering
- Provide getter/setter functions: `getSelectedEntityNames()`, `setSelectedEntityNames()`, `toggleEntitySelection()`, `clearSelection()`
- Reset selection when new model loads
- Maintain selection when subject area changes (deselect entities that become invisible)

### Click Handling
- Extend existing `handleMouseDown()` in [src/interactions.ts](src/interactions.ts)
- Detect click vs drag by measuring distance threshold (< 5 pixels = click)
- Check for Ctrl/Cmd modifier key for multi-select
- Hit test clicked position against visible entities
- Update selection state and trigger re-render

### Visual Feedback
- Modify `renderEntity()` in [src/renderer.ts](src/renderer.ts)
- Draw selection highlight (border glow or background color change) for selected entities
- Use blue accent color (#2563eb) with 3px border or subtle background overlay
- Render highlight before entity content (background layer)

### UI Controls
- Add selection controls section to [index.html](index.html)
- "Select All" button (keyboard: Ctrl+A)
- "Deselect All" button (keyboard: Escape)
- Selection count display: "X entities selected"
- Show controls only when model is loaded
- Position below subject area selector

### Keyboard Shortcuts
- Ctrl+A (Cmd+A on Mac): Select all visible entities
- Escape: Deselect all entities
- Prevent default browser behavior for Ctrl+A

### Subject Area Integration
- When subject area changes, deselect entities not in new filtered view
- Selection count reflects only visible entities
- "Select All" selects only entities in current subject area

## Performance Considerations
- Use Set for O(1) selection lookups
- Only re-render on selection change (not on every mousemove)
- Hit testing already optimized in existing code

## Testing Strategy
- Unit tests for selection state management functions
- Integration tests for click selection flow
- Integration tests for keyboard shortcuts
- Manual tests for multi-select behavior
- Visual tests for selection highlight rendering
- Subject area + selection interaction tests

## Acceptance Criteria
- ✅ Users can select individual entities by clicking
- ✅ Users can multi-select with Ctrl/Cmd+Click
- ✅ Users can select all visible entities with button or Ctrl+A
- ✅ Users can deselect all entities with button or Escape
- ✅ Selected entities have clear, consistent visual highlight
- ✅ Selection count displays accurately
- ✅ Selection state persists during zoom/pan/drag
- ✅ Selection respects subject area filtering
- ✅ Click vs drag detection works reliably (no accidental selections during drag)

## Migration Notes
No migration needed - this is a new feature with no breaking changes.

## Rollout Plan
1. Implement selection state management
2. Add click handling and hit testing
3. Implement visual feedback
4. Add UI controls
5. Add keyboard shortcuts
6. Test with subject area filtering
7. Validate and merge

## Open Questions
None - scope is well-defined and straightforward.
