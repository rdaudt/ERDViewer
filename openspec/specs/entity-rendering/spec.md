# entity-rendering Specification

## Purpose
TBD - created by archiving change add-basic-erd-rendering. Update Purpose after archive.
## Requirements
### Requirement: Entity Box Rendering
The application SHALL render each entity from a loaded data model as a visually distinct box on the canvas.

#### Scenario: Entity box has three sections
- **WHEN** an entity is rendered
- **THEN** the entity box displays three distinct sections:
  - Header section with table name and schema name
  - Primary key section with columns marked (PK)
  - Regular columns section with remaining columns

#### Scenario: Entity header displays table name and schema
- **WHEN** an entity is rendered
- **THEN** the header section displays the table name and schema name in format "TableName (schema)"
- **AND** the header has a distinct background color (#3b82f6 blue)
- **AND** the header text is bold and white

#### Scenario: Primary key columns are visually distinct
- **WHEN** an entity has primary key columns
- **THEN** primary key columns are rendered in a separate section below the header
- **AND** each primary key column displays (PK) notation
- **AND** the primary key section has a light blue background (#e0f2fe)

#### Scenario: Regular columns are rendered below primary keys
- **WHEN** an entity has non-primary-key columns
- **THEN** regular columns are rendered in a section below the primary key section
- **AND** the regular columns section has a white background (#ffffff)
- **AND** each column displays name and data type

#### Scenario: Foreign key columns show (FK) notation
- **WHEN** a column is a foreign key (referenced in relationships array)
- **THEN** the column displays (FK) notation after the column name
- **AND** if the column is both primary key and foreign key, it displays (PK, FK) notation

#### Scenario: Entity boxes have consistent styling
- **WHEN** entities are rendered
- **THEN** all entity boxes have:
  - Fixed width of 250px
  - 1px solid border (#cbd5e1)
  - 8px horizontal padding
  - 4px vertical padding
  - 24px row height for columns
  - 32px header height

#### Scenario: Long column names are truncated
- **WHEN** a column name exceeds the available width (230px after padding)
- **THEN** the column name is truncated with ellipsis (...)
- **AND** the column name remains readable within the entity box bounds

### Requirement: Entity Dimension Calculation
The application SHALL calculate entity dimensions dynamically based on content.

#### Scenario: Entity height adapts to column count
- **WHEN** an entity has N columns
- **THEN** the entity height is calculated as:
  - Header height (32px) + PK section height + regular columns section height
  - Where PK section height = (number of PK columns × 24px)
  - Where regular columns height = (number of non-PK columns × 24px)

#### Scenario: Minimum entity height is enforced
- **WHEN** an entity has very few columns
- **THEN** the entity height is at least 80px (header + one column)

#### Scenario: Entity width is fixed
- **WHEN** any entity is rendered
- **THEN** the entity width is always 250px regardless of content

### Requirement: All Entities Rendered
The application SHALL render all entities from the loaded data model.

#### Scenario: All entities from model are rendered
- **WHEN** a valid data model is loaded
- **THEN** every entity in the entities array is rendered on the canvas
- **AND** the entity count in the success message matches the rendered entity count

#### Scenario: Entities without columns are skipped
- **WHEN** an entity has zero columns (malformed data)
- **THEN** the entity is not rendered
- **AND** a warning is logged to the console
- **AND** the entity count excludes skipped entities

#### Scenario: Rendering order matches entity array order
- **WHEN** entities are rendered
- **THEN** entities appear in the same order as defined in the entities array
- **AND** the layout algorithm processes entities sequentially

### Requirement: Rendering Clarity
The application SHALL ensure entity boxes are readable and visually clear.

#### Scenario: Entity boxes have clear visual hierarchy
- **WHEN** entities are rendered
- **THEN** the header section is visually distinct (dark blue background)
- **AND** the primary key section is visually distinct (light blue background)
- **AND** the regular columns section is visually distinct (white background)
- **AND** section separators (borders) are clearly visible

#### Scenario: Text is readable
- **WHEN** entity boxes are rendered
- **THEN** all text uses a readable font size (14px minimum)
- **AND** text color provides sufficient contrast against backgrounds
- **AND** column names and data types are clearly legible

#### Scenario: Entity boxes do not overlap
- **WHEN** multiple entities are rendered
- **THEN** entity boxes do not overlap each other
- **AND** there is at least 20px horizontal spacing between adjacent entities
- **AND** there is at least 20px vertical spacing between rows

### Requirement: Column Information Display
The application SHALL display complete column information for each entity.

#### Scenario: Column name is displayed
- **WHEN** a column is rendered
- **THEN** the column name is visible in the entity box

#### Scenario: Column data type is displayed
- **WHEN** a column is rendered
- **THEN** the column data type is visible after the column name
- **AND** the data type format matches the .erdv specification

#### Scenario: Primary key notation is displayed
- **WHEN** a column is a primary key
- **THEN** (PK) notation is displayed after the column name

#### Scenario: Foreign key notation is displayed
- **WHEN** a column is a foreign key
- **THEN** (FK) notation is displayed after the column name
- **AND** the FK detection is based on the relationships array in the model

#### Scenario: Composite notations are supported
- **WHEN** a column is both a primary key and a foreign key
- **THEN** (PK, FK) notation is displayed after the column name

