// Map calculation utilities

// Convert map coordinates to screen coordinates
export const toScreen = (mapX, mapY, zoom, offset) => ({
  x: (mapX * zoom) + offset.x + 400,
  y: (mapY * zoom) + offset.y + 300
});

// Convert screen coordinates back to map coordinates
export const toMap = (screenX, screenY, zoom, offset) => ({
  x: (screenX - offset.x - 400) / zoom,
  y: (screenY - offset.y - 300) / zoom
});

// Calculate position based on direction
export const getDirectionalOffset = (direction, distance = 1) => {
  const scale = distance * 50; // 50 pixels per unit
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

// Check if a point is inside a polygon
export const isPointInPolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

// Classify feature type based on name
export const classifyFeatureType = (name) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('mountain') || lowerName.includes('range') || lowerName.includes('peak') || lowerName.includes('summit')) {
    return { type: 'mountain', isArea: true };
  }
  if (lowerName.includes('river') || lowerName.includes('stream') || lowerName.includes('creek') || lowerName.includes('brook')) {
    return { type: 'waterway', isArea: false };
  }
  if (lowerName.includes('lake') || lowerName.includes('sea') || lowerName.includes('ocean') || lowerName.includes('bay')) {
    return { type: 'water_body', isArea: true };
  }
  if (lowerName.includes('forest') || lowerName.includes('woods') || lowerName.includes('jungle')) {
    return { type: 'forest', isArea: true };
  }
  if (lowerName.includes('desert') || lowerName.includes('plains') || lowerName.includes('prairie') || lowerName.includes('valley')) {
    return { type: 'terrain', isArea: true };
  }
  if (lowerName.includes('park') || lowerName.includes('reserve') || lowerName.includes('monument')) {
    return { type: 'protected_area', isArea: true };
  }
  if (lowerName.includes('highway') || lowerName.includes('interstate') || lowerName.includes('route') || lowerName.includes('road')) {
    return { type: 'infrastructure', isArea: false };
  }
  if (lowerName.includes('airport') || lowerName.includes('port') || lowerName.includes('station')) {
    return { type: 'transport_hub', isArea: false };
  }
  if (lowerName.includes('city') || lowerName.includes('town') || lowerName.includes('village') || lowerName.includes('settlement')) {
    return { type: 'urban', isArea: false };
  }
  
  return { type: 'settlement', isArea: false };
};

// String similarity function
export const stringSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

// Levenshtein distance function for string similarity
const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Optimize map layout
export const optimizeMapLayout = (locations, paths, waterways, strategy) => {
  const locationNames = Object.keys(locations);
  if (locationNames.length === 0) return locations;
  
  const newLocations = { ...locations };
  
  switch (strategy) {
    case 'circular':
      // Arrange in a circle
      const radius = Math.max(200, locationNames.length * 30);
      locationNames.forEach((name, index) => {
        const angle = (index / locationNames.length) * 2 * Math.PI;
        newLocations[name] = {
          ...newLocations[name],
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        };
      });
      break;
      
    case 'grid':
      // Arrange in a grid
      const cols = Math.ceil(Math.sqrt(locationNames.length));
      const spacing = 150;
      locationNames.forEach((name, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        newLocations[name] = {
          ...newLocations[name],
          x: (col - cols / 2) * spacing,
          y: (row - Math.ceil(locationNames.length / cols) / 2) * spacing
        };
      });
      break;
      
    case 'organic':
      // Force-directed layout simulation
      const iterations = 50;
      const repulsion = 10000;
      const attraction = 0.01;
      const allConnections = [...paths, ...waterways];
      
      for (let iter = 0; iter < iterations; iter++) {
        const forces = {};
        
        // Initialize forces
        locationNames.forEach(name => {
          forces[name] = { x: 0, y: 0 };
        });
        
        // Repulsion between all nodes
        for (let i = 0; i < locationNames.length; i++) {
          for (let j = i + 1; j < locationNames.length; j++) {
            const name1 = locationNames[i];
            const name2 = locationNames[j];
            const dx = newLocations[name2].x - newLocations[name1].x;
            const dy = newLocations[name2].y - newLocations[name1].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = repulsion / (dist * dist);
            
            forces[name1].x -= (dx / dist) * force;
            forces[name1].y -= (dy / dist) * force;
            forces[name2].x += (dx / dist) * force;
            forces[name2].y += (dy / dist) * force;
          }
        }
        
        // Attraction along paths
        allConnections.forEach(connection => {
          if (newLocations[connection.from] && newLocations[connection.to]) {
            const dx = newLocations[connection.to].x - newLocations[connection.from].x;
            const dy = newLocations[connection.to].y - newLocations[connection.from].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = dist * attraction;
            
            forces[connection.from].x += (dx / dist) * force;
            forces[connection.from].y += (dy / dist) * force;
            forces[connection.to].x -= (dx / dist) * force;
            forces[connection.to].y -= (dy / dist) * force;
          }
        });
        
        // Apply forces
        locationNames.forEach(name => {
          newLocations[name] = {
            ...newLocations[name],
            x: newLocations[name].x + forces[name].x * 0.1,
            y: newLocations[name].y + forces[name].y * 0.1
          };
        });
      }
      break;
  }
  
  return newLocations;
};