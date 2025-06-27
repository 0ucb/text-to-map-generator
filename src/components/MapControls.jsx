import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

const MapControls = ({
  zoom,
  setZoom,
  searchState,
  setSearchState,
  showSearchPanel,
  setShowSearchPanel,
  showChatPanel,
  setShowChatPanel,
  showMapData,
  setShowMapData,
  showHelp,
  setShowHelp,
  modes,
  setModes,
  removeLastAddition,
  clearAllLocations,
  locations,
  paths,
  waterways,
  regions
}) => {
  const resetView = () => {
    setZoom(1);
    // This would need access to setOffset if it was passed down
  };

  const toggleMode = (modeName) => {
    setModes(prev => {
      const newModes = {
        pathMode: false,
        waterwayMode: false,
        regionMode: false,
        selectedNode: null
      };
      
      if (!prev[modeName]) {
        newModes[modeName] = true;
      }
      
      return newModes;
    });
  };

  return (
    <div className="bg-white border-b p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mr-4">
          <div className="relative">
            <input
              type="text"
              value={searchState.query}
              onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
              onFocus={() => setShowSearchPanel(true)}
              placeholder="Search map..."
              className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchState.query && (
              <button
                onClick={() => {
                  setSearchState(prev => ({ ...prev, query: '', results: null }));
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setZoom(Math.min(zoom * 1.2, 20))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom / 1.2, 0.001))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-600">
          Zoom: {(zoom * 100).toFixed(zoom >= 10 ? 0 : zoom >= 1 ? 1 : zoom >= 0.1 ? 2 : zoom >= 0.01 ? 3 : 4)}%
        </span>
        
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        
        {/* Cleanup Tools */}
        <button
          onClick={removeLastAddition}
          disabled={Object.keys(locations).length === 0}
          className="p-2 hover:bg-gray-100 rounded text-sm disabled:opacity-50"
          title="Remove Last Addition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.333 4z" />
          </svg>
        </button>
        
        <button
          onClick={clearAllLocations}
          disabled={Object.keys(locations).length === 0}
          className="p-2 hover:bg-red-100 rounded text-sm text-red-600 disabled:opacity-50"
          title="Clear All"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        
        <button
          onClick={() => setShowChatPanel(!showChatPanel)}
          className={`p-2 rounded text-sm flex items-center gap-1 ${
            showChatPanel 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Chat with Claude"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Claude Chat
        </button>
        
        <button
          onClick={() => toggleMode('pathMode')}
          className={`p-2 rounded flex items-center gap-1 text-sm ${
            modes.pathMode 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {modes.pathMode ? 'Exit Path Mode' : 'Add Paths'}
        </button>
        
        <button
          onClick={() => toggleMode('waterwayMode')}
          className={`p-2 rounded flex items-center gap-1 text-sm ${
            modes.waterwayMode 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          {modes.waterwayMode ? 'Exit Waterway Mode' : 'Add Waterways'}
        </button>
        
        <button
          onClick={() => toggleMode('regionMode')}
          className={`p-2 rounded flex items-center gap-1 text-sm ${
            modes.regionMode 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {modes.regionMode ? 'Add Regions' : 'Add Regions'}
        </button>
        
        {(modes.pathMode || modes.waterwayMode || modes.regionMode) && (
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {modes.pathMode ? 'Click two locations to connect with path' : 
             modes.waterwayMode ? 'Click two locations to connect with waterway (flow direction)' :
             'Click on map or locations to define region boundaries (min 3 points)'}
          </span>
        )}
        
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        
        <button
          onClick={() => setShowMapData(!showMapData)}
          className="p-2 hover:bg-gray-100 rounded text-sm"
          title="View/Export Map Data"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 hover:bg-gray-100 rounded text-sm"
          title="Help & Syntax Guide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapControls;