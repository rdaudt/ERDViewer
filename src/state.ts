/**
 * Application State Management
 *
 * Simple module-level state management for storing the current ERD model.
 * Only one model can be active at a time per project requirements.
 */

import type { ERDVModel } from './types';
import type { LineStyle } from './relationships';

/**
 * Canvas transform state for zoom and pan
 */
export interface CanvasTransform {
  zoom: number;    // 0.1 to 5.0 (10% to 500%)
  panX: number;    // pixels
  panY: number;    // pixels
}

/**
 * Application state interface
 */
interface AppState {
  model: ERDVModel | null;
  fileName: string | null;
  uploadedAt: Date | null;
  validationErrors: string[] | null;
  lineStyle: LineStyle;
  canvasTransform: CanvasTransform;
  entityPositionOverrides: Map<string, { x: number; y: number }>;  // entityName → position
  selectedSubjectArea: string | null;  // null represents "All"
}

/**
 * Current application state
 */
let state: AppState = {
  model: null,
  fileName: null,
  uploadedAt: null,
  validationErrors: null,
  lineStyle: 'orthogonal',
  canvasTransform: { zoom: 1.0, panX: 0, panY: 0 },
  entityPositionOverrides: new Map(),
  selectedSubjectArea: null,  // null = "All"
};

/**
 * Model metadata summary
 */
export interface ModelMetadata {
  modelName: string;
  database: string;
  entityCount: number;
  relationshipCount: number;
  subjectAreaCount: number;
  fileName: string;
  uploadedAt: Date;
}

/**
 * Get the current model
 * @returns The current ERDVModel or null if none is loaded
 */
export function getModel(): ERDVModel | null {
  return state.model;
}

/**
 * Set the current model and clear any previous validation errors
 * @param model - The validated ERDVModel to store
 * @param fileName - Original filename
 */
export function setModel(model: ERDVModel, fileName: string): void {
  state.model = model;
  state.fileName = fileName;
  state.uploadedAt = new Date();
  state.validationErrors = null;
  // Reset transform and position overrides when new model loads
  state.canvasTransform = { zoom: 1.0, panX: 0, panY: 0 };
  state.entityPositionOverrides.clear();
  // Reset selected subject area to "All"
  state.selectedSubjectArea = null;
}

/**
 * Clear the current model and reset state
 */
export function clearModel(): void {
  state.model = null;
  state.fileName = null;
  state.uploadedAt = null;
  state.validationErrors = null;
}

/**
 * Set validation errors (when upload fails)
 * @param errors - Array of error messages
 */
export function setValidationErrors(errors: string[]): void {
  state.validationErrors = errors;
  state.model = null;
}

/**
 * Get validation errors if any
 * @returns Array of error messages or null
 */
export function getValidationErrors(): string[] | null {
  return state.validationErrors;
}

/**
 * Get metadata summary from the current model
 * @returns ModelMetadata or null if no model is loaded
 */
export function getMetadata(): ModelMetadata | null {
  if (!state.model || !state.fileName || !state.uploadedAt) {
    return null;
  }

  return {
    modelName: state.model.metadata.model_name,
    database: state.model.database,
    entityCount: state.model.entities.length,
    relationshipCount: state.model.relationships.length,
    subjectAreaCount: state.model.subject_areas.length,
    fileName: state.fileName,
    uploadedAt: state.uploadedAt,
  };
}

/**
 * Get the current line style for relationship rendering
 * @returns Current LineStyle setting
 */
export function getLineStyle(): LineStyle {
  return state.lineStyle;
}

/**
 * Set the line style for relationship rendering
 * @param lineStyle - The line style to use (straight, rounded, or orthogonal)
 */
export function setLineStyle(lineStyle: LineStyle): void {
  state.lineStyle = lineStyle;
}

/**
 * Get the current canvas transform (zoom and pan)
 * @returns Current CanvasTransform state
 */
export function getCanvasTransform(): CanvasTransform {
  return state.canvasTransform;
}

/**
 * Set the canvas transform (zoom and pan)
 * @param transform - The new transform state
 */
export function setCanvasTransform(transform: CanvasTransform): void {
  state.canvasTransform = transform;
}

/**
 * Reset canvas transform to default (100% zoom, no pan)
 */
export function resetCanvasTransform(): void {
  state.canvasTransform = { zoom: 1.0, panX: 0, panY: 0 };
}

/**
 * Get entity position override for a specific entity
 * @param entityName - Name of the entity
 * @returns Position override or null if not set
 */
export function getEntityPositionOverride(entityName: string): { x: number; y: number } | null {
  return state.entityPositionOverrides.get(entityName) || null;
}

/**
 * Set entity position override for a specific entity
 * @param entityName - Name of the entity
 * @param position - Custom position {x, y}
 */
export function setEntityPositionOverride(entityName: string, position: { x: number; y: number }): void {
  state.entityPositionOverrides.set(entityName, position);
}

/**
 * Clear all entity position overrides
 */
export function clearEntityPositionOverrides(): void {
  state.entityPositionOverrides.clear();
}

/**
 * Get all entity position overrides
 * @returns Map of entity names to positions
 */
export function getAllEntityPositionOverrides(): Map<string, { x: number; y: number }> {
  return state.entityPositionOverrides;
}

/**
 * Get the currently selected subject area
 * @returns The subject area name or null (representing "All")
 */
export function getSelectedSubjectArea(): string | null {
  return state.selectedSubjectArea;
}

/**
 * Set the selected subject area
 * @param name - The subject area name to select, or null for "All"
 */
export function setSelectedSubjectArea(name: string | null): void {
  state.selectedSubjectArea = name;
}
