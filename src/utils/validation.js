// Validation utilities for map additions

import { classifyFeatureType, stringSimilarity } from './mapCalculations';

export const validateAdditions = (parsedData, existingLocations) => {
  const issues = [];
  const warnings = [];
  const duplicates = [];
  
  const allNames = Object.keys(existingLocations);
  
  // Check for parsing errors
  parsedData.relationships.forEach((rel, index) => {
    // Check if location names contain connection words (parsing error)
    const connectionWords = ['interstate', 'highway', 'route', 'road', 'path', 'connects', 'between'];
    if (connectionWords.some(word => rel.location?.toLowerCase().includes(word))) {
      issues.push({
        type: 'parsing_error',
        message: `"${rel.location}" appears to be a connection description, not a location name`,
        item: rel.location,
        index
      });
    }
  });
  
  // Check for duplicates and similar names
  parsedData.relationships.forEach(rel => {
    if (rel.location) {
      const similar = allNames.find(existing => {
        const sim = stringSimilarity(rel.location.toLowerCase(), existing.toLowerCase());
        return sim > 0.8 && rel.location.toLowerCase() !== existing.toLowerCase();
      });
      if (similar) {
        duplicates.push({
          type: 'duplicate',
          message: `"${rel.location}" is very similar to existing "${similar}"`,
          new: rel.location,
          existing: similar
        });
      }
    }
  });
  
  // Check geographic feature classification
  parsedData.relationships.forEach(rel => {
    if (rel.location) {
      const classification = classifyFeatureType(rel.location);
      if (classification.isArea && rel.type === 'positioned') {
        warnings.push({
          type: 'area_feature',
          message: `"${rel.location}" appears to be a ${classification.type} (area feature) but is being placed as a single point`,
          item: rel.location,
          classification
        });
      }
    }
  });
  
  // Check for unrealistic distances
  parsedData.relationships.forEach(rel => {
    if (rel.type === 'directional' && rel.distance) {
      if (rel.distance > 50) {
        warnings.push({
          type: 'large_distance',
          message: `Distance of ${rel.distance} miles between "${rel.location}" and "${rel.reference}" may not fit well in view`,
          item: rel.location
        });
      }
    }
  });
  
  return { issues, warnings, duplicates };
};
