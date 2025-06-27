import React from 'react';

const HelpPanel = () => {
  return (
    <div className="bg-blue-50 border-b p-4">
      <div className="max-w-4xl">
        <h3 className="font-semibold text-blue-900 mb-2">🤖 Claude Interaction Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Location Syntax:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• "Castle is north of Village"</li>
              <li>• "Forest lies 2 miles east of Castle"</li>
              <li>• "Market is between Church and Tavern"</li>
              <li>• "Well is nearby Market"</li>
              <li>• "Castle is named Bronze Castle"</li>
              <li>• "Forest is called Dark Forest"</li>
              <li>• "River is named Blue River"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Path Syntax:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• "A road connects Village and Castle"</li>
              <li>• "Highway runs from City to Airport"</li>
              <li>• "The road between A and B is Main Street"</li>
              <li>• "Trail from Park to Lake is Nature Path"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Waterway Syntax:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• "A river flows from Mountains to Sea"</li>
              <li>• "Stream runs from Lake to Village"</li>
              <li>• "The river from A to B is Blue River"</li>
              <li>• "Creek connecting Forest and Town"</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
          <strong>💡 Enhanced Features:</strong> The system now validates additions, classifies feature types (cities, mountains, etc.), and prevents parsing errors. Use step-by-step mode for complex maps. Click cleanup tools to remove mistakes.
        </div>
      </div>
    </div>
  );
};

export default HelpPanel;