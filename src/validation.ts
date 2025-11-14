/**
 * JSON Schema Validation Module
 *
 * Validates .erdv files against erdv_file_spec.json using ajv.
 */

import Ajv, { type ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import type { ERDVModel } from './types';

let validator: Ajv | null = null;
let validatorReady = false;

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[] | null;
  data?: ERDVModel;
}

/**
 * Initialize the validator by loading the schema and setting up ajv
 * @returns Promise that resolves when validator is ready
 */
export async function initValidator(): Promise<void> {
  try {
    // Fetch the schema file from GitHub raw content
    // This provides reliable CORS-enabled access to the public schema file
    const schemaUrl = 'https://raw.githubusercontent.com/rdaudt/ERDViewer/main/erdv_file_spec.json';

    const response = await fetch(schemaUrl);
    if (!response.ok) {
      throw new Error(`Failed to load schema: ${response.statusText}`);
    }

    const schema = await response.json();

    // Initialize ajv with strict mode and all errors
    // validateSchema: false prevents ajv from trying to validate the schema itself
    // against the JSON Schema Draft 2020-12 meta-schema
    validator = new Ajv({
      strict: true,
      allErrors: true,
      verbose: true,
      validateSchema: false,
    });

    // Add format validators
    addFormats(validator);

    // Compile the schema
    validator.compile(schema);

    validatorReady = true;
    console.log('Validator initialized successfully');
  } catch (error) {
    console.error('Failed to initialize validator:', error);
    throw new Error(
      'Could not load validation schema from remote source. Please check your internet connection.'
    );
  }
}

/**
 * Check if validator is ready
 * @returns true if validator is initialized
 */
export function isValidatorReady(): boolean {
  return validatorReady;
}

/**
 * Validate data against the ERD schema
 * @param data - Parsed JSON data to validate
 * @returns ValidationResult with validation status and formatted errors
 */
export function validateModel(data: unknown): ValidationResult {
  if (!validator || !validatorReady) {
    return {
      valid: false,
      errors: ['Validator not initialized. Please refresh the page.'],
    };
  }

  try {
    const valid = validator.validate('https://example.com/schemas/erd-model.schema.json', data);

    if (valid) {
      return {
        valid: true,
        errors: null,
        data: data as ERDVModel,
      };
    }

    const errors = validator.errors || [];
    const formattedErrors = formatErrors(errors);

    return {
      valid: false,
      errors: formattedErrors,
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      valid: false,
      errors: ['Unexpected validation error. See console for details.'],
    };
  }
}

/**
 * Format ajv errors into user-friendly messages
 * @param errors - Array of ajv ErrorObject
 * @returns Array of formatted error messages
 */
function formatErrors(errors: ErrorObject[]): string[] {
  return errors.map((error, index) => {
    const path = formatPath(error.instancePath, error.params);
    const message = formatMessage(error);

    return `${index + 1}. ${message}\n   Path: ${path}`;
  });
}

/**
 * Format the JSON path for display
 * @param instancePath - ajv instance path
 * @param params - ajv error params
 * @returns Formatted path string
 */
function formatPath(instancePath: string, params: Record<string, unknown>): string {
  if (!instancePath || instancePath === '') {
    return 'root';
  }

  // Convert /entities/0/name to entities[0].name
  const formatted = instancePath
    .substring(1) // Remove leading /
    .replace(/\//g, '.')
    .replace(/\.(\d+)/g, '[$1]');

  return formatted || 'root';
}

/**
 * Format error message based on error type
 * @param error - ajv ErrorObject
 * @returns User-friendly error message
 */
function formatMessage(error: ErrorObject): string {
  const { keyword, message, params } = error;

  switch (keyword) {
    case 'required':
      return `Missing required property: ${params.missingProperty}`;

    case 'type':
      return `Invalid data type: expected ${params.type}, got ${typeof error.data}`;

    case 'pattern':
      if (params.pattern === '^[A-Za-z_][A-Za-z0-9_]*$') {
        return `Invalid identifier format (must start with letter/underscore, followed by letters/digits/underscores)`;
      }
      return `Pattern mismatch: ${message}`;

    case 'enum':
      return `Invalid value: must be one of ${JSON.stringify(params.allowedValues)}`;

    case 'minItems':
      return `Array too short: must have at least ${params.limit} items`;

    case 'minLength':
      return `String too short: must have at least ${params.limit} characters`;

    case 'minimum':
      return `Number too small: must be >= ${params.limit}`;

    case 'additionalProperties':
      return `Unexpected property: ${params.additionalProperty}`;

    case 'oneOf':
    case 'anyOf':
      return `Value does not match any of the expected schemas`;

    default:
      return message || 'Validation error';
  }
}
