// Search functionality for maps
export const performSearch = (query, locations, paths, waterways, regions) => {
  if (!query.trim()) {
    return null;
  }
  
  const lowerQuery = query.toLowerCase();
  const results = {
    locations: [],
    paths: [],
    waterways: [],
    regions: []
  };
  
  // Search locations
  Object.entries(locations).forEach(([name, data]) => {
    if (
      name.toLowerCase().includes(lowerQuery) ||
      data.type.toLowerCase().includes(lowerQuery) ||
      (data.metadata && data.metadata.toLowerCase().includes(lowerQuery))
    ) {
      results.locations.push({ name, ...data });
    }
  });
  
  // Search paths
  paths.forEach(path => {
    const pathName = path.name || `${path.from} → ${path.to}`;
    if (
      pathName.toLowerCase().includes(lowerQuery) ||
      path.type.toLowerCase().includes(lowerQuery) ||
      path.from.toLowerCase().includes(lowerQuery) ||
      path.to.toLowerCase().includes(lowerQuery) ||
      (path.metadata && path.metadata.toLowerCase().includes(lowerQuery))
    ) {
      results.paths.push(path);
    }
  });
  
  // Search waterways
  waterways.forEach(waterway => {
    const waterwayName = waterway.name || `${waterway.from} → ${waterway.to}`;
    if (
      waterwayName.toLowerCase().includes(lowerQuery) ||
      waterway.type.toLowerCase().includes(lowerQuery) ||
      waterway.from.toLowerCase().includes(lowerQuery) ||
      waterway.to.toLowerCase().includes(lowerQuery) ||
      (waterway.metadata && waterway.metadata.toLowerCase().includes(lowerQuery))
    ) {
      results.waterways.push(waterway);
    }
  });
  
  // Search regions
  regions.forEach(region => {
    if (
      region.name.toLowerCase().includes(lowerQuery) ||
      region.type.toLowerCase().includes(lowerQuery) ||
      (region.metadata && region.metadata.toLowerCase().includes(lowerQuery))
    ) {
      results.regions.push(region);
    }
  });
  
  return results;
};

// Focus on search result
export const focusOnItem = (item, locations, setOffset, setZoom, setSelectedItem, setShowMetadataPanel, zoom) => {
  let centerX, centerY;
  
  if (item.type === 'location') {
    const loc = locations[item.name];
    centerX = loc.x;
    centerY = loc.y;
  } else if (item.type === 'path' || item.type === 'waterway') {
    const fromLoc = locations[item.from];
    const toLoc = locations[item.to];
    if (fromLoc && toLoc) {
      centerX = (fromLoc.x + toLoc.x) / 2;
      centerY = (fromLoc.y + toLoc.y) / 2;
    }
  } else if (item.type === 'region') {
    const centroid = item.points.reduce((acc, point) => ({
      x: acc.x + point.x / item.points.length,
      y: acc.y + point.y / item.points.length
    }), { x: 0, y: 0 });
    centerX = centroid.x;
    centerY = centroid.y;
  }
  
  if (centerX !== undefined && centerY !== undefined) {
    // Center the view on the item
    setOffset({
      x: -centerX * zoom,
      y: -centerY * zoom
    });
    
    // Select the item
    setSelectedItem(item);
    setShowMetadataPanel(true);
    
    // Flash zoom for visual feedback
    const originalZoom = zoom;
    setZoom(zoom * 1.2);
    setTimeout(() => setZoom(originalZoom), 200);
  }
};