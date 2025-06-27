import React from 'react';

const GridPattern = ({ zoom }) => {
  const baseGridSize = 50;
  const gridSize = baseGridSize * zoom;
  const smallGridSize = gridSize / 4;
  
  const smallOpacity = Math.min(0.4, 0.2 + zoom * 0.1);
  const majorOpacity = Math.min(0.6, 0.3 + zoom * 0.15);

  return (
    <defs>
      <pattern id="smallGrid" width={smallGridSize} height={smallGridSize} patternUnits="userSpaceOnUse">
        <path d={`M ${smallGridSize} 0 L 0 0 0 ${smallGridSize}`} fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity={smallOpacity}/>
      </pattern>
      <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
        <rect width={gridSize} height={gridSize} fill="url(#smallGrid)"/>
        <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#d1d5db" strokeWidth="1" opacity={majorOpacity}/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </defs>
  );
};

export default GridPattern;