# Spec: Entity Selection

## ADDED Requirements

### Requirement: Store entity selection state
The system SHALL maintain a set of selected entity names in application state.

#### Scenario: Initialize empty selection
```
GIVEN the application starts
OR a new file is loaded
WHEN the application state is initialized
THEN selectedEntityNames is an empty Set
AND no entities are selected
```

#### Scenario: Store selection by entity name
```
GIVEN entities: ["Order", "Customer", "Product"]
WHEN the user selects "Customer"
THEN selectedEntityNames contains "Customer"
AND selectedEntityNames.size = 1
```

#### Scenario: Selection persists by name across reordering
```
GIVEN "Customer" entity is selected
AND selectedEntityNames contains "Customer"
WHEN the entity list is reordered or filtered
THEN selectedEntityNames still contains "Customer"
AND the selection remains valid regardless of entity index changes
```

### Requirement: Select entity via click
The system SHALL allow users to select an entity by clicking on it.

#### Scenario: Click unselected entity
```
GIVEN entity "Order" is not selected
WHEN the user clicks on "Order" entity box
THEN "Order" is added to selectedEntityNames
AND "Order" entity displays selection highlight
AND selection count increases by 1
```

#### Scenario: Click selected entity (toggle off)
```
GIVEN entity "Customer" is selected
AND selectedEntityNames contains "Customer"
WHEN the user clicks on "Customer" entity box again
THEN "Customer" is removed from selectedEntityNames
AND "Customer" entity selection highlight is removed
AND selection count decreases by 1
```

#### Scenario: Click vs drag detection
```
GIVEN the user presses mouse down on entity "Product"
WHEN the mouse moves less than 5 pixels
AND the user releases the mouse button
THEN the click is interpreted as a selection action
AND "Product" selection state is toggled
```

#### Scenario: Drag does not trigger selection
```
GIVEN the user presses mouse down on entity "Order"
WHEN the mouse moves more than 5 pixels
AND the user releases the mouse button
THEN the action is interpreted as a drag (not a click)
AND "Order" selection state does NOT change
```

### Requirement: Multi-select with modifier key
The system SHALL support multi-select using Ctrl (Windows/Linux) or Cmd (Mac) modifier key.

#### Scenario: Ctrl+Click to add to selection
```
GIVEN entity "Order" is selected
AND selectedEntityNames = ["Order"]
WHEN the user holds Ctrl and clicks on "Customer"
THEN "Customer" is added to selectedEntityNames
AND selectedEntityNames = ["Order", "Customer"]
AND both entities display selection highlight
```

#### Scenario: Ctrl+Click to remove from selection
```
GIVEN entities "Order" and "Customer" are selected
AND selectedEntityNames = ["Order", "Customer"]
WHEN the user holds Ctrl and clicks on "Order"
THEN "Order" is removed from selectedEntityNames
AND selectedEntityNames = ["Customer"]
AND only "Customer" displays selection highlight
```

#### Scenario: Click without modifier replaces selection
```
GIVEN entities "Order" and "Customer" are selected
AND selectedEntityNames = ["Order", "Customer"]
WHEN the user clicks on "Product" WITHOUT holding Ctrl/Cmd
THEN selectedEntityNames is cleared and set to ["Product"]
AND only "Product" displays selection highlight
AND "Order" and "Customer" highlights are removed
```

### Requirement: Select all visible entities
The system SHALL provide functionality to select all visible entities in the current view.

#### Scenario: Select all in unfiltered view
```
GIVEN the subject area is "All"
AND visible entities are: ["Order", "Customer", "Product", "Employee"]
WHEN the user triggers "Select All" action
THEN selectedEntityNames = ["Order", "Customer", "Product", "Employee"]
AND all 4 entities display selection highlight
AND selection count displays "4 entities selected"
```

#### Scenario: Select all in filtered view
```
GIVEN the subject area is "Sales"
AND visible entities are: ["Order", "Customer"]
AND "Product" and "Employee" are NOT visible
WHEN the user triggers "Select All" action
THEN selectedEntityNames = ["Order", "Customer"]
AND only visible entities are selected
AND "Product" and "Employee" remain unselected
```

#### Scenario: Select all with existing selection
```
GIVEN entities "Order" is already selected
AND visible entities are: ["Order", "Customer", "Product"]
WHEN the user triggers "Select All" action
THEN selectedEntityNames = ["Order", "Customer", "Product"]
AND all visible entities are selected (including previously selected)
```

### Requirement: Deselect all entities
The system SHALL provide functionality to clear all entity selections.

#### Scenario: Deselect all
```
GIVEN entities "Order", "Customer", "Product" are selected
AND selectedEntityNames = ["Order", "Customer", "Product"]
WHEN the user triggers "Deselect All" action
THEN selectedEntityNames is empty
AND no entities display selection highlight
AND selection count displays "0 entities selected"
```

#### Scenario: Deselect all when none selected
```
GIVEN no entities are selected
AND selectedEntityNames is empty
WHEN the user triggers "Deselect All" action
THEN selectedEntityNames remains empty
AND no error occurs
```

### Requirement: Maintain selection during interactions
Selection state SHALL persist while the user zooms, pans, or drags entities.

#### Scenario: Selection persists during zoom
```
GIVEN entities "Order" and "Customer" are selected
WHEN the user zooms in to 200%
THEN selectedEntityNames still contains ["Order", "Customer"]
AND both entities still display selection highlight
AND selection count remains "2 entities selected"
```

#### Scenario: Selection persists during pan
```
GIVEN entity "Product" is selected
WHEN the user pans the canvas 500px to the right
THEN "Product" remains selected
AND selection highlight remains visible (moves with entity)
```

#### Scenario: Selection persists during entity drag
```
GIVEN entity "Customer" is selected
WHEN the user drags "Customer" to a new position
THEN "Customer" remains selected after drag completes
AND selection highlight remains visible at new position
```

### Requirement: Handle selection with subject area changes
When the subject area changes, entities not in the new view SHALL be deselected.

#### Scenario: Subject area change deselects hidden entities
```
GIVEN the subject area is "All"
AND entities "Order", "Customer", "Product" are selected
AND selectedEntityNames = ["Order", "Customer", "Product"]
WHEN the user switches to subject area "Sales"
AND "Sales" contains only ["Order", "Customer"]
AND "Product" is NOT in "Sales"
THEN "Product" is removed from selectedEntityNames
AND selectedEntityNames = ["Order", "Customer"]
AND only "Order" and "Customer" display selection highlight
```

#### Scenario: Switch back to "All" restores no selection
```
GIVEN the subject area is "Sales" with ["Order", "Customer"] selected
WHEN the user switches to "All"
THEN selectedEntityNames still contains ["Order", "Customer"]
AND "Product" and "Employee" remain unselected
AND only "Order" and "Customer" display selection highlight
```

### Requirement: Provide selection state query functions
The system SHALL expose functions to query current selection state.

#### Scenario: Query selected entity names
```
GIVEN entities "Order" and "Customer" are selected
WHEN getSelectedEntityNames() is called
THEN it returns Set(["Order", "Customer"])
```

#### Scenario: Check if entity is selected
```
GIVEN entity "Product" is selected
WHEN isEntitySelected("Product") is called
THEN it returns true
WHEN isEntitySelected("Employee") is called
THEN it returns false
```

#### Scenario: Get selection count
```
GIVEN 3 entities are selected
WHEN getSelectionCount() is called
THEN it returns 3
```

### Requirement: Reset selection on file load
When a new file is loaded, the selection SHALL be cleared.

#### Scenario: New file clears selection
```
GIVEN entities "Order" and "Customer" are selected in current model
AND selectedEntityNames = ["Order", "Customer"]
WHEN the user loads a new file
AND the new file is validated successfully
THEN selectedEntityNames is reset to empty Set
AND no entities display selection highlight
AND selection count displays "0 entities selected"
```
