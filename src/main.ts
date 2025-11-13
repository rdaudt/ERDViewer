/**
 * ERD Viewer - Main Application Entry Point
 *
 * This file initializes the application and performs basic setup.
 */

import './styles.css';

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
 * Initialize the application.
 */
function initializeApp(): void {
  console.log('ERD Viewer initialized successfully');
  console.log('Version: 1.0.0');
  console.log('Build tool: Vite');
  console.log('Language: TypeScript');

  // Log that the application is ready
  const uploadSection = document.getElementById('upload-section');
  const canvasSection = document.getElementById('canvas-section');

  if (uploadSection && canvasSection) {
    console.log('UI sections loaded:', {
      uploadSection: uploadSection.classList.contains('upload-section'),
      canvasSection: canvasSection.classList.contains('canvas-section'),
    });
  }

  // Future: Add event listeners for file upload, canvas interactions, etc.
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
