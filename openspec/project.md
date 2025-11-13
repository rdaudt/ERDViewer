# Project Context

## Purpose
ERD Viewer (ERDV) is a visualization and exploration tool for relational data models. It helps data practitioners explore and visualize entity-relationship diagrams (ERDs) from pre-existing data models.

**Key Points:**
- ERDV is **not a data modeling tool** - it cannot create or edit data models
- Data models are managed elsewhere and converted to `.erdv` file format for visualization
- Primary users: data practitioners, database designers, analysts
- Primary use case: exploring and understanding existing relational database structures

## Tech Stack
- **Language:** TypeScript 5.x (strict mode, ES2020 target)
- **Frontend Framework:** Vanilla JavaScript/TypeScript (no framework - simplicity first)
- **Build Tool:** Vite 7.x
- **Input Format:** JSON files following `.erdv` specification
- **Schema Validation:** JSON Schema Draft 2020-12
- **Rendering:** Canvas/SVG (for diagram visualization) - to be implemented
- **Target Database Types:** Microsoft SQL Server (primary), format-agnostic design
- **Development Approach:** OpenSpec-driven development

## Project Conventions

### Code Style
- **Simplicity First:** Default to <100 lines of new code per change
- **Single-file implementations** until proven insufficient
- Avoid frameworks without clear justification
- Choose boring, proven patterns over novel approaches
- **Identifier Naming:** `^[A-Za-z_][A-Za-z0-9_]*$` (start with letter/underscore)
- **Capability Naming:** verb-noun format (e.g., "user-auth", "render-erd")
- **Change ID Naming:** kebab-case with verb-led prefixes (add-, update-, remove-, refactor-)

### Architecture Patterns
- **OpenSpec-driven development:** All significant changes go through proposal → approval → implementation
- **Single model at a time:** Application works with one data model per session
- **Read-only architecture:** No data model editing capabilities
- **Subject area isolation:** Render one subject area at a time
- **Validation-first:** Strict JSON Schema validation on all input files

### Testing Strategy
- Input validation tests (erdv_file_spec.json schema compliance)
- Component tests for ERD rendering
- Integration tests for file upload → validation → rendering pipeline
- Visual regression tests for diagram rendering
- Unit tests for layout algorithms
- User interaction tests (drag, zoom, pan)

### Git Workflow
- Follow OpenSpec workflow for changes (see [openspec/AGENTS.md](openspec/AGENTS.md))
- Changes proposed in `openspec/changes/[change-id]/`
- Archive completed changes in `openspec/archive/`
- Maintain current specs in `openspec/specs/`

## Domain Context

### Entity-Relationship Diagrams (ERDs)
- **Entities:** Represented as boxed containers with table name, primary key columns, and regular columns
- **Relationships:** Lines connecting parent-to-child tables using crow's foot notation
- **Cardinality:** 0..1, 1..1, 0..N, 1..N notations
- **Relationship Types:** Identifying vs Non-Identifying
- **Subject Areas:** Logical groupings of related entities

### Data Model Structure
- **Metadata:** model_name
- **Server Info:** target_server_name, version
- **Database:** database name
- **Schemas:** list of schema names
- **Entities:** tables with columns (name, data_type, nullable, order, primary_key)
- **Relationships:** foreign key relationships with cardinality
- **Subject Areas:** logical groupings with entity_names

### Column Notation
- **(PK)** Primary key columns
- **(FK)** Foreign key columns
- Each column displayed on separate line

### T-SQL Data Types
Supported types include: bigint, int, smallint, tinyint, varchar(n), nvarchar(n), char(n), nchar(n), datetime, datetime2, date, time, decimal(p,s), numeric(p,s), float, real, bit, uniqueidentifier, xml, text, ntext, etc.

## Important Constraints

### Functional Constraints
- **Single Model Limitation:** Can only work with one data model at a time (no multi-model comparison)
- **Read-Only:** No data model creation or editing - models must be created elsewhere
- **Cross-Subject Area Relationships:** Relationships between entities in different subject areas are not rendered
- **File Format:** Only accepts `.erdv` files (JSON format)

### Technical Constraints
- Must validate all input files against [erdv_file_spec.json](../erdv_file_spec.json)
- Schema validation is mandatory before rendering
- Database-agnostic design (though optimized for SQL Server initially)

### Performance Considerations
- Must handle large data models efficiently
- Zoom and pan operations should be smooth
- Auto-layout algorithms should complete in reasonable time
- Image export should work for large diagrams

## External Dependencies

### Input Files
- **Primary Dependency:** `.erdv` files (JSON format)
- **Schema Definition:** [erdv_file_spec.json](../erdv_file_spec.json)
- **Example:** [data_model_example.yaml](../data_model_example.yaml)

### Expected Libraries (TBD)
- JSON Schema validation library
- Canvas/SVG rendering library
- Graph layout algorithm library (for auto-layout)
- Zoom/pan interaction library
- Image export library (PNG, JPG, SVG)
- File upload handling library

### Data Sources
- Data models are created and maintained in external tools
- ERDV consumes exported `.erdv` files
- No direct database connections (works with file-based models only)
