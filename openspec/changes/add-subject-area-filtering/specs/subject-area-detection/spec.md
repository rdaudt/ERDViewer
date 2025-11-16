# Spec: Subject Area Detection

## ADDED Requirements

### Requirement: Detect subject areas from ERDV model
The system SHALL parse the `subject_areas` array from uploaded ERDV files and make them available for filtering.

#### Scenario: File with subject areas
```
GIVEN a valid ERDV file containing:
  - subject_areas: [
      { name: "Sales", entity_count: 25, entity_names: ["Order", "Customer", ...] },
      { name: "Inventory", entity_count: 20, entity_names: ["Product", "Stock", ...] }
    ]
WHEN the file is loaded and validated
THEN the system detects 2 subject areas: "Sales" and "Inventory"
AND each subject area contains the specified entity names
AND entity counts match the entity_names array length
```

#### Scenario: File with no subject areas
```
GIVEN a valid ERDV file with an empty subject_areas array: []
WHEN the file is loaded and validated
THEN the system detects 0 explicit subject areas
AND only the synthetic "All" area is available
```

### Requirement: Create synthetic "All" subject area
The system SHALL always provide an "All" subject area representing the entire model, regardless of explicit subject areas defined in the file.

#### Scenario: Synthetic "All" area creation
```
GIVEN an ERDV model with 80 entities
AND 3 explicit subject areas covering 65 entities
WHEN subject areas are detected
THEN a synthetic "All" subject area is created
AND "All" contains all 80 entity names from model.entities
AND "All" has entity_count = 80
AND "All" is marked as isSynthetic = true
```

#### Scenario: "All" is always first
```
GIVEN any ERDV model with subject areas
WHEN the list of available subject areas is retrieved
THEN "All" appears as the first item in the list
AND explicit subject areas appear in their defined order after "All"
```

### Requirement: Validate subject area entity references
The system SHALL validate that entity names in subject areas refer to actual entities in the model.

#### Scenario: Valid entity references
```
GIVEN a subject area "Sales" with entity_names: ["Order", "Customer"]
AND the model contains entities named "Order" and "Customer"
WHEN subject areas are detected
THEN the "Sales" subject area is valid
AND no warnings are logged
```

#### Scenario: Invalid entity reference
```
GIVEN a subject area "Sales" with entity_names: ["Order", "NonExistentEntity"]
AND the model does NOT contain an entity named "NonExistentEntity"
WHEN subject areas are detected
THEN a warning is logged: "Subject area 'Sales' references non-existent entity: 'NonExistentEntity'"
AND the invalid entity name is excluded from the subject area
AND the subject area's entity_count is adjusted to reflect actual valid entities
```

### Requirement: Handle entities not in any subject area
The system SHALL correctly handle entities that exist in the model but are not included in any explicit subject area.

#### Scenario: Orphan entities
```
GIVEN a model with entities: ["Order", "Customer", "Product", "AuditLog"]
AND subject areas:
  - "Sales": ["Order", "Customer"]
  - "Inventory": ["Product"]
AND "AuditLog" is NOT in any subject area
WHEN subject areas are detected
THEN "AuditLog" appears ONLY in the "All" subject area
AND "AuditLog" does NOT appear in "Sales" or "Inventory"
```

### Requirement: Provide subject area metadata
The system SHALL expose subject area information for UI rendering and filtering operations.

#### Scenario: Retrieve subject area info
```
GIVEN a model with subject areas detected
WHEN getAvailableSubjectAreas() is called
THEN it returns an array of SubjectAreaInfo objects
AND each object contains:
  - name: string (subject area name)
  - entityCount: number (number of entities in area)
  - entityNames: string[] (array of entity names)
  - isSynthetic: boolean (true for "All", false for others)
```

#### Scenario: Entity count accuracy
```
GIVEN a subject area "Sales" with entity_names: ["Order", "Customer", "Invoice"]
WHEN the subject area info is retrieved
THEN entityCount = 3
AND entityNames.length = 3
AND entityCount matches the actual number of valid entity references
```
