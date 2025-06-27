import { useState } from 'react';
import { parseLocationText } from '../utils/textParser';
import { validateAdditions } from '../utils/validation';

export const useMapData = () => {
  const [locations, setLocations] = useState({});
  const [paths, setPaths] = useState([]);
  const [waterways, setWaterways] = useState([]);
  const [regions, setRegions] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  // Undo functionality
  const saveStateToUndo = (action) => {
    const state = {
      locations: { ...locations },
      paths: [...paths],
      waterways: [...waterways],
      regions: [...regions],
      action,
      timestamp: Date.now()
    };
    setUndoStack(prev => [...prev.slice(-9), state]); // Keep last 10 actions
  };

  const undo = () => {
    if (undoStack.length === 0) return false;
    
    const lastState = undoStack[undoStack.length - 1];
    setLocations(lastState.locations);
    setPaths(lastState.paths);
    setWaterways(lastState.waterways);
    setRegions(lastState.regions);
    setUndoStack(prev => prev.slice(0, -1));
    return true;
  };

  // Delete functions
  const deleteLocation = (locationName) => {
    saveStateToUndo(`delete location: ${locationName}`);
    
    // Remove the location
    setLocations(prev => {
      const newLocations = { ...prev };
      delete newLocations[locationName];
      return newLocations;
    });
    
    // Remove paths connected to this location
    setPaths(prev => prev.filter(path => 
      path.from !== locationName && path.to !== locationName
    ));
    
    // Remove waterways connected to this location
    setWaterways(prev => prev.filter(waterway => 
      waterway.from !== locationName && waterway.to !== locationName
    ));
  };

  const deletePath = (pathId) => {
    saveStateToUndo(`delete path: ${pathId}`);
    setPaths(prev => prev.filter(path => path.id !== pathId));
  };

  const deleteWaterway = (waterwayId) => {
    saveStateToUndo(`delete waterway: ${waterwayId}`);
    setWaterways(prev => prev.filter(waterway => waterway.id !== waterwayId));
  };

  const deleteRegion = (regionId) => {
    saveStateToUndo(`delete region: ${regionId}`);
    setRegions(prev => prev.filter(region => region.id !== regionId));
  };

  const renameLocation = (oldName, newName) => {
    if (!newName.trim() || oldName === newName.trim()) return false;
    
    saveStateToUndo(`rename location: ${oldName} to ${newName}`);
    
    // Update location name
    setLocations(prev => {
      const newLocations = { ...prev };
      newLocations[newName.trim()] = { ...newLocations[oldName] };
      delete newLocations[oldName];
      return newLocations;
    });
    
    // Update paths that reference this location
    setPaths(prev => prev.map(path => ({
      ...path,
      from: path.from === oldName ? newName.trim() : path.from,
      to: path.to === oldName ? newName.trim() : path.to
    })));
    
    // Update waterways that reference this location
    setWaterways(prev => prev.map(waterway => ({
      ...waterway,
      from: waterway.from === oldName ? newName.trim() : waterway.from,
      to: waterway.to === oldName ? newName.trim() : waterway.to
    })));
    
    return true;
  };

  const addLocations = (inputText, options = {}) => {
    if (!inputText.trim()) {
      return { success: false, error: 'No input text provided' };
    }

    const parsed = parseLocationText(inputText);
    const validation = validateAdditions(parsed, locations);
    
    if (options.skipValidation || (validation.issues.length === 0 && validation.warnings.length === 0)) {
      applyParsedData(parsed);
      return { success: true };
    }
    
    return {
      success: false,
      validation,
      parsed
    };
  };

  const applyParsedData = (parsedData) => {
    // Save current state before making changes
    saveStateToUndo('add locations from text');
    
    const { relationships, pathRelationships, waterwayRelationships, locationRenamings } = parsedData;
    const newLocations = { ...locations };
    
    const processedPaths = new Set();
    const processedWaterways = new Set();
    const finalPaths = [...paths];
    const finalWaterways = [...waterways];

    // Process location relationships
    relationships.forEach(rel => {
      if (rel.type === 'directional') {
        if (!newLocations[rel.reference]) {
          newLocations[rel.reference] = { x: 0, y: 0, type: 'reference', metadata: '' };
        }
        
        const refPos = newLocations[rel.reference];
        const offset = getDirectionalOffset(rel.direction, rel.distance);
        
        if (!newLocations[rel.location]) {
          newLocations[rel.location] = {
            x: refPos.x + offset.x,
            y: refPos.y + offset.y,
            type: 'positioned',
            metadata: ''
          };
        }
      } else if (rel.type === 'nearby') {
        if (!newLocations[rel.reference]) {
          newLocations[rel.reference] = { x: 0, y: 0, type: 'reference', metadata: '' };
        }
        
        const refPos = newLocations[rel.reference];
        
        if (!newLocations[rel.location]) {
          newLocations[rel.location] = {
            x: refPos.x + (Math.random() - 0.5) * 60,
            y: refPos.y + (Math.random() - 0.5) * 60,
            type: 'nearby',
            metadata: ''
          };
        }
      } else if (rel.type === 'between') {
        if (!newLocations[rel.reference1]) {
          newLocations[rel.reference1] = { x: -50, y: 0, type: 'reference', metadata: '' };
        }
        if (!newLocations[rel.reference2]) {
          newLocations[rel.reference2] = { x: 50, y: 0, type: 'reference', metadata: '' };
        }
        
        const pos1 = newLocations[rel.reference1];
        const pos2 = newLocations[rel.reference2];
        
        if (!newLocations[rel.location]) {
          newLocations[rel.location] = {
            x: (pos1.x + pos2.x) / 2,
            y: (pos1.y + pos2.y) / 2,
            type: 'between',
            metadata: ''
          };
        }
      }
    });

    // Process path relationships
    pathRelationships.forEach(pathRel => {
      if (!newLocations[pathRel.from]) {
        newLocations[pathRel.from] = { 
          x: (Math.random() - 0.5) * 200, 
          y: (Math.random() - 0.5) * 200, 
          type: 'reference',
          metadata: ''
        };
      }
      if (!newLocations[pathRel.to]) {
        newLocations[pathRel.to] = { 
          x: (Math.random() - 0.5) * 200, 
          y: (Math.random() - 0.5) * 200, 
          type: 'reference',
          metadata: ''
        };
      }

      const pathExists = finalPaths.some(path => 
        (path.from === pathRel.from && path.to === pathRel.to) ||
        (path.from === pathRel.to && path.to === pathRel.from)
      );

      if (!pathExists) {
        const newPath = {
          id: `${pathRel.from}-${pathRel.to}-${Date.now()}`,
          from: pathRel.from,
          to: pathRel.to,
          type: pathRel.pathType || 'road',
          name: pathRel.name,
          metadata: ''
        };
        finalPaths.push(newPath);
      }
    });

    // Process waterway relationships
    waterwayRelationships.forEach(waterwayRel => {
      if (!newLocations[waterwayRel.from]) {
        newLocations[waterwayRel.from] = { 
          x: (Math.random() - 0.5) * 200, 
          y: (Math.random() - 0.5) * 200, 
          type: 'reference',
          metadata: ''
        };
      }
      if (!newLocations[waterwayRel.to]) {
        newLocations[waterwayRel.to] = { 
          x: (Math.random() - 0.5) * 200, 
          y: (Math.random() - 0.5) * 200, 
          type: 'reference',
          metadata: ''
        };
      }

      const waterwayExists = finalWaterways.some(waterway => 
        (waterway.from === waterwayRel.from && waterway.to === waterwayRel.to) ||
        (waterway.from === waterwayRel.to && waterway.to === waterwayRel.from)
      );

      if (!waterwayExists) {
        const newWaterway = {
          id: `${waterwayRel.from}-${waterwayRel.to}-waterway-${Date.now()}`,
          from: waterwayRel.from,
          to: waterwayRel.to,
          type: waterwayRel.waterwayType || 'river',
          name: waterwayRel.name,
          metadata: ''
        };
        finalWaterways.push(newWaterway);
      }
    });

    // Process location renamings
    locationRenamings.forEach(renaming => {
      const existingLocationKey = Object.keys(newLocations).find(key => {
        const keyLower = key.toLowerCase();
        const renamingLower = renaming.oldName.toLowerCase();
        return keyLower === renamingLower || keyLower.includes(renamingLower) || renamingLower.includes(keyLower);
      });
      
      if (existingLocationKey) {
        const locationData = { ...newLocations[existingLocationKey] };
        delete newLocations[existingLocationKey];
        newLocations[renaming.newName] = locationData;
        
        // Update paths and waterways
        finalPaths.forEach(path => {
          if (path.from === existingLocationKey) path.from = renaming.newName;
          if (path.to === existingLocationKey) path.to = renaming.newName;
        });
        
        finalWaterways.forEach(waterway => {
          if (waterway.from === existingLocationKey) waterway.from = renaming.newName;
          if (waterway.to === existingLocationKey) waterway.to = renaming.newName;
        });
      }
    });

    setLocations(newLocations);
    setPaths(finalPaths);
    setWaterways(finalWaterways);
  };

  const getDirectionalOffset = (direction, distance = 1) => {
    const scale = distance * 50;
    const directions = {
      north: { x: 0, y: -scale },
      south: { x: 0, y: scale },
      east: { x: scale, y: 0 },
      west: { x: -scale, y: 0 },
      northeast: { x: scale * 0.7, y: -scale * 0.7 },
      northwest: { x: -scale * 0.7, y: -scale * 0.7 },
      southeast: { x: scale * 0.7, y: scale * 0.7 },
      southwest: { x: -scale * 0.7, y: scale * 0.7 }
    };
    return directions[direction] || { x: 0, y: 0 };
  };

  const removeLastAddition = () => {
    const locationKeys = Object.keys(locations);
    if (locationKeys.length > 0) {
      const lastKey = locationKeys[locationKeys.length - 1];
      const newLocations = { ...locations };
      delete newLocations[lastKey];
      setLocations(newLocations);
    }
  };

  const clearAllLocations = () => {
    if (window.confirm('Are you sure you want to clear all locations?')) {
      setLocations({});
      setPaths([]);
      setWaterways([]);
      setRegions([]);
    }
  };

  const completeRegion = (regionPoints, name, color = '#3B82F6', opacity = 0.3) => {
    if (regionPoints.length < 3) {
      alert('A region needs at least 3 points.');
      return false;
    }

    const newRegion = {
      id: `region-${Date.now()}`,
      name: name || `Region ${regions.length + 1}`,
      type: 'custom',
      points: regionPoints,
      color: color,
      opacity: opacity,
      metadata: ''
    };

    setRegions(prev => [...prev, newRegion]);
    return true;
  };

  return {
    locations,
    setLocations,
    paths,
    setPaths,
    waterways,
    setWaterways,
    regions,
    setRegions,
    addLocations,
    removeLastAddition,
    clearAllLocations,
    completeRegion,
    undo,
    undoStack,
    deleteLocation,
    deletePath,
    deleteWaterway,
    deleteRegion,
    renameLocation
  };
};