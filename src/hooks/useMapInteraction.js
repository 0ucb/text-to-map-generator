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
      
      return newModes;
    });
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
    toggleMode
  };
};