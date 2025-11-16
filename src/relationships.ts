/**
 * Relationship Rendering Module
 *
 * Renders relationship lines between entities with crow's foot notation
 * for cardinality visualization.
 */

import type { ERDVModel, Relationship, Cardinality, Entity } from './types';
import type { LayoutPosition } from './layout';
import { HEADER_HEIGHT, ROW_HEIGHT } from './renderer';

// Line style types
export type LineStyle = 'straight' | 'rounded' | 'orthogonal';

// Connection side enum
type Side = 'top' | 'right' | 'bottom' | 'left';

// Point interface
interface Point {
  x: number;
  y: number;
}

// Rendering constants
const LINE_COLOR = '#64748b'; // Medium gray
const LINE_WIDTH = 2;
const CIRCLE_RADIUS = 5;
const CIRCLE_OFFSET = 8;
const SINGLE_LINE_LENGTH = 6;
const CROWS_FOOT_LENGTH = 8;
const CROWS_FOOT_SPREAD = 6;
const SYMBOL_OFFSET = 4; // Offset to push symbols away from entity edge

// Canvas context reference
let ctx: CanvasRenderingContext2D | null = null;

/**
 * Set the canvas context for relationship rendering
 * @param context - Canvas 2D rendering context
 */
export function setRelationshipContext(context: CanvasRenderingContext2D): void {
  ctx = context;
}

/**
 * Render all relationships for a model
 * @param model - The ERD model
 * @param positions - Entity positions from layout
 * @param lineStyle - Line routing style
 */
export function renderRelationships(
  model: ERDVModel,
  positions: LayoutPosition[],
  lineStyle: LineStyle = 'orthogonal'
): void {
  if (!ctx || model.relationships.length === 0) return;

  // Create entity and position maps for quick lookup
  const positionMap = new Map<string, LayoutPosition>();
  const entityMap = new Map<string, Entity>();
  for (let i = 0; i < model.entities.length; i++) {
    positionMap.set(model.entities[i].name, positions[i]);
    entityMap.set(model.entities[i].name, model.entities[i]);
  }

  // Render each relationship
  for (const relationship of model.relationships) {
    const parentPos = positionMap.get(relationship.parent_entity_name);
    const childPos = positionMap.get(relationship.child_entity_name);
    const parentEntity = entityMap.get(relationship.parent_entity_name);
    const childEntity = entityMap.get(relationship.child_entity_name);

    if (!parentPos || !childPos || !parentEntity || !childEntity) {
      console.warn(`Cannot render relationship: entity not found`, relationship);
      continue;
    }

    // Check for self-referencing relationship
    const isSelfRef = relationship.parent_entity_name === relationship.child_entity_name;

    if (isSelfRef) {
      renderSelfReferencingRelationship(relationship, parentPos);
    } else {
      renderRelationship(relationship, parentEntity, childEntity, parentPos, childPos, lineStyle);
    }
  }
}

/**
 * Render a single relationship line
 */
function renderRelationship(
  relationship: Relationship,
  parentEntity: Entity,
  childEntity: Entity,
  parentPos: LayoutPosition,
  childPos: LayoutPosition,
  lineStyle: LineStyle
): void {
  if (!ctx) return;

  // Calculate connection points based on specific columns
  const { start, end, startSide, endSide } = calculateConnectionPoints(
    relationship,
    parentEntity,
    childEntity,
    parentPos,
    childPos
  );

  // Set line style
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = LINE_WIDTH;

  // Set dash pattern based on relationship type
  const dashPattern = relationship.relationship_type === 'Identifying' ? [] : [5, 5];
  ctx.setLineDash(dashPattern);

  // Draw the line based on style
  ctx.beginPath();
  switch (lineStyle) {
    case 'straight':
      drawStraightLine(start, end);
      break;
    case 'rounded':
      drawRoundedLine(start, end, startSide, endSide);
      break;
    case 'orthogonal':
      drawOrthogonalLine(start, end, startSide, endSide);
      break;
  }
  ctx.stroke();

  // Reset dash pattern
  ctx.setLineDash([]);

  // Calculate line angles for cardinality symbols
  const startAngle = getAngle(start, end);
  const endAngle = getAngle(end, start);

  // Draw cardinality symbols at each end
  // For a "1..N" relationship (one-to-many):
  // - Parent end (GlossaryTerm) should show "1" (single line) - the "one" side
  // - Child end (SubstanceGlossaryTerm) should show "N" (crow's foot) - the "many" side

  // Create "1" cardinality for parent end (always "1", no optional circles)
  const parentCardinality: Cardinality = {
    notation: '1..1',
    description: 'One',
    min_cardinality: 1,
    max_cardinality: 1,
  };

  // Create "N" cardinality for child end
  const childCardinality: Cardinality = {
    notation: '1..N',
    description: 'Many',
    min_cardinality: 1,
    max_cardinality: 'N',
  };

  // Draw "1" (single line) at start (parent)
  drawCardinality(start, startAngle, parentCardinality);
  // Draw "N" (crow's foot) at end (child)
  drawCardinality(end, endAngle, childCardinality);
}

/**
 * Render self-referencing relationship (loop)
 */
function renderSelfReferencingRelationship(
  relationship: Relationship,
  pos: LayoutPosition
): void {
  if (!ctx) return;

  // Draw a loop from right side, curving out and back
  const startX = pos.x + pos.width;
  const startY = pos.y + pos.height / 2;
  const loopWidth = 40;
  const loopHeight = 30;

  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = LINE_WIDTH;
  const dashPattern = relationship.relationship_type === 'Identifying' ? [] : [5, 5];
  ctx.setLineDash(dashPattern);

  ctx.beginPath();
  ctx.moveTo(startX, startY - 10);
  ctx.bezierCurveTo(
    startX + loopWidth, startY - loopHeight,
    startX + loopWidth, startY + loopHeight,
    startX, startY + 10
  );
  ctx.stroke();

  ctx.setLineDash([]);

  // Draw cardinality at both ends
  const topAngle = 0; // Right-pointing
  const bottomAngle = 0;

  drawCardinality({ x: startX, y: startY - 10 }, topAngle, { notation: '1..1' } as Cardinality);
  drawCardinality({ x: startX, y: startY + 10 }, bottomAngle, relationship.cardinality);
}

/**
 * Calculate connection points and sides for a relationship
 * Now connects from specific PK column to specific FK column
 */
function calculateConnectionPoints(
  relationship: Relationship,
  parentEntity: Entity,
  childEntity: Entity,
  parentPos: LayoutPosition,
  childPos: LayoutPosition
): { start: Point; end: Point; startSide: Side; endSide: Side } {
  // Get the first parent column involved in the relationship
  const parentColumn = relationship.parent_entity_columns[0];
  // Get the first child column involved in the relationship
  const childColumn = relationship.child_entity_columns[0];

  // Calculate Y position for parent column
  const parentColumnY = getColumnYPosition(parentEntity, parentColumn, parentPos);
  // Calculate Y position for child column
  const childColumnY = getColumnYPosition(childEntity, childColumn, childPos);

  // Get entity centers for X calculation
  const parentCenterX = parentPos.x + parentPos.width / 2;
  const childCenterX = childPos.x + childPos.width / 2;

  // Use column Y positions, entity center X positions
  const parentPoint = { x: parentCenterX, y: parentColumnY };
  const childPoint = { x: childCenterX, y: childColumnY };

  // Calculate angle from parent to child
  const angle = Math.atan2(childPoint.y - parentPoint.y, childPoint.x - parentPoint.x);

  // Determine connection sides based on angle
  const startSide = angleToSide(angle);
  const endSide = angleToSide(angle + Math.PI); // Opposite side

  // Calculate connection points on edges with column Y
  const start = getEntityEdgePointForColumn(parentPos, startSide, parentColumnY);
  const end = getEntityEdgePointForColumn(childPos, endSide, childColumnY);

  return { start, end, startSide, endSide };
}

/**
 * Calculate the Y position of a specific column in an entity
 * @param entity - The entity containing the column
 * @param columnName - The name of the column
 * @param pos - The entity's position on canvas
 * @returns Y coordinate of the column's center
 */
function getColumnYPosition(entity: Entity, columnName: string, pos: LayoutPosition): number {
  // Start after header
  let currentY = pos.y + HEADER_HEIGHT;

  // Check if it's a primary key column
  const isPK = entity.primary_key_columns.includes(columnName);

  if (isPK) {
    // Find index in primary key columns
    const pkColumns = entity.columns.filter(col =>
      entity.primary_key_columns.includes(col.name)
    );
    const pkIndex = pkColumns.findIndex(col => col.name === columnName);

    if (pkIndex >= 0) {
      // Return center of this PK row
      return currentY + (pkIndex * ROW_HEIGHT) + (ROW_HEIGHT / 2);
    }
  } else {
    // It's a regular column
    const pkCount = entity.primary_key_columns.length;
    const regularColumns = entity.columns.filter(col =>
      !entity.primary_key_columns.includes(col.name)
    );
    const regularIndex = regularColumns.findIndex(col => col.name === columnName);

    if (regularIndex >= 0) {
      // Skip PK section
      currentY += pkCount * ROW_HEIGHT;
      // Return center of this regular row
      return currentY + (regularIndex * ROW_HEIGHT) + (ROW_HEIGHT / 2);
    }
  }

  // Fallback to entity center if column not found
  return pos.y + pos.height / 2;
}

/**
 * Get connection point on entity edge for a specific column Y position
 */
function getEntityEdgePointForColumn(pos: LayoutPosition, side: Side, columnY: number): Point {
  const { x, y, width, height } = pos;
  switch (side) {
    case 'top':
      return { x: x + width / 2, y };
    case 'right':
      return { x: x + width, y: columnY };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: columnY };
  }
}

/**
 * Convert angle to side
 */
function angleToSide(angle: number): Side {
  // Normalize angle to 0-2π
  const normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Convert to degrees for easier comparison
  const degrees = (normalized * 180) / Math.PI;

  if (degrees >= 315 || degrees < 45) return 'right';
  if (degrees >= 45 && degrees < 135) return 'bottom';
  if (degrees >= 135 && degrees < 225) return 'left';
  return 'top';
}

/**
 * Get connection point on entity edge
 */
function getEntityEdgePoint(pos: LayoutPosition, side: Side): Point {
  const { x, y, width, height } = pos;
  switch (side) {
    case 'top':
      return { x: x + width / 2, y };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
  }
}

/**
 * Draw a straight line
 */
function drawStraightLine(start: Point, end: Point): void {
  if (!ctx) return;
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
}

/**
 * Draw a rounded line using bezier curve
 */
function drawRoundedLine(start: Point, end: Point, startSide: Side, endSide: Side): void {
  if (!ctx) return;

  // Calculate control point for smooth curve
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Offset control point based on sides
  const offset = 50;
  let controlX = midX;
  let controlY = midY;

  if (startSide === 'right' || startSide === 'left') {
    controlX = midX;
    controlY = start.y;
  } else {
    controlX = start.x;
    controlY = midY;
  }

  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
}

/**
 * Draw an orthogonal line (right angles)
 */
function drawOrthogonalLine(start: Point, end: Point, startSide: Side, endSide: Side): void {
  if (!ctx) return;

  ctx.moveTo(start.x, start.y);

  // Determine routing direction
  const isHorizontalFirst = startSide === 'right' || startSide === 'left';

  if (isHorizontalFirst) {
    // Horizontal then vertical
    const midX = (start.x + end.x) / 2;
    ctx.lineTo(midX, start.y);
    ctx.lineTo(midX, end.y);
  } else {
    // Vertical then horizontal
    const midY = (start.y + end.y) / 2;
    ctx.lineTo(start.x, midY);
    ctx.lineTo(end.x, midY);
  }

  ctx.lineTo(end.x, end.y);
}

/**
 * Get angle between two points
 */
function getAngle(from: Point, to: Point): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

/**
 * Draw cardinality notation at line endpoint
 */
function drawCardinality(point: Point, angle: number, cardinality: Cardinality): void {
  if (!ctx) return;

  const { notation } = cardinality;
  const isMany = notation.endsWith('N');

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(angle);

  // Apply offset to push symbols away from entity edge
  ctx.translate(SYMBOL_OFFSET, 0);

  // Draw cardinality indicator (no optional circles - simplified to just 1 or N)
  if (isMany) {
    // Crow's foot for "many" (N)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-CROWS_FOOT_LENGTH, -CROWS_FOOT_SPREAD);
    ctx.moveTo(0, 0);
    ctx.lineTo(-CROWS_FOOT_LENGTH, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(-CROWS_FOOT_LENGTH, CROWS_FOOT_SPREAD);
    ctx.stroke();
  } else {
    // Single vertical line for "one" (1)
    ctx.beginPath();
    ctx.moveTo(0, -SINGLE_LINE_LENGTH);
    ctx.lineTo(0, SINGLE_LINE_LENGTH);
    ctx.stroke();
  }

  ctx.restore();
}
