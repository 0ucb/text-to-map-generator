import React, { forwardRef, useEffect, useState } from 'react';
import { toScreen, toMap } from '../utils/mapCalculations';
import { isPointInPolygon } from '../utils/mapCalculations';
import ContextMenu from './ContextMenu';
import RegionPreview from './RegionPreview';
import MapLegend from './MapLegend';
import CompassRose from './CompassRose';
import ScaleIndicator from './ScaleIndicator';
import GridPattern from './GridPattern';

const MapCanvas = forwardRef(({
  locations,
  setLocations,
  paths,
  setPaths,
  waterways,
  setWaterways,
  regions,
  setRegions,
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
  showMetadataPanel,
  setShowMetadataPanel,
  showChatPanel
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  const [regionPoints, setRegionPoints] = useState([]);

  // Handle wheel zoom
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setZoom(currentZoom => {
        setOffset(currentOffset => {
          const mapCoordsBefore = {
            x: (mouseX - currentOffset.x - 400) / currentZoom,
            y: (mouseY - currentOffset.y - 300) / currentZoom
          };
          
          const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
          const newZoom = Math.max(0.001, Math.min(currentZoom * zoomFactor, 20));
          
          const mapCoordsAfter = {
            x: (mouseX - currentOffset.x - 400) / newZoom,
            y: (mouseY - currentOffset.y - 300) / newZoom
          };
          
          const deltaX = (mapCoordsAfter.x - mapCoordsBefore.x) * newZoom;
          const deltaY = (mapCoordsAfter.y - mapCoordsBefore.y) * newZoom;
          
          return {
            x: currentOffset.x + deltaX,
            y: currentOffset.y + deltaY
          };
        });
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        return Math.max(0.001, Math.min(currentZoom * zoomFactor, 20));
      });
    };

    svg.addEventListener('wheel', wheelHandler, { passive: false });
    return () => svg.removeEventListener('wheel', wheelHandler);
  }, [ref, setZoom, setOffset]);

  // Handle context menu outside clicks
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu, setContextMenu]);

  const handleMouseDown = (e) => {
    if (e.button !== 0 || draggingNode) return;
    
    if (modes.regionMode) {
      const rect = ref.current.getBoundingClientRect();
      const mapCoords = toMap(e.clientX - rect.left, e.clientY - rect.top, zoom, offset);
      setRegionPoints(prev => [...prev, mapCoords]);
      return;
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    setContextMenu(null);
  };

  const handleMouseMove = (e) => {
    if (draggingNode) {
      const mapCoords = toMap(e.clientX - nodeOffset.x, e.clientY - nodeOffset.y, zoom, offset);
      setLocations(prev => ({
        ...prev,
        [draggingNode]: {
          ...prev[draggingNode],
          x: mapCoords.x,
          y: mapCoords.y
        }
      }));
    } else if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNode(null);
    setNodeOffset({ x: 0, y: 0 });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    const mapCoords = toMap(e.clientX - rect.left, e.clientY - rect.top, zoom, offset);
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      mapX: mapCoords.x,
      mapY: mapCoords.y
    });
  };

  const handleNodeMouseDown = (e, nodeName) => {
    if (e.button !== 0) return;
    if (modes.pathMode || modes.waterwayMode || modes.regionMode) return;
    e.stopPropagation();
    const nodePos = toScreen(locations[nodeName].x, locations[nodeName].y, zoom, offset);
    setDraggingNode(nodeName);
    setNodeOffset({
      x: e.clientX - nodePos.x,
      y: e.clientY - nodePos.y
    });
  };

  const handleNodeClick = (e, nodeName) => {
    if (modes.regionMode) {
      e.stopPropagation();
      const loc = locations[nodeName];
      setRegionPoints(prev => [...prev, { x: loc.x, y: loc.y }]);
      return;
    }
    
    if (modes.pathMode || modes.waterwayMode) {
      e.stopPropagation();
      // Handle path/waterway creation logic
      return;
    }

    // Handle regular node selection
    setSelectedItem({ type: 'location', name: nodeName, ...locations[nodeName] });
    setShowMetadataPanel(true);
  };

  const handleItemClick = (item, e) => {
    e.stopPropagation();
    if (modes.pathMode || modes.waterwayMode || modes.regionMode) return;
    
    setSelectedItem(item);
    setShowMetadataPanel(true);
  };

  const renderRegions = () => {
    return regions.map(region => {
      const pathData = region.points.map((point, index) => {
        const screenPoint = toScreen(point.x, point.y, zoom, offset);
        return `${index === 0 ? 'M' : 'L'} ${screenPoint.x} ${screenPoint.y}`;
      }).join(' ') + ' Z';
      
      const isSelected = selectedItem?.type === 'region' && selectedItem?.id === region.id;
      const isHighlighted = !!(searchState.results && searchState.results.regions && 
        searchState.results.regions.some(r => r.id === region.id));
      
      return (
        <g key={region.id}>
          <path
            d={pathData}
            fill={region.color}
            fillOpacity={isHighlighted ? region.opacity + 0.3 : (isSelected ? region.opacity + 0.2 : region.opacity)}
            stroke={isHighlighted ? region.color : (isSelected ? region.color : 'none')}
            strokeWidth={(isHighlighted || isSelected) ? 2 : 0}
            className="cursor-pointer hover:fill-opacity-50"
            onClick={(e) => handleItemClick({ type: 'region', ...region }, e)}
          />
          {/* Region label */}
          {(() => {
            const centroid = region.points.reduce((acc, point) => ({
              x: acc.x + point.x / region.points.length,
              y: acc.y + point.y / region.points.length
            }), { x: 0, y: 0 });
            const screenCentroid = toScreen(centroid.x, centroid.y, zoom, offset);
            
            return (
              <text
                x={screenCentroid.x}
                y={screenCentroid.y}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-700 pointer-events-none select-none"
                style={{ textShadow: '1px 1px 2px white' }}
              >
                {region.name}
              </text>
            );
          })()}
        </g>
      );
    });
  };

  const renderPaths = () => {
    return paths.map(path => {
      const fromPos = locations[path.from];
      const toPos = locations[path.to];
      if (!fromPos || !toPos) return null;
      
      const fromScreen = toScreen(fromPos.x, fromPos.y, zoom, offset);
      const toScreenPos = toScreen(toPos.x, toPos.y, zoom, offset);
      
      const pathStyles = {
        road: { stroke: '#6b7280', strokeWidth: 3, strokeDasharray: 'none' },
        highway: { stroke: '#374151', strokeWidth: 4, strokeDasharray: 'none' },
        path: { stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '5,5' },
        trail: { stroke: '#d1d5db', strokeWidth: 1.5, strokeDasharray: '3,3' }
      };
      
      const style = pathStyles[path.type] || pathStyles.road;
      const isSelected = selectedItem?.type === 'path' && selectedItem?.id === path.id;
      const isHighlighted = !!(searchState.results && searchState.results.paths && 
        searchState.results.paths.some(p => p.id === path.id));
      
      return (
        <g key={path.id}>
          <line
            x1={fromScreen.x}
            y1={fromScreen.y}
            x2={toScreenPos.x}
            y2={toScreenPos.y}
            stroke={isHighlighted ? '#f59e0b' : (isSelected ? '#2563eb' : style.stroke)}
            strokeWidth={(isHighlighted || isSelected) ? style.strokeWidth + 2 : style.strokeWidth}
            strokeDasharray={style.strokeDasharray}
            opacity={isHighlighted ? 1 : (isSelected ? 1 : 0.8)}
            className="cursor-pointer hover:opacity-100"
            onClick={(e) => handleItemClick({ type: 'path', ...path }, e)}
          />
          <text
            x={(fromScreen.x + toScreenPos.x) / 2}
            y={(fromScreen.y + toScreenPos.y) / 2 - 5}
            textAnchor="middle"
            className="text-xs fill-gray-600 pointer-events-none"
            style={{ textShadow: '1px 1px 2px white' }}
          >
            {path.name || path.type}
          </text>
        </g>
      );
    });
  };

  const renderWaterways = () => {
    return waterways.map(waterway => {
      const fromPos = locations[waterway.from];
      const toPos = locations[waterway.to];
      if (!fromPos || !toPos) return null;
      
      const fromScreen = toScreen(fromPos.x, fromPos.y, zoom, offset);
      const toScreenPos = toScreen(toPos.x, toPos.y, zoom, offset);
      
      const waterwayStyles = {
        river: { stroke: '#3b82f6', strokeWidth: 4 },
        stream: { stroke: '#60a5fa', strokeWidth: 3 },
        creek: { stroke: '#93c5fd', strokeWidth: 2 },
        brook: { stroke: '#dbeafe', strokeWidth: 2 }
      };
      
      const style = waterwayStyles[waterway.type] || waterwayStyles.river;
      const isSelected = selectedItem?.type === 'waterway' && selectedItem?.id === waterway.id;
      
      const dx = toScreenPos.x - fromScreen.x;
      const dy = toScreenPos.y - fromScreen.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const arrowX = fromScreen.x + dx * 0.67;
      const arrowY = fromScreen.y + dy * 0.67;
      const arrowSize = 8;
      const arrowAngle = Math.atan2(dy, dx);
      
      return (
        <g key={waterway.id}>
          <line
            x1={fromScreen.x}
            y1={fromScreen.y}
            x2={toScreenPos.x}
            y2={toScreenPos.y}
            stroke={isSelected ? '#1d4ed8' : style.stroke}
            strokeWidth={isSelected ? style.strokeWidth + 2 : style.strokeWidth}
            opacity={isSelected ? 1 : 0.8}
            className="cursor-pointer hover:opacity-100"
            onClick={(e) => handleItemClick({ type: 'waterway', ...waterway }, e)}
          />
          <path
            d={`M ${arrowX - arrowSize * Math.cos(arrowAngle - Math.PI/6)} ${arrowY - arrowSize * Math.sin(arrowAngle - Math.PI/6)} 
                L ${arrowX} ${arrowY} 
                L ${arrowX - arrowSize * Math.cos(arrowAngle + Math.PI/6)} ${arrowY - arrowSize * Math.sin(arrowAngle + Math.PI/6)}`}
            stroke={isSelected ? '#1d4ed8' : style.stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          />
          <text
            x={(fromScreen.x + toScreenPos.x) / 2}
            y={(fromScreen.y + toScreenPos.y) / 2 + 15}
            textAnchor="middle"
            className="text-xs fill-blue-700 pointer-events-none"
            style={{ textShadow: '1px 1px 2px white' }}
          >
            {waterway.name || waterway.type}
          </text>
        </g>
      );
    });
  };

  const renderLocations = () => {
    return Object.entries(locations).map(([name, pos]) => {
      const screenPos = toScreen(pos.x, pos.y, zoom, offset);
      const colors = {
        reference: '#ef4444',
        positioned: '#3b82f6',
        nearby: '#10b981',
        between: '#f59e0b',
        manual: '#8b5cf6',
        unknown: '#6b7280'
      };
      
      const isSelected = selectedItem?.type === 'location' && selectedItem?.name === name;
      
      return (
        <g key={name}>
          <circle
            cx={screenPos.x}
            cy={screenPos.y}
            r={isSelected ? 12 : (modes.pathMode || modes.waterwayMode) ? 10 : 8}
            fill={colors[pos.type] || colors.unknown}
            stroke={isSelected ? '#1e40af' : 'white'}
            strokeWidth={isSelected ? 3 : 2}
            className="drop-shadow-sm transition-all cursor-pointer"
            onMouseDown={(modes.pathMode || modes.waterwayMode || modes.regionMode) ? undefined : (e) => handleNodeMouseDown(e, name)}
            onClick={(e) => handleNodeClick(e, name)}
          />
          <text
            x={screenPos.x}
            y={screenPos.y - 15}
            textAnchor="middle"
            className="text-xs font-medium fill-gray-800 pointer-events-none select-none"
            style={{ textShadow: '1px 1px 2px white' }}
          >
            {name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className={`flex-1 relative overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 ${
      showMetadataPanel ? 'mr-80' : showChatPanel ? 'mr-96' : ''
    }`}>
      <svg
        ref={ref}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{ cursor: draggingNode ? 'grabbing' : isDragging ? 'grabbing' : 'grab' }}
      >
        <GridPattern zoom={zoom} />
        <ScaleIndicator zoom={zoom} />
        
        {/* Regions - rendered first */}
        {renderRegions()}
        
        {/* Region creation preview */}
        {modes.regionMode && regionPoints.length > 0 && (
          <RegionPreview 
            regionPoints={regionPoints} 
            toScreen={(x, y) => toScreen(x, y, zoom, offset)} 
          />
        )}
        
        {/* Paths */}
        {renderPaths()}
        
        {/* Waterways */}
        {renderWaterways()}
        
        {/* Location markers */}
        {renderLocations()}
        
        <MapLegend locations={locations} paths={paths} waterways={waterways} regions={regions} />
        <CompassRose />
      </svg>

      {contextMenu && (
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          locations={locations}
          setLocations={setLocations}
        />
      )}
    </div>
  );
});

MapCanvas.displayName = 'MapCanvas';

export default MapCanvas;