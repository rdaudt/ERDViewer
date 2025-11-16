/**
 * ERD Viewer - Main Application Entry Point
 *
 * This file initializes the application and performs basic setup.
 */

import './styles.css';
import { initValidator } from './validation';
import { initFileUpload } from './fileUpload';
import { initCanvas, renderModel, getCanvas } from './renderer';
import { setLineStyle } from './state';
import { getModel } from './state';
import type { LineStyle } from './relationships';
import { initInteractions, zoomIn, zoomOut, resetView } from './interactions';

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
