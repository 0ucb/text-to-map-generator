import React from 'react';

const ScaleIndicator = ({ zoom }) => {
  const getScaleInfo = () => {
    const baseDistance = 50;
    const scaledDistance = baseDistance * zoom;
    
    let scaleLength, scaleUnit, scaleValue;
    
    if (zoom >= 2) {
      if (scaledDistance >= 200) {
        scaleLength = scaledDistance / 8;
        scaleValue = 660;
        scaleUnit = "ft";
      } else {
        scaleLength = scaledDistance / 4;
        scaleValue = 0.25;
        scaleUnit = "mi";
      }
    } else if (zoom >= 1) {
      if (scaledDistance >= 100) {
        scaleLength = scaledDistance / 2;
        scaleValue = 0.5;
        scaleUnit = "mi";
      } else {
        scaleLength = scaledDistance;
        scaleValue = 1;
        scaleUnit = "mi";
      }
    } else if (zoom >= 0.5) {
      scaleLength = scaledDistance * 2;
      scaleValue = 2;
      scaleUnit = "mi";
    } else if (zoom >= 0.2) {
      scaleLength = scaledDistance * 5;
      scaleValue = 5;
      scaleUnit = "mi";
    } else if (zoom >= 0.1) {
      scaleLength = scaledDistance * 10;
      scaleValue = 10;
      scaleUnit = "mi";
    } else if (zoom >= 0.05) {
      scaleLength = scaledDistance * 20;
      scaleValue = 20;
      scaleUnit = "mi";
    } else {
      scaleLength = scaledDistance * 100;
      scaleValue = 100;
      scaleUnit = "mi";
    }
    
    scaleLength = Math.min(scaleLength, 200);
    scaleLength = Math.max(scaleLength, 20);
    
    const scaleText = scaleUnit === "ft" ? 
      `${scaleValue} ft` : 
      `${scaleValue} ${scaleUnit}`;
    
    return { scaleLength, scaleText };
  };

  const { scaleLength, scaleText } = getScaleInfo();

  return (
    <g transform="translate(20, 80)">
      <rect width="160" height="45" fill="white" fillOpacity="0.9" stroke="#d1d5db" rx="4" />
      <text x="8" y="16" className="text-xs font-medium fill-gray-800">Scale</text>
      <line x1="8" y1="28" x2={8 + scaleLength} y2="28" stroke="#374151" strokeWidth="2" />
      <line x1="8" y1="25" x2="8" y2="31" stroke="#374151" strokeWidth="2" />
      <line x1={8 + scaleLength} y1="25" x2={8 + scaleLength} y2="31" stroke="#374151" strokeWidth="2" />
      <text x={8 + scaleLength/2} y="42" textAnchor="middle" className="text-xs fill-gray-600">{scaleText}</text>
    </g>
  );
};

export default ScaleIndicator;