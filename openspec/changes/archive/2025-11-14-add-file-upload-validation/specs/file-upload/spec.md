# Capability: File Upload

## ADDED Requirements

### Requirement: File Upload Interface
The application SHALL provide an intuitive interface for users to upload .erdv files using drag-and-drop or file selection.

#### Scenario: User uploads file via drag-and-drop
- **WHEN** user drags a .erdv file over the upload zone
- **THEN** the upload zone displays a visual indication (highlight/border change)
- **AND** when user drops the file, the file is read and processed

#### Scenario: User uploads file via button click
- **WHEN** user clicks the "Select File" button
- **THEN** a file selection dialog opens
- **AND** user can select a .erdv or .json file
- **AND** when file is selected, the file is read and processed

#### Scenario: User attempts to upload invalid file type
- **WHEN** user attempts to upload a file that is not .erdv or .json
- **THEN** an error message is displayed indicating only .erdv/.json files are accepted
- **AND** the file is not processed

### Requirement: File Reading and Parsing
The application SHALL read uploaded files using the browser's File API and parse them as JSON.

#### Scenario: Valid JSON file is read successfully
- **WHEN** a valid .erdv file is uploaded
- **THEN** the file contents are read as text
- **AND** the text is parsed as JSON
- **AND** the parsed JSON is passed to validation

#### Scenario: Invalid JSON file is uploaded
- **WHEN** a file with invalid JSON syntax is uploaded
- **THEN** a clear error message is displayed indicating JSON parsing failed
- **AND** the specific JSON syntax error is shown (line number, if available)
- **AND** the upload interface remains active for retry

### Requirement: Single File Limitation
The application SHALL only work with one data model (.erdv file) at a time, as per project requirements.

#### Scenario: User uploads new file while model is loaded
- **WHEN** a valid model is already loaded
- **AND** user uploads a new file
- **THEN** the previous model is replaced with the new model
- **AND** a confirmation may be shown (optional enhancement)
- **AND** the canvas is cleared and ready for new model rendering

#### Scenario: User can clear current model
- **WHEN** a model is loaded
- **AND** user clicks "Upload Different File" button
- **THEN** the current model is cleared
- **AND** the upload interface is shown again
- **AND** the canvas is reset to empty state

### Requirement: Upload Feedback and Status
The application SHALL provide clear visual feedback about upload status and results.

#### Scenario: File upload in progress
- **WHEN** a file is being read and validated
- **THEN** a loading indicator is displayed
- **AND** the upload interface is disabled to prevent multiple uploads
- **AND** user cannot interact with upload zone during processing

#### Scenario: File upload succeeds
- **WHEN** file validation passes
- **THEN** the upload zone is hidden
- **AND** a success message is displayed
- **AND** file metadata is shown (model name, database, entity count, relationship count)
- **AND** user sees an option to upload a different file

#### Scenario: File upload fails
- **WHEN** file validation fails
- **THEN** the upload zone remains visible
- **AND** validation errors are displayed in a scrollable list
- **AND** user can try uploading a different file
- **AND** the failed file is not stored in application state

### Requirement: Metadata Display
The application SHALL display key metadata from successfully uploaded .erdv files.

#### Scenario: Metadata is extracted and displayed
- **WHEN** a valid .erdv file is loaded
- **THEN** the following metadata is displayed:
  - Model name (from metadata.model_name)
  - Database name (from database field)
  - Entity count (number of entities in entities array)
  - Relationship count (number of relationships in relationships array)
- **AND** metadata is clearly labeled and easy to read
- **AND** metadata remains visible until a new file is uploaded

### Requirement: Error Handling
The application SHALL handle all file upload and reading errors gracefully with user-friendly messages.

#### Scenario: File reading fails
- **WHEN** browser fails to read the file (permissions, corruption, etc.)
- **THEN** a clear error message explains the issue
- **AND** user is prompted to try again or use a different file
- **AND** the error details are logged to console for debugging

#### Scenario: File is too large
- **WHEN** user uploads a file larger than 10MB (reasonable limit)
- **THEN** a warning is shown suggesting the file may be too large
- **AND** validation still proceeds (unless browser fails)
- **AND** performance degradation is acceptable for large files in this phase

#### Scenario: Browser does not support File API
- **WHEN** application loads in a browser without File API support
- **THEN** upload interface shows an error message
- **AND** message directs user to use a modern browser
- **AND** this is caught by existing browser compatibility check
