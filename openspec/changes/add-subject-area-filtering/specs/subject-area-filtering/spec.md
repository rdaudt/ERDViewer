# Spec: Subject Area Filtering

## ADDED Requirements

### Requirement: Filter entities based on selected subject area
The renderer SHALL display only entities belonging to the selected subject area.

#### Scenario: Filter to specific subject area
```
GIVEN a model with entities: ["Order", "Customer", "Product", "Employee"]
AND subject areas:
  - "Sales": ["Order", "Customer"]
  - "Inventory": ["Product"]
  - "HR": ["Employee"]
WHEN the selected subject area is "Sales"
THEN only entities ["Order", "Customer"] are rendered
AND entities ["Product", "Employee"] are NOT rendered
```

#### Scenario: Show all entities when "All" is selected
```
GIVEN a model with 80 entities across multiple subject areas
WHEN the selected subject area is null ("All")
THEN all 80 entities are rendered
AND no filtering is applied
```

#### Scenario: Empty subject area
```
GIVEN a subject area "Archive" with entity_names: []
WHEN the selected subject area is "Archive"
THEN zero entities are rendered
AND the canvas shows an empty diagram
```

### Requirement: Filter relationships based on selected subject area
The renderer SHALL display only relationships where both ends are within the selected subject area.

#### Scenario: Both ends in subject area
```
GIVEN entities in subject area "Sales": ["Order", "Customer"]
AND a relationship: Order → Customer
WHEN the selected subject area is "Sales"
THEN the Order → Customer relationship is rendered
```

#### Scenario: One end outside subject area
```
GIVEN entities in subject area "Sales": ["Order", "Customer"]
AND entities in subject area "Inventory": ["Product"]
AND a relationship: Order → Product (cross-area relationship)
WHEN the selected subject area is "Sales"
THEN the Order → Product relationship is NOT rendered
AND only the Order entity is visible (Product is filtered out)
```

#### Scenario: Parent outside, child inside
```
GIVEN entities in subject area "HR": ["Employee"]
AND entities in subject area "Sales": ["Order"]
AND a relationship: Employee → Order (created_by foreign key)
WHEN the selected subject area is "Sales"
THEN the Employee → Order relationship is NOT rendered
AND only the Order entity is visible (Employee is filtered out)
```

#### Scenario: All relationships when "All" selected
```
GIVEN multiple cross-subject-area relationships exist
WHEN the selected subject area is null ("All")
THEN all relationships are rendered
INCLUDING cross-subject-area relationships
```

### Requirement: Reset view state when changing subject areas
When the user switches to a different subject area, the view state (zoom, pan, entity positions) SHALL be reset.

#### Scenario: Reset zoom and pan
```
GIVEN the current subject area is "Sales"
AND the canvas is zoomed to 250% and panned 500px right
WHEN the user switches to subject area "Inventory"
THEN the zoom is reset to 100%
AND the pan offset is reset to (0, 0)
AND the Inventory entities are rendered at default positions
```

#### Scenario: Clear custom entity positions
```
GIVEN the current subject area is "Sales"
AND the user has dragged "Order" entity to a custom position
WHEN the user switches to subject area "Inventory"
THEN all custom entity positions are cleared
AND the Inventory entities are rendered using grid layout
WHEN the user switches back to "Sales"
THEN the "Order" entity is back at its default grid position (position not preserved)
```

#### Scenario: No reset when re-selecting same area
```
GIVEN the current subject area is "Sales"
AND the canvas is zoomed to 200%
WHEN the user re-selects "Sales" from the dropdown (same area)
THEN the zoom remains at 200%
AND no view reset occurs
```

### Requirement: Preserve canvas interactions within filtered view
Zoom, pan, and entity dragging SHALL work normally when a subject area is selected.

#### Scenario: Zoom within filtered view
```
GIVEN the selected subject area is "Inventory"
AND only Inventory entities are visible
WHEN the user zooms in to 300%
THEN the zoom applies to the filtered diagram
AND only Inventory entities are scaled
AND the selected subject area remains "Inventory"
```

#### Scenario: Pan within filtered view
```
GIVEN the selected subject area is "Sales"
WHEN the user drags the canvas background to pan
THEN the pan offset is updated
AND the Sales entities move accordingly
AND the selected subject area remains "Sales"
```

#### Scenario: Drag entity within filtered view
```
GIVEN the selected subject area is "HR"
AND an "Employee" entity is visible
WHEN the user drags the "Employee" entity to a new position
THEN the custom position is stored in state
AND the entity moves to the new position
AND relationships connected to "Employee" update accordingly
AND the selected subject area remains "HR"
```

### Requirement: Maintain entity relationship integrity within subject area
Relationships between entities in the selected subject area SHALL render correctly with proper cardinality notation.

#### Scenario: Internal relationship rendering
```
GIVEN subject area "Sales" with entities: ["Order", "Customer", "Invoice"]
AND relationships:
  - Customer → Order (1..N)
  - Order → Invoice (1..N)
WHEN the selected subject area is "Sales"
THEN both relationships are rendered with correct crow's foot notation
AND relationship lines connect to specific PK/FK columns
AND cardinality symbols appear on correct ends
```

#### Scenario: Self-referencing relationship
```
GIVEN subject area "HR" with entity "Employee"
AND a self-referencing relationship: Employee → Employee (manager_id)
WHEN the selected subject area is "HR"
THEN the self-referencing relationship is rendered as a loop
AND cardinality notation appears correctly
```

### Requirement: Handle subject area switch with open interactions
If the user switches subject areas during an active interaction (mid-drag, mid-zoom), the interaction SHALL be cancelled gracefully.

#### Scenario: Switch during entity drag
```
GIVEN the user is actively dragging an "Order" entity
AND the mouse button is still down
WHEN the user switches from "Sales" to "Inventory"
THEN the drag operation is cancelled
AND the view is reset to "Inventory"
AND no error occurs
```

#### Scenario: Switch during pan
```
GIVEN the user is actively panning the canvas
AND the mouse button is still down
WHEN the subject area changes
THEN the pan operation is cancelled
AND the view is reset for the new subject area
```

### Requirement: Provide feedback for empty filtered views
When a subject area filter results in no entities being rendered, the UI SHALL provide clear feedback.

#### Scenario: Empty subject area feedback
```
GIVEN a subject area "Archive" with no entities
WHEN the selected subject area is "Archive"
THEN the canvas displays a message: "No entities in this subject area"
AND the message is centered on the canvas
AND no entities or relationships are rendered
```

#### Scenario: All entities filtered out by invalid references
```
GIVEN a subject area "InvalidArea" referencing only non-existent entities
WHEN the selected subject area is "InvalidArea"
THEN the canvas displays a message: "No entities in this subject area"
AND a console warning lists the invalid entity references
```
