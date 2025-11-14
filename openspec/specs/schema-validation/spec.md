# schema-validation Specification

## Purpose
TBD - created by archiving change add-file-upload-validation. Update Purpose after archive.
## Requirements
### Requirement: JSON Schema Validation
The application SHALL validate uploaded .erdv files against the erdv_file_spec.json JSON Schema using the ajv library.

#### Scenario: Valid file passes validation
- **WHEN** a .erdv file conforming to erdv_file_spec.json is uploaded
- **THEN** validation passes without errors
- **AND** the parsed model is stored in application state
- **AND** success feedback is shown to the user

#### Scenario: Invalid file fails validation
- **WHEN** a .erdv file not conforming to erdv_file_spec.json is uploaded
- **THEN** validation fails with specific errors
- **AND** errors are formatted and displayed to the user
- **AND** the file is NOT stored in application state

### Requirement: Validation Error Reporting
The application SHALL provide clear, actionable error messages when validation fails, including the field path and reason for failure.

#### Scenario: Missing required field error
- **WHEN** validation fails due to a missing required field
- **THEN** error message indicates the missing field name
- **AND** error message shows the JSON path where field is expected
- **AND** example: "Missing required property: metadata"

#### Scenario: Invalid data type error
- **WHEN** validation fails due to wrong data type
- **THEN** error message indicates expected type and actual type
- **AND** error message shows the JSON path of the invalid field
- **AND** example: "Invalid data type at entities[0].name: expected string, got number"

#### Scenario: Pattern mismatch error
- **WHEN** validation fails due to regex pattern mismatch
- **THEN** error message shows the field, pattern, and actual value
- **AND** error message explains what format is expected
- **AND** example: "Pattern mismatch at entities[0].name: must match ^[A-Za-z_][A-Za-z0-9_]*$ (identifier format)"

#### Scenario: Multiple validation errors
- **WHEN** file has multiple validation errors
- **THEN** all errors are collected and displayed
- **AND** errors are numbered for easy reference
- **AND** errors are displayed in a scrollable list
- **AND** user can see all errors without clicking through one at a time

### Requirement: Schema Loading
The application SHALL load the erdv_file_spec.json schema file and initialize the validator on application startup.

#### Scenario: Schema loads successfully
- **WHEN** application initializes
- **THEN** erdv_file_spec.json is fetched and loaded
- **AND** ajv validator is initialized with the schema
- **AND** validator is ready before any file upload
- **AND** no errors are logged to console

#### Scenario: Schema fails to load
- **WHEN** erdv_file_spec.json cannot be loaded (network error, missing file)
- **THEN** application displays an error message
- **AND** file upload is disabled
- **AND** error suggests checking file availability
- **AND** detailed error is logged to console

### Requirement: Validation Performance
The application SHALL validate files quickly to provide responsive user feedback.

#### Scenario: Small file validates quickly
- **WHEN** a file with <50 entities is uploaded
- **THEN** validation completes in less than 500ms
- **AND** user sees validation result without noticeable delay

#### Scenario: Medium file validates reasonably
- **WHEN** a file with 50-200 entities is uploaded
- **THEN** validation completes in less than 2 seconds
- **AND** loading indicator shows during validation
- **AND** user experience remains acceptable

#### Scenario: Large file shows loading state
- **WHEN** a file with >200 entities is uploaded
- **THEN** loading indicator is shown immediately
- **AND** validation may take longer but still completes
- **AND** user is not blocked from other actions (future enhancement)

### Requirement: Validation Coverage
The application SHALL validate all aspects of the .erdv file format defined in erdv_file_spec.json.

#### Scenario: Root level validation
- **WHEN** file is validated
- **THEN** required root properties are checked: metadata, server_info, database, schemas, entities, relationships, subject_areas
- **AND** no additional properties are allowed (per additionalProperties: false)

#### Scenario: Metadata validation
- **WHEN** metadata section is validated
- **THEN** model_name is required and must be a non-empty string

#### Scenario: Server info validation
- **WHEN** server_info section is validated
- **THEN** target_server_name and version are required
- **AND** both must be non-empty strings

#### Scenario: Entity validation
- **WHEN** entities array is validated
- **THEN** each entity must have: name, schema_name, columns, primary_key_columns
- **AND** entity name matches identifier pattern
- **AND** columns array has at least one column
- **AND** primary_key_columns references valid column names

#### Scenario: Column validation
- **WHEN** columns are validated
- **THEN** each column must have: name, data_type, nullable, order
- **AND** name matches identifier pattern
- **AND** data_type matches tsqlDataType pattern
- **AND** nullable is boolean
- **AND** order is integer >= 1

#### Scenario: Relationship validation
- **WHEN** relationships are validated
- **THEN** required fields: name, isLogical, parent_entity_name, child_entity_name, parent_entity_columns, child_entity_columns, relationship_type, cardinality, verb_phrase, inverse_phrase
- **AND** relationship_type is "Identifying" or "Non-Identifying"
- **AND** cardinality notation matches pattern (0..1, 1..1, 0..N, 1..N)

#### Scenario: Subject area validation
- **WHEN** subject_areas are validated
- **THEN** each subject area has: name, entity_count, entity_names
- **AND** entity_names is an array of identifiers
- **AND** entity_count is integer >= 0

### Requirement: Validation Error Formatting
The application SHALL convert ajv validation errors into user-friendly messages that non-technical users can understand.

#### Scenario: Technical ajv error is converted to user-friendly message
- **WHEN** ajv returns a validation error
- **THEN** the error is reformatted to be more readable
- **AND** technical jargon is replaced with plain language
- **AND** field paths use dot notation or array indices (entities[0].name instead of /entities/0/name)
- **AND** suggestions for fixing the error are provided when possible

#### Scenario: Error shows context
- **WHEN** validation error is displayed
- **THEN** error message includes the JSON path
- **AND** if applicable, the invalid value is shown
- **AND** expected format or value is clearly stated
- **AND** example: "At path 'entities[2].columns[0].order': expected integer, got string '1'"

