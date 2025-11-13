/**
 * TypeScript type definitions for ERDV (Entity-Relationship Diagram Viewer) file format.
 * These types are based on erdv_file_spec.json (JSON Schema Draft 2020-12).
 */

/**
 * Metadata about the data model.
 */
export interface Metadata {
  /** Name of the data model */
  model_name: string;
}

/**
 * Information about the target database server.
 */
export interface ServerInfo {
  /** Name of the target database server */
  target_server_name: string;
  /** Version of the database server */
  version: string;
}

/**
 * A column within an entity (table).
 */
export interface Column {
  /** Column name (identifier: starts with letter/underscore, followed by letters, digits, underscores) */
  name: string;
  /** SQL Server data type (e.g., 'int', 'varchar(50)', 'datetime2(7)') */
  data_type: string;
  /** Whether the column allows NULL values */
  nullable: boolean;
  /** Column order/position (1-based) */
  order: number;
}

/**
 * An entity (table) in the data model.
 */
export interface Entity {
  /** Entity/table name (identifier) */
  name: string;
  /** Schema name the entity belongs to */
  schema_name: string;
  /** Array of columns in the entity */
  columns: Column[];
  /** Array of column names that make up the primary key */
  primary_key_columns: string[];
}

/**
 * Cardinality notation for relationships.
 * Examples: "0..1", "1..1", "0..N", "1..N"
 */
export interface Cardinality {
  /** Cardinality notation (e.g., "0..1", "1..N") */
  notation: '0..1' | '1..1' | '0..N' | '1..N';
  /** Human-readable description of the cardinality */
  description: string;
  /** Minimum cardinality (0 or 1) */
  min_cardinality: number;
  /** Maximum cardinality (integer or "N" for unbounded) */
  max_cardinality: number | 'N';
}

/**
 * Relationship type: Identifying or Non-Identifying.
 */
export type RelationshipType = 'Identifying' | 'Non-Identifying';

/**
 * A relationship (foreign key) between two entities.
 */
export interface Relationship {
  /** Relationship name (identifier) */
  name: string;
  /** Whether this is a logical relationship (vs. physical) */
  isLogical: boolean;
  /** Name of the parent entity */
  parent_entity_name: string;
  /** Column names in the parent entity that form the relationship */
  parent_entity_columns: string[];
  /** Name of the child entity */
  child_entity_name: string;
  /** Column names in the child entity that form the relationship */
  child_entity_columns: string[];
  /** Type of relationship: Identifying or Non-Identifying */
  relationship_type: RelationshipType;
  /** Cardinality of the relationship */
  cardinality: Cardinality;
  /** Verb phrase describing the relationship (parent to child) */
  verb_phrase: string;
  /** Inverse phrase describing the relationship (child to parent) */
  inverse_phrase: string;
}

/**
 * A subject area - a logical grouping of entities.
 */
export interface SubjectArea {
  /** Name of the subject area */
  name: string;
  /** Number of entities in this subject area */
  entity_count: number;
  /** Array of entity names in this subject area */
  entity_names: string[];
}

/**
 * The complete ERDV model structure.
 * This is the root object in a .erdv file.
 */
export interface ERDVModel {
  /** Metadata about the model */
  metadata: Metadata;
  /** Database server information */
  server_info: ServerInfo;
  /** Database name */
  database: string;
  /** Array of schema names in the database */
  schemas: string[];
  /** Array of entities (tables) in the model */
  entities: Entity[];
  /** Array of relationships (foreign keys) between entities */
  relationships: Relationship[];
  /** Array of subject areas (logical groupings) */
  subject_areas: SubjectArea[];
}
