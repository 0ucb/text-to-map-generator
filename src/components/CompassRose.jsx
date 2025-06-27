import React from 'react';

const CompassRose = () => {
  return (
    <g transform="translate(750, 50)">
      <rect width="80" height="80" fill="white" fillOpacity="0.9" stroke="#d1d5db" rx="4" />
      <g transform="translate(40, 40)">
        <circle cx="0" cy="0" r="30" fill="none" stroke="#d1d5db" strokeWidth="1" />
        
        <g className="text-xs font-medium fill-gray-800">
          <text x="0" y="-20" textAnchor="middle">N</text>
          <text x="20" y="4" textAnchor="middle">E</text>
          <text x="0" y="28" textAnchor="middle">S</text>
          <text x="-20" y="4" textAnchor="middle">W</text>
        </g>
        
        <g>
          <path d="M 0,-25 L 3,-5 L 0,0 L -3,-5 Z" fill="#ef4444" />
          <path d="M 0,25 L 3,5 L 0,0 L -3,5 Z" fill="#6b7280" />
          <circle cx="0" cy="0" r="2" fill="#374151" />
        </g>
        
        <g stroke="#e5e7eb" strokeWidth="1">
          <line x1="0" y1="-30" x2="0" y2="30" />
          <line x1="-30" y1="0" x2="30" y2="0" />
          <line x1="-21" y1="-21" x2="21" y2="21" />
          <line x1="21" y1="-21" x2="-21" y2="21" />
        </g>
      </g>
    </g>
  );
};

export default CompassRose;