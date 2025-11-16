# Design: Subject Area Filtering

## Architecture Overview

Subject area filtering introduces a new layer of data filtering between the loaded ERD model and the rendering engine. The architecture follows this flow:

```
ERDV File → Validation → Model State → Subject Area Filter → Filtered Model → Renderer → Canvas
```

## Component Design

### 1. State Management (src/state.ts)

**New State:**
```typescript
interface AppState {
  // ... existing fields
  selectedSubjectArea: string | null;  // null = "All", string = specific area name
}
```

**New Functions:**
```typescript
getSelectedSubjectArea(): string | null
setSelectedSubjectArea(name: string | null): void
getAvailableSubjectAreas(): SubjectAreaInfo[]  // Returns all areas including synthetic "All"
```

**Subject Area Info Interface:**
```typescript
interface SubjectAreaInfo {
  name: string;
  entityCount: number;
  entityNames: string[];
  isSynthetic: boolean;  // true for "All", false for actual subject areas
}
```

### 2. Subject Area Detection (src/subjectAreas.ts - NEW)

**Purpose:** Parse and validate subject areas from ERDV model

**Key Functions:**
```typescript
/**
 * Detect subject areas from model and create synthetic "All" area
 */
function detectSubjectAreas(model: ERDVModel): SubjectAreaInfo[]

/**
 * Get entities for a specific subject area
 */
function getEntitiesForSubjectArea(
  model: ERDVModel,
  subjectAreaName: string | null
): Entity[]

/**
 * Get relationships for a specific subject area (both ends must be in area)
 */
function getRelationshipsForSubjectArea(
  model: ERDVModel,
  subjectAreaName: string | null,
  filteredEntities: Entity[]
): Relationship[]
```

**Synthetic "All" Subject Area:**
- Name: "All"
- Entity names: All entity names from `model.entities`
- Entity count: `model.entities.length`
- Always present, even if `subject_areas` array is empty

**Validation:**
- Warn if subject area references non-existent entity
- Handle entities not in any subject area (only appear in "All")

### 3. UI Component (src/subjectAreaSelector.ts - NEW)

**Purpose:** Dropdown UI for selecting subject areas

**HTML Structure:**
```html
<div class="subject-area-selector">
  <label for="subject-area-dropdown">Subject Area:</label>
  <select id="subject-area-dropdown">
    <option value="">All (80 entities)</option>
    <option value="Sales">Sales (25 entities)</option>
    <option value="Inventory">Inventory (20 entities)</option>
  </select>
</div>
```

**Functions:**
```typescript
/**
 * Initialize subject area selector UI
 */
function initSubjectAreaSelector(): void

/**
 * Populate dropdown with subject areas
 */
function populateSubjectAreaSelector(areas: SubjectAreaInfo[]): void

/**
 * Handle subject area selection change
 */
function handleSubjectAreaChange(subjectAreaName: string | null): void
```

**Behavior:**
- Populated after successful file load
- Hidden when no model is loaded
- Triggers view reset (zoom, pan, positions) on change
- Re-renders diagram with filtered entities/relationships

### 4. Renderer Integration (src/renderer.ts)

**Modified Rendering Flow:**
```typescript
export function renderModel(model: ERDVModel): void {
  // Get selected subject area
  const selectedArea = getSelectedSubjectArea();

  // Filter entities and relationships
  const filteredEntities = getEntitiesForSubjectArea(model, selectedArea);
  const filteredRelationships = getRelationshipsForSubjectArea(
    model,
    selectedArea,
    filteredEntities
  );

  // Create temporary filtered model for rendering
  const filteredModel: ERDVModel = {
    ...model,
    entities: filteredEntities,
    relationships: filteredRelationships
  };

  // Render filtered model (existing logic)
  // ... rest of rendering code
}
```

**No changes needed to:**
- Entity rendering logic
- Relationship rendering logic
- Layout algorithms
- Canvas interactions

### 5. View Reset Logic (src/interactions.ts)

**New Function:**
```typescript
/**
 * Reset view when switching subject areas
 * Called from subject area selector change handler
 */
export function resetViewForSubjectAreaChange(): void {
  // Reset canvas transform
  resetCanvasTransform();

  // Clear entity position overrides
  clearEntityPositionOverrides();

  // Re-render diagram
  const model = getModel();
  if (model) {
    renderModel(model);
  }
}
```

## Data Flow

### File Load Flow
```
1. User uploads file
2. Validate JSON schema
3. Store model in state
4. Detect subject areas (including synthetic "All")
5. Set selectedSubjectArea to null ("All")
6. Populate subject area selector dropdown
7. Render full model (no filtering)
```

### Subject Area Selection Flow
```
1. User selects subject area from dropdown
2. Update state: setSelectedSubjectArea(name)
3. Reset view: resetViewForSubjectAreaChange()
   - Reset zoom to 100%
   - Reset pan to (0, 0)
   - Clear custom entity positions
4. Filter entities by subject area
5. Filter relationships by subject area
6. Re-render diagram with filtered data
```

### Interaction Flow (Zoom/Pan/Drag)
```
1. User zooms/pans/drags within filtered view
2. Interactions work normally (no filtering awareness needed)
3. Custom positions stored per entity name
4. If user switches subject area → positions cleared
5. If same subject area → positions persist
```

## Edge Cases

### Empty Subject Areas
- Subject area with `entity_count = 0` or `entity_names = []`
- **Handling:** Show in dropdown with "(0 entities)", render empty canvas with message

### Entities Not in Any Subject Area
- Entities in `model.entities` but not in any `subject_areas[].entity_names`
- **Handling:** Appear only in synthetic "All" subject area

### Invalid Entity References
- Subject area references entity name not in `model.entities`
- **Handling:** Log warning, skip invalid reference, continue with valid entities

### No Subject Areas in File
- `subject_areas` array is empty `[]`
- **Handling:** Only show "All" option in dropdown (no filtering available)

### Cross-Subject-Area Relationships
- Relationship where parent is in "Sales" and child is in "Inventory"
- **Handling:** Hidden when viewing either "Sales" or "Inventory", shown when viewing "All"

## Performance Considerations

### Filtering Performance
- Subject area filtering is O(n) where n = number of entities
- For 100 entities, filtering is negligible (<1ms)
- No optimization needed for Phase 5

### Re-rendering on Switch
- Full diagram re-render when switching subject areas
- Acceptable for Phase 5 (tested with 50+ entities in Phase 4)
- Potential future optimization: cache layout per subject area

### Memory Usage
- No duplication of model data (filtering creates views, not copies)
- Filtered arrays are temporary (created during render)
- Minimal memory overhead

## UI/UX Decisions

### Dropdown Placement
- Located in metadata section, below entity/relationship counts
- Rationale: Grouped with other model information, visible but not intrusive

### View Reset on Switch
- Always reset zoom/pan/positions when changing subject areas
- Rationale: Prevents disorientation from previous area's custom layout
- User can still drag/zoom after switch for current area

### "All" Label
- Use "All" instead of "All Subject Areas" or "Entire Model"
- Rationale: Concise, clear, matches dropdown conventions

### Entity Count Display
- Show entity count next to each subject area name
- Format: "Sales (25 entities)"
- Rationale: Helps users understand scope before selection

## Testing Strategy

### Unit Tests (src/subjectAreas.test.ts - NEW)
- `detectSubjectAreas()` creates synthetic "All" area
- `getEntitiesForSubjectArea()` filters correctly
- `getRelationshipsForSubjectArea()` excludes cross-area relationships
- Edge cases: empty areas, invalid references, no subject areas

### Integration Tests
- Load file with subject areas → verify dropdown populated
- Select subject area → verify filtered rendering
- Switch between areas → verify view reset
- Zoom/pan/drag within area → verify interactions work
- Switch area → verify custom positions cleared

### Manual Test Scenarios
1. Load file with 3 subject areas → verify all appear in dropdown with "All"
2. Select "Sales" area → verify only Sales entities rendered
3. Zoom in 200% → switch to "Inventory" → verify zoom reset to 100%
4. Drag entity in "Sales" → switch to "Inventory" → back to "Sales" → verify drag position cleared
5. Load file with no subject areas → verify only "All" in dropdown

## Backward Compatibility

### Existing Features
- All Phase 4 features (zoom, pan, drag) continue to work within filtered view
- File upload, validation, rendering unchanged
- No breaking changes to existing functionality

### State Management
- New state fields have sensible defaults (selectedSubjectArea: null = "All")
- Existing state management code unaffected
- Additive change only

### File Format
- No changes to .erdv file specification
- Subject areas are already defined in schema
- Works with existing test files

## Future Enhancements (Out of Scope for Phase 5)

### Cross-Subject-Area Relationship Visualization
- Show ghost entities or dashed connections for cross-area relationships
- Requires: new rendering mode, UI toggle, visual design

### Multiple Subject Area Selection
- Allow viewing multiple areas simultaneously (e.g., "Sales + Inventory")
- Requires: multi-select UI, union filtering logic, area boundary visualization

### Subject Area Creation/Editing
- Allow users to create custom subject areas
- Requires: edit mode, entity multi-select, persistence mechanism
- Conflicts with read-only constraint - would need project context change

### Subject Area Metadata
- Show description, owner, last modified for subject areas
- Requires: .erdv schema extension, UI design for metadata display

### Persistent Subject Area Selection
- Remember last selected subject area across sessions
- Requires: localStorage or URL state management

## Migration Path

This is a new feature, not a migration. No existing data or code needs to be migrated.

### Implementation Order
1. Add state management for selected subject area
2. Implement subject area detection and filtering logic
3. Create UI selector component
4. Integrate filtering into renderer
5. Add view reset on subject area change
6. Test with existing .erdv files
7. Update documentation

### Rollout Strategy
- Ship as single feature (not incremental)
- All capabilities delivered together for Phase 5
- Feature is additive - no risk to existing functionality
