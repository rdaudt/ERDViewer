/**
 * File Upload Module
 *
 * Handles file upload UI, drag-and-drop, file reading, and user feedback.
 */

import { validateModel } from './validation';
import { setModel, clearModel, setValidationErrors, getMetadata, selectAllEntities } from './state';
import { renderModel, clearCanvas, hideCanvas } from './renderer';
import type { ERDVModel } from './types';
import { detectSubjectAreas, getEntitiesForSubjectArea } from './subjectAreas';
import { populateSubjectAreaSelector, populateEntitySelectionDropdown, updateSelectionCountDisplay } from './main';

// UI Elements
let uploadZone: HTMLElement | null = null;
let fileInput: HTMLInputElement | null = null;
let uploadButton: HTMLButtonElement | null = null;
let uploadSuccess: HTMLElement | null = null;
let uploadErrors: HTMLElement | null = null;
let loadingIndicator: HTMLElement | null = null;

/**
 * Initialize file upload functionality
 * Sets up all event listeners for drag-drop and file selection
 */
export function initFileUpload(): void {
  // Get UI elements
  uploadZone = document.getElementById('upload-zone');
  fileInput = document.getElementById('file-input') as HTMLInputElement;
  uploadButton = document.getElementById('upload-button') as HTMLButtonElement;
  uploadSuccess = document.getElementById('upload-success');
  uploadErrors = document.getElementById('upload-errors');
  loadingIndicator = document.getElementById('loading-indicator');

  if (!uploadZone || !fileInput || !uploadButton) {
    console.error('Required upload UI elements not found');
    return;
  }

  // Setup drag-and-drop events
  uploadZone.addEventListener('dragover', handleDragOver);
  uploadZone.addEventListener('dragleave', handleDragLeave);
  uploadZone.addEventListener('drop', handleFileDrop);

  // Setup file selection button
  uploadButton.addEventListener('click', () => fileInput?.click());
  fileInput.addEventListener('change', handleFileSelect);

  // Setup retry/reload buttons
  const tryAgainBtn = document.getElementById('try-again');
  const uploadAnotherBtn = document.getElementById('upload-another');

  if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', clearUploadState);
  }

  if (uploadAnotherBtn) {
    uploadAnotherBtn.addEventListener('click', clearUploadState);
  }

  console.log('File upload initialized');
}

/**
 * Handle drag over event
 */
function handleDragOver(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();

  if (uploadZone) {
    uploadZone.classList.add('drag-over');
  }
}

/**
 * Handle drag leave event
 */
function handleDragLeave(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();

  if (uploadZone) {
    uploadZone.classList.remove('drag-over');
  }
}

/**
 * Handle file drop event
 */
function handleFileDrop(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();

  if (uploadZone) {
    uploadZone.classList.remove('drag-over');
  }

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
}

/**
 * Handle file selection via button
 */
function handleFileSelect(event: Event): void {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    processFile(files[0]);
  }
}

/**
 * Process the selected file
 * @param file - File object to process
 */
async function processFile(file: File): Promise<void> {
  // Validate file type
  const validExtensions = ['.json'];
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (!validExtensions.includes(fileExtension)) {
    displayErrors([
      `Invalid file type: ${file.name}`,
      'Please upload a .json file.',
    ]);
    return;
  }

  // Check file size (warn if > 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    console.warn(`Large file detected: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }

  // Show loading state
  showLoading(true);

  try {
    // Read file
    const text = await readFile(file);

    // Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch (error) {
      const err = error as Error;
      displayErrors([
        'Invalid JSON file',
        `Parse error: ${err.message}`,
        'Please check the file format and try again.',
      ]);
      showLoading(false);
      return;
    }

    // Validate against schema
    const result = validateModel(data);

    showLoading(false);

    if (result.valid && result.data) {
      // Store in state
      setModel(result.data, file.name);

      // Display success
      displayMetadata(result.data);

      // Detect subject areas and populate selector
      const subjectAreas = detectSubjectAreas(result.data);
      populateSubjectAreaSelector(subjectAreas);
      console.log(`Detected ${subjectAreas.length} subject areas`);

      // Select all entities by default
      const allEntities = getEntitiesForSubjectArea(result.data, null);  // null = "All" subject area
      const allEntityNames = allEntities.map(e => e.name);
      selectAllEntities(allEntityNames);

      // Populate entity selection dropdown and show controls
      populateEntitySelectionDropdown();
      updateSelectionCountDisplay();

      const entitySelection = document.getElementById('entity-selection');
      if (entitySelection) {
        entitySelection.hidden = false;
      }

      // Render the diagram
      try {
        renderModel(result.data);
        console.log('Diagram rendered successfully');
      } catch (renderError) {
        console.error('Failed to render diagram:', renderError);
        displayErrors([
          'File loaded but rendering failed',
          'See console for details',
        ]);
      }
    } else {
      // Display validation errors
      setValidationErrors(result.errors || ['Unknown validation error']);
      displayErrors(result.errors || ['Unknown validation error']);
    }
  } catch (error) {
    console.error('File processing error:', error);
    const err = error as Error;
    displayErrors([
      'Failed to read file',
      err.message,
      'Please try again or use a different file.',
    ]);
    showLoading(false);
  }
}

/**
 * Read file as text using FileReader API
 * @param file - File to read
 * @returns Promise resolving to file contents as string
 */
function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };

    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };

    reader.readAsText(file);
  });
}

/**
 * Display metadata after successful upload
 * @param model - Validated ERDVModel
 */
function displayMetadata(model: ERDVModel): void {
  const metadata = getMetadata();
  if (!metadata) return;

  // Update metadata display
  const modelNameEl = document.getElementById('model-name');
  const databaseEl = document.getElementById('database-name');
  const entityCountEl = document.getElementById('entity-count');
  const relationshipCountEl = document.getElementById('relationship-count');

  if (modelNameEl) modelNameEl.textContent = metadata.modelName;
  if (databaseEl) databaseEl.textContent = metadata.database;
  if (entityCountEl) entityCountEl.textContent = metadata.entityCount.toString();
  if (relationshipCountEl) relationshipCountEl.textContent = metadata.relationshipCount.toString();

  // Hide upload zone and errors, show success
  if (uploadZone) uploadZone.hidden = true;
  if (uploadErrors) uploadErrors.hidden = true;
  if (uploadSuccess) uploadSuccess.hidden = false;

  console.log('File uploaded successfully:', metadata.fileName);
}

/**
 * Display validation errors
 * @param errors - Array of error messages
 */
function displayErrors(errors: string[]): void {
  const errorListEl = document.getElementById('error-list');
  if (!errorListEl) return;

  // Clear previous errors
  errorListEl.innerHTML = '';

  // Create error message list
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-messages';

  const title = document.createElement('p');
  title.className = 'error-title';
  title.textContent = `Validation failed with ${errors.length} error${errors.length > 1 ? 's' : ''}:`;
  errorContainer.appendChild(title);

  errors.forEach((error) => {
    const errorItem = document.createElement('pre');
    errorItem.className = 'error-item';
    errorItem.textContent = error;
    errorContainer.appendChild(errorItem);
  });

  errorListEl.appendChild(errorContainer);

  // Hide other states, show errors
  if (uploadZone) uploadZone.hidden = true;
  if (uploadSuccess) uploadSuccess.hidden = true;
  if (uploadErrors) uploadErrors.hidden = false;

  console.error('Validation errors:', errors);
}

/**
 * Clear upload state and reset UI
 */
function clearUploadState(): void {
  clearModel();

  // Clear and hide canvas
  clearCanvas();
  hideCanvas();

  // Reset file input
  if (fileInput) {
    fileInput.value = '';
  }

  // Hide success and errors, show upload zone
  if (uploadZone) {
    uploadZone.hidden = false;
    uploadZone.classList.remove('drag-over');
  }
  if (uploadSuccess) uploadSuccess.hidden = true;
  if (uploadErrors) uploadErrors.hidden = true;

  // Hide entity selection controls
  const entitySelection = document.getElementById('entity-selection');
  if (entitySelection) entitySelection.hidden = true;

  console.log('Upload state cleared');
}

/**
 * Show/hide loading indicator
 * @param show - true to show loading, false to hide
 */
function showLoading(show: boolean): void {
  if (loadingIndicator) {
    loadingIndicator.hidden = !show;
  }

  // Disable upload controls during loading
  if (uploadButton) {
    uploadButton.disabled = show;
  }
  if (fileInput) {
    fileInput.disabled = show;
  }
}
