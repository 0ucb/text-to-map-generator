import React, { useState } from 'react';
import { X, Palette } from 'lucide-react';

const RegionModal = ({ isOpen, onClose, onConfirm, pointCount }) => {
  const [regionName, setRegionName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const predefinedColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#DC2626', // Dark Red
    '#059669', // Dark Green
    '#7C3AED', // Dark Purple
    '#B45309', // Dark Orange
    '#0284C7', // Dark Blue
    '#65A30D'  // Dark Lime
  ];

  const handleConfirm = () => {
    if (regionName.trim()) {
      onConfirm(regionName.trim(), selectedColor);
      setRegionName('');
      setSelectedColor('#3B82F6');
      onClose();
    }
  };

  const handleCancel = () => {
    setRegionName('');
    setSelectedColor('#3B82F6');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Create Region</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Creating region with {pointCount} points
            </p>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region Name
            </label>
            <input
              type="text"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              placeholder="Enter region name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
                if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Region Color
            </label>
            
            {/* Color Preview */}
            <div className="mb-3">
              <div
                className="w-full h-8 rounded border border-gray-300"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <p className="text-xs text-gray-500 mt-1">Selected: {selectedColor}</p>
            </div>

            {/* Predefined Colors */}
            <div className="grid grid-cols-8 gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#3B82F6"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!regionName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Region
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionModal;