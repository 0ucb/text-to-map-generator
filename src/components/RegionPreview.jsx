import React from 'react';

const RegionPreview = ({ regionPoints, toScreen }) => {
  if (regionPoints.length === 0) return null;

  return (
    <g>
      {/* Draw lines connecting points */}
      {regionPoints.map((point, index) => {
        if (index === 0) return null;
        const prevPoint = regionPoints[index - 1];
        const screenPoint = toScreen(point.x, point.y);
        const screenPrevPoint = toScreen(prevPoint.x, prevPoint.y);
        
        return (
          <line
            key={`region-line-${index}`}
            x1={screenPrevPoint.x}
            y1={screenPrevPoint.y}
            x2={screenPoint.x}
            y2={screenPoint.y}
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      })}
      
      {/* Draw dots at each point */}
      {regionPoints.map((point, index) => {
        const screenPoint = toScreen(point.x, point.y);
        return (
          <circle
            key={`region-point-${index}`}
            cx={screenPoint.x}
            cy={screenPoint.y}
            r="5"
            fill="#8b5cf6"
            stroke="white"
            strokeWidth="2"
          />
        );
      })}
      
      {/* Preview closing line if we have at least 2 points */}
      {regionPoints.length >= 2 && (
        <line
          x1={toScreen(regionPoints[regionPoints.length - 1].x, regionPoints[regionPoints.length - 1].y).x}
          y1={toScreen(regionPoints[regionPoints.length - 1].x, regionPoints[regionPoints.length - 1].y).y}
          x2={toScreen(regionPoints[0].x, regionPoints[0].y).x}
          y2={toScreen(regionPoints[0].x, regionPoints[0].y).y}
          stroke="#8b5cf6"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.5"
        />
      )}
    </g>
  );
};

export default RegionPreview;