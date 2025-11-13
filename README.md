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

This is the initial project foundation. The application currently provides:
- ✅ Development environment with hot reload
- ✅ TypeScript with strict type checking
- ✅ Production build system
- ✅ Basic UI skeleton
- ⏳ File upload functionality (coming soon)
- ⏳ ERD rendering (coming soon)
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

## Project Structure

```
erd-viewer/
├── index.html              # Entry HTML file
├── src/
│   ├── main.ts             # Application entry point
│   ├── types.ts            # TypeScript type definitions for .erdv files
│   └── styles.css          # Global styles
├── dist/                   # Production build output (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── erdv_file_spec.json     # JSON Schema for .erdv file format
└── data_model_example.yaml # Example data model
```

## Technology Stack

- **Language**: TypeScript 5.x (strict mode)
- **Build Tool**: Vite 7.x
- **Runtime**: Modern browsers (ES2020+)
- **Module System**: ES Modules

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

## Contributing

This project uses OpenSpec for change management. To propose changes:

1. Read `openspec/AGENTS.md` for workflow details
2. Create a proposal in `openspec/changes/`
3. Wait for approval before implementation

## License

ISC

## Version

1.0.0 - Initial project foundation
