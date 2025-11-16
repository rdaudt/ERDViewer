# Implementation Tasks

## 1. State Management Infrastructure
- [x] 1.1 Add `selectedSubjectArea: string | null` to AppState in src/state.ts
- [x] 1.2 Add `getSelectedSubjectArea()` function to src/state.ts
- [x] 1.3 Add `setSelectedSubjectArea(name: string | null)` function to src/state.ts
- [x] 1.4 Initialize selectedSubjectArea to null on app start
- [x] 1.5 Reset selectedSubjectArea to null when new model loads (in setModel)
- [x] 1.6 Add SubjectAreaInfo interface to src/types.ts

## 2. Subject Area Detection Module
- [x] 2.1 Create src/subjectAreas.ts module
- [x] 2.2 Implement `detectSubjectAreas(model: ERDVModel): SubjectAreaInfo[]`
  - Parse model.subject_areas array
  - Create synthetic "All" area with all entity names
  - Validate entity references
  - Return array with "All" first
- [x] 2.3 Implement `getAvailableSubjectAreas(): SubjectAreaInfo[]`
  - Retrieve from state/model
  - Return cached result for performance
- [x] 2.4 Implement `getEntitiesForSubjectArea(model, areaName): Entity[]`
  - Return all entities if areaName is null ("All")
  - Filter entities by subject area entity_names
  - Handle invalid entity references
- [x] 2.5 Implement `getRelationshipsForSubjectArea(model, areaName, entities): Relationship[]`
  - Return all relationships if areaName is null ("All")
  - Filter relationships where both parent AND child are in entities array
  - Use entity name lookup for performance (Set or Map)
- [x] 2.6 Add validation warnings for invalid entity references
- [x] 2.7 Export all functions from src/subjectAreas.ts

## 3. Subject Area Selector UI
- [x] 3.1 Add HTML structure to index.html:
  - Subject area selector container
  - Label: "Subject Area:"
  - Select dropdown element with id="subject-area-dropdown"
  - Place below entity/relationship counts in metadata section
- [x] 3.2 Add CSS styling to src/styles.css:
  - Style .subject-area-selector container
  - Style select dropdown (consistent with line-style selector)
  - Add hover/focus states
  - Ensure visibility toggle works
- [x] 3.3 Create src/subjectAreaSelector.ts module (optional, or add to main.ts)
- [x] 3.4 Implement `initSubjectAreaSelector()` function
  - Get references to HTML elements
  - Attach change event listener
  - Hide by default (shown after model load)
- [x] 3.5 Implement `populateSubjectAreaSelector(areas: SubjectAreaInfo[])` function
  - Clear existing options
  - Add options for each subject area
  - Format: "name (count entities)"
  - Set "All" as default selected
- [x] 3.6 Implement `handleSubjectAreaChange()` event handler
  - Get selected value from dropdown
  - Parse value (null/"" for All, string for specific area)
  - Call setSelectedSubjectArea(value)
  - Call resetViewForSubjectAreaChange()
  - Trigger re-render

## 4. Renderer Integration
- [x] 4.1 Modify renderModel() in src/renderer.ts:
  - Get selected subject area from state
  - Filter entities using getEntitiesForSubjectArea()
  - Filter relationships using getRelationshipsForSubjectArea()
  - Create filtered model object for rendering
- [x] 4.2 Pass filtered entities/relationships to layout calculation
- [x] 4.3 Ensure grid layout works with filtered entity list
- [x] 4.4 Add empty state message rendering:
  - Check if filteredEntities.length === 0
  - Render centered message: "No entities in this subject area"
- [x] 4.5 Test rendering with various filtered views

## 5. View Reset on Subject Area Change
- [x] 5.1 Create `resetViewForSubjectAreaChange()` function in src/interactions.ts (or new file)
- [x] 5.2 Call resetCanvasTransform() to reset zoom/pan
- [x] 5.3 Call clearEntityPositionOverrides() to clear custom positions
- [x] 5.4 Get current model and call renderModel() to re-render
- [x] 5.5 Add guard to prevent reset if same subject area re-selected
- [x] 5.6 Export resetViewForSubjectAreaChange() function

## 6. File Load Integration
- [x] 6.1 Modify handleFileLoad() in src/fileUpload.ts (or relevant module):
  - After model validation succeeds
  - Call detectSubjectAreas(model)
  - Store available subject areas (if needed)
  - Call populateSubjectAreaSelector() with areas
  - Show subject area selector UI
- [x] 6.2 Reset selected subject area to null when new file loads
- [x] 6.3 Hide subject area selector when model is cleared

## 7. Interaction Preservation
- [x] 7.1 Verify zoom works correctly with filtered entities
- [x] 7.2 Verify pan works correctly with filtered entities
- [x] 7.3 Verify entity dragging works correctly with filtered entities
- [x] 7.4 Verify relationship updates work with filtered entities
- [x] 7.5 Verify custom entity positions are stored correctly (by entity name, not index)

## 8. Edge Case Handling
- [x] 8.1 Handle empty subject areas (entity_names = [])
- [x] 8.2 Handle subject areas with invalid entity references
- [x] 8.3 Handle models with no subject areas (subject_areas = [])
- [x] 8.4 Handle orphan entities (not in any subject area)
- [x] 8.5 Handle cross-subject-area relationships correctly (filter them out)
- [x] 8.6 Handle subject area switch during active drag/pan (cancel interaction)

## 9. Testing & Validation
- [x] 9.1 Unit test: detectSubjectAreas() creates synthetic "All"
- [x] 9.2 Unit test: getEntitiesForSubjectArea() filters correctly
- [x] 9.3 Unit test: getRelationshipsForSubjectArea() filters both ends
- [x] 9.4 Unit test: Invalid entity references are handled gracefully
- [x] 9.5 Integration test: Load file → populate dropdown → select area → verify rendering
- [x] 9.6 Integration test: Switch subject areas → verify view reset
- [x] 9.7 Integration test: Zoom/pan/drag within filtered view
- [x] 9.8 Manual test: Dropdown interaction and keyboard accessibility
- [x] 9.9 Manual test: Empty subject area shows message
- [x] 9.10 Manual test: Load multiple files and verify subject area reset

## 10. Documentation
- [x] 10.1 Update README.md with subject area filtering feature
- [x] 10.2 Add "Filtering by Subject Area" section to user docs
- [x] 10.3 Update ROADMAP.md to mark Phase 5 as complete
- [x] 10.4 Add JSDoc comments to src/subjectAreas.ts
- [x] 10.5 Document subject area filtering behavior in code comments
- [x] 10.6 Create PHASE5_COMPLETION.md summary document

## Task Dependencies

**Parallelizable:**
- Tasks 1, 2, 3 can be done in parallel (independent modules)
- Tasks 9.1-9.4 (unit tests) can be done in parallel

**Sequential:**
- Task 1 must complete before tasks 2, 4, 5, 6
- Task 2 must complete before task 4
- Task 3 must complete before task 6
- Tasks 4, 5 must complete before task 7
- Tasks 1-8 must complete before task 9 (integration tests)
- All tasks must complete before task 10

**Critical Path:**
1. State Management (Task 1)
2. Subject Area Detection (Task 2)
3. Renderer Integration (Task 4)
4. View Reset (Task 5)
5. File Load Integration (Task 6)
6. Testing (Task 9)
7. Documentation (Task 10)

## Estimated Effort

- State Management: 2 hours
- Subject Area Detection: 4 hours
- Subject Area Selector UI: 3 hours
- Renderer Integration: 3 hours
- View Reset: 2 hours
- File Load Integration: 2 hours
- Interaction Preservation: 2 hours
- Edge Case Handling: 3 hours
- Testing & Validation: 5 hours
- Documentation: 2 hours

**Total: 28 hours (3-4 days)**
