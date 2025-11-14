/**
 * Layout Module
 *
 * Calculates positions for entities using various layout algorithms.
 * Phase 2 implements a simple grid layout.
 */

import type { Entity } from './types';
import { getEntityWidth, getEntityHeight } from './renderer';

/**
 * Position of an entity on the canvas
 */
export interface LayoutPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Layout constants
const HORIZONTAL_SPACING = 20;
const VERTICAL_SPACING = 20;
const TOP_PADDING = 20;
const SIDE_PADDING = 20;

/**
 * Calculate grid layout positions for entities
 * @param entities - Array of entities to position
 * @param canvasWidth - Available canvas width
 * @param canvasHeight - Available canvas height
 * @returns Array of positions, one per entity
 */
export function calculateGridLayout(
  entities: Entity[],
  canvasWidth: number,
  canvasHeight: number
): LayoutPosition[] {
  const positions: LayoutPosition[] = [];
  const entityWidth = getEntityWidth();

  // Calculate how many entities fit per row
  const availableWidth = canvasWidth - 2 * SIDE_PADDING;
  const entitiesPerRow = Math.max(
    1,
    Math.floor((availableWidth + HORIZONTAL_SPACING) / (entityWidth + HORIZONTAL_SPACING))
  );

  // Calculate total grid width for centering
  const gridWidth = entitiesPerRow * entityWidth + (entitiesPerRow - 1) * HORIZONTAL_SPACING;
  const leftOffset = Math.max(SIDE_PADDING, (canvasWidth - gridWidth) / 2);

  let currentRow = 0;
  let currentCol = 0;
  let currentRowMaxHeight = 0;
  let currentY = TOP_PADDING;

  for (const entity of entities) {
    // Skip entities with no columns
    if (entity.columns.length === 0) {
      positions.push({ x: 0, y: 0, width: 0, height: 0 });
      continue;
    }

    const entityHeight = getEntityHeight(entity);

    // Calculate position
    const x = leftOffset + currentCol * (entityWidth + HORIZONTAL_SPACING);
    const y = currentY;

    positions.push({
      x,
      y,
      width: entityWidth,
      height: entityHeight,
    });

    // Track tallest entity in current row
    currentRowMaxHeight = Math.max(currentRowMaxHeight, entityHeight);

    // Move to next position
    currentCol++;

    // Check if we need to wrap to next row
    if (currentCol >= entitiesPerRow) {
      currentCol = 0;
      currentRow++;
      currentY += currentRowMaxHeight + VERTICAL_SPACING;
      currentRowMaxHeight = 0;
    }
  }

  return positions;
}

/**
 * Calculate the total height needed for the layout
 * @param entities - Array of entities
 * @param canvasWidth - Available canvas width
 * @returns Total height needed
 */
export function calculateRequiredHeight(entities: Entity[], canvasWidth: number): number {
  const entityWidth = getEntityWidth();
  const availableWidth = canvasWidth - 2 * SIDE_PADDING;
  const entitiesPerRow = Math.max(
    1,
    Math.floor((availableWidth + HORIZONTAL_SPACING) / (entityWidth + HORIZONTAL_SPACING))
  );

  let totalHeight = TOP_PADDING;
  let currentCol = 0;
  let currentRowMaxHeight = 0;

  for (const entity of entities) {
    if (entity.columns.length === 0) continue;

    const entityHeight = getEntityHeight(entity);
    currentRowMaxHeight = Math.max(currentRowMaxHeight, entityHeight);

    currentCol++;

    if (currentCol >= entitiesPerRow) {
      totalHeight += currentRowMaxHeight + VERTICAL_SPACING;
      currentCol = 0;
      currentRowMaxHeight = 0;
    }
  }

  // Add remaining row height if not complete
  if (currentCol > 0) {
    totalHeight += currentRowMaxHeight;
  }

  totalHeight += TOP_PADDING; // Bottom padding

  return totalHeight;
}
