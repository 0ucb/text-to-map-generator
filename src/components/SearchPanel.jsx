import React from 'react';
import { X } from 'lucide-react';

const SearchPanel = ({ 
  searchState, 
  setSearchState, 
  setShowSearchPanel, 
  locations,
  setSelectedItem,
  setShowMetadataPanel,
  setZoom,
  setOffset,
  zoom
}) => {
  const focusOnItem = (item) => {
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
      setOffset({
        x: -centerX * zoom,
        y: -centerY * zoom
      });
      
      setSelectedItem(item);
      setShowMetadataPanel(true);
      
      const originalZoom = zoom;
      setZoom(zoom * 1.2);
      setTimeout(() => setZoom(originalZoom), 200);
    }
  };

  if (!searchState.results) return null;

  return (
    <div className="absolute top-12 left-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-80 max-h-96 overflow-y-auto">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Search Results ({
              searchState.results.locations.length + 
              searchState.results.paths.length + 
              searchState.results.waterways.length + 
              searchState.results.regions.length
            })
          </h4>
          <button
            onClick={() => setShowSearchPanel(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Locations */}
        {searchState.results.locations.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs font-medium text-gray-600 mb-1">Locations ({searchState.results.locations.length})</h5>
            <div className="space-y-1">
              {searchState.results.locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    focusOnItem({ type: 'location', name: loc.name, ...loc });
                    setShowSearchPanel(false);
                  }}
                  className="w-full text-left px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between group"
                >
                  <span className="font-medium">{loc.name}</span>
                  <span className="text-gray-500 text-xs">{loc.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* No results */}
        {searchState.results.locations.length === 0 && 
         searchState.results.paths.length === 0 && 
         searchState.results.waterways.length === 0 && 
         searchState.results.regions.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No results found for "{searchState.query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;