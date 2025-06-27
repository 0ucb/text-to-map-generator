import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import AISettingsPanel from './AISettingsPanel';

const ClaudeChat = ({
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  isClaudeThinking,
  sendMessageToClaude,
  setShowChatPanel,
  setSelectedItem,
  askClaudeToAnalyze,
  askClaudeToAddFeatures,
  askClaudeToOptimize
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <AISettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-lg border-l flex flex-col">
      <div className="p-4 border-b bg-purple-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Claude Map Assistant
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(true)}
              className="p-1 hover:bg-purple-100 rounded"
              title="AI Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowChatPanel(false);
                setSelectedItem(null);
              }}
              className="p-1 hover:bg-purple-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <button
            onClick={askClaudeToAnalyze}
            className="text-xs bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded text-purple-700"
          >
            Analyze Map
          </button>
          <button
            onClick={askClaudeToAddFeatures}
            className="text-xs bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded text-purple-700"
          >
            Suggest Features
          </button>
          <button
            onClick={askClaudeToOptimize}
            className="text-xs bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded text-purple-700"
          >
            Optimize Layout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Chat with Claude about your map!</p>
            <p className="text-xs mt-1">Ask for suggestions, analysis, or help adding features.</p>
          </div>
        )}
        
        {chatMessages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{message.content}</p>
              
              {message.role === 'assistant' && (
                <div className="mt-2 space-y-2">
                  {message.actions && message.actions.length > 0 && (
                    <div className="text-xs bg-green-50 text-green-800 p-2 rounded">
                      <strong>Actions Performed:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {message.actions.map((action, i) => (
                          <li key={i}>
                            {action.type === 'addLocations' && `Added ${action.params.locations?.length || 0} location(s)`}
                            {action.type === 'moveLocation' && `Moved ${action.params.name}`}
                            {action.type === 'deleteLocation' && `Deleted ${action.params.name}`}
                            {action.type === 'renameLocation' && `Renamed ${action.params.oldName} to ${action.params.newName}`}
                            {action.type === 'addPath' && `Added path from ${action.params.from} to ${action.params.to}`}
                            {action.type === 'addWaterway' && `Added waterway from ${action.params.from} to ${action.params.to}`}
                            {action.type === 'deletePath' && `Removed a path`}
                            {action.type === 'deleteWaterway' && `Removed a waterway`}
                            {action.type === 'addRegion' && `Added region "${action.params.name}"`}
                            {action.type === 'deleteRegion' && `Removed a region`}
                            {action.type === 'updateRegion' && `Updated region properties`}
                            {action.type === 'optimizeLayout' && `Optimized map layout (${action.params.strategy})`}
                            {action.type === 'addMetadata' && `Added metadata to ${action.params.name || 'item'}`}
                            {action.type === 'clearAll' && `Cleared entire map`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {message.analysis && (
                    <div className="text-xs bg-purple-50 text-purple-800 p-2 rounded">
                      <strong>Analysis:</strong> {message.analysis}
                    </div>
                  )}
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="text-xs bg-blue-50 text-blue-800 p-2 rounded">
                      <strong>Suggestions:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {message.suggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isClaudeThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                <span className="text-sm">Claude is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessageToClaude(chatInput);
              }
            }}
            placeholder="Ask Claude about your map..."
            className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isClaudeThinking}
          />
          <button
            onClick={() => sendMessageToClaude(chatInput)}
            disabled={isClaudeThinking || !chatInput.trim()}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Try: "Add a mountain range north of the cities", "Connect all cities with highways", "Reorganize the map in a circle"
        </p>
      </div>
    </div>
    </>
  );
};

export default ClaudeChat;