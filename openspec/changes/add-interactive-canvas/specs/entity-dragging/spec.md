# entity-dragging Specification

## Purpose
Allow users to reposition entities by dragging them to customize diagram layout.

## ADDED Requirements

### Requirement: Entity Drag Initiation
The application SHALL allow users to start dragging an entity by clicking and holding on it.

#### Scenario: Click on entity initiates drag
- **WHEN** the user clicks (mousedown) on an entity
- **THEN** the entity enters drag mode
- **AND** the cursor changes to "grabbing" or "move"
- **AND** the entity follows the mouse cursor

#### Scenario: Click on background does not drag entity
- **WHEN** the user clicks (mousedown) on the canvas background (not on an entity)
- **THEN** no entity drag is initiated
- **AND** canvas pan mode is initiated instead
- **AND** the cursor changes to "grab" for panning

#### Scenario: Entity detection uses hit testing
- **WHEN** the user clicks on the canvas
- **THEN** the application performs hit testing to find the entity under the cursor
- **AND** hit testing uses canvas coordinates (accounting for zoom/pan)
- **AND** entities are tested in reverse render order (top entity first)

### Requirement: Entity Dragging
The application SHALL update the entity position as the user drags.

#### Scenario: Entity follows cursor during drag
- **WHEN** the user drags an entity (mousemove while mouse is down)
- **THEN** the entity position updates to follow the cursor
- **AND** the entity moves smoothly without lag
- **AND** the position update accounts for zoom level

#### Scenario: Relationships update during drag
- **WHEN** an entity is being dragged
- **THEN** all relationships connected to that entity are redrawn
- **AND** relationship lines connect to the entity's new position
- **AND** relationships update in real-time during the drag

#### Scenario: Diagram re-renders during drag
- **WHEN** an entity is being dragged
- **THEN** the entire diagram is re-rendered each frame
- **AND** the re-render includes all entities and relationships
- **AND** the dragged entity appears at its new position

#### Scenario: Drag position is constrained to canvas coordinates
- **WHEN** an entity is being dragged
- **THEN** the entity position is unlimited (can be dragged anywhere)
- **AND** entities can be positioned off-screen if desired
- **AND** users can pan to view off-screen entities

### Requirement: Entity Drag Completion
The application SHALL finalize the entity position when the user releases the mouse button.

#### Scenario: Releasing mouse button ends drag
- **WHEN** the user releases the mouse button (mouseup) during entity drag
- **THEN** the drag operation completes
- **AND** the entity remains at its final position
- **AND** the cursor returns to default state
- **AND** the final position is stored in state

#### Scenario: Custom position overrides grid layout
- **WHEN** an entity has been dragged to a custom position
- **THEN** the custom position is stored in application state
- **AND** the entity renders at the custom position (not grid layout position)
- **AND** subsequent re-renders use the custom position

#### Scenario: Un-dragged entities use grid layout
- **WHEN** an entity has not been dragged
- **THEN** the entity position comes from the grid layout algorithm
- **AND** the entity position updates if the grid layout changes

### Requirement: Entity Position State
The application SHALL maintain custom entity positions in application state.

#### Scenario: Custom positions are stored per entity
- **WHEN** an entity is dragged
- **THEN** the custom position is stored by entity name
- **AND** the position is stored as {x, y} coordinates in canvas space
- **AND** the position persists during the session

#### Scenario: Custom positions are session-scoped
- **WHEN** a user loads a new model file
- **THEN** all custom entity positions are cleared
- **AND** entities revert to grid layout positions
- **AND** the transform state (zoom/pan) also resets

#### Scenario: Custom positions persist across zoom and pan
- **WHEN** a user zooms or pans after dragging entities
- **THEN** the custom entity positions remain in canvas coordinates
- **AND** entities appear at their custom positions regardless of transform
- **AND** relationships remain connected correctly

### Requirement: Hit Testing
The application SHALL correctly identify which entity is under the cursor.

#### Scenario: Hit testing uses bounding boxes
- **WHEN** the application performs hit testing
- **THEN** each entity is tested as an axis-aligned bounding box (AABB)
- **AND** the test checks if the cursor point is inside the box bounds
- **AND** formula: `x >= entity.x && x <= entity.x + entity.width && y >= entity.y && y <= entity.y + entity.height`

#### Scenario: Hit testing accounts for zoom and pan
- **WHEN** the application performs hit testing
- **THEN** the screen coordinates are transformed to canvas coordinates
- **AND** the transformation uses the current zoom level and pan offset
- **AND** hit testing is performed in canvas coordinate space

#### Scenario: Hit testing handles overlapping entities
- **WHEN** multiple entities overlap at the cursor position
- **THEN** the topmost entity (last rendered) is selected
- **AND** entities are tested in reverse render order
- **AND** the first match (topmost) is returned

### Requirement: Drag Visual Feedback
The application SHALL provide visual feedback during entity dragging.

#### Scenario: Cursor changes during drag
- **WHEN** the user hovers over an entity
- **THEN** the cursor changes to "move" to indicate draggability
- **WHEN** the user is dragging an entity
- **THEN** the cursor changes to "grabbing"
- **WHEN** the user releases the drag
- **THEN** the cursor returns to "move" if still over the entity, or "default" otherwise

#### Scenario: Entity appears at cursor position during drag
- **WHEN** an entity is being dragged
- **THEN** the entity renders at the current cursor position
- **AND** the entity follows the cursor smoothly (60fps)
- **AND** there is no visible lag between cursor and entity

### Requirement: Drag Interaction State
The application SHALL maintain interaction state to distinguish between dragging and panning.

#### Scenario: Interaction state tracks current mode
- **WHEN** the user interacts with the canvas
- **THEN** the application tracks the current interaction mode (idle, dragging_entity, panning_canvas)
- **AND** only one interaction mode is active at a time
- **AND** the mode determines how mouse events are handled

#### Scenario: Dragging entity prevents panning
- **WHEN** the user is dragging an entity
- **THEN** canvas panning is disabled
- **AND** mousemove events update the entity position (not pan offset)
- **AND** panning only resumes after mouseup

#### Scenario: Panning background prevents entity drag
- **WHEN** the user clicks on the background and starts panning
- **THEN** entity dragging is disabled
- **AND** mousemove events update the pan offset (not entity position)
- **AND** entity drag only becomes available after mouseup

### Requirement: Reset Custom Positions
The application SHALL allow users to reset entities to their grid layout positions.

#### Scenario: Reset button clears custom positions
- **WHEN** the user clicks the "Reset View" button
- **THEN** all custom entity positions are cleared
- **AND** entities return to their grid layout positions
- **AND** the zoom and pan transform also resets to default
- **AND** the diagram re-renders with grid layout

#### Scenario: Loading new file clears custom positions
- **WHEN** the user loads a new model file
- **THEN** all custom entity positions from the previous model are cleared
- **AND** the new model entities use grid layout
- **AND** no custom positions carry over between files

### Requirement: Drag Performance
The application SHALL maintain smooth performance during entity dragging.

#### Scenario: Drag updates at 60fps
- **WHEN** the user drags an entity
- **THEN** the entity position updates at 60fps
- **AND** the diagram re-renders at 60fps
- **AND** there is no visible lag or stuttering

#### Scenario: Drag events are throttled
- **WHEN** rapid mousemove events occur during drag
- **THEN** position updates are throttled to 16ms (60fps)
- **AND** intermediate events are skipped to maintain performance
- **AND** the final position is always applied

#### Scenario: Dragging large models performs well
- **WHEN** a model with 50+ entities is loaded and an entity is dragged
- **THEN** the drag operation remains smooth (60fps)
- **AND** all relationships redraw correctly
- **AND** the browser remains responsive

### Requirement: Drag Accessibility
The application SHALL provide keyboard alternatives for entity positioning (future enhancement).

#### Scenario: Future - Arrow keys move selected entity
- **WHEN** an entity is selected and the user presses arrow keys
- **THEN** the entity moves in the arrow direction (1px per press)
- **AND** Shift+arrow moves 10px per press
- **NOTE:** Entity selection is deferred to Phase 6, so this is a placeholder requirement

#### Scenario: Current - No keyboard dragging
- **WHEN** no entity selection mechanism exists (Phase 4)
- **THEN** keyboard-based entity positioning is not available
- **AND** only mouse/touch dragging is supported
- **AND** keyboard dragging will be added in Phase 6
