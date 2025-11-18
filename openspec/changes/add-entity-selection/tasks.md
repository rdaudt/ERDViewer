# Implementation Tasks

## 1. Selection State Management
- [x] 1.1 Add `selectedEntityNames: Set<string>` to AppState in src/state.ts
- [x] 1.2 Initialize selectedEntityNames to empty Set on app start
- [x] 1.3 Add `getSelectedEntityNames(): Set<string>` function to src/state.ts
- [x] 1.4 Add `isEntitySelected(name: string): boolean` function to src/state.ts
- [x] 1.5 Add `toggleEntitySelection(name: string): void` function to src/state.ts
- [x] 1.6 Add `selectAllEntities(entityNames: string[]): void` function to src/state.ts
- [x] 1.7 Add `clearSelection(): void` function to src/state.ts
- [x] 1.8 Add `getSelectionCount(): number` function to src/state.ts
- [x] 1.9 Reset selectedEntityNames to empty Set when new model loads (in setModel)
- [x] 1.10 Export all selection state functions from src/state.ts

## 2. Click Detection and Selection Logic
- [x] 2.1 Add click detection state to src/interactions.ts:
  - Track mousedown position
  - Measure distance on mouseup
  - Threshold: < 5 pixels = click
- [x] 2.2 Modify `handleMouseDown()` in src/interactions.ts:
  - Store initial mouse position
  - Store timestamp for click detection
- [x] 2.3 Modify `handleMouseUp()` in src/interactions.ts:
  - Calculate distance from mousedown position
  - If distance < 5px, treat as click
  - Perform hit testing to find clicked entity
  - Check for Ctrl/Cmd modifier key
- [x] 2.4 Implement `handleEntityClick(entityName: string, isMultiSelect: boolean)`:
  - If isMultiSelect: toggle entity in selection
  - If NOT isMultiSelect: clear selection and select only clicked entity
  - Trigger re-render after selection change
- [x] 2.5 Update hit testing to return entity name (not just index)
- [x] 2.6 Add guard to prevent selection change during drag operations

## 3. Visual Selection Highlight
- [x] 3.1 Modify `renderEntity()` in src/renderer.ts:
  - Check if entity is selected using isEntitySelected(entity.name)
  - If selected, draw highlight before entity content
- [x] 3.2 Implement selection highlight rendering:
  - Draw 3px border around entity box
  - Use blue accent color (#2563eb)
  - Position highlight as background layer (z-order)
- [x] 3.3 Define selection highlight constants:
  - COLOR_SELECTION_HIGHLIGHT = '#2563eb'
  - SELECTION_BORDER_WIDTH = 3
- [x] 3.4 Test highlight visibility at different zoom levels
- [x] 3.5 Ensure highlight doesn't obscure entity content

## 4. Selection Control UI
- [x] 4.1 Add HTML structure to index.html:
  - Selection controls container
  - "Select All" button
  - "Deselect All" button
  - Selection count display element
  - Place below subject area selector in metadata section
- [x] 4.2 Add CSS styling to src/styles.css:
  - Style .selection-controls container
  - Style selection buttons (consistent with other buttons)
  - Style selection count display
  - Add hover/focus/active states for buttons
  - Ensure visibility toggle works
- [x] 4.3 Create `initSelectionControls()` function in src/main.ts:
  - Get references to HTML elements
  - Attach click event listeners to buttons
  - Hide by default (shown after model load)
- [x] 4.4 Implement `updateSelectionCountDisplay()` function:
  - Get selection count from state
  - Update count display text: "X entities selected"
  - Call after every selection change

## 5. Select All Functionality
- [x] 5.1 Implement `handleSelectAll()` function in src/main.ts:
  - Get current visible entities from renderer
  - Get entity names from visible entities
  - Call selectAllEntities(entityNames)
  - Trigger re-render
  - Update selection count display
- [x] 5.2 Attach click handler to "Select All" button
- [x] 5.3 Test Select All with subject area filtering
- [x] 5.4 Test Select All with existing partial selection

## 6. Deselect All Functionality
- [x] 6.1 Implement `handleDeselectAll()` function in src/main.ts:
  - Call clearSelection()
  - Trigger re-render
  - Update selection count display
- [x] 6.2 Attach click handler to "Deselect All" button
- [x] 6.3 Test Deselect All with empty selection (no errors)

## 7. Keyboard Shortcuts
- [x] 7.1 Modify `handleKeyDown()` in src/interactions.ts:
  - Detect Ctrl+A (or Cmd+A on Mac)
  - Prevent default browser behavior for Ctrl+A
  - Call handleSelectAll()
- [x] 7.2 Add Escape key handler:
  - Detect Escape key press
  - Call handleDeselectAll()
- [x] 7.3 Test keyboard shortcuts work with focus on canvas
- [x] 7.4 Test keyboard shortcuts work regardless of focus (global handlers)

## 8. Subject Area Integration
- [x] 8.1 Modify subject area change handler in src/main.ts:
  - After subject area changes, get new visible entity names
  - Filter selectedEntityNames to only include visible entities
  - Update selection state
  - Trigger re-render
  - Update selection count display
- [x] 8.2 Test selection persistence when switching subject areas
- [x] 8.3 Test entities are deselected when they become invisible
- [x] 8.4 Test "Select All" only selects visible entities in filtered view

## 9. Selection Persistence During Interactions
- [x] 9.1 Verify selection persists during zoom:
  - Zoom in/out while entities are selected
  - Confirm selection highlights remain visible
  - Confirm selection state unchanged
- [x] 9.2 Verify selection persists during pan:
  - Pan canvas while entities are selected
  - Confirm highlights move with entities
  - Confirm selection state unchanged
- [x] 9.3 Verify selection persists during entity drag:
  - Drag a selected entity to new position
  - Confirm entity remains selected after drag
  - Confirm highlight renders at new position
- [x] 9.4 Verify dragging doesn't accidentally select/deselect:
  - Start drag on entity
  - Move > 5 pixels
  - Confirm selection state unchanged (not toggled)

## 10. File Load Integration
- [x] 10.1 Verify selection is cleared when new file loads
- [x] 10.2 Verify selection controls are hidden when no model loaded
- [x] 10.3 Verify selection controls are shown when model loads successfully
- [x] 10.4 Verify selection count resets to "0 entities selected"

## 11. Accessibility
- [x] 11.1 Add ARIA labels to selection control buttons:
  - "Select All" button: aria-label="Select all visible entities"
  - "Deselect All" button: aria-label="Clear selection"
- [x] 11.2 Add aria-live region for selection count (optional):
  - Announce selection changes to screen readers
  - Use aria-live="polite" for non-intrusive announcements
- [x] 11.3 Test keyboard navigation to selection control buttons
- [x] 11.4 Test button activation with Enter and Space keys
- [x] 11.5 Ensure visible focus indicators on buttons

## 12. Edge Case Handling
- [x] 12.1 Handle click on canvas background (no entity):
  - If NOT holding Ctrl/Cmd, deselect all
  - If holding Ctrl/Cmd, selection unchanged
- [x] 12.2 Handle selection of entity with no columns (should work)
- [x] 12.3 Handle rapid clicking (debouncing if needed)
- [x] 12.4 Handle selection when no entities visible (empty subject area)
- [x] 12.5 Handle selection state with entity name collisions (should not occur per spec)

## 13. Testing & Validation
- [x] 13.1 Unit test: Selection state management functions
  - toggleEntitySelection() adds/removes correctly
  - selectAllEntities() sets all provided names
  - clearSelection() empties the Set
  - isEntitySelected() returns correct boolean
- [x] 13.2 Unit test: Click detection logic
  - Distance < 5px = click
  - Distance >= 5px = drag (not click)
- [x] 13.3 Integration test: Click selection flow
  - Click entity → selected
  - Click selected entity → deselected
  - Ctrl+Click → multi-select
- [x] 13.4 Integration test: Select All / Deselect All buttons
  - Buttons trigger correct state changes
  - Selection count updates correctly
- [x] 13.5 Integration test: Keyboard shortcuts
  - Ctrl+A selects all visible
  - Escape deselects all
  - Default browser behavior prevented
- [x] 13.6 Integration test: Subject area + selection
  - Selection filtered when subject area changes
  - "Select All" respects current filter
- [x] 13.7 Visual test: Selection highlight rendering
  - Highlight visible and consistent
  - Multiple selections render correctly
  - Highlight doesn't obscure content
- [x] 13.8 Manual test: Selection persistence during zoom/pan/drag
- [x] 13.9 Manual test: Click vs drag discrimination
- [x] 13.10 Manual test: Keyboard accessibility

## 14. Documentation
- [x] 14.1 Update README.md with entity selection feature
- [x] 14.2 Add "Selecting Entities" section to user docs:
  - How to select single entity
  - How to multi-select with Ctrl/Cmd
  - How to use Select All / Deselect All
  - Keyboard shortcuts (Ctrl+A, Escape)
- [x] 14.3 Add JSDoc comments to selection state functions in src/state.ts
- [x] 14.4 Document selection behavior in code comments
- [x] 14.5 Update ROADMAP.md to mark Phase 6 as complete

## Task Dependencies

**Parallelizable:**
- Tasks 1 and 4 can be done in parallel (state management + UI structure)
- Tasks 13.1-13.4 (unit tests) can be done in parallel

**Sequential:**
- Task 1 must complete before tasks 2, 3, 5, 6, 7, 8
- Task 2 must complete before task 9.4 (click vs drag testing)
- Task 3 must complete before tasks 9.1-9.3 (visual persistence testing)
- Task 4 must complete before tasks 5, 6, 10
- Tasks 1-12 must complete before task 13 (testing)
- All tasks must complete before task 14 (documentation)

**Critical Path:**
1. Selection State Management (Task 1)
2. Click Detection and Selection Logic (Task 2)
3. Visual Selection Highlight (Task 3)
4. Subject Area Integration (Task 8)
5. Testing (Task 13)
6. Documentation (Task 14)

## Estimated Effort

- Selection State Management: 2 hours
- Click Detection and Selection Logic: 3 hours
- Visual Selection Highlight: 2 hours
- Selection Control UI: 2 hours
- Select All Functionality: 1 hour
- Deselect All Functionality: 1 hour
- Keyboard Shortcuts: 2 hours
- Subject Area Integration: 2 hours
- Selection Persistence During Interactions: 2 hours
- File Load Integration: 1 hour
- Accessibility: 2 hours
- Edge Case Handling: 2 hours
- Testing & Validation: 4 hours
- Documentation: 2 hours

**Total: 28 hours (3-4 days)**
