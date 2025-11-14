# ERD Viewer

A visualization and exploration tool for relational data models. ERD Viewer helps data practitioners explore and visualize entity-relationship diagrams (ERDs) from pre-existing data models.

## Features (Planned)

- **File Upload**: Upload `.erdv` (JSON) files containing data model definitions
- **ERD Visualization**: Render entities, columns, and relationships as interactive diagrams
- **Subject Areas**: Filter and view logical groupings of entities
- **Interactive Canvas**: Zoom, pan, and drag entities around the canvas
- **Auto-Layout**: Multiple layout algorithms for organizing diagrams
- **Export**: Export diagrams to PNG, JPG, or SVG formats

## Current Status

**Phase 2 Complete**: Basic ERD Rendering
- ✅ Development environment with hot reload
- ✅ TypeScript with strict type checking
- ✅ Production build system
- ✅ Basic UI skeleton
- ✅ File upload with drag-and-drop support
- ✅ JSON Schema validation with user-friendly error messages
- ✅ Metadata display for loaded models
- ✅ Entity rendering on HTML5 Canvas
- ✅ Grid layout for entities
- ✅ Three-section entity boxes (header, primary keys, columns)
- ✅ Foreign key notation
- ⏳ Relationship rendering (Phase 3)
- ⏳ Interactive features (coming soon)

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

## Development

### Start Development Server

Run the development server with hot module replacement:

```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:5173`.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The production files will be generated in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

This serves the production build at `http://localhost:5173`.

## Using the Application

### Uploading a Data Model

1. **Start the development server** (see above)
2. **Upload a `.erdv` file** using one of these methods:
   - **Drag and drop**: Drag a `.erdv` or `.json` file onto the upload zone
   - **Click to browse**: Click the "Select File" button and choose a file from your system

3. **Validation**: The file will be automatically validated against the ERD schema
   - ✅ **Success**: View model metadata (name, database, entity count, relationship count)
   - ❌ **Errors**: Review detailed validation errors with file paths and descriptions

4. **Upload another file**: Click "Upload Different File" to load a new model

### File Requirements

- **Format**: `.erdv` or `.json` files
- **Content**: Must conform to the ERD schema defined in [erdv_file_spec.json](erdv_file_spec.json)
- **Size**: Files larger than 10MB will generate a console warning but will still be processed

### Example Files

Create a simple test file (`test.erdv`):
```json
{
  "$schema": "https://example.com/schemas/erd-model.schema.json",
  "metadata": {
    "model_name": "Sample Model"
  },
  "server_info": {
    "target_server_name": "Microsoft SQL Server",
    "version": "2022"
  },
  "database": "SampleDB",
  "schemas": ["dbo"],
  "entities": [
    {
      "name": "Users",
      "schema_name": "dbo",
      "columns": [
        {
          "name": "user_id",
          "data_type": "int",
          "nullable": false,
          "order": 1
        }
      ],
      "primary_key_columns": ["user_id"]
    }
  ],
  "relationships": [],
  "subject_areas": []
}
```

## Project Structure

```
erd-viewer/
├── index.html              # Entry HTML file
├── src/
│   ├── main.ts             # Application entry point
│   ├── types.ts            # TypeScript type definitions for .erdv files
│   ├── state.ts            # Application state management
│   ├── validation.ts       # JSON Schema validation using ajv
│   ├── fileUpload.ts       # File upload and drag-drop handling
│   └── styles.css          # Global styles
├── dist/                   # Production build output (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── erdv_file_spec.json     # JSON Schema for .erdv file format
└── openspec/               # OpenSpec change management
    ├── AGENTS.md           # OpenSpec workflow documentation
    ├── project.md          # Project context and conventions
    └── changes/            # Approved changes and proposals
```

## Technology Stack

- **Language**: TypeScript 5.x (strict mode, ES2020 target)
- **Build Tool**: Vite 7.x with hot module replacement
- **Runtime**: Modern browsers (ES2020+)
- **Module System**: ES Modules
- **Validation**: ajv 8.x (JSON Schema Draft 2020-12)
- **State Management**: Simple module-level state (no framework)
- **Styling**: Vanilla CSS with CSS variables

## Browser Requirements

ERD Viewer requires a modern browser with support for:
- ES2020 features (optional chaining, nullish coalescing)
- Native ES modules
- File API
- Canvas API

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Approach

This project follows **OpenSpec-driven development**:
- All significant changes go through a proposal → approval → implementation workflow
- Specifications are maintained in `openspec/specs/`
- Changes are proposed in `openspec/changes/`
- See `openspec/AGENTS.md` for detailed workflow

## File Format

ERD Viewer works with `.erdv` files (JSON format). The schema is defined in `erdv_file_spec.json`.

Example structure:
```json
{
  "metadata": { "model_name": "..." },
  "server_info": { "target_server_name": "...", "version": "..." },
  "database": "...",
  "schemas": ["..."],
  "entities": [...],
  "relationships": [...],
  "subject_areas": [...]
}
```

See `data_model_example.yaml` for a complete example.

## Common Validation Errors

When uploading files, you may encounter validation errors. Here are some common issues:

### Missing Required Properties
```
Missing required property: server_info
```
**Solution**: Ensure all required top-level fields are present: `metadata`, `server_info`, `database`, `schemas`, `entities`, `relationships`, `subject_areas`

### Invalid Identifier Format
```
Invalid identifier format (must start with letter/underscore, followed by letters/digits/underscores)
```
**Solution**: Entity names, column names, and other identifiers must follow SQL naming conventions:
- Start with a letter (a-z, A-Z) or underscore (_)
- Followed by letters, digits (0-9), or underscores
- Example: `user_id`, `OrderDate`, `_temp`

### Empty Model Name
```
String too short: must have at least 1 characters
Path: metadata.model_name
```
**Solution**: The `model_name` field cannot be empty. Provide a meaningful name for your data model.

### Invalid Array Length
```
Array too short: must have at least 1 items
Path: entities
```
**Solution**: The `entities` array must contain at least one entity. Empty models are not allowed.

### Invalid Cardinality Notation
```
Invalid value: must be one of ["0..1","1..1","0..N","1..N"]
```
**Solution**: Use only the allowed cardinality notations in relationships:
- `"0..1"`: Optional single relationship
- `"1..1"`: Required single relationship
- `"0..N"`: Optional multiple relationship
- `"1..N"`: Required multiple relationship

## Contributing

This project uses OpenSpec for change management. To propose changes:

1. Read `openspec/AGENTS.md` for workflow details
2. Create a proposal in `openspec/changes/`
3. Wait for approval before implementation

## License

ISC

## Version

1.0.0 - Initial project foundation
