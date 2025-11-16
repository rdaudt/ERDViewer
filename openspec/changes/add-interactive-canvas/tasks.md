# Implementation Tasks

## 1. Transform State Infrastructure
- [x] 1.1 Add CanvasTransform interface to state.ts (zoom, panX, panY)
- [x] 1.2 Add entity position overrides map to state.ts (Map<entityName, {x, y}>)
- [x] 1.3 Add getTransform() and setTransform() functions
- [x] 1.4 Add getEntityPositionOverride() and setEntityPositionOverride() functions
- [x] 1.5 Add clearEntityPositionOverrides() function
- [x] 1.6 Initialize transform state with default values (zoom: 1.0, pan: 0, 0)

## 2. Coordinate Transformation Functions
- [x] 2.1 Create src/interactions.ts module
- [x] 2.2 Implement screenToCanvas() coordinate transformation
- [x] 2.3 Implement canvasToScreen() coordinate transformation
- [x] 2.4 Add unit tests for coordinate transformations
- [x] 2.5 Implement applyCanvasTransform() to set ctx.setTransform()

## 3. Entity Hit Testing
- [x] 3.1 Implement findEntityAtPoint() for hit testing
- [x] 3.2 Use AABB (axis-aligned bounding box) collision detection
- [x] 3.3 Test entities in reverse render order (topmost first)
- [x] 3.4 Account for zoom and pan in hit testing
- [x] 3.5 Add unit tests for hit testing with various entity positions

## 4. Zoom Functionality
- [x] 4.1 Implement handleWheelZoom() for mouse wheel events
- [x] 4.2 Implement zoomToPoint() algorithm (zoom toward cursor)
- [x] 4.3 Implement zoomIn() and zoomOut() for button controls
- [x] 4.4 Enforce zoom limits (10% to 500%)
- [x] 4.5 Add keyboard shortcuts (Ctrl+Plus, Ctrl+Minus, Ctrl+0)
- [x] 4.6 Re-render diagram after zoom updates

## 5. Pan Functionality
- [x] 5.1 Implement handlePanStart() for mousedown on background
- [x] 5.2 Implement handlePanMove() for mousemove during pan
- [x] 5.3 Implement handlePanEnd() for mouseup after pan
- [x] 5.4 Update pan offset in state during pan
- [x] 5.5 Re-render diagram during pan (throttled to 60fps)
- [x] 5.6 Add cursor feedback (grab/grabbing)

## 6. Entity Dragging
- [x] 6.1 Implement handleDragStart() for mousedown on entity
- [x] 6.2 Implement handleDragMove() for mousemove during drag
- [x] 6.3 Implement handleDragEnd() for mouseup after drag
- [x] 6.4 Update entity position override in state during drag
- [x] 6.5 Re-render diagram during drag (throttled to 60fps)
- [x] 6.6 Add cursor feedback (move/grabbing)

## 7. Interaction State Machine
- [x] 7.1 Define InteractionState type (idle, dragging_entity, panning_canvas)
- [x] 7.2 Implement state transitions on mousedown
- [x] 7.3 Implement state-specific mousemove handlers
- [x] 7.4 Implement state transitions on mouseup
- [x] 7.5 Prevent conflicting interactions (drag vs pan)

## 8. Renderer Integration
- [x] 8.1 Modify renderer.ts to accept transform parameter
- [x] 8.2 Apply canvas transform before rendering (ctx.setTransform)
- [x] 8.3 Modify layout.ts to accept position overrides
- [x] 8.4 Merge grid layout positions with custom overrides
- [x] 8.5 Pass merged positions to entity and relationship rendering
- [x] 8.6 Export entity bounds for hit testing

## 9. Zoom Controls UI
- [x] 9.1 Add zoom controls container to index.html
- [x] 9.2 Add Zoom In button (+)
- [x] 9.3 Add Zoom Out button (−)
- [x] 9.4 Add Reset View button (⟲)
- [x] 9.5 Add zoom level display (e.g., "100%")
- [x] 9.6 Style controls in styles.css (fixed bottom-right position)
- [x] 9.7 Show/hide controls based on diagram loaded state

## 10. Event Listeners
- [x] 10.1 Add mousedown listener to canvas
- [x] 10.2 Add mousemove listener to canvas
- [x] 10.3 Add mouseup listener to canvas
- [x] 10.4 Add wheel listener for zoom
- [x] 10.5 Add keyboard listeners for zoom shortcuts (Ctrl+Plus, etc.)
- [x] 10.6 Add click listeners for zoom control buttons
- [x] 10.7 Clean up event listeners on canvas destruction

## 11. Touch Gesture Support
- [x] 11.1 Add touchstart listener for touch initiation
- [x] 11.2 Add touchmove listener for drag and pinch
- [x] 11.3 Add touchend listener for gesture completion
- [x] 11.4 Implement pinch-to-zoom gesture detection
- [x] 11.5 Implement two-finger pan gesture
- [x] 11.6 Prevent default touch behaviors (scrolling, zooming)

## 12. Reset Functionality
- [x] 12.1 Implement resetView() to clear transform and overrides
- [x] 12.2 Connect Reset button to resetView()
- [x] 12.3 Clear overrides on new file load
- [x] 12.4 Reset zoom to 100% on new file load
- [x] 12.5 Reset pan to (0, 0) on new file load

## 13. Performance Optimization
- [x] 13.1 Throttle mousemove events to 16ms (60fps)
- [x] 13.2 Throttle touchmove events to 16ms
- [x] 13.3 Use requestAnimationFrame for rendering updates
- [x] 13.4 Profile rendering performance with 100-entity model
- [x] 13.5 Optimize if necessary (defer to Phase 9 if acceptable)

## 14. Testing & Validation
- [x] 14.1 Test zoom with mouse wheel on various browsers
- [x] 14.2 Test zoom with buttons
- [x] 14.3 Test zoom keyboard shortcuts
- [x] 14.4 Test pan by dragging background
- [x] 14.5 Test entity dragging
- [x] 14.6 Test zoom limits (10% - 500%)
- [x] 14.7 Test reset button
- [x] 14.8 Test coordinate transformations at various zoom levels
- [x] 14.9 Test relationship updates during entity drag
- [x] 14.10 Test pinch-to-zoom on touch device (if available)
- [x] 14.11 Test with large model (50+ entities)

## 15. Documentation
- [x] 15.1 Update README.md with Phase 4 completion
- [x] 15.2 Update ROADMAP.md with implementation notes
- [x] 15.3 Add JSDoc comments to interactions.ts
- [x] 15.4 Add code comments explaining coordinate transformations
- [x] 15.5 Document zoom/pan behavior in user-facing docs (if applicable)
