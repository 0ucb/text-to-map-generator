import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import MapCanvas from './MapCanvas';
import SearchPanel from './SearchPanel';
import MetadataPanel from './MetadataPanel';
import ClaudeChat from './ClaudeChat';
import ValidationPanel from './ValidationPanel';
import MapDataPanel from './MapDataPanel';
import HelpPanel from './HelpPanel';
import MapControls from './MapControls';
import TextInput from './TextInput';
import { useMapData } from '../hooks/useMapData';
import { useMapInteraction } from '../hooks/useMapInteraction';
import { useClaudeIntegration } from '../hooks/useClaudeIntegration';

const TextToMapApp = () => {
  // Core map state
  const {
    locations,
    setLocations,
    paths,
    setPaths,
    waterways,
    setWaterways,
    regions,
    setRegions,
    addLocations,
    clearAllLocations,
    removeLastAddition,
    completeRegion
  } = useMapData();

  // Map interaction state
  const {
    zoom,
    setZoom,
    offset,
    setOffset,
    selectedItem,
    setSelectedItem,
    contextMenu,
    setContextMenu,
    editingStates,
    setEditingStates,
    modes,
    setModes,
    searchState,
    setSearchState,
    regionPoints,
    addRegionPoint,
    clearRegionPoints,
    toggleMode,
    resetView
  } = useMapInteraction();

  // Claude integration
  const {
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    isClaudeThinking,
    sendMessageToClaude,
    askClaudeToAnalyze,
    askClaudeToAddFeatures,
    askClaudeToOptimize
  } = useClaudeIntegration(locations, paths, waterways, regions);

  // Panel visibility states
  const [showHelp, setShowHelp] = useState(false);
  const [showMapData, setShowMapData] = useState(false);
  const [showMetadataPanel, setShowMetadataPanel] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Input and processing states
  const [inputText, setInputText] = useState('Washington DC is the reference point. New York City is 3 miles north of Washington DC. Los Angeles is 15 miles west of Washington DC. Chicago is 8 miles northwest of Washington DC. Miami is 6 miles south of Washington DC. Seattle is 12 miles northwest of Washington DC. Denver is 10 miles west of Washington DC. Boston is 4 miles northeast of Washington DC. New Orleans is 8 miles southwest of Washington DC. Detroit is 3 miles north of Chicago. The Mississippi River flows from Chicago to New Orleans. Interstate 95 runs from Miami to Boston. Interstate 10 connects Los Angeles and New Orleans. The Rocky Mountains are near Denver. The Great Lakes are near Detroit.');
  const [processingMode, setProcessingMode] = useState('batch');
  const [pendingAdditions, setPendingAdditions] = useState(null);
  const [validationResults, setValidationResults] = useState(null);

  const svgRef = useRef(null);

  // Region completion handler
  const handleCompleteRegion = () => {
    const name = prompt('Enter region name:');
    if (name !== null) { // null means user cancelled
      const color = prompt('Enter region color (hex, e.g., #FF6B6B):', '#3B82F6');
      if (completeRegion(regionPoints, name, color || '#3B82F6')) {
        clearRegionPoints();
        toggleMode('regionMode'); // Exit region mode
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Text-to-Map Generator</h1>
        </div>
        
        <TextInput
          inputText={inputText}
          setInputText={setInputText}
          addLocations={addLocations}
          processingMode={processingMode}
          setProcessingMode={setProcessingMode}
        />
      </div>

      {/* Conditional Panels */}
      {showHelp && <HelpPanel />}
      {showMapData && (
        <MapDataPanel
          locations={locations}
          paths={paths}
          waterways={waterways}
          regions={regions}
        />
      )}
      {showValidationPanel && validationResults && (
        <ValidationPanel
          validationResults={validationResults}
          onConfirm={() => {
            // Handle confirmation logic
            setShowValidationPanel(false);
          }}
          onCancel={() => {
            setShowValidationPanel(false);
            setPendingAdditions(null);
            setValidationResults(null);
          }}
        />
      )}

      {/* Map Controls */}
      <MapControls
        zoom={zoom}
        setZoom={setZoom}
        resetView={resetView}
        searchState={searchState}
        setSearchState={setSearchState}
        showSearchPanel={showSearchPanel}
        setShowSearchPanel={setShowSearchPanel}
        showChatPanel={showChatPanel}
        setShowChatPanel={setShowChatPanel}
        showMapData={showMapData}
        setShowMapData={setShowMapData}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        modes={modes}
        toggleMode={toggleMode}
        removeLastAddition={removeLastAddition}
        clearAllLocations={clearAllLocations}
        locations={locations}
        paths={paths}
        waterways={waterways}
        regions={regions}
        regionPoints={regionPoints}
        handleCompleteRegion={handleCompleteRegion}
      />

      {/* Main content area */}
      <div className="flex-1 flex relative">
        <MapCanvas
          ref={svgRef}
          locations={locations}
          setLocations={setLocations}
          paths={paths}
          setPaths={setPaths}
          waterways={waterways}
          setWaterways={setWaterways}
          regions={regions}
          setRegions={setRegions}
          zoom={zoom}
          setZoom={setZoom}
          offset={offset}
          setOffset={setOffset}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          editingStates={editingStates}
          setEditingStates={setEditingStates}
          modes={modes}
          setModes={setModes}
          searchState={searchState}
          showMetadataPanel={showMetadataPanel}
          setShowMetadataPanel={setShowMetadataPanel}
          showChatPanel={showChatPanel}
          regionPoints={regionPoints}
          addRegionPoint={addRegionPoint}
        />

        {/* Search Panel */}
        {showSearchPanel && searchState.results && (
          <SearchPanel
            searchState={searchState}
            setSearchState={setSearchState}
            setShowSearchPanel={setShowSearchPanel}
            locations={locations}
            setSelectedItem={setSelectedItem}
            setShowMetadataPanel={setShowMetadataPanel}
            setZoom={setZoom}
            setOffset={setOffset}
            zoom={zoom}
          />
        )}

        {/* Metadata Panel */}
        {showMetadataPanel && selectedItem && (
          <MetadataPanel
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setShowMetadataPanel={setShowMetadataPanel}
            locations={locations}
            setLocations={setLocations}
            paths={paths}
            setPaths={setPaths}
            waterways={waterways}
            setWaterways={setWaterways}
            regions={regions}
            setRegions={setRegions}
          />
        )}

        {/* Claude Chat Panel */}
        {showChatPanel && (
          <ClaudeChat
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isClaudeThinking={isClaudeThinking}
            sendMessageToClaude={sendMessageToClaude}
            askClaudeToAnalyze={askClaudeToAnalyze}
            askClaudeToAddFeatures={askClaudeToAddFeatures}
            askClaudeToOptimize={askClaudeToOptimize}
            setShowChatPanel={setShowChatPanel}
            setSelectedItem={setSelectedItem}
            locations={locations}
            paths={paths}
            waterways={waterways}
            regions={regions}
          />
        )}
      </div>
    </div>
  );
};

export default TextToMapApp;