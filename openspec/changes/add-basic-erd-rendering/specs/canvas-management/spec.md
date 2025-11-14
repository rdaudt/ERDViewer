## ADDED Requirements

### Requirement: Canvas Initialization
The application SHALL initialize an HTML5 canvas element for rendering ERD diagrams.

#### Scenario: Canvas element is added to DOM
- **WHEN** the application loads
- **THEN** a canvas element with id "erd-canvas" is present in the DOM
- **AND** the canvas is positioned below the upload section
- **AND** the canvas is initially hidden until a model is loaded

#### Scenario: Canvas context is initialized
- **WHEN** the rendering module initializes
- **THEN** a 2D rendering context is created for the canvas
- **AND** the context is configured with appropriate settings (font, text align, etc.)
- **AND** the context is ready to accept drawing commands

#### Scenario: Canvas coordinate system is established
- **WHEN** the canvas is initialized
- **THEN** the coordinate system origin (0,0) is at the top-left corner
- **AND** x-axis increases to the right
- **AND** y-axis increases downward
- **AND** coordinates are in pixels

### Requirement: Canvas Sizing
The application SHALL size the canvas to fit the available viewport space.

#### Scenario: Canvas fills available width
- **WHEN** the canvas is displayed
- **THEN** the canvas width is 100% of its container width
- **AND** the canvas adapts to the container width

#### Scenario: Canvas height is responsive
- **WHEN** the canvas is displayed
- **THEN** the canvas height is at least 600px
- **AND** the canvas height does not exceed 90vh (90% of viewport height)
- **AND** the canvas height accommodates the rendered diagram

#### Scenario: Canvas resizes with window
- **WHEN** the browser window is resized
- **THEN** the canvas dimensions update to match the new viewport size
- **AND** the diagram is re-rendered to fit the new canvas size
- **AND** entity positions are recalculated based on new dimensions

#### Scenario: High-DPI display support
- **WHEN** the canvas is displayed on a high-DPI screen (retina, 4K, etc.)
- **THEN** the canvas backing store is scaled appropriately (devicePixelRatio)
- **AND** rendered entities appear sharp and clear (not blurry)

### Requirement: Canvas Lifecycle
The application SHALL manage the canvas lifecycle in sync with model loading.

#### Scenario: Canvas is hidden before model loads
- **WHEN** no model is loaded
- **THEN** the canvas element is hidden (display: none)
- **AND** the upload section is visible

#### Scenario: Canvas is shown after model loads
- **WHEN** a valid model is successfully loaded and validated
- **THEN** the canvas element becomes visible
- **AND** the upload success message is displayed above the canvas
- **AND** the diagram is rendered on the canvas

#### Scenario: Canvas is cleared when new model loads
- **WHEN** a user uploads a new file while a model is already loaded
- **THEN** the canvas is cleared (all previous rendering removed)
- **AND** the new model is rendered on the clean canvas
- **AND** previous entity positions are discarded

#### Scenario: Canvas is cleared on upload error
- **WHEN** file validation fails
- **THEN** the canvas remains hidden or is cleared if previously visible
- **AND** the error message is displayed
- **AND** no rendering occurs

### Requirement: Grid Layout
The application SHALL arrange entities in a simple grid layout.

#### Scenario: Entities are arranged left-to-right
- **WHEN** entities are positioned
- **THEN** entities are placed starting from the left side of the canvas
- **AND** entities are placed horizontally with consistent spacing (20px minimum)
- **AND** the layout proceeds left-to-right for each row

#### Scenario: Row wrapping occurs when width is exceeded
- **WHEN** the next entity would exceed the canvas width
- **THEN** the layout starts a new row below the current row
- **AND** the new row maintains the same left alignment
- **AND** there is at least 20px vertical spacing between rows

#### Scenario: Grid is centered horizontally
- **WHEN** entities are positioned in grid layout
- **THEN** the entire grid is centered horizontally on the canvas
- **AND** there is equal padding on the left and right sides
- **AND** the grid starts at the top of the canvas with minimal top padding (20px)

#### Scenario: Entity positions are calculated before rendering
- **WHEN** the rendering process begins
- **THEN** all entity positions (x, y coordinates) are calculated first
- **AND** entity dimensions (width, height) are calculated based on content
- **AND** the layout algorithm determines optimal grid arrangement
- **AND** only after layout calculation does rendering begin

#### Scenario: Layout adapts to entity count
- **WHEN** the model has few entities (1-5)
- **THEN** entities are arranged in a single row or few rows
- **AND** the grid does not appear sparse
- **WHEN** the model has many entities (20+)
- **THEN** entities wrap into multiple rows to fit the canvas width
- **AND** the layout remains organized and readable

### Requirement: Rendering Trigger
The application SHALL automatically render the diagram after successful file validation.

#### Scenario: Rendering is triggered after validation success
- **WHEN** file validation completes successfully
- **THEN** the rendering pipeline is automatically triggered
- **AND** the user does not need to click a separate "Render" button
- **AND** the canvas becomes visible and displays the diagram

#### Scenario: Rendering is skipped on validation failure
- **WHEN** file validation fails
- **THEN** the rendering pipeline is not triggered
- **AND** the canvas remains hidden
- **AND** validation errors are displayed instead

#### Scenario: Rendering shows success feedback
- **WHEN** diagram rendering completes successfully
- **THEN** a success message is displayed showing the entity count
- **AND** the canvas is visible with all entities rendered
- **AND** the "Upload Different File" button is available

### Requirement: Canvas Clearing
The application SHALL provide a method to clear the canvas.

#### Scenario: Canvas is cleared before each render
- **WHEN** the rendering pipeline begins
- **THEN** the canvas is completely cleared of all previous drawings
- **AND** the canvas background is reset to default (white or transparent)
- **AND** no artifacts from previous renderings remain

#### Scenario: Canvas is cleared on new file upload
- **WHEN** a user uploads a new file
- **THEN** the canvas is cleared immediately
- **AND** the new file validation and rendering proceeds
- **AND** the previous model's entities are no longer visible

#### Scenario: Clearing is efficient
- **WHEN** the canvas is cleared
- **THEN** the clearing operation completes in less than 100ms
- **AND** the canvas is ready for immediate re-rendering
- **AND** memory is released from previous rendering (no leaks)

### Requirement: Rendering Error Handling
The application SHALL handle rendering errors gracefully.

#### Scenario: Rendering errors are caught
- **WHEN** an error occurs during rendering
- **THEN** the error is caught and logged to the console
- **AND** an error message is displayed to the user
- **AND** the application remains functional (user can upload new file)

#### Scenario: Partial rendering failures are handled
- **WHEN** some entities render successfully but one fails
- **THEN** the successfully rendered entities remain visible
- **AND** an error message indicates the issue
- **AND** the console logs which entity failed and why

#### Scenario: Canvas context errors are handled
- **WHEN** the canvas context cannot be initialized (unsupported browser, etc.)
- **THEN** a clear error message is displayed
- **AND** the message directs user to use a modern browser
- **AND** the application degrades gracefully (file upload still works)

### Requirement: Rendering Performance
The application SHALL render diagrams efficiently.

#### Scenario: Small diagrams render quickly
- **WHEN** a model with 1-10 entities is rendered
- **THEN** the rendering completes in less than 100ms
- **AND** the user perceives instant rendering

#### Scenario: Medium diagrams render acceptably
- **WHEN** a model with 10-50 entities is rendered
- **THEN** the rendering completes in less than 500ms
- **AND** the user sees a smooth rendering process

#### Scenario: Large diagrams render within acceptable time
- **WHEN** a model with 50-100 entities is rendered
- **THEN** the rendering completes in less than 2000ms (2 seconds)
- **AND** a loading indicator is shown during rendering
- **AND** the browser remains responsive

#### Scenario: Rendering does not block UI
- **WHEN** rendering is in progress
- **THEN** the browser UI remains responsive
- **AND** the user can interact with other parts of the page
- **AND** rendering does not freeze the browser tab
