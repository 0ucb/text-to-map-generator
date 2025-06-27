import { useState } from 'react';

export const useClaudeIntegration = (locations, paths, waterways, regions) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isClaudeThinking, setIsClaudeThinking] = useState(false);

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
        pointCount: r.points.length
      }))
    };
  };

  const sendMessageToClaude = async (userMessage) => {
    if (!userMessage.trim()) return;
    
    const newUserMessage = { role: 'user', content: userMessage, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');
    setIsClaudeThinking(true);

    try {
      const currentMapData = {
        locations: locations,
        paths: paths,
        waterways: waterways,
        summary: generateMapSummary()
      };

      const prompt = `
You are an intelligent mapping assistant with DIRECT CONTROL over a text-to-map application. You can manipulate the map directly through JSON commands.

CURRENT MAP STATE:
${JSON.stringify(currentMapData, null, 2)}

CONVERSATION HISTORY:
${JSON.stringify(chatMessages, null, 2)}

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

Your entire response MUST be a single, valid JSON object. DO NOT include any text outside the JSON structure.
`;

      // Mock Claude response for now - in real implementation, this would call Claude API
      const mockResponse = {
        response: "I understand you want to work with your map. However, I need a real Claude API integration to provide intelligent responses and map manipulation.",
        actions: [],
        analysis: "This is a mock response. Real Claude integration would analyze your map and provide intelligent assistance.",
        suggestions: ["Integrate with Claude API", "Add more detailed map features", "Implement advanced natural language processing"]
      };
      
      const claudeMessage = { 
        role: 'assistant', 
        content: mockResponse.response,
        actions: mockResponse.actions,
        analysis: mockResponse.analysis,
        suggestions: mockResponse.suggestions,
        timestamp: Date.now() 
      };
      
      setChatMessages(prev => [...prev, claudeMessage]);
      
    } catch (error) {
      console.error('Claude integration error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: Date.now() 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsClaudeThinking(false);
    }
  };

  const askClaudeToAnalyze = () => {
    sendMessageToClaude("Please analyze my current map and provide insights about its layout and organization.");
  };

  const askClaudeToAddFeatures = () => {
    sendMessageToClaude("Please add some interesting geographic features to my map that would make it more complete and realistic. Add them directly to the map.");
  };

  const askClaudeToOptimize = () => {
    sendMessageToClaude("Please optimize the layout of my map to make it more visually appealing and easier to read. Rearrange the locations as needed.");
  };

  return {
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    isClaudeThinking,
    sendMessageToClaude,
    askClaudeToAnalyze,
    askClaudeToAddFeatures,
    askClaudeToOptimize
  };
};