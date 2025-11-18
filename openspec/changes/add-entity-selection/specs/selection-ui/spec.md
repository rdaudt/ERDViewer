# Spec: Selection UI

## ADDED Requirements

### Requirement: Display selection highlight on selected entities
Selected entities SHALL have a clear, consistent visual highlight.

#### Scenario: Render selection highlight
```
GIVEN entity "Order" is selected
WHEN the ERD canvas is rendered
THEN "Order" entity box has a selection highlight
AND the highlight uses blue accent color (#2563eb)
AND the highlight is a 3px border around the entity box
AND the highlight is visible and clearly distinguishes selected from unselected
```

#### Scenario: Multiple selected entities
```
GIVEN entities "Order", "Customer", "Product" are selected
WHEN the ERD canvas is rendered
THEN all 3 entities display the same selection highlight style
AND the highlights are consistent and uniform
```

#### Scenario: Unselected entity has no highlight
```
GIVEN entity "Employee" is NOT selected
WHEN the ERD canvas is rendered
THEN "Employee" entity box has NO selection highlight
AND "Employee" renders normally without border enhancement
```

#### Scenario: Selection highlight z-order
```
GIVEN entity "Customer" is selected
WHEN the entity is rendered
THEN the selection highlight is drawn BEFORE the entity content
AND the highlight acts as a background layer
AND entity text and borders remain clearly visible over the highlight
```

### Requirement: Provide selection control UI
The system SHALL provide UI buttons for selection operations.

#### Scenario: Display selection controls when model loaded
```
GIVEN a valid model is loaded successfully
WHEN the UI is rendered
THEN selection control buttons are visible
AND "Select All" button is displayed
AND "Deselect All" button is displayed
AND selection count display is visible
```

#### Scenario: Hide selection controls when no model
```
GIVEN no model is loaded
OR the model failed validation
WHEN the UI is rendered
THEN selection control buttons are hidden
AND selection count display is hidden
```

#### Scenario: Controls positioned correctly
```
GIVEN selection controls are visible
WHEN the UI is rendered
THEN controls appear below the subject area selector
AND controls are in the metadata display section
AND controls are horizontally aligned
```

### Requirement: Display selection count
The system SHALL display the number of currently selected entities.

#### Scenario: Display count with selection
```
GIVEN 3 entities are selected
WHEN the UI is rendered
THEN the selection count displays "3 entities selected"
AND the text format is: "<count> entities selected"
AND "entities" is plural even for 1 entity
```

#### Scenario: Display zero count
```
GIVEN no entities are selected
WHEN the UI is rendered
THEN the selection count displays "0 entities selected"
```

#### Scenario: Update count on selection change
```
GIVEN 2 entities are selected
AND selection count displays "2 entities selected"
WHEN the user selects 1 more entity
THEN selection count immediately updates to "3 entities selected"
```

### Requirement: Select All button functionality
The "Select All" button SHALL select all visible entities in the current view.

#### Scenario: Click Select All button
```
GIVEN visible entities are: ["Order", "Customer", "Product"]
AND no entities are currently selected
WHEN the user clicks "Select All" button
THEN all 3 entities become selected
AND selectedEntityNames = ["Order", "Customer", "Product"]
AND selection count displays "3 entities selected"
AND all entities display selection highlight
```

#### Scenario: Select All with subject area filter
```
GIVEN subject area is "Sales"
AND visible entities are: ["Order", "Customer"]
AND "Product" and "Employee" are NOT visible
WHEN the user clicks "Select All" button
THEN only visible entities are selected
AND selectedEntityNames = ["Order", "Customer"]
AND selection count displays "2 entities selected"
```

### Requirement: Deselect All button functionality
The "Deselect All" button SHALL clear all entity selections.

#### Scenario: Click Deselect All button
```
GIVEN 3 entities are currently selected
WHEN the user clicks "Deselect All" button
THEN selectedEntityNames is cleared
AND selection count displays "0 entities selected"
AND no entities display selection highlight
```

#### Scenario: Deselect All when none selected
```
GIVEN no entities are selected
WHEN the user clicks "Deselect All" button
THEN no error occurs
AND selection count remains "0 entities selected"
```

### Requirement: Keyboard shortcut support
The system SHALL support keyboard shortcuts for selection operations.

#### Scenario: Ctrl+A selects all visible entities
```
GIVEN visible entities are: ["Order", "Customer", "Product"]
WHEN the user presses Ctrl+A (or Cmd+A on Mac)
THEN all visible entities become selected
AND selectedEntityNames = ["Order", "Customer", "Product"]
AND default browser behavior (select all text) is prevented
```

#### Scenario: Escape deselects all entities
```
GIVEN 3 entities are selected
WHEN the user presses Escape key
THEN all entities are deselected
AND selectedEntityNames is empty
AND selection count displays "0 entities selected"
```

#### Scenario: Keyboard shortcuts work with subject area filter
```
GIVEN subject area is "Inventory"
AND visible entities are: ["Product"]
WHEN the user presses Ctrl+A
THEN only "Product" is selected (not entities in other subject areas)
```

### Requirement: Visual button states
Selection control buttons SHALL have appropriate visual states.

#### Scenario: Button hover state
```
GIVEN selection control buttons are rendered
WHEN the user hovers over "Select All" button
THEN the button shows hover state (color change, shadow, etc.)
```

#### Scenario: Button active/pressed state
```
GIVEN the user hovers over "Deselect All" button
WHEN the user presses the mouse button down
THEN the button shows active/pressed state
```

#### Scenario: Button disabled state (optional)
```
GIVEN no entities are visible (empty subject area)
WHEN selection controls are rendered
THEN "Select All" button MAY be disabled
AND disabled state is visually indicated (grayed out)
```

### Requirement: Selection accessibility
Selection controls and keyboard shortcuts SHALL be accessible.

#### Scenario: Button ARIA labels
```
GIVEN selection control buttons are rendered
WHEN a screen reader encounters "Select All" button
THEN it announces "Select All" or "Select all visible entities"
WHEN a screen reader encounters "Deselect All" button
THEN it announces "Deselect All" or "Clear selection"
```

#### Scenario: Keyboard navigation
```
GIVEN the user uses Tab key to navigate
WHEN focus moves to selection control buttons
THEN the buttons receive visible focus indicators
AND the user can activate buttons with Enter or Space keys
```

#### Scenario: Selection count announcement
```
GIVEN 3 entities become selected
WHEN the selection count updates
THEN screen readers MAY announce "3 entities selected"
(using aria-live region if implemented)
```
