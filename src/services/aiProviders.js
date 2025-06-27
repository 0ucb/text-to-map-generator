// AI Provider Configuration and API Clients
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  DEEPSEEK: 'deepseek',
  GOOGLE: 'google',
  LM_STUDIO: 'lm_studio',
  KOBOLD: 'kobold'
};

export const PROVIDER_CONFIG = {
  [AI_PROVIDERS.OPENAI]: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiresApiKey: true,
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  },
  [AI_PROVIDERS.ANTHROPIC]: {
    name: 'Anthropic Claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-3-sonnet-20240229',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    requiresApiKey: true,
    headers: (apiKey) => ({
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    })
  },
  [AI_PROVIDERS.DEEPSEEK]: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-coder'],
    requiresApiKey: true,
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  },
  [AI_PROVIDERS.GOOGLE]: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    defaultModel: 'gemini-1.5-pro',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    requiresApiKey: true,
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    })
  },
  [AI_PROVIDERS.LM_STUDIO]: {
    name: 'LM Studio',
    endpoint: 'http://localhost:1234/v1/chat/completions',
    defaultModel: 'local-model',
    models: ['local-model'],
    requiresApiKey: false,
    headers: () => ({
      'Content-Type': 'application/json'
    })
  },
  [AI_PROVIDERS.KOBOLD]: {
    name: 'Kobold AI',
    endpoint: 'http://localhost:5001/api/v1/generate',
    defaultModel: 'kobold',
    models: ['kobold'],
    requiresApiKey: false,
    headers: () => ({
      'Content-Type': 'application/json'
    })
  }
};

// Storage keys for settings
export const STORAGE_KEYS = {
  SELECTED_PROVIDER: 'ai_selected_provider',
  API_KEYS: 'ai_api_keys',
  CUSTOM_ENDPOINTS: 'ai_custom_endpoints',
  SELECTED_MODELS: 'ai_selected_models'
};

// Settings management
export class AISettings {
  static getSelectedProvider() {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_PROVIDER) || AI_PROVIDERS.OPENAI;
  }

  static setSelectedProvider(provider) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PROVIDER, provider);
  }

  static getApiKeys() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.API_KEYS) || '{}');
    } catch {
      return {};
    }
  }

  static setApiKey(provider, apiKey) {
    const keys = this.getApiKeys();
    keys[provider] = apiKey;
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
  }

  static getCustomEndpoints() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ENDPOINTS) || '{}');
    } catch {
      return {};
    }
  }

  static setCustomEndpoint(provider, endpoint) {
    const endpoints = this.getCustomEndpoints();
    endpoints[provider] = endpoint;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ENDPOINTS, JSON.stringify(endpoints));
  }

  static getSelectedModels() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SELECTED_MODELS) || '{}');
    } catch {
      return {};
    }
  }

  static setSelectedModel(provider, model) {
    const models = this.getSelectedModels();
    models[provider] = model;
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODELS, JSON.stringify(models));
  }

  static getProviderConfig(provider) {
    const config = { ...PROVIDER_CONFIG[provider] };
    const customEndpoints = this.getCustomEndpoints();
    const selectedModels = this.getSelectedModels();
    
    if (customEndpoints[provider]) {
      config.endpoint = customEndpoints[provider];
    }
    
    if (selectedModels[provider]) {
      config.selectedModel = selectedModels[provider];
    } else {
      config.selectedModel = config.defaultModel;
    }
    
    return config;
  }
}

// API Client for making requests
export class AIClient {
  static async sendMessage(userMessage, mapData, conversationHistory = []) {
    const provider = AISettings.getSelectedProvider();
    const config = AISettings.getProviderConfig(provider);
    const apiKeys = AISettings.getApiKeys();
    
    if (config.requiresApiKey && !apiKeys[provider]) {
      throw new Error(`API key required for ${config.name}`);
    }

    const prompt = this.buildPrompt(userMessage, mapData, conversationHistory);
    
    try {
      let result;
      switch (provider) {
        case AI_PROVIDERS.OPENAI:
        case AI_PROVIDERS.DEEPSEEK:
          result = await this.sendOpenAIStyleRequest(config, apiKeys[provider], prompt);
          break;
        case AI_PROVIDERS.ANTHROPIC:
          result = await this.sendAnthropicRequest(config, apiKeys[provider], prompt);
          break;
        case AI_PROVIDERS.GOOGLE:
          result = await this.sendGoogleRequest(config, apiKeys[provider], prompt);
          break;
        case AI_PROVIDERS.LM_STUDIO:
          result = await this.sendOpenAIStyleRequest(config, null, prompt);
          break;
        case AI_PROVIDERS.KOBOLD:
          result = await this.sendKoboldRequest(config, prompt);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
      
      // Validate the response structure
      return this.validateResponse(result);
      
    } catch (error) {
      console.error(`Error with ${config.name}:`, error);
      
      // Enhanced error handling with specific error types
      if (error.message.includes('API key')) {
        throw new Error(`Invalid API key for ${config.name}. Please check your settings.`);
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        throw new Error(`${config.name} model not found. Please check your model selection.`);
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        throw new Error(`Rate limit exceeded for ${config.name}. Please try again later.`);
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error(`Authentication failed for ${config.name}. Please check your API key.`);
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        throw new Error(`${config.name} server error. Please try again later.`);
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        throw new Error(`Network error connecting to ${config.name}. Please check your connection.`);
      }
      
      throw error;
    }
  }

  static validateResponse(response) {
    // Ensure the response has the expected structure
    const validatedResponse = {
      response: response.response || "I've processed your request.",
      actions: Array.isArray(response.actions) ? response.actions : [],
      analysis: response.analysis || "",
      suggestions: Array.isArray(response.suggestions) ? response.suggestions : []
    };

    // Validate actions have required fields
    validatedResponse.actions = validatedResponse.actions.filter(action => 
      action && typeof action === 'object' && action.type
    );

    return validatedResponse;
  }

  static buildPrompt(userMessage, mapData, conversationHistory) {
    return `
You are an intelligent mapping assistant with DIRECT CONTROL over a text-to-map application. You can manipulate the map directly through JSON commands.

CURRENT MAP STATE:
${JSON.stringify(mapData, null, 2)}

CONVERSATION HISTORY:
${JSON.stringify(conversationHistory, null, 2)}

USER'S CURRENT MESSAGE: "${userMessage}"

You can directly manipulate the map using these action types:
1. "addLocations": Add new locations with positions
2. "moveLocation": Move an existing location
3. "deleteLocation": Remove a location
4. "renameLocation": Rename a location
5. "addPath": Add a path between two locations
6. "addWaterway": Add a waterway between two locations
7. "deletePath": Remove a path
8. "deleteWaterway": Remove a waterway
9. "addRegion": Add a colored region with multiple points
10. "deleteRegion": Remove a region
11. "updateRegion": Update region properties
12. "clearAll": Clear the entire map
13. "optimizeLayout": Rearrange locations for better visualization
14. "addMetadata": Add metadata to a location, path, waterway, or region

Respond with a JSON object in this EXACT format:
{
  "response": "Your conversational response explaining what you're doing",
  "actions": [
    {
      "type": "action_type",
      "params": { ... action specific parameters ... }
    }
  ],
  "analysis": "Brief analysis if relevant",
  "suggestions": ["future suggestions if relevant"]
}

Your entire response MUST be a single, valid JSON object. DO NOT include any text outside the JSON structure.`;
  }

  static async sendOpenAIStyleRequest(config, apiKey, prompt, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: config.headers(apiKey),
        body: JSON.stringify({
          model: config.selectedModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content received');
      }

      return this.parseAIResponse(content);
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry on timeout or network errors (max 2 retries)
      if (retryCount < 2 && (error.name === 'AbortError' || error.message.includes('Network'))) {
        console.warn(`Request failed, retrying (${retryCount + 1}/2):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Progressive delay
        return this.sendOpenAIStyleRequest(config, apiKey, prompt, retryCount + 1);
      }
      
      throw error;
    }
  }

  static async sendAnthropicRequest(config, apiKey, prompt, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: config.headers(apiKey),
        body: JSON.stringify({
          model: config.selectedModel,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;
      
      if (!content) {
        throw new Error('No response content received');
      }

      return this.parseAIResponse(content);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retryCount < 2 && (error.name === 'AbortError' || error.message.includes('Network'))) {
        console.warn(`Request failed, retrying (${retryCount + 1}/2):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.sendAnthropicRequest(config, apiKey, prompt, retryCount + 1);
      }
      
      throw error;
    }
  }

  static async sendKoboldRequest(config, prompt) {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: config.headers(),
      body: JSON.stringify({
        prompt: prompt,
        max_length: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.results?.[0]?.text;
    
    if (!content) {
      throw new Error('No response content received');
    }

    return this.parseAIResponse(content);
  }

  static async sendGoogleRequest(config, apiKey, prompt) {
    const endpoint = config.endpoint.replace('{model}', config.selectedModel);
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No response content received');
    }

    return this.parseAIResponse(content);
  }

  static parseAIResponse(content) {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return {
        response: parsed.response || "I've processed your request.",
        actions: parsed.actions || [],
        analysis: parsed.analysis || "",
        suggestions: parsed.suggestions || []
      };
    } catch {
      // If not JSON, treat as plain text response
      return {
        response: content,
        actions: [],
        analysis: "",
        suggestions: []
      };
    }
  }
}