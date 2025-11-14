/**
 * Application State Management
 *
 * Simple module-level state management for storing the current ERD model.
 * Only one model can be active at a time per project requirements.
 */

import type { ERDVModel } from './types';

/**
 * Application state interface
 */
interface AppState {
  model: ERDVModel | null;
  fileName: string | null;
  uploadedAt: Date | null;
  validationErrors: string[] | null;
}

/**
 * Current application state
 */
let state: AppState = {
  model: null,
  fileName: null,
  uploadedAt: null,
  validationErrors: null,
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
