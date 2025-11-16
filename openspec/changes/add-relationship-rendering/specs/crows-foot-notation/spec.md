# crows-foot-notation Specification

## Purpose
Implement crow's foot notation to visually represent relationship cardinality at line endpoints.

## ADDED Requirements

### Requirement: Cardinality Symbol Rendering
The application SHALL render cardinality symbols at both endpoints of relationship lines using crow's foot notation.

#### Scenario: Cardinality symbols are rendered at line endpoints
- **WHEN** a relationship line is drawn
- **THEN** a cardinality symbol is rendered at the parent end
- **AND** a cardinality symbol is rendered at the child end
- **AND** symbols match the relationship's cardinality specification

#### Scenario: Symbols are oriented correctly
- **WHEN** cardinality symbols are rendered
- **THEN** symbols are rotated to match the line angle
- **AND** symbols point in the correct direction
- **AND** symbols are positioned at the exact endpoint

#### Scenario: Symbols are visually distinct from lines
- **WHEN** cardinality symbols are rendered
- **THEN** symbols are clearly visible
- **AND** symbols do not overlap with entity boxes
- **AND** symbols maintain consistent size regardless of line length

### Requirement: Optional Cardinality Indicator (Circle)
The application SHALL render a circle symbol to indicate optional cardinality (minimum 0).

#### Scenario: Circle is rendered for 0..1 cardinality
- **WHEN** cardinality is "0..1" (optional one)
- **THEN** a circle is drawn near the endpoint
- **AND** the circle has a radius of 5px
- **AND** the circle is positioned 8px from the endpoint
- **AND** a vertical line is drawn at the endpoint (for "one")

#### Scenario: Circle is rendered for 0..N cardinality
- **WHEN** cardinality is "0..N" (optional many)
- **THEN** a circle is drawn near the endpoint
- **AND** the circle has a radius of 5px
- **AND** the circle is positioned 8px from the endpoint
- **AND** a crow's foot is drawn at the endpoint (for "many")

#### Scenario: Circle is not rendered for required cardinality
- **WHEN** cardinality is "1..1" or "1..N"
- **THEN** no circle is rendered
- **AND** only the cardinality indicator (line or crow's foot) is shown

### Requirement: Single Cardinality Indicator (Line)
The application SHALL render a vertical line to indicate single cardinality (maximum 1).

#### Scenario: Single line is rendered for 0..1 cardinality
- **WHEN** cardinality is "0..1"
- **THEN** a vertical line is drawn at the endpoint
- **AND** the line extends 6px above and below the center
- **AND** the line is positioned at the endpoint (0px offset)

#### Scenario: Single line is rendered for 1..1 cardinality
- **WHEN** cardinality is "1..1" (required one)
- **THEN** a vertical line is drawn at the endpoint
- **AND** the line extends 6px above and below the center
- **AND** no circle is drawn (required, not optional)

#### Scenario: Single line orientation matches relationship line
- **WHEN** a single cardinality line is rendered
- **THEN** the line is perpendicular to the relationship line
- **AND** the line rotates with the relationship line angle
- **AND** the line remains visually distinct

### Requirement: Many Cardinality Indicator (Crow's Foot)
The application SHALL render a crow's foot symbol to indicate many cardinality (maximum N).

#### Scenario: Crow's foot is rendered for 0..N cardinality
- **WHEN** cardinality is "0..N"
- **THEN** a crow's foot (three-line fork) is drawn at the endpoint
- **AND** the fork extends 8px back from the endpoint
- **AND** the fork spans 12px vertically (6px above and below center)

#### Scenario: Crow's foot is rendered for 1..N cardinality
- **WHEN** cardinality is "1..N" (required many)
- **THEN** a crow's foot is drawn at the endpoint
- **AND** the fork extends 8px back from the endpoint
- **AND** no circle is drawn (required, not optional)

#### Scenario: Crow's foot consists of three lines
- **WHEN** a crow's foot is rendered
- **THEN** three lines fan out from the endpoint
- **AND** one line extends straight back (0° offset)
- **AND** one line extends at +30° angle
- **AND** one line extends at -30° angle
- **AND** all three lines meet at the endpoint

#### Scenario: Crow's foot orientation matches relationship line
- **WHEN** a crow's foot is rendered
- **THEN** the fork opens toward the entity
- **AND** the symbol rotates with the relationship line angle
- **AND** the three lines remain evenly spaced

### Requirement: Cardinality Notation Mapping
The application SHALL correctly map cardinality notation strings to visual symbols.

#### Scenario: 0..1 notation renders correctly
- **WHEN** cardinality notation is "0..1"
- **THEN** a circle is rendered (optional)
- **AND** a single line is rendered (one)
- **AND** the visual is: O—|

#### Scenario: 1..1 notation renders correctly
- **WHEN** cardinality notation is "1..1"
- **THEN** no circle is rendered (required)
- **AND** a single line is rendered (one)
- **AND** the visual is: —|

#### Scenario: 0..N notation renders correctly
- **WHEN** cardinality notation is "0..N"
- **THEN** a circle is rendered (optional)
- **AND** a crow's foot is rendered (many)
- **AND** the visual is: O—<

#### Scenario: 1..N notation renders correctly
- **WHEN** cardinality notation is "1..N"
- **THEN** no circle is rendered (required)
- **AND** a crow's foot is rendered (many)
- **AND** the visual is: —<

### Requirement: Parent and Child Cardinality
The application SHALL render appropriate cardinality symbols at both ends of the relationship line.

#### Scenario: Parent cardinality is based on relationship definition
- **WHEN** a relationship is rendered
- **THEN** the parent end shows cardinality based on parent entity columns
- **AND** typically parent cardinality is "1..1" (one parent per child)
- **AND** the parent symbol is rendered at the parent entity connection point

#### Scenario: Child cardinality is from relationship cardinality field
- **WHEN** a relationship is rendered
- **THEN** the child end shows cardinality from relationship.cardinality.notation
- **AND** the child symbol is rendered at the child entity connection point
- **AND** the symbol accurately represents min_cardinality and max_cardinality

#### Scenario: Typical one-to-many relationship renders correctly
- **WHEN** a relationship is one-to-many (parent 1..1, child 0..N)
- **THEN** parent end shows —| (required one)
- **AND** child end shows O—< (optional many)
- **AND** the visual clearly indicates parent has many children

### Requirement: Symbol Sizing and Spacing
The application SHALL use consistent dimensions for all cardinality symbols.

#### Scenario: Circle dimensions are consistent
- **WHEN** optional circles are rendered
- **THEN** all circles have radius = 5px
- **AND** circles are positioned 8px from the endpoint
- **AND** circles are drawn with 1px stroke width

#### Scenario: Single line dimensions are consistent
- **WHEN** single cardinality lines are rendered
- **THEN** all lines extend 6px above center
- **AND** all lines extend 6px below center
- **AND** lines are drawn with 2px stroke width
- **AND** lines are positioned exactly at the endpoint

#### Scenario: Crow's foot dimensions are consistent
- **WHEN** crow's foot symbols are rendered
- **THEN** all forks extend 8px back from endpoint
- **AND** fork span is 12px total (6px above, 6px below)
- **AND** fork lines are drawn with 2px stroke width
- **AND** angles are consistent (+30°, 0°, -30°)

### Requirement: Symbol Color and Styling
The application SHALL use consistent styling for cardinality symbols.

#### Scenario: Symbols use same color as relationship lines
- **WHEN** cardinality symbols are rendered
- **THEN** symbols use the same color as the relationship line (#64748b)
- **AND** symbols use the same stroke width as the relationship line (2px)
- **AND** symbols match the line dash pattern (solid or dashed)

#### Scenario: Symbols are drawn with stroke (not fill)
- **WHEN** cardinality symbols are rendered
- **THEN** circles are stroked, not filled
- **AND** lines and crow's feet are stroked paths
- **AND** symbols remain hollow/outlined
- **AND** symbols do not obscure underlying elements
