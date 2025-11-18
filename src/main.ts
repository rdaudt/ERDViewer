/**
 * ERD Viewer - Main Application Entry Point
 *
 * This file initializes the application and performs basic setup.
 */

import './styles.css';
import { initValidator } from './validation';
import { initFileUpload } from './fileUpload';
import { initCanvas, renderModel, getCanvas } from './renderer';
import { setLineStyle, setSelectedSubjectArea, selectAllEntities, clearSelection, getSelectionCount, getSelectedSubjectArea, getSelectedEntityNames } from './state';
import { getModel } from './state';
import type { LineStyle } from './relationships';
import { initInteractions, zoomIn, zoomOut, resetView } from './interactions';
import type { SubjectAreaInfo } from './types';
import { resetCanvasTransform, clearEntityPositionOverrides } from './state';
import { getEntitiesForSubjectArea } from './subjectAreas';

/**
 * Check if the browser supports required modern features.
 * @returns true if browser is compatible, false otherwise
 */
function checkBrowserCompatibility(): boolean {
  const requiredFeatures = {
    'ES2020 Optional Chaining': () => {
      const obj: { a?: { b?: string } } = {};
      return obj?.a?.b === undefined;
    },
    'ES2020 Nullish Coalescing': () => {
      const value = null ?? 'default';
      return value === 'default';
    },
    'File API': () => typeof File !== 'undefined' && typeof FileReader !== 'undefined',
    'Canvas API': () => {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    },
  };

  const unsupportedFeatures: string[] = [];

  for (const [featureName, checkFn] of Object.entries(requiredFeatures)) {
    try {
      if (!checkFn()) {
        unsupportedFeatures.push(featureName);
      }
    } catch {
      unsupportedFeatures.push(featureName);
    }
  }

  if (unsupportedFeatures.length > 0) {
    const message = `
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; font-family: sans-serif; text-align: center; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px;">
        <h2 style="color: #856404;">Browser Not Supported</h2>
        <p>Your browser does not support the following required features:</p>
        <ul style="text-align: left; display: inline-block;">
          ${unsupportedFeatures.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <p><strong>Please use a modern browser:</strong></p>
        <p>Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+</p>
      </div>
    `;
    document.body.innerHTML = message;
    return false;
  }

  return true;
}

/**
 * Initialize line style selector.
 */
function initLineStyleSelector(): void {
  const selector = document.getElementById('line-style-selector') as HTMLSelectElement;
  if (!selector) {
    console.warn('Line style selector not found');
    return;
  }

  selector.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    const lineStyle = target.value as LineStyle;

    // Update state
    setLineStyle(lineStyle);

    // Re-render the diagram if a model is loaded
    const model = getModel();
    if (model) {
      renderModel(model);
    }

    console.log(`Line style changed to: ${lineStyle}`);
  });
}

/**
 * Initialize zoom controls.
 */
function initZoomControls(): void {
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const resetViewBtn = document.getElementById('reset-view-btn');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', zoomIn);
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', zoomOut);
  }

  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', resetView);
  }
}

/**
 * Populate the subject area dropdown with available subject areas.
 * @param areas - Array of subject area info objects
 */
export function populateSubjectAreaSelector(areas: SubjectAreaInfo[]): void {
  const dropdown = document.getElementById('subject-area-dropdown') as HTMLSelectElement;
  const container = document.getElementById('subject-area-selector');

  if (!dropdown || !container) {
    console.warn('Subject area selector elements not found');
    return;
  }

  // Clear existing options
  dropdown.innerHTML = '';

  // Add options for each subject area
  for (const area of areas) {
    const option = document.createElement('option');
    option.value = area.isSynthetic ? '' : area.name;  // Empty string for "All"
    option.textContent = `${area.name} (${area.entityCount} entities)`;
    dropdown.appendChild(option);
  }

  // Show the selector
  container.hidden = false;
}

/**
 * Initialize subject area selector event handler.
 */
function initSubjectAreaSelector(): void {
  const dropdown = document.getElementById('subject-area-dropdown') as HTMLSelectElement;
  if (!dropdown) {
    console.warn('Subject area dropdown not found');
    return;
  }

  dropdown.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    const areaName = selectedValue === '' ? null : selectedValue;

    console.log(`Subject area changed to: ${areaName || 'All'}`);

    // Update state
    setSelectedSubjectArea(areaName);

    // Reset view (zoom, pan, entity positions)
    resetCanvasTransform();
    clearEntityPositionOverrides();

    // Get model for repopulating dropdown and filtering
    const model = getModel();
    if (model) {
      // Repopulate entity selection dropdown with new subject area's entities
      populateEntitySelectionDropdown();

      // Re-render the diagram with filtered data
      renderModel(model);

      // Update selection count display
      updateSelectionCountDisplay();
    }
  });

  // Hide by default (shown after model load)
  const container = document.getElementById('subject-area-selector');
  if (container) {
    container.hidden = true;
  }
}

/**
 * Update the selection count display
 */
export function updateSelectionCountDisplay(): void {
  const countDisplay = document.getElementById('selection-count');
  if (countDisplay) {
    const count = getSelectionCount();
    countDisplay.textContent = `${count} entities selected`;
  }
}

/**
 * Populate the entity selection dropdown with entities from current subject area
 */
export function populateEntitySelectionDropdown(): void {
  const dropdown = document.getElementById('entity-selection-dropdown') as HTMLSelectElement;
  if (!dropdown) {
    console.warn('Entity selection dropdown not found');
    return;
  }

  const model = getModel();
  if (!model) return;

  // Get visible entities based on current subject area filter
  const selectedArea = getSelectedSubjectArea();
  const visibleEntities = getEntitiesForSubjectArea(model, selectedArea);

  // Clear existing options
  dropdown.innerHTML = '';

  // Add option for each entity
  for (const entity of visibleEntities) {
    const option = document.createElement('option');
    option.value = entity.name;
    option.textContent = entity.name;
    dropdown.appendChild(option);
  }

  // Select options that are in the current selection state
  const selectedEntityNames = getSelectedEntityNames();
  Array.from(dropdown.options).forEach(option => {
    option.selected = selectedEntityNames.has(option.value);
  });
}

/**
 * Initialize entity selection controls
 */
function initEntitySelectionControls(): void {
  const dropdown = document.getElementById('entity-selection-dropdown') as HTMLSelectElement;
  const selectAllBtn = document.getElementById('select-all-entities-btn');
  const deselectAllBtn = document.getElementById('deselect-all-entities-btn');
  const container = document.getElementById('entity-selection');

  if (!dropdown || !selectAllBtn || !deselectAllBtn || !container) {
    console.warn('Entity selection control elements not found');
    return;
  }

  // Flag to prevent dropdown change handler from running during programmatic changes
  let isProgrammaticChange = false;

  // Dropdown change handler
  dropdown.addEventListener('change', () => {
    // Skip if this is a programmatic change from Select All / Deselect All buttons
    if (isProgrammaticChange) {
      return;
    }

    const model = getModel();
    if (!model) return;

    // Get selected options from dropdown
    const selectedOptions = Array.from(dropdown.selectedOptions);
    const selectedNames = selectedOptions.map(opt => opt.value);

    // If selection changed significantly, clear position overrides
    const currentSelectionCount = getSelectionCount();
    const newSelectionCount = selectedNames.length;

    // Clear overrides if going from 0 to many, or if selection changed dramatically
    if (currentSelectionCount === 0 && newSelectionCount > 0) {
      clearEntityPositionOverrides();
      resetCanvasTransform();
    }

    // Update selection state
    selectAllEntities(selectedNames);

    // Update display and re-render
    updateSelectionCountDisplay();
    renderModel(model);
  });

  // Select All button
  selectAllBtn.addEventListener('click', () => {
    const model = getModel();
    if (!model) return;

    // Clear position overrides and reset view FIRST to ensure clean layout
    clearEntityPositionOverrides();
    resetCanvasTransform();

    // Get all entity names from dropdown
    const entityNames = Array.from(dropdown.options).map(opt => opt.value);

    // Update selection state
    selectAllEntities(entityNames);

    // Select all options in the dropdown (suppress change event)
    isProgrammaticChange = true;
    Array.from(dropdown.options).forEach(option => {
      option.selected = true;
    });
    isProgrammaticChange = false;

    updateSelectionCountDisplay();
    renderModel(model);
  });

  // Deselect All button
  deselectAllBtn.addEventListener('click', () => {
    // Clear selection state and entity position overrides
    clearSelection();
    clearEntityPositionOverrides();

    // Deselect all options in the dropdown (suppress change event)
    isProgrammaticChange = true;
    Array.from(dropdown.options).forEach(option => {
      option.selected = false;
    });
    isProgrammaticChange = false;

    updateSelectionCountDisplay();

    const model = getModel();
    if (model) {
      renderModel(model);
    }
  });

  // Hide by default (shown after model load)
  container.hidden = true;
}

/**
 * Initialize the application.
 */
async function initializeApp(): Promise<void> {
  console.log('ERD Viewer initialized successfully');
  console.log('Version: 1.0.0');
  console.log('Build tool: Vite');
  console.log('Language: TypeScript');

  try {
    // Initialize validator first
    await initValidator();
    console.log('Validator ready');

    // Initialize canvas renderer
    const canvasReady = initCanvas();
    if (!canvasReady) {
      throw new Error('Failed to initialize canvas');
    }
    console.log('Canvas ready');

    // Initialize file upload functionality
    initFileUpload();
    console.log('File upload ready');

    // Initialize line style selector
    initLineStyleSelector();
    console.log('Line style selector ready');

    // Initialize canvas interactions (zoom, pan, drag)
    const canvas = getCanvas();
    if (canvas) {
      initInteractions(canvas);
      console.log('Canvas interactions ready');
    }

    // Initialize zoom controls
    initZoomControls();
    console.log('Zoom controls ready');

    // Initialize subject area selector
    initSubjectAreaSelector();
    console.log('Subject area selector ready');

    // Initialize entity selection controls
    initEntitySelectionControls();
    console.log('Entity selection controls ready');
  } catch (error) {
    console.error('Initialization error:', error);

    // Display error to user
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #ef4444;">
          <h3>Initialization Error</h3>
          <p>${error instanceof Error ? error.message : 'Failed to initialize application'}</p>
          <p style="font-size: 0.875rem; color: #64748b;">Please refresh the page or check the console for details.</p>
        </div>
      `;
    }
  }
}

/**
 * Application entry point.
 * Runs when the DOM is fully loaded.
 */
function main(): void {
  // Check browser compatibility first
  if (!checkBrowserCompatibility()) {
    console.error('Browser compatibility check failed');
    return;
  }

  // Initialize the application
  initializeApp();
}

// Run the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  // DOM already loaded
  main();
}
