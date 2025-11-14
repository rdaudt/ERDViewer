# Design: File Upload and Validation

## Context
This is the first user-facing feature of ERD Viewer. Users need a way to upload .erdv files for visualization. The implementation must be simple, robust, and provide excellent error feedback since validation errors are common when working with JSON files.

## Goals / Non-Goals

### Goals
- Intuitive file upload UX (drag-drop + button)
- Fast validation (<1s for typical files)
- Clear, actionable error messages
- Parse and store valid files in memory
- Replace placeholder UI with functional component

### Non-Goals
- Multiple file uploads (only one model at a time per requirements)
- File editing or modification
- Saving files back to disk
- Server-side validation (pure client-side)
- Complex state management (defer until needed)

## Decisions

### Decision: Use ajv for JSON Schema validation
**Rationale:**
- Industry standard, widely used
- Supports JSON Schema Draft 2020-12 (matches erdv_file_spec.json)
- Fast validation performance
- Good error reporting with detailed messages
- TypeScript support

**Alternatives considered:**
- joi: Designed for JavaScript validation, not JSON Schema
- zod: TypeScript-first, but requires rebuilding schema (we already have JSON Schema)
- Manual validation: Error-prone, time-consuming to maintain

### Decision: Native File API for file handling
**Rationale:**
- Built into all modern browsers
- No dependencies required
- Simple API for drag-drop and file selection
- Direct FileReader API for reading JSON

**Alternatives considered:**
- File upload library: Unnecessary overhead for simple use case
- Server upload: Not needed, pure client-side application

### Decision: Simple module-level state
**Rationale:**
- Single model at a time (per requirements)
- No complex state transitions yet
- Easy to migrate to state library later if needed (Redux, Zustand, etc.)
- Keeps code simple and focused

**Alternatives considered:**
- Redux/Zustand now: Overkill for current needs, adds complexity
- localStorage: Not needed, application state is session-based
- URL parameters: Would expose large JSON in URL, not user-friendly

### Decision: Inline error display
**Rationale:**
- Errors shown directly in upload area
- Users don't need to hunt for error messages
- Clear visual feedback immediately after upload
- Scrollable error list for multiple errors

## Architecture

### File Upload Flow
```
User Action (drag/drop or select file)
  ↓
Read file as text (FileReader API)
  ↓
Parse JSON
  ↓
Validate against erdv_file_spec.json (ajv)
  ↓
├─ Valid: Store in state, show metadata, enable rendering
└─ Invalid: Show errors, keep upload UI active
```

### Module Structure
```
src/
├── fileUpload.ts       # File upload UI logic and event handlers
├── validation.ts       # JSON Schema validation with ajv
├── state.ts            # Application state management
├── main.ts             # Application entry (updated)
└── types.ts            # TypeScript types (existing)
```

### State Structure
```typescript
interface AppState {
  model: ERDVModel | null;        // Parsed and validated model
  fileName: string | null;         // Original filename
  uploadedAt: Date | null;         // Upload timestamp
  validationErrors: string[] | null; // Validation errors if any
}
```

### Error Message Format
```
Validation failed with 3 errors:

1. Missing required property: metadata
   Path: root

2. Invalid data type: expected string, got number
   Path: entities[0].name

3. Pattern mismatch: must match ^[A-Za-z_][A-Za-z0-9_]*$
   Path: entities[2].columns[1].name
   Value: "2ndColumn"
```

## Component Breakdown

### File Upload Component (`fileUpload.ts`)
**Responsibilities:**
- Setup drag-and-drop zone event listeners
- Handle file selection button click
- Read file contents with FileReader
- Trigger validation
- Display metadata on success
- Display errors on failure

**Key Functions:**
- `initFileUpload()` - Initialize event listeners
- `handleFileDrop(event)` - Handle drag-and-drop
- `handleFileSelect(event)` - Handle file button click
- `readFile(file)` - Read file as text
- `displayMetadata(model)` - Show model summary
- `displayErrors(errors)` - Show validation errors

### Validation Module (`validation.ts`)
**Responsibilities:**
- Load erdv_file_spec.json
- Initialize ajv validator
- Validate parsed JSON against schema
- Format error messages for display

**Key Functions:**
- `initValidator()` - Setup ajv with schema
- `validateModel(data)` - Validate against schema
- `formatErrors(errors)` - Convert ajv errors to user-friendly messages

### State Module (`state.ts`)
**Responsibilities:**
- Store current model
- Provide getter/setter for model
- Notify listeners when model changes (future)

**Key Functions:**
- `getModel()` - Get current model
- `setModel(model)` - Store validated model
- `clearModel()` - Remove current model
- `getMetadata()` - Get model metadata summary

## UI Updates

### Upload Section (Updated)
```html
<section class="upload-section">
  <div class="upload-zone" id="upload-zone">
    <p class="upload-icon">📁</p>
    <h2>Upload .erdv File</h2>
    <p>Drag and drop your file here, or click to browse</p>
    <input type="file" id="file-input" accept=".erdv,.json" hidden>
    <button id="upload-button" class="button-primary">Select File</button>
  </div>

  <!-- Shown on successful upload -->
  <div class="upload-success" id="upload-success" hidden>
    <h3>✓ File Loaded Successfully</h3>
    <div class="metadata-display">
      <p><strong>Model:</strong> <span id="model-name"></span></p>
      <p><strong>Database:</strong> <span id="database-name"></span></p>
      <p><strong>Entities:</strong> <span id="entity-count"></span></p>
      <p><strong>Relationships:</strong> <span id="relationship-count"></span></p>
    </div>
    <button id="upload-another" class="button-secondary">Upload Different File</button>
  </div>

  <!-- Shown on validation errors -->
  <div class="upload-errors" id="upload-errors" hidden>
    <h3>⚠ Validation Errors</h3>
    <div class="error-list" id="error-list"></div>
    <button id="try-again" class="button-secondary">Try Again</button>
  </div>
</section>
```

## Technology Stack Additions
- **ajv** (^8.17.1) - JSON Schema validator
- **ajv-formats** (^3.0.1) - Format validators for ajv

## Risks / Trade-offs

### Risk: Large file performance
**Impact:** Validation may be slow for very large models (1000+ entities)
**Mitigation:**
- Test with large example files
- Add loading indicator during validation
- Consider Web Worker for validation if needed (Phase 9)
- Current scope: Handle models up to 200 entities smoothly

### Risk: JSON Schema complexity
**Impact:** erdv_file_spec.json uses $refs which may need special handling
**Mitigation:**
- ajv handles $refs natively
- Test with erdv_file_spec.json to verify
- Document any ajv configuration needed

### Trade-off: Client-side only validation
**Reasoning:**
- Pure client-side aligns with project goals (no backend)
- All validation happens in browser
- No server costs, instant feedback
- **Drawback:** Limited to browser memory for large files

### Trade-off: Single file limitation
**Reasoning:**
- Per requirements, only one model at a time
- Simplifies state management
- Prevents confusion about which model is rendered
- **Drawback:** Users can't compare multiple models (out of scope)

## Migration Plan
N/A - This is a new feature with no existing functionality to migrate.

## Open Questions
None - requirements are clear and scope is well-defined.
