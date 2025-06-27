import React from 'react';
import { Plus } from 'lucide-react';

const TextInput = ({ 
  inputText, 
  setInputText, 
  addLocations, 
  processingMode, 
  setProcessingMode 
}) => {
  const handleAddLocations = () => {
    if (!inputText.trim()) return;
    
    const result = addLocations(inputText);
    
    // If validation failed, try with skipValidation option
    if (result && !result.success && result.validation) {
      if (confirm(`Found ${result.validation.issues.length} issues and ${result.validation.warnings.length} warnings. Add anyway?`)) {
        addLocations(inputText, { skipValidation: true });
      }
    }
  };

  const exampleTexts = [
    "The castle is north of the village. The forest lies 2 miles east of the castle. A road connects the village and the castle. A river flows from the forest to the village. The road between the village and castle is Castle Road. The castle is named Bronze Castle. The forest is called Dark Forest. The village is named Riverside.",
    "The market is between the church and the tavern. The well is nearby the market. There is a path from the church to the tavern. A stream runs from the well to the market. The path from church to tavern is called Market Street. The market is named Central Market.",
    "Dragon's Peak stands 5 miles northeast of Riverside. The old mill is west of the village. A highway runs from Riverside to the mill. A river flows from Dragon's Peak to Riverside. The highway connecting Riverside and the mill is Route 66. The river from Dragon's Peak to Riverside is called Dragon River. The mill is named Old Windmill."
  ];

  return (
    <>
      {/* Input area */}
      <div className="flex gap-2 mb-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe locations, relationships, and roads... (e.g., 'The castle is north of the village. A road connects them. The road between the village and castle is Main Street.') Use Help for syntax guide or Export Data for Claude interaction."
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAddLocations}
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Map
          </button>
          
          {/* Processing Mode Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setProcessingMode('batch')}
              className={`text-xs px-2 py-1 rounded ${
                processingMode === 'batch' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Batch
            </button>
            <button
              onClick={() => setProcessingMode('incremental')}
              className={`text-xs px-2 py-1 rounded ${
                processingMode === 'incremental' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Step-by-step
            </button>
          </div>
        </div>
      </div>

      {/* Example buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Try these examples:</span>
        {exampleTexts.map((example, index) => (
          <button
            key={index}
            onClick={() => setInputText(example)}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
          >
            Example {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default TextInput;