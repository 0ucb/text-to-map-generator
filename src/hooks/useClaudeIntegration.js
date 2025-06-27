import { useState } from 'react';
import { AIClient } from '../services/aiProviders';

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
        regions: regions,
        summary: generateMapSummary()
      };

      // Use the new AI client system
      const response = await AIClient.sendMessage(userMessage, currentMapData, chatMessages);
      
      const claudeMessage = { 
        role: 'assistant', 
        content: response.response,
        actions: response.actions,
        analysis: response.analysis,
        suggestions: response.suggestions,
        timestamp: Date.now() 
      };
      
      setChatMessages(prev => [...prev, claudeMessage]);
      
    } catch (error) {
      console.error('AI integration error:', error);
      let errorMessage = "I'm sorry, I encountered an error processing your request.";
      
      if (error.message.includes('API key required')) {
        errorMessage = "Please configure your AI provider API key in the settings panel.";
      } else if (error.message.includes('API request failed')) {
        errorMessage = "Failed to connect to the AI service. Please check your settings and try again.";
      }
      
      const errorResponse = { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: Date.now() 
      };
      setChatMessages(prev => [...prev, errorResponse]);
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