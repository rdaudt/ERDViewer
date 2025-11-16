# Proposal: Subject Area Filtering (Phase 5)

## Change ID
`add-subject-area-filtering`

## Summary
Enable subject area filtering to allow users to view and explore specific logical groupings of entities within large data models, making complex ERDs more manageable and focused.

## Why
After Phase 4, users can interact with complete ERD diagrams through zoom, pan, and entity dragging. However, for real-world data models with 50-100+ entities, viewing the entire diagram at once is overwhelming and impractical.

Subject areas provide logical groupings of related entities (e.g., "Sales", "Inventory", "HR"). By filtering to a single subject area, users can:
- **Focus on relevant subsystems** without visual clutter from unrelated entities
- **Understand specific business domains** within a larger data model
- **Navigate large models efficiently** by switching between subject areas
- **Reduce cognitive load** by limiting the number of entities displayed at once

Real-world example: A data warehouse with 80+ entities might have subject areas like "Core Dimensions" (15 entities), "Sales Analytics" (25 entities), "Customer Data" (20 entities), etc. Without filtering, understanding any single area requires mentally filtering out 60+ irrelevant entities.

## Scope

### In Scope
1. **subject-area-detection** - Parse subject areas from uploaded files and create implicit "All" area
2. **subject-area-selection** - UI for selecting and switching between subject areas
3. **subject-area-filtering** - Filter entities and relationships based on selected subject area

### Features
- Detect subject areas at file load time from `subject_areas` array in ERDV file
- Create implicit "All" subject area for viewing entire model
- Subject area selector dropdown in UI (positioned near file info display)
- Display entity count for each subject area in selector
- Filter entities: only render entities in selected subject area
- Filter relationships: hide relationships where either end is outside selected subject area
- Preserve canvas interactions (zoom, pan, drag) when switching subject areas
- Reset view (zoom/pan/positions) when switching subject areas
- Store selected subject area in application state

### Out of Scope
- Creating or editing subject areas (read-only, as per project constraints)
- Multi-subject-area selection (one at a time only)
- Subject area relationship visualization (showing cross-area relationships)
- Subject area metadata editing

## What Changes

See [specs/](specs/) for detailed requirements organized by capability:
- [subject-area-detection/spec.md](specs/subject-area-detection/spec.md) - Parsing and detecting subject areas from ERDV files
- [subject-area-selection/spec.md](specs/subject-area-selection/spec.md) - UI for selecting and switching subject areas
- [subject-area-filtering/spec.md](specs/subject-area-filtering/spec.md) - Filtering entities and relationships by selected area

## Dependencies
- Phase 4 (Interactive Canvas) must be complete ✅
- Requires existing type definitions for `SubjectArea` in [src/types.ts](src/types.ts#L101-L108)
- Uses existing state management in [src/state.ts](src/state.ts)
- Integrates with existing renderer in [src/renderer.ts](src/renderer.ts)

## Technical Approach

### State Management
- Add `selectedSubjectArea` to application state (string: subject area name or "All")
- Add getter/setter functions: `getSelectedSubjectArea()`, `setSelectedSubjectArea(name)`
- Default to "All" on file load

### Subject Area Detection
- Parse `subject_areas` array from ERDV model
- Create synthetic "All" subject area containing all entity names
- Validate that entity names in subject areas exist in model

### Entity Filtering
- Before rendering, filter `model.entities` based on selected subject area
- If "All": render all entities
- If specific area: render only entities in `subjectArea.entity_names`

### Relationship Filtering
- Filter `model.relationships` to include only relationships where:
  - Both `parent_entity_name` AND `child_entity_name` are in selected subject area
- This hides cross-subject-area relationships

### UI Components
- Dropdown selector in metadata display area (below entity/relationship counts)
- Format: "Subject Area: [dropdown] (X entities)"
- Dropdown options: "All (X)", "Area1 (X)", "Area2 (X)", etc.
- Update diagram immediately on selection change

### View Reset Behavior
- When switching subject areas:
  - Reset canvas transform (zoom to 100%, pan to 0,0)
  - Clear entity position overrides (return to grid layout)
  - This prevents disorientation from previous area's custom positions

## Acceptance Criteria
- Subject areas are detected from uploaded ERDV file
- "All" subject area is available for viewing entire model
- Users can select a subject area from dropdown
- Dropdown shows entity count for each area
- Only entities in selected subject area are rendered
- Cross-subject-area relationships are hidden
- Switching subject areas resets view (zoom, pan, positions)
- Canvas interactions (zoom, pan, drag) work normally within filtered view
- Selected subject area persists during zoom/pan/drag operations
- Loading new file resets to "All" subject area

## Testing Strategy
- Unit tests for subject area detection logic
- Unit tests for entity/relationship filtering
- Integration test: load file → select subject area → verify filtered rendering
- UI test: dropdown interaction and state updates
- Edge cases:
  - Files with no subject areas (only "All" should appear)
  - Entities not in any subject area (appear only in "All")
  - Subject areas with zero entities
  - Invalid entity names in subject areas

## Open Questions
None - design decisions finalized based on ROADMAP.md and Phase 5 plan.
