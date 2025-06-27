import React from 'react';

const MapLegend = ({ locations, paths, waterways, regions }) => {
  return (
    <g transform="translate(20, 140)">
      <rect width="160" height="180" fill="white" fillOpacity="0.9" stroke="#d1d5db" rx="4" />
      <text x="8" y="16" className="text-sm font-medium fill-gray-800">Legend</text>
      {[
        { type: 'reference', label: 'Reference point', color: '#ef4444' },
        { type: 'positioned', label: 'Positioned', color: '#3b82f6' },
        { type: 'nearby', label: 'Nearby', color: '#10b981' },
        { type: 'between', label: 'Between', color: '#f59e0b' },
        { type: 'manual', label: 'Manual', color: '#8b5cf6' }
      ].map((item, index) => (
        <g key={item.type} transform={`translate(8, ${30 + index * 20})`}>
          <circle cx="6" cy="0" r="4" fill={item.color} />
          <text x="16" y="4" className="text-xs fill-gray-700">{item.label}</text>
        </g>
      ))}
      
      {/* Map Statistics */}
      <g transform="translate(8, 140)">
        <line x1="-4" y1="-5" x2="144" y2="-5" stroke="#e5e7eb" strokeWidth="1" />
        <text x="0" y="8" className="text-xs fill-gray-600">
          Locations: {Object.keys(locations).length}
        </text>
        <text x="0" y="20" className="text-xs fill-gray-600">
          Paths: {paths.length} | Waterways: {waterways.length}
        </text>
        <text x="0" y="32" className="text-xs fill-gray-600">
          Regions: {regions.length}
        </text>
      </g>
    </g>
  );
};

export default MapLegend;