import React from 'react';

const ContextMenu = ({ contextMenu, setContextMenu, locations, setLocations }) => {
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

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-50"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-2">
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