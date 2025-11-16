# relationship-rendering Specification

## Purpose
TBD - created by archiving change add-relationship-rendering. Update Purpose after archive.
## Requirements
### Requirement: Relationship Line Rendering
The application SHALL render lines connecting parent and child entities for each relationship in the model.

#### Scenario: All relationships are rendered
- **WHEN** a model with relationships is loaded
- **THEN** a line is drawn for each relationship in the relationships array
- **AND** lines connect from parent entity to child entity
- **AND** lines are drawn before entities (z-order: relationships behind entities)

#### Scenario: Models with no relationships render without errors
- **WHEN** a model has zero relationships
- **THEN** no relationship lines are rendered
- **AND** entities are rendered normally
- **AND** no errors are thrown

#### Scenario: Relationship lines use consistent styling
- **WHEN** relationships are rendered
- **THEN** all lines have a consistent stroke width (2px)
- **AND** all lines use the same base color (#64748b medium gray)
- **AND** line styling is applied consistently

### Requirement: Connection Point Calculation
The application SHALL calculate connection points on entity box edges for relationship lines.

#### Scenario: Connection points are at entity edge centers
- **WHEN** a relationship line is drawn
- **THEN** the start point is at the center of a parent entity edge
- **AND** the end point is at the center of a child entity edge
- **AND** the edges are chosen based on relative entity positions

#### Scenario: Connection side is determined by entity positions
- **WHEN** child entity is to the right of parent
- **THEN** parent connection is on right edge and child connection is on left edge
- **WHEN** child entity is below parent
- **THEN** parent connection is on bottom edge and child connection is on top edge
- **WHEN** child entity is to the left of parent
- **THEN** parent connection is on left edge and child connection is on right edge
- **WHEN** child entity is above parent
- **THEN** parent connection is on top edge and child connection is on bottom edge

#### Scenario: Connection points are calculated correctly
- **WHEN** connection point is on top edge
- **THEN** point is at (x + width/2, y)
- **WHEN** connection point is on right edge
- **THEN** point is at (x + width, y + height/2)
- **WHEN** connection point is on bottom edge
- **THEN** point is at (x + width/2, y + height)
- **WHEN** connection point is on left edge
- **THEN** point is at (x, y + height/2)

### Requirement: Line Style Support
The application SHALL support multiple line routing styles for relationship rendering.

#### Scenario: Straight line style is supported
- **WHEN** straight line style is selected
- **THEN** relationships are rendered as direct lines from start to end point
- **AND** lines use a single path segment

#### Scenario: Rounded line style is supported
- **WHEN** rounded line style is selected
- **THEN** relationships are rendered as curved lines
- **AND** curves use quadratic bezier paths
- **AND** control points create smooth curves

#### Scenario: Orthogonal line style is supported
- **WHEN** orthogonal line style is selected
- **THEN** relationships are rendered with right-angle segments
- **AND** lines consist of horizontal and vertical segments only
- **AND** intermediate points create 90-degree turns

#### Scenario: Line style can be changed
- **WHEN** user selects a different line style
- **THEN** all relationship lines are re-rendered with the new style
- **AND** the diagram updates immediately
- **AND** the new style is applied to all relationships

### Requirement: Identifying vs Non-Identifying Relationships
The application SHALL visually distinguish between Identifying and Non-Identifying relationships.

#### Scenario: Identifying relationships use solid lines
- **WHEN** a relationship has type "Identifying"
- **THEN** the line is rendered as solid (no dash pattern)
- **AND** the line is clearly continuous

#### Scenario: Non-Identifying relationships use dashed lines
- **WHEN** a relationship has type "Non-Identifying"
- **THEN** the line is rendered as dashed
- **AND** the dash pattern is [5, 5] (5px dash, 5px gap)
- **AND** the dashed pattern is clearly visible

#### Scenario: Relationship type is visually distinct
- **WHEN** a model contains both Identifying and Non-Identifying relationships
- **THEN** users can easily distinguish between the two types
- **AND** the visual difference is consistent across all line styles

### Requirement: Self-Referencing Relationships
The application SHALL handle relationships where parent and child entities are the same.

#### Scenario: Self-referencing relationships are detected
- **WHEN** a relationship has parent_entity_name === child_entity_name
- **THEN** the relationship is identified as self-referencing
- **AND** special rendering logic is applied

#### Scenario: Self-referencing relationships render as loops
- **WHEN** a self-referencing relationship is rendered
- **THEN** a curved line loops from the entity back to itself
- **AND** the loop extends outward from the entity
- **AND** both endpoints connect to the same entity
- **AND** cardinality symbols are rendered at both endpoints

### Requirement: Multiple Relationships Between Entities
The application SHALL handle multiple relationships between the same pair of entities.

#### Scenario: Multiple relationships are detected
- **WHEN** multiple relationships exist between the same parent and child
- **THEN** each relationship is rendered as a separate line
- **AND** connection points are offset to avoid complete overlap

#### Scenario: Multiple relationships remain distinguishable
- **WHEN** multiple relationships connect the same entities
- **THEN** lines are visually distinct (offset connection points)
- **AND** all relationships are visible
- **AND** cardinality symbols for each relationship are visible

### Requirement: Relationship Rendering Performance
The application SHALL render relationships efficiently.

#### Scenario: Small diagrams with relationships render quickly
- **WHEN** a model with 1-10 relationships is rendered
- **THEN** relationship rendering completes in less than 50ms
- **AND** total diagram rendering completes in less than 150ms

#### Scenario: Medium diagrams with relationships render acceptably
- **WHEN** a model with 10-50 relationships is rendered
- **THEN** relationship rendering completes in less than 200ms
- **AND** total diagram rendering completes in less than 700ms

#### Scenario: Large diagrams with relationships render within acceptable time
- **WHEN** a model with 50-100 relationships is rendered
- **THEN** relationship rendering completes in less than 500ms
- **AND** total diagram rendering completes in less than 2500ms
- **AND** the browser remains responsive

