# Implementation Tasks

## 1. Relationship Infrastructure
- [x] 1.1 Create src/relationships.ts module
- [x] 1.2 Define LineStyle type (straight, rounded, orthogonal)
- [x] 1.3 Define connection point calculation interfaces
- [x] 1.4 Add relationship rendering state to state.ts
- [x] 1.5 Export entity position data from layout.ts

## 2. Connection Point Calculation
- [x] 2.1 Implement getEntityEdgePoint() for edge-based connections
- [x] 2.2 Calculate optimal connection side (top, right, bottom, left)
- [x] 2.3 Handle connection point collision detection (optional)
- [x] 2.4 Implement column-specific connection points (optional)

## 3. Line Drawing - Straight Style
- [x] 3.1 Implement drawStraightLine() function
- [x] 3.2 Calculate start and end points
- [x] 3.3 Draw line using canvas path
- [x] 3.4 Add line styling (color, width)

## 4. Line Drawing - Rounded Style
- [x] 4.1 Implement drawRoundedLine() function
- [x] 4.2 Calculate control points for bezier curves
- [x] 4.3 Draw curved line using quadraticCurveTo or bezierCurveTo
- [x] 4.4 Ensure smooth curves

## 5. Line Drawing - Orthogonal Style
- [x] 5.1 Implement drawOrthogonalLine() function
- [x] 5.2 Calculate intermediate points for right-angle turns
- [x] 5.3 Handle horizontal and vertical segments
- [x] 5.4 Avoid entity box overlaps with routing

## 6. Crow's Foot Notation
- [x] 6.1 Implement drawCrowsFoot() for many cardinality
- [x] 6.2 Implement drawCircle() for optional cardinality
- [x] 6.3 Implement drawLine() for one cardinality
- [x] 6.4 Position symbols correctly at line endpoints
- [x] 6.5 Handle rotation based on line angle
- [x] 6.6 Support all cardinality combinations (0..1, 1..1, 0..N, 1..N)

## 7. Relationship Type Visualization
- [x] 7.1 Use solid lines for Identifying relationships
- [x] 7.2 Use dashed lines for Non-Identifying relationships
- [x] 7.3 Add line style constants

## 8. Integration
- [x] 8.1 Modify renderer.ts to call renderRelationships()
- [x] 8.2 Render relationships before entities (z-order)
- [x] 8.3 Pass entity positions to relationship renderer
- [x] 8.4 Handle models with no relationships gracefully

## 9. Line Style Selector UI
- [x] 9.1 Add line style selector to index.html
- [x] 9.2 Style selector control in styles.css
- [x] 9.3 Add event listener for style changes
- [x] 9.4 Store line style preference in state
- [x] 9.5 Re-render diagram when style changes

## 10. Testing & Documentation
- [x] 10.1 Test with models containing various cardinalities
- [x] 10.2 Test with different line styles
- [x] 10.3 Test with Identifying vs Non-Identifying relationships
- [x] 10.4 Test with complex relationship patterns (self-referencing, multiple FKs)
- [x] 10.5 Test with entities at various positions
- [x] 10.6 Update README.md with Phase 3 completion
- [x] 10.7 Update ROADMAP.md with implementation notes
- [x] 10.8 Add code comments and JSDoc
