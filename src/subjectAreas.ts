/**
 * Subject Area Detection and Filtering
 *
 * This module handles detection of subject areas from ERDV models,
 * creates the synthetic "All" area, and provides filtering functions
 * for entities and relationships based on selected subject areas.
 */

import type { ERDVModel, Entity, Relationship, SubjectAreaInfo } from './types';
import { getModel } from './state';

/**
 * Detect subject areas from an ERDV model and create the synthetic "All" area.
 * @param model - The ERDV model to analyze
 * @returns Array of SubjectAreaInfo objects with "All" first
 */
export function detectSubjectAreas(model: ERDVModel): SubjectAreaInfo[] {
  const areas: SubjectAreaInfo[] = [];

  // Create synthetic "All" subject area containing all entities
  const allEntityNames = model.entities.map(e => e.name);
  areas.push({
    name: 'All',
    entityCount: allEntityNames.length,
    entityNames: allEntityNames,
    isSynthetic: true,
  });

  // Create entity name set for validation
  const validEntityNames = new Set(allEntityNames);

  // Process explicit subject areas from the model
  for (const subjectArea of model.subject_areas) {
    // Validate entity references
    const validNames: string[] = [];
    for (const entityName of subjectArea.entity_names) {
      if (validEntityNames.has(entityName)) {
        validNames.push(entityName);
      } else {
        console.warn(
          `Subject area '${subjectArea.name}' references non-existent entity: '${entityName}'`
        );
      }
    }

    // Add subject area with validated entity names
    areas.push({
      name: subjectArea.name,
      entityCount: validNames.length,
      entityNames: validNames,
      isSynthetic: false,
    });
  }

  return areas;
}

// Cache for detected subject areas
let cachedSubjectAreas: SubjectAreaInfo[] | null = null;
let cachedModelTimestamp: Date | null = null;

/**
 * Get available subject areas for the current model.
 * Results are cached for performance.
 * @returns Array of SubjectAreaInfo objects with "All" first
 */
export function getAvailableSubjectAreas(): SubjectAreaInfo[] {
  const model = getModel();
  if (!model) {
    return [];
  }

  // Check if we need to refresh the cache
  // (Simple cache invalidation - could be improved with model hash)
  if (!cachedSubjectAreas || cachedModelTimestamp !== model.metadata.model_name) {
    cachedSubjectAreas = detectSubjectAreas(model);
    cachedModelTimestamp = model.metadata.model_name as any; // Using model_name as cache key
  }

  return cachedSubjectAreas;
}

/**
 * Get entities for a specific subject area.
 * @param model - The ERDV model
 * @param areaName - The subject area name, or null for "All"
 * @returns Array of entities in the subject area
 */
export function getEntitiesForSubjectArea(
  model: ERDVModel,
  areaName: string | null
): Entity[] {
  // If "All" (null), return all entities
  if (areaName === null) {
    return model.entities;
  }

  // Get subject area info
  const areas = detectSubjectAreas(model);
  const area = areas.find(a => a.name === areaName);
  if (!area) {
    console.warn(`Subject area '${areaName}' not found`);
    return [];
  }

  // Filter entities by name
  const entityNameSet = new Set(area.entityNames);
  return model.entities.filter(entity => entityNameSet.has(entity.name));
}

/**
 * Get relationships for a specific subject area.
 * Only includes relationships where both parent AND child are in the subject area.
 * @param model - The ERDV model
 * @param areaName - The subject area name, or null for "All"
 * @param entities - The filtered entities in the subject area (for performance)
 * @returns Array of relationships within the subject area
 */
export function getRelationshipsForSubjectArea(
  model: ERDVModel,
  areaName: string | null,
  entities: Entity[]
): Relationship[] {
  // If "All" (null), return all relationships
  if (areaName === null) {
    return model.relationships;
  }

  // Create entity name lookup set for performance
  const entityNames = new Set(entities.map(e => e.name));

  // Filter relationships where both ends are in the entity set
  return model.relationships.filter(relationship => {
    const parentInArea = entityNames.has(relationship.parent_entity_name);
    const childInArea = entityNames.has(relationship.child_entity_name);
    return parentInArea && childInArea;
  });
}
