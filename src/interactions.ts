/**
 * Canvas Interactions Module
 *
 * Handles zoom, pan, and entity dragging interactions on the ERD canvas.
 * Manages coordinate transformations between screen and canvas space.
 */

import type { ERDVModel, Entity } from './types';
import type { LayoutPosition } from './layout';
import type { CanvasTransform } from './state';
import {
  getCanvasTransform,
  setCanvasTransform,
  resetCanvasTransform,
  setEntityPositionOverride,
  getAllEntityPositionOverrides,
  clearEntityPositionOverrides,
} from './state';
import { renderModel } from './renderer';
import { getModel } from './state';

// Zoom limits
const MIN_ZOOM = 0.1;  // 10%
const MAX_ZOOM = 5.0;  // 500%

// Interaction state
type InteractionState =
  | { mode: 'idle' }
  | { mode: 'dragging_entity'; entityIndex: number; entityName: string; startX: number; startY: number; originalPosX: number; originalPosY: number }
  | { mode: 'panning'; startX: number; startY: number; startPanX: number; startPanY: number };

let interactionState: InteractionState = { mode: 'idle' };
let currentPositions: LayoutPosition[] = [];
let canvas: HTMLCanvasElement | null = null;

/**
 * Initialize interactions for the canvas
 * @param canvasElement - The canvas element to attach interactions to
 */
export function initInteractions(canvasElement: HTMLCanvasElement): void {
  canvas = canvasElement;

  // Mouse events
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('wheel', handleWheel, { passive: false });

  // Touch events (basic support)
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd);

  // Keyboard events
  document.addEventListener('keydown', handleKeyDown);

  console.log('Canvas interactions initialized');
}

/**
 * Store current entity positions for hit testing
 * @param positions - Array of entity positions
 */
export function setEntityPositions(positions: LayoutPosition[]): void {
  currentPositions = positions;
}

/**
 * Apply canvas transform before rendering
 * @param ctx - Canvas rendering context
 * @param transform - Transform to apply
 */
export function applyCanvasTransform(
  ctx: CanvasRenderingContext2D,
  transform: CanvasTransform
): void {
  // Reset transform first
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // Apply new transform: translate then scale
  ctx.translate(transform.panX, transform.panY);
  ctx.scale(transform.zoom, transform.zoom);
}

/**
 * Convert screen coordinates to canvas coordinates
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param transform - Current canvas transform
 * @returns Canvas coordinates
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  transform: CanvasTransform
): { x: number; y: number } {
  return {
    x: (screenX - transform.panX) / transform.zoom,
    y: (screenY - transform.panY) / transform.zoom,
  };
}

/**
 * Convert canvas coordinates to screen coordinates
 * @param canvasX - Canvas X coordinate
 * @param canvasY - Canvas Y coordinate
 * @param transform - Current canvas transform
 * @returns Screen coordinates
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  transform: CanvasTransform
): { x: number; y: number } {
  return {
    x: canvasX * transform.zoom + transform.panX,
    y: canvasY * transform.zoom + transform.panY,
  };
}

/**
 * Find entity at a given canvas point
 * @param canvasX - Canvas X coordinate
 * @param canvasY - Canvas Y coordinate
 * @param model - The ERD model
 * @param positions - Entity positions
 * @returns Entity index and entity, or null if none found
 */
function findEntityAtPoint(
  canvasX: number,
  canvasY: number,
  model: ERDVModel,
  positions: LayoutPosition[]
): { index: number; entity: Entity } | null {
  // Iterate in reverse order (topmost entity = last rendered)
  for (let i = model.entities.length - 1; i >= 0; i--) {
    const entity = model.entities[i];
    const pos = positions[i];

    if (
      canvasX >= pos.x &&
      canvasX <= pos.x + pos.width &&
      canvasY >= pos.y &&
      canvasY <= pos.y + pos.height
    ) {
      return { index: i, entity };
    }
  }
  return null;
}

/**
 * Handle mouse down event
 */
function handleMouseDown(e: MouseEvent): void {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;

  const transform = getCanvasTransform();
  const canvasCoords = screenToCanvas(screenX, screenY, transform);

  const model = getModel();
  if (!model) return;

  // Check if clicking on an entity
  const entityAt = findEntityAtPoint(canvasCoords.x, canvasCoords.y, model, currentPositions);

  if (entityAt) {
    // Start dragging entity
    const pos = currentPositions[entityAt.index];
    interactionState = {
      mode: 'dragging_entity',
      entityIndex: entityAt.index,
      entityName: entityAt.entity.name,
      startX: e.clientX,
      startY: e.clientY,
      originalPosX: pos.x,
      originalPosY: pos.y,
    };
    if (canvas) canvas.style.cursor = 'grabbing';
  } else {
    // Start panning canvas
    interactionState = {
      mode: 'panning',
      startX: e.clientX,
      startY: e.clientY,
      startPanX: transform.panX,
      startPanY: transform.panY,
    };
    if (canvas) canvas.style.cursor = 'grabbing';
  }
}

/**
 * Handle mouse move event
 */
function handleMouseMove(e: MouseEvent): void {
  if (!canvas) return;

  if (interactionState.mode === 'dragging_entity') {
    // Update entity position
    const deltaX = e.clientX - interactionState.startX;
    const deltaY = e.clientY - interactionState.startY;

    const transform = getCanvasTransform();
    const canvasDeltaX = deltaX / transform.zoom;
    const canvasDeltaY = deltaY / transform.zoom;

    const newX = interactionState.originalPosX + canvasDeltaX;
    const newY = interactionState.originalPosY + canvasDeltaY;

    // Update position override
    setEntityPositionOverride(interactionState.entityName, { x: newX, y: newY });

    // Update current positions for this entity
    currentPositions[interactionState.entityIndex].x = newX;
    currentPositions[interactionState.entityIndex].y = newY;

    // Re-render
    const model = getModel();
    if (model) {
      renderModel(model);
    }
  } else if (interactionState.mode === 'panning') {
    // Update pan offset
    const deltaX = e.clientX - interactionState.startX;
    const deltaY = e.clientY - interactionState.startY;

    const newPanX = interactionState.startPanX + deltaX;
    const newPanY = interactionState.startPanY + deltaY;

    const transform = getCanvasTransform();
    setCanvasTransform({ ...transform, panX: newPanX, panY: newPanY });

    // Re-render
    const model = getModel();
    if (model) {
      renderModel(model);
    }
  } else {
    // Update cursor based on what's under the mouse
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const transform = getCanvasTransform();
    const canvasCoords = screenToCanvas(screenX, screenY, transform);

    const model = getModel();
    if (!model) return;

    const entityAt = findEntityAtPoint(canvasCoords.x, canvasCoords.y, model, currentPositions);
    canvas.style.cursor = entityAt ? 'move' : 'default';
  }
}

/**
 * Handle mouse up event
 */
function handleMouseUp(): void {
  if (!canvas) return;

  interactionState = { mode: 'idle' };
  canvas.style.cursor = 'default';
}

/**
 * Handle mouse wheel event for zooming
 */
function handleWheel(e: WheelEvent): void {
  e.preventDefault();
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;

  // Zoom factor: 1.1 for zoom in, 0.9 for zoom out
  const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;

  zoomToPoint(screenX, screenY, zoomDelta);
}

/**
 * Zoom toward a specific point
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param zoomDelta - Zoom multiplier (>1 = zoom in, <1 = zoom out)
 */
export function zoomToPoint(
  screenX: number,
  screenY: number,
  zoomDelta: number
): void {
  const transform = getCanvasTransform();
  const oldZoom = transform.zoom;
  const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, oldZoom * zoomDelta));

  // Canvas point under cursor (before zoom)
  const canvasX = (screenX - transform.panX) / oldZoom;
  const canvasY = (screenY - transform.panY) / oldZoom;

  // Adjust pan to keep same canvas point under cursor (after zoom)
  const newPanX = screenX - canvasX * newZoom;
  const newPanY = screenY - canvasY * newZoom;

  setCanvasTransform({ zoom: newZoom, panX: newPanX, panY: newPanY });

  // Re-render
  const model = getModel();
  if (model) {
    renderModel(model);
  }

  // Update zoom display
  updateZoomDisplay();
}

/**
 * Zoom in by 20%
 */
export function zoomIn(): void {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  zoomToPoint(centerX, centerY, 1.2);
}

/**
 * Zoom out by 20%
 */
export function zoomOut(): void {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  zoomToPoint(centerX, centerY, 0.8);
}

/**
 * Reset view to default (100% zoom, no pan, grid layout)
 */
export function resetView(): void {
  resetCanvasTransform();
  clearEntityPositionOverrides();

  // Re-render
  const model = getModel();
  if (model) {
    renderModel(model);
  }

  // Update zoom display
  updateZoomDisplay();
}

/**
 * Update zoom level display
 */
function updateZoomDisplay(): void {
  const zoomDisplay = document.getElementById('zoom-level');
  if (zoomDisplay) {
    const transform = getCanvasTransform();
    zoomDisplay.textContent = `${Math.round(transform.zoom * 100)}%`;
  }

  // Update button states
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');

  if (zoomInBtn && zoomOutBtn) {
    const transform = getCanvasTransform();
    (zoomInBtn as HTMLButtonElement).disabled = transform.zoom >= MAX_ZOOM;
    (zoomOutBtn as HTMLButtonElement).disabled = transform.zoom <= MIN_ZOOM;
  }
}

/**
 * Handle touch start (basic pinch-zoom support)
 */
let lastTouchDistance: number | null = null;

function handleTouchStart(e: TouchEvent): void {
  e.preventDefault();

  if (e.touches.length === 2) {
    // Pinch zoom - record initial distance
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
  }
}

function handleTouchMove(e: TouchEvent): void {
  e.preventDefault();

  if (e.touches.length === 2 && lastTouchDistance !== null) {
    // Pinch zoom
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const zoomDelta = distance / lastTouchDistance;
    lastTouchDistance = distance;

    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
    const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

    zoomToPoint(centerX, centerY, zoomDelta);
  }
}

function handleTouchEnd(): void {
  lastTouchDistance = null;
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyDown(e: KeyboardEvent): void {
  // Ctrl/Cmd + Plus: Zoom in
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
    e.preventDefault();
    zoomIn();
  }
  // Ctrl/Cmd + Minus: Zoom out
  else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
    e.preventDefault();
    zoomOut();
  }
  // Ctrl/Cmd + 0: Reset zoom
  else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
    e.preventDefault();
    resetView();
  }
}

/**
 * Get merged entity positions (grid + overrides)
 * @param gridPositions - Base grid layout positions
 * @param entities - Array of entities
 * @returns Merged positions with overrides applied
 */
export function getMergedPositions(
  gridPositions: LayoutPosition[],
  entities: Entity[]
): LayoutPosition[] {
  const overrides = getAllEntityPositionOverrides();

  return gridPositions.map((pos, index) => {
    const override = overrides.get(entities[index].name);
    if (override) {
      return { ...pos, x: override.x, y: override.y };
    }
    return pos;
  });
}
