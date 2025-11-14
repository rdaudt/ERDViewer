# Change: Add File Upload and Validation

## Why
ERD Viewer currently has no way to accept user input. To render ERDs, the application must be able to accept .erdv files from users and validate them against the JSON Schema specification. This is the foundational feature that enables all visualization functionality.

## What Changes
- Add file upload UI component with drag-and-drop and file selection
- Integrate JSON Schema validation library (ajv)
- Implement file reading and parsing
- Display validation errors with clear, actionable messages
- Show uploaded file metadata (model name, database, entity count)
- Store parsed model data in application state
- Replace placeholder UI with functional upload component

**Technical Decisions:**
- **ajv** - Industry-standard JSON Schema validator, fast, supports Draft 2020-12
- **Native File API** - Browser-native file handling, no additional libraries needed
- **Simple state management** - Store model in module-level variable (defer complex state library)
- **Error display** - User-friendly error messages with line numbers and field names

## Impact
- **Affected specs:** `file-upload` (new), `schema-validation` (new)
- **Affected code:**
  - `index.html` - Update upload section with interactive elements
  - `src/main.ts` - Add file upload handlers
  - New: `src/fileUpload.ts` - File upload logic
  - New: `src/validation.ts` - Schema validation logic
  - New: `src/state.ts` - Application state management
- **Dependencies:**
  - Add ajv library (`npm install ajv`)
  - Add ajv-formats for format validation (`npm install ajv-formats`)
- **Breaking:** None (first feature implementation)

## Success Criteria
- Users can upload .erdv files via drag-and-drop
- Users can upload .erdv files via file selection button
- Invalid files show clear validation error messages
- Valid files are accepted and metadata is displayed
- Only .erdv/.json files are accepted
- Only one file can be loaded at a time
- Application state holds the parsed model data
- Console shows no errors during upload/validation
