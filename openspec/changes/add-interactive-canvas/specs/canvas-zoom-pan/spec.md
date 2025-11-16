# canvas-zoom-pan Specification

## Purpose
Enable zoom and pan interactions for exploring ERD diagrams that exceed the viewport size.

## ADDED Requirements

### Requirement: Zoom In and Out
The application SHALL allow users to zoom in and out of the canvas.

#### Scenario: Mouse wheel zoom
- **WHEN** the user scrolls the mouse wheel
- **THEN** the zoom level increases (scroll up) or decreases (scroll down)
- **AND** the zoom increment is smooth (1.1x per wheel tick)
- **AND** the zoom centers on the mouse cursor position

#### Scenario: Zoom button controls
- **WHEN** the user clicks the "Zoom In" button
- **THEN** the zoom level increases by 20% (1.2x)
- **AND** the zoom centers on the canvas center point

#### Scenario: Zoom button controls - Zoom Out
- **WHEN** the user clicks the "Zoom Out" button
- **THEN** the zoom level decreases by 20% (0.8x)
- **AND** the zoom centers on the canvas center point

#### Scenario: Keyboard zoom shortcuts
- **WHEN** the user presses Ctrl+Plus (or Cmd+Plus on Mac)
- **THEN** the zoom level increases by 20%
- **WHEN** the user presses Ctrl+Minus (or Cmd+Minus on Mac)
- **THEN** the zoom level decreases by 20%
- **WHEN** the user presses Ctrl+0 (or Cmd+0 on Mac)
- **THEN** the zoom resets to 100%

### Requirement: Zoom Limits
The application SHALL enforce minimum and maximum zoom levels.

#### Scenario: Minimum zoom limit
- **WHEN** the user attempts to zoom out below 10%
- **THEN** the zoom level is clamped at 10% (0.1x)
- **AND** further zoom out actions have no effect
- **AND** the Zoom Out button is disabled when at minimum

#### Scenario: Maximum zoom limit
- **WHEN** the user attempts to zoom in above 500%
- **THEN** the zoom level is clamped at 500% (5.0x)
- **AND** further zoom in actions have no effect
- **AND** the Zoom In button is disabled when at maximum

#### Scenario: Zoom level display
- **WHEN** the zoom level changes
- **THEN** the current zoom percentage is displayed (e.g., "150%")
- **AND** the display updates in real-time during zooming

### Requirement: Pan Canvas
The application SHALL allow users to pan across the canvas by dragging.

#### Scenario: Pan by dragging background
- **WHEN** the user clicks and drags on the canvas background (not on an entity)
- **THEN** the canvas pan offset updates to follow the drag
- **AND** the entire diagram moves with the drag
- **AND** the cursor changes to a "grabbing" hand during pan

#### Scenario: Pan is constrained by drag bounds
- **WHEN** the user drags to pan
- **THEN** panning is unlimited in all directions
- **AND** users can pan to create workspace around the diagram

#### Scenario: Pan performance
- **WHEN** the user pans the canvas
- **THEN** the pan operation maintains 60fps
- **AND** the diagram redraw is smooth without jank

### Requirement: Zoom to Point
The application SHALL zoom toward the cursor position.

#### Scenario: Zoom centers on cursor
- **WHEN** the user zooms with the mouse wheel
- **THEN** the point under the cursor remains stationary
- **AND** the diagram zooms toward/away from that point
- **AND** the pan offset adjusts to maintain cursor position

#### Scenario: Zoom on button click centers on canvas
- **WHEN** the user zooms with zoom buttons
- **THEN** the zoom centers on the middle of the visible canvas area
- **AND** entities remain centered in the viewport

### Requirement: Reset View
The application SHALL provide a way to reset zoom and pan to default state.

#### Scenario: Reset button restores default view
- **WHEN** the user clicks the "Reset View" button
- **THEN** the zoom level resets to 100%
- **AND** the pan offset resets to (0, 0)
- **AND** the diagram is re-centered with grid layout
- **AND** custom entity positions are discarded

#### Scenario: Reset button is always available
- **WHEN** the diagram is loaded
- **THEN** the Reset View button is always enabled
- **AND** clicking it always returns to the default state

### Requirement: Transform State Management
The application SHALL maintain zoom and pan state across interactions.

#### Scenario: Transform state persists during session
- **WHEN** a user zooms or pans
- **THEN** the transform state (zoom, panX, panY) is stored in application state
- **AND** the transform state persists until the user loads a new file
- **AND** rendering uses the current transform state

#### Scenario: Transform state resets on new file load
- **WHEN** a user loads a new model file
- **THEN** the transform state resets to default (zoom: 1.0, pan: 0, 0)
- **AND** custom entity positions are cleared
- **AND** the new diagram renders at 100% zoom

### Requirement: Coordinate Transformation
The application SHALL correctly transform between screen and canvas coordinates.

#### Scenario: Screen to canvas coordinate mapping
- **WHEN** a mouse event occurs at screen coordinates
- **THEN** the coordinates are transformed to canvas coordinates
- **AND** the transformation accounts for zoom level
- **AND** the transformation accounts for pan offset
- **AND** formula: `canvasX = (screenX - panX) / zoom`

#### Scenario: Canvas to screen coordinate mapping
- **WHEN** rendering canvas elements
- **THEN** canvas coordinates are transformed to screen coordinates
- **AND** the transformation accounts for zoom level
- **AND** the transformation accounts for pan offset
- **AND** formula: `screenX = canvasX * zoom + panX`

### Requirement: Zoom Controls UI
The application SHALL display zoom controls in the canvas view.

#### Scenario: Zoom controls are visible when diagram is loaded
- **WHEN** a diagram is rendered
- **THEN** zoom controls (Zoom In, Zoom Out, Reset) are visible
- **AND** controls are positioned in the bottom-right corner
- **AND** controls overlay the canvas without obscuring content

#### Scenario: Zoom controls are hidden when no diagram
- **WHEN** no diagram is loaded
- **THEN** zoom controls are hidden
- **AND** only the upload section is visible

#### Scenario: Zoom controls are accessible
- **WHEN** zoom controls are displayed
- **THEN** buttons have keyboard focus support
- **AND** buttons have ARIA labels (e.g., "Zoom in", "Zoom out", "Reset view")
- **AND** buttons show hover/focus states

### Requirement: Touch Gesture Support
The application SHALL support basic touch gestures for zoom and pan on touch devices.

#### Scenario: Pinch to zoom
- **WHEN** the user performs a pinch gesture on a touch device
- **THEN** the zoom level changes based on pinch distance
- **AND** zoom centers on the midpoint between fingers
- **AND** zoom limits are enforced (10%-500%)

#### Scenario: Two-finger pan
- **WHEN** the user drags with two fingers on a touch device
- **THEN** the canvas pans in the direction of the drag
- **AND** the pan is smooth and follows the gesture

#### Scenario: Single-finger drag on background
- **WHEN** the user drags with one finger on canvas background
- **THEN** the canvas pans (same as mouse drag)
- **AND** the pan follows the finger movement

### Requirement: Zoom and Pan Performance
The application SHALL maintain smooth performance during zoom and pan operations.

#### Scenario: Zoom operations are smooth
- **WHEN** the user zooms in or out
- **THEN** the zoom animation is smooth (60fps)
- **AND** the diagram re-renders without visible lag
- **AND** zoom completes in less than 100ms

#### Scenario: Pan operations are smooth
- **WHEN** the user pans the canvas
- **THEN** the pan updates at 60fps
- **AND** the diagram follows the drag without lag
- **AND** there is no visible jank or stuttering

#### Scenario: Transform updates are throttled
- **WHEN** rapid zoom or pan events occur
- **THEN** rendering updates are throttled to 60fps (16ms)
- **AND** intermediate events are skipped to maintain performance
- **AND** the final transform state is always rendered
