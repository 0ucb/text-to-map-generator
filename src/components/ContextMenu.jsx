import React, { useState } from 'react';
import { Trash2, Edit3, MapPin } from 'lucide-react';

const ContextMenu = ({ 
  contextMenu, 
  setContextMenu, 
  locations, 
  setLocations, 
  deleteLocation, 
  renameLocation 
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  if (!contextMenu) return null;

  const addLocationAtPosition = (name) => {
    if (!name.trim()) return;
    
    setLocations(prev => ({
      ...prev,
      [name.trim()]: {
        x: contextMenu.mapX,
        y: contextMenu.mapY,
        type: 'manual',
        metadata: ''
      }
    }));
    
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (contextMenu.locationName) {
      deleteLocation(contextMenu.locationName);
    }
    setContextMenu(null);
  };

  const handleRename = () => {
    setIsRenaming(true);
    setRenameValue(contextMenu.locationName || '');
  };

  const submitRename = () => {
    if (renameValue.trim() && contextMenu.locationName) {
      renameLocation(contextMenu.locationName, renameValue.trim());
    }
    setContextMenu(null);
    setIsRenaming(false);
  };

  // Location context menu (right-clicked on a location)
  if (contextMenu.locationName) {
    return (
      <div
        className="fixed bg-white border border-gray-300 rounded-lg shadow-lg py-1 z-50 min-w-32"
        style={{ left: contextMenu.x, top: contextMenu.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {isRenaming ? (
          <div className="px-3 py-2">
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitRename();
                }
                if (e.key === 'Escape') {
                  setContextMenu(null);
                  setIsRenaming(false);
                }
              }}
              onBlur={submitRename}
            />
          </div>
        ) : (
          <>
            <button
              onClick={handleRename}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 text-left"
            >
              <Edit3 className="w-4 h-4" />
              Rename
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 text-left"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        )}
      </div>
    );
  }

  // Empty space context menu (add new location)
  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-50"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          Add Location
        </div>
        <input
          type="text"
          placeholder="Location name..."
          className="w-40 text-sm border border-gray-300 rounded px-2 py-1"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addLocationAtPosition(e.target.value);
            }
            if (e.key === 'Escape') {
              setContextMenu(null);
            }
          }}
          onBlur={(e) => {
            if (e.target.value.trim()) {
              addLocationAtPosition(e.target.value);
            } else {
              setContextMenu(null);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ContextMenu;