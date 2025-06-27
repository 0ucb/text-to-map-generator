import { useState } from 'react';

export const useMapInteraction = () => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  
  // Editing states
  const [editingStates, setEditingStates] = useState({
    editingPath: null,
    editingWaterway: null,
    editingLocation: null,
    editingRegion: null
  });

  // Mode states
  const [modes, setModes] = useState({
    pathMode: false,
    waterwayMode: false,
    regionMode: false,
    selectedNode: null
  });

  // Region creation state
  const [regionPoints, setRegionPoints] = useState([]);

  // Search state
  const [searchState, setSearchState] = useState({
    query: '',
    results: null
  });

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
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
      
      // Clear region points when exiting region mode
      if (modeName === 'regionMode' && prev.regionMode) {
        setRegionPoints([]);
      }
      
      return newModes;
    });
  };

  const addRegionPoint = (point) => {
    setRegionPoints(prev => [...prev, point]);
  };

  const clearRegionPoints = () => {
    setRegionPoints([]);
  };

  return {
    zoom,
    setZoom,
    offset,
    setOffset,
    selectedItem,
    setSelectedItem,
    contextMenu,
    setContextMenu,
    editingStates,
    setEditingStates,
    modes,
    setModes,
    searchState,
    setSearchState,
    resetView,
    toggleMode,
    regionPoints,
    setRegionPoints,
    addRegionPoint,
    clearRegionPoints
  };
};