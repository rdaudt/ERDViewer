# Spec: Subject Area Selection

## ADDED Requirements

### Requirement: Display subject area selector UI
The system SHALL provide a dropdown UI element for selecting subject areas.

#### Scenario: Selector visibility with model loaded
```
GIVEN a valid ERDV model has been loaded successfully
WHEN the UI is rendered
THEN a subject area selector dropdown is visible
AND it is located in the metadata display section
AND it appears below the entity and relationship counts
```

#### Scenario: Selector hidden without model
```
GIVEN no ERDV model has been loaded
OR the model failed validation
WHEN the UI is rendered
THEN the subject area selector is hidden
AND no dropdown element is displayed
```

### Requirement: Populate dropdown with available subject areas
The dropdown SHALL display all available subject areas including the synthetic "All" area.

#### Scenario: Dropdown options with subject areas
```
GIVEN a model with subject areas:
  - "All" (80 entities) - synthetic
  - "Sales" (25 entities)
  - "Inventory" (20 entities)
  - "HR" (15 entities)
WHEN the dropdown is populated
THEN it contains 4 options:
  - "All (80 entities)"
  - "Sales (25 entities)"
  - "Inventory (20 entities)"
  - "HR (15 entities)"
AND "All" is the first option
AND explicit subject areas appear in their defined order
```

#### Scenario: Dropdown with no explicit subject areas
```
GIVEN a model with no explicit subject areas (subject_areas = [])
AND 50 total entities
WHEN the dropdown is populated
THEN it contains only 1 option: "All (50 entities)"
AND the dropdown is still functional (not disabled)
```

#### Scenario: Entity count display format
```
GIVEN a subject area named "Sales" with 25 entities
WHEN the dropdown option is rendered
THEN the option text is exactly: "Sales (25 entities)"
AND the format is: "<name> (<count> entities)"
AND "entities" is always plural (even for 1 entity)
```

### Requirement: Default selection on file load
The system SHALL default to showing the entire model ("All") when a file is first loaded.

#### Scenario: Initial selection
```
GIVEN a user loads a valid ERDV file for the first time
WHEN the model is loaded and subject areas are detected
THEN the selected subject area is set to null (representing "All")
AND the dropdown displays "All (...)" as selected
AND the full model is rendered (no filtering)
```

### Requirement: Update selection on user interaction
The system SHALL respond to user selection changes in the dropdown.

#### Scenario: Select specific subject area
```
GIVEN the dropdown is currently showing "All" as selected
WHEN the user selects "Sales (25 entities)" from the dropdown
THEN the selected subject area changes to "Sales"
AND the state is updated via setSelectedSubjectArea("Sales")
AND a re-render is triggered with filtered data
```

#### Scenario: Select "All" after filtering
```
GIVEN the current selection is "Sales"
AND the diagram is showing only Sales entities
WHEN the user selects "All (...)" from the dropdown
THEN the selected subject area changes to null
AND the state is updated via setSelectedSubjectArea(null)
AND a re-render is triggered showing all entities
```

### Requirement: Persist selection during interactions
The selected subject area SHALL remain active while the user zooms, pans, or drags entities.

#### Scenario: Selection persists during zoom
```
GIVEN the selected subject area is "Sales"
WHEN the user zooms in to 200%
THEN the selected subject area remains "Sales"
AND only Sales entities remain visible
AND the dropdown still shows "Sales (25 entities)" as selected
```

#### Scenario: Selection persists during entity drag
```
GIVEN the selected subject area is "Inventory"
WHEN the user drags a Product entity to a new position
THEN the selected subject area remains "Inventory"
AND the custom position is saved for the Product entity
AND only Inventory entities remain visible
```

### Requirement: Reset selection on new file load
When a new file is loaded, the subject area selection SHALL reset to "All".

#### Scenario: New file resets selection
```
GIVEN the current selection is "Sales"
WHEN the user loads a different ERDV file
AND the new file is validated successfully
THEN the selected subject area is reset to null ("All")
AND the dropdown shows "All (...)" as selected
AND the full new model is rendered
```

### Requirement: Provide accessible dropdown interaction
The dropdown SHALL be keyboard-accessible and follow standard HTML select behavior.

#### Scenario: Keyboard navigation
```
GIVEN the subject area dropdown is rendered
WHEN the user tabs to the dropdown and presses Enter/Space
THEN the dropdown opens showing all options
WHEN the user uses arrow keys to navigate
THEN focus moves between options
WHEN the user presses Enter
THEN the focused option is selected
AND the selection handler is triggered
```

#### Scenario: Screen reader support
```
GIVEN the subject area dropdown has a visible label
WHEN a screen reader encounters the dropdown
THEN it announces "Subject Area" as the label
AND it announces the current selection
AND it indicates the dropdown has X options
```
