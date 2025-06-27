import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import { AI_PROVIDERS, PROVIDER_CONFIG, AISettings, ModelFetcher } from '../services/aiProviders';

const AISettingsPanel = ({ isOpen, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS.OPENAI);
  const [apiKeys, setApiKeys] = useState({});
  const [customEndpoints, setCustomEndpoints] = useState({});
  const [selectedModels, setSelectedModels] = useState({});
  const [availableModels, setAvailableModels] = useState({});
  const [showApiKeys, setShowApiKeys] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isRefreshingModels, setIsRefreshingModels] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = () => {
    setSelectedProvider(AISettings.getSelectedProvider());
    setApiKeys(AISettings.getApiKeys());
    setCustomEndpoints(AISettings.getCustomEndpoints());
    setSelectedModels(AISettings.getSelectedModels());
    
    // Load available models for each provider
    const models = {};
    Object.keys(PROVIDER_CONFIG).forEach(provider => {
      models[provider] = AISettings.getAvailableModels(provider);
    });
    setAvailableModels(models);
  };

  const saveSettings = () => {
    AISettings.setSelectedProvider(selectedProvider);
    
    Object.entries(apiKeys).forEach(([provider, key]) => {
      if (key.trim()) {
        AISettings.setApiKey(provider, key);
      }
    });
    
    Object.entries(customEndpoints).forEach(([provider, endpoint]) => {
      if (endpoint.trim()) {
        AISettings.setCustomEndpoint(provider, endpoint);
      }
    });
    
    Object.entries(selectedModels).forEach(([provider, model]) => {
      if (model) {
        AISettings.setSelectedModel(provider, model);
      }
    });
    
    onClose();
  };

  const refreshModels = async (provider) => {
    const config = PROVIDER_CONFIG[provider];
    
    if (!config.supportsModelListing) {
      return; // Can't refresh models for providers that don't support it
    }

    const apiKey = apiKeys[provider];
    if (config.requiresApiKey && !apiKey) {
      setTestResults({ ...testResults, [provider]: 'error: API key required for model refresh' });
      return;
    }

    setIsRefreshingModels({ ...isRefreshingModels, [provider]: true });
    
    try {
      const models = await ModelFetcher.refreshModels(provider, apiKey);
      setAvailableModels({ ...availableModels, [provider]: models });
      setTestResults({ ...testResults, [provider]: `refreshed: Found ${models.length} models` });
    } catch (error) {
      setTestResults({ ...testResults, [provider]: `error: ${error.message}` });
    } finally {
      setIsRefreshingModels({ ...isRefreshingModels, [provider]: false });
    }
  };

  const testConnection = async (provider) => {
    setIsTestingConnection(true);
    setTestResults({ ...testResults, [provider]: 'testing' });
    
    try {
      console.log('Testing connection for provider:', provider);
      // Simple test request to verify the API key and endpoint work
      const config = PROVIDER_CONFIG[provider];
      const apiKey = apiKeys[provider];
      const endpoint = customEndpoints[provider] || config.endpoint;
      console.log('Endpoint:', endpoint, 'Config:', config);
      
      if (config.requiresApiKey && !apiKey) {
        throw new Error('API key required');
      }
      
      // Test with a simple request
      const testPrompt = 'Test connection. Respond with just "OK".';
      let response;
      
      if (provider === AI_PROVIDERS.GOOGLE) {
        const testEndpoint = (endpoint || '').replace('{model}', selectedModels[provider] || config.defaultModel || '');
        response = await fetch(`${testEndpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: testPrompt }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        });
      } else if (provider === AI_PROVIDERS.ANTHROPIC) {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: config.headers(apiKey),
          body: JSON.stringify({
            model: selectedModels[provider] || config.defaultModel,
            max_tokens: 10,
            messages: [{ role: 'user', content: testPrompt }]
          })
        });
      } else {
        // OpenAI-style APIs
        response = await fetch(endpoint, {
          method: 'POST',
          headers: config.headers(apiKey),
          body: JSON.stringify({
            model: selectedModels[provider] || config.defaultModel,
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 10
          })
        });
      }
      
      if (response.ok) {
        setTestResults({ ...testResults, [provider]: 'success' });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Connection test failed for', provider, ':', error);
      console.error('Error stack:', error.stack);
      setTestResults({ ...testResults, [provider]: `error: ${error.message}` });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const toggleApiKeyVisibility = (provider) => {
    setShowApiKeys({
      ...showApiKeys,
      [provider]: !showApiKeys[provider]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <h2 className="text-xl font-semibold">AI Provider Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Provider Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Active Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Provider Configuration Cards */}
          <div className="space-y-6">
            {Object.entries(PROVIDER_CONFIG).map(([providerKey, config]) => (
              <div
                key={providerKey}
                className={`border rounded-lg p-4 ${
                  selectedProvider === providerKey ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{config.name}</h3>
                  <div className="flex items-center gap-2">
                    {testResults[providerKey] === 'testing' && (
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    )}
                    {testResults[providerKey] === 'success' && (
                      <span className="text-green-600 text-sm">✓ Connected</span>
                    )}
                    {testResults[providerKey]?.startsWith('error:') && (
                      <span className="text-red-600 text-sm">✗ Failed</span>
                    )}
                    <button
                      onClick={() => testConnection(providerKey)}
                      disabled={isTestingConnection}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Test
                    </button>
                  </div>
                </div>

                {/* API Key */}
                {config.requiresApiKey && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys[providerKey] ? 'text' : 'password'}
                        value={apiKeys[providerKey] || ''}
                        onChange={(e) => setApiKeys({
                          ...apiKeys,
                          [providerKey]: e.target.value
                        })}
                        placeholder="Enter your API key"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleApiKeyVisibility(providerKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKeys[providerKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Endpoint - Only for local providers */}
                {config.customEndpoint && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Endpoint URL (Local)
                    </label>
                    <input
                      type="text"
                      value={customEndpoints[providerKey] || ''}
                      onChange={(e) => setCustomEndpoints({
                        ...customEndpoints,
                        [providerKey]: e.target.value
                      })}
                      placeholder={config.chatEndpoint}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default: {config.chatEndpoint}
                    </p>
                  </div>
                )}

                {/* Model Selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    {config.supportsModelListing && (
                      <button
                        onClick={() => refreshModels(providerKey)}
                        disabled={isRefreshingModels[providerKey]}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshingModels[providerKey] ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    )}
                  </div>
                  <select
                    value={selectedModels[providerKey] || config.defaultModel}
                    onChange={(e) => setSelectedModels({
                      ...selectedModels,
                      [providerKey]: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(availableModels[providerKey] || config.fallbackModels || [config.defaultModel]).map(model => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  {!config.supportsModelListing && (
                    <p className="text-xs text-gray-500 mt-1">
                      Models are predefined for this provider
                    </p>
                  )}
                  {AISettings.isModelCacheExpired() && config.supportsModelListing && (
                    <p className="text-xs text-orange-600 mt-1">
                      Model list may be outdated. Click refresh to update.
                    </p>
                  )}
                </div>

                {/* Status Display */}
                {testResults[providerKey]?.startsWith('error:') && (
                  <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    {testResults[providerKey].replace('error: ', '')}
                  </div>
                )}
                {testResults[providerKey]?.startsWith('refreshed:') && (
                  <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                    {testResults[providerKey].replace('refreshed: ', '')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettingsPanel;