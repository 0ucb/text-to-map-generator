import React from 'react';

const MapDataPanel = ({ locations, paths, waterways, regions }) => {
  const generateMapSummary = () => {
    const locationList = Object.keys(locations);
    return {
      totalLocations: locationList.length,
      totalPaths: paths.length,
      totalWaterways: waterways.length,
      totalRegions: regions.length,
      locations: locationList,
      namedPaths: paths.filter(p => p.name).map(p => ({
        name: p.name,
        from: p.from,
        to: p.to,
        type: p.type
      })),
      unnamedPaths: paths.filter(p => !p.name).map(p => ({
        from: p.from,
        to: p.to,
        type: p.type
      })),
      namedWaterways: waterways.filter(w => w.name).map(w => ({
        name: w.name,
        from: w.from,
        to: w.to,
        type: w.type
      })),
      unnamedWaterways: waterways.filter(w => !w.name).map(w => ({
        from: w.from,
        to: w.to,
        type: w.type
      })),
      regions: regions.map(r => ({
        name: r.name,
        type: r.type,
        color: r.color,
        pointCount: r.points?.length || 0
      }))
    };
  };

  const exportMapData = () => {
    const mapData = {
      locations: locations,
      paths: paths,
      waterways: waterways,
      regions: regions,
      summary: generateMapSummary()
    };
    return JSON.stringify(mapData, null, 2);
  };

  const generateMapDescription = () => {
    let description = [];
    
    Object.entries(locations).forEach(([name, data]) => {
      if (data.type === 'positioned') {
        description.push(`${name} is positioned on the map`);
      }
    });

    paths.forEach(path => {
      if (path.name) {
        description.push(`${path.name} is a ${path.type} connecting ${path.from} and ${path.to}`);
      } else {
        description.push(`A ${path.type} connects ${path.from} and ${path.to}`);
      }
    });

    waterways.forEach(waterway => {
      if (waterway.name) {
        description.push(`${waterway.name} is a ${waterway.type} flowing from ${waterway.from} to ${waterway.to}`);
      } else {
        description.push(`A ${waterway.type} flows from ${waterway.from} to ${waterway.to}`);
      }
    });

    return description.join('. ') + '.';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const importMapData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      // This would need to be connected to the parent component's state setters
      console.log('Import data:', data);
      return true;
    } catch (error) {
      alert('Invalid JSON data');
      return false;
    }
  };

  return (
    <div className="bg-gray-50 border-b p-4">
      <div className="max-w-4xl">
        <h3 className="font-semibold text-gray-900 mb-3">📊 Map Data & Export</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Summary */}
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium mb-2">Current Map Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Locations: {Object.keys(locations).length}</div>
              <div>Paths: {paths.length}</div>
              <div>Waterways: {waterways.length}</div>
              <div>Regions: {regions.length}</div>
              <div>Named paths: {paths.filter(p => p.name).length}</div>
              <div>Named waterways: {waterways.filter(w => w.name).length}</div>
            </div>
            <button
              onClick={() => copyToClipboard(generateMapDescription())}
              className="mt-2 text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
            >
              Copy Description
            </button>
          </div>

          {/* JSON Export */}
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium mb-2">JSON Data Export</h4>
            <p className="text-xs text-gray-600 mb-2">Structured data for Claude analysis</p>
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(exportMapData())}
                className="block w-full text-xs bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
              >
                Copy JSON Data
              </button>
              <button
                onClick={() => {
                  const data = exportMapData();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'map-data.json';
                  a.click();
                }}
                className="block w-full text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Download JSON
              </button>
            </div>
          </div>

          {/* JSON Import */}
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium mb-2">Import JSON Data</h4>
            <p className="text-xs text-gray-600 mb-2">Load map from Claude or file</p>
            <textarea
              placeholder="Paste JSON data here..."
              className="w-full text-xs border border-gray-300 rounded p-2 h-16 resize-none"
              onPaste={(e) => {
                setTimeout(() => {
                  const data = e.target.value;
                  if (data.trim()) {
                    importMapData(data);
                    e.target.value = '';
                  }
                }, 100);
              }}
            />
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => importMapData(e.target.result);
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
              className="mt-1 w-full text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              Upload JSON File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDataPanel;