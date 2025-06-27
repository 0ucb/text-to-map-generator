import React from 'react';
import { Edit3, X } from 'lucide-react';

const MetadataPanel = ({
  selectedItem,
  setSelectedItem,
  setShowMetadataPanel,
  locations,
  setLocations,
  paths,
  setPaths,
  waterways,
  setWaterways,
  regions,
  setRegions
}) => {
  const updateMetadata = (newMetadata) => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'location') {
      setLocations(prev => ({
        ...prev,
        [selectedItem.name]: {
          ...prev[selectedItem.name],
          metadata: newMetadata
        }
      }));
    } else if (selectedItem.type === 'path') {
      setPaths(prev => prev.map(path => 
        path.id === selectedItem.id 
          ? { ...path, metadata: newMetadata }
          : path
      ));
    } else if (selectedItem.type === 'waterway') {
      setWaterways(prev => prev.map(waterway => 
        waterway.id === selectedItem.id 
          ? { ...waterway, metadata: newMetadata }
          : waterway
      ));
    } else if (selectedItem.type === 'region') {
      setRegions(prev => prev.map(region => 
        region.id === selectedItem.id 
          ? { ...region, metadata: newMetadata }
          : region
      ));
    }
  };

  const handleNameChange = (newName) => {
    if (selectedItem.type === 'location') {
      if (newName.trim() && newName !== selectedItem.name) {
        setLocations(prev => {
          const updated = { ...prev };
          updated[newName.trim()] = { ...prev[selectedItem.name] };
          delete updated[selectedItem.name];
          return updated;
        });
        setSelectedItem(prev => ({ ...prev, name: newName.trim() }));
      }
    } else if (selectedItem.type === 'path') {
      setPaths(prev => prev.map(path => 
        path.id === selectedItem.id 
          ? { ...path, name: newName }
          : path
      ));
      setSelectedItem(prev => ({ ...prev, name: newName }));
    } else if (selectedItem.type === 'waterway') {
      setWaterways(prev => prev.map(waterway => 
        waterway.id === selectedItem.id 
          ? { ...waterway, name: newName }
          : waterway
      ));
      setSelectedItem(prev => ({ ...prev, name: newName }));
    } else if (selectedItem.type === 'region') {
      setRegions(prev => prev.map(region => 
        region.id === selectedItem.id 
          ? { ...region, name: newName }
          : region
      ));
      setSelectedItem(prev => ({ ...prev, name: newName }));
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg border-l overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Metadata Editor
          </h3>
          <button
            onClick={() => {
              setShowMetadataPanel(false);
              setSelectedItem(null);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Type</h4>
            <p className="text-sm capitalize bg-gray-100 px-2 py-1 rounded">
              {selectedItem.type}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Name</h4>
            <input
              type="text"
              value={
                selectedItem.type === 'location' 
                  ? selectedItem.name 
                  : selectedItem.name || ''
              }
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={
                selectedItem.type === 'location' 
                  ? 'Location name' 
                  : `Name this ${selectedItem.type}`
              }
              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedItem.type !== 'location' && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedItem.from} → {selectedItem.to}
              </p>
            )}
          </div>

          {selectedItem.type !== 'location' && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Connects</h4>
              <p className="text-sm bg-gray-100 px-2 py-1 rounded">
                {selectedItem.from} → {selectedItem.to}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Notes & Information
            </h4>
            <textarea
              value={selectedItem.metadata || ''}
              onChange={(e) => {
                const newMetadata = e.target.value;
                setSelectedItem(prev => ({ ...prev, metadata: newMetadata }));
                updateMetadata(newMetadata);
              }}
              placeholder="Add notes, descriptions, or any information about this item..."
              className="w-full h-48 p-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-medium">💡 Metadata Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Describe historical significance</li>
              <li>Add population or size data</li>
              <li>Note important features or landmarks</li>
              <li>Record travel times or distances</li>
              <li>Include quest or story information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataPanel;