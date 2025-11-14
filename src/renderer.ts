/**
 * Canvas Rendering Module
 *
 * Manages the HTML5 canvas for rendering ERD diagrams.
 * Handles canvas initialization, coordinate system, and entity rendering.
 */

import type { ERDVModel, Entity, Column } from './types';
import { calculateGridLayout, type LayoutPosition } from './layout';

// Canvas and context references
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let canvasSection: HTMLElement | null = null;

// Entity styling constants
const ENTITY_WIDTH = 250;
const HEADER_HEIGHT = 32;
const ROW_HEIGHT = 24;
const PADDING_H = 8;
const PADDING_V = 4;
const MIN_ENTITY_HEIGHT = 80;

// Colors
const COLOR_HEADER_BG = '#3b82f6';
const COLOR_HEADER_TEXT = '#ffffff';
const COLOR_PK_BG = '#e0f2fe';
const COLOR_COLUMN_BG = '#ffffff';
const COLOR_BORDER = '#cbd5e1';
const COLOR_TEXT = '#1e293b';

/**
 * Initialize the canvas rendering system
 * @returns true if initialization succeeds, false otherwise
 */
export function initCanvas(): boolean {
  try {
    canvas = document.getElementById('erd-canvas') as HTMLCanvasElement;
    canvasSection = document.getElementById('canvas-section');

    if (!canvas) {
      console.error('Canvas element not found');
      return false;
    }

    // Get 2D rendering context
    ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D rendering context');
      return false;
    }

    // Set up canvas for high-DPI displays
    setupHighDPICanvas();

    // Set default rendering settings
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    console.log('Canvas initialized successfully');
    return true;
  } catch (error) {
    console.error('Canvas initialization error:', error);
    return false;
  }
}

/**
 * Set up canvas for high-DPI displays (retina, 4K, etc.)
 */
function setupHighDPICanvas(): void {
  if (!canvas || !ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Set actual canvas size (accounting for device pixel ratio)
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Scale context to match device pixel ratio
  ctx.scale(dpr, dpr);

  // Set CSS size (visual size)
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}

/**
 * Clear the canvas completely
 */
export function clearCanvas(): void {
  if (!canvas || !ctx) return;

  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
}

/**
 * Show the canvas section
 */
export function showCanvas(): void {
  if (canvasSection) {
    canvasSection.hidden = false;
  }
}

/**
 * Hide the canvas section
 */
export function hideCanvas(): void {
  if (canvasSection) {
    canvasSection.hidden = true;
  }
}

/**
 * Render the entire ERD model
 * @param model - The validated ERD model to render
 */
export function renderModel(model: ERDVModel): void {
  if (!canvas || !ctx) {
    console.error('Canvas not initialized');
    return;
  }

  try {
    // Clear canvas
    clearCanvas();

    // Calculate layout positions
    const rect = canvas.getBoundingClientRect();
    const positions = calculateGridLayout(model.entities, rect.width, rect.height);

    // Render each entity
    let renderedCount = 0;
    for (let i = 0; i < model.entities.length; i++) {
      const entity = model.entities[i];
      const position = positions[i];

      // Skip entities with no columns
      if (entity.columns.length === 0) {
        console.warn(`Skipping entity "${entity.name}" - no columns`);
        continue;
      }

      renderEntity(entity, position.x, position.y, model);
      renderedCount++;
    }

    console.log(`Rendered ${renderedCount} entities`);

    // Show canvas
    showCanvas();
  } catch (error) {
    console.error('Rendering error:', error);
    throw new Error('Failed to render ERD diagram');
  }
}

/**
 * Render a single entity box
 * @param entity - The entity to render
 * @param x - X position on canvas
 * @param y - Y position on canvas
 * @param model - The full model (for FK detection)
 */
function renderEntity(entity: Entity, x: number, y: number, model: ERDVModel): void {
  if (!ctx) return;

  // Calculate entity height
  const height = calculateEntityHeight(entity);

  // Separate primary key and regular columns
  const pkColumns = entity.columns.filter(col =>
    entity.primary_key_columns.includes(col.name)
  );
  const regularColumns = entity.columns.filter(col =>
    !entity.primary_key_columns.includes(col.name)
  );

  let currentY = y;

  // Render header
  currentY = renderHeader(entity, x, currentY);

  // Render primary key section
  if (pkColumns.length > 0) {
    currentY = renderPrimaryKeySection(pkColumns, x, currentY, entity, model);
  }

  // Render regular columns section
  if (regularColumns.length > 0) {
    currentY = renderColumnsSection(regularColumns, x, currentY, entity, model);
  }

  // Draw outer border
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, ENTITY_WIDTH, height);
}

/**
 * Render entity header section
 */
function renderHeader(entity: Entity, x: number, y: number): number {
  if (!ctx) return y;

  // Draw header background
  ctx.fillStyle = COLOR_HEADER_BG;
  ctx.fillRect(x, y, ENTITY_WIDTH, HEADER_HEIGHT);

  // Draw header border
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + HEADER_HEIGHT);
  ctx.lineTo(x + ENTITY_WIDTH, y + HEADER_HEIGHT);
  ctx.stroke();

  // Draw header text
  ctx.fillStyle = COLOR_HEADER_TEXT;
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const headerText = `${entity.name} (${entity.schema_name})`;
  const truncatedHeader = truncateText(headerText, ENTITY_WIDTH - 2 * PADDING_H);
  ctx.fillText(truncatedHeader, x + PADDING_H, y + PADDING_V + 6);

  // Reset font
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  return y + HEADER_HEIGHT;
}

/**
 * Render primary key section
 */
function renderPrimaryKeySection(
  pkColumns: Column[],
  x: number,
  y: number,
  entity: Entity,
  model: ERDVModel
): number {
  if (!ctx) return y;

  const sectionHeight = pkColumns.length * ROW_HEIGHT;

  // Draw background
  ctx.fillStyle = COLOR_PK_BG;
  ctx.fillRect(x, y, ENTITY_WIDTH, sectionHeight);

  // Draw section border
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + sectionHeight);
  ctx.lineTo(x + ENTITY_WIDTH, y + sectionHeight);
  ctx.stroke();

  // Draw columns
  ctx.fillStyle = COLOR_TEXT;
  pkColumns.forEach((col, index) => {
    const rowY = y + index * ROW_HEIGHT;
    const isFk = isColumnForeignKey(entity.name, col.name, model);
    const notation = isFk ? '(PK, FK)' : '(PK)';
    const columnText = `${col.name} ${notation} ${col.data_type}`;
    const truncated = truncateText(columnText, ENTITY_WIDTH - 2 * PADDING_H);
    ctx.fillText(truncated, x + PADDING_H, rowY + PADDING_V);
  });

  return y + sectionHeight;
}

/**
 * Render regular columns section
 */
function renderColumnsSection(
  columns: Column[],
  x: number,
  y: number,
  entity: Entity,
  model: ERDVModel
): number {
  if (!ctx) return y;

  const sectionHeight = columns.length * ROW_HEIGHT;

  // Draw background
  ctx.fillStyle = COLOR_COLUMN_BG;
  ctx.fillRect(x, y, ENTITY_WIDTH, sectionHeight);

  // Draw columns
  ctx.fillStyle = COLOR_TEXT;
  columns.forEach((col, index) => {
    const rowY = y + index * ROW_HEIGHT;
    const isFk = isColumnForeignKey(entity.name, col.name, model);
    const notation = isFk ? '(FK)' : '';
    const columnText = `${col.name} ${notation} ${col.data_type}`.trim();
    const truncated = truncateText(columnText, ENTITY_WIDTH - 2 * PADDING_H);
    ctx.fillText(truncated, x + PADDING_H, rowY + PADDING_V);
  });

  return y + sectionHeight;
}

/**
 * Calculate entity height based on column count
 */
function calculateEntityHeight(entity: Entity): number {
  const pkCount = entity.primary_key_columns.length;
  const regularCount = entity.columns.length - pkCount;
  const columnsHeight = (pkCount + regularCount) * ROW_HEIGHT;
  const totalHeight = HEADER_HEIGHT + columnsHeight;
  return Math.max(totalHeight, MIN_ENTITY_HEIGHT);
}

/**
 * Check if a column is a foreign key
 */
function isColumnForeignKey(entityName: string, columnName: string, model: ERDVModel): boolean {
  return model.relationships.some(rel =>
    rel.child_entity_name === entityName &&
    rel.child_entity_columns.includes(columnName)
  );
}

/**
 * Truncate text to fit within max width
 */
function truncateText(text: string, maxWidth: number): string {
  if (!ctx) return text;

  const metrics = ctx.measureText(text);
  if (metrics.width <= maxWidth) {
    return text;
  }

  // Binary search for truncation point
  let left = 0;
  let right = text.length;
  let result = '';

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const candidate = text.substring(0, mid) + '...';
    const width = ctx.measureText(candidate).width;

    if (width <= maxWidth) {
      result = candidate;
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return result || text.substring(0, 3) + '...';
}

/**
 * Get entity width constant (for layout calculation)
 */
export function getEntityWidth(): number {
  return ENTITY_WIDTH;
}

/**
 * Calculate entity height for layout purposes
 */
export function getEntityHeight(entity: Entity): number {
  return calculateEntityHeight(entity);
}
