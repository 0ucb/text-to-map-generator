# System Architecture

## Component Architecture

### Main Application Structure
```
src/
├── App.jsx                 # Root application wrapper
├── index.jsx              # React 18 createRoot entry point
├── components/            # React components organized by feature
├── hooks/                 # Custom React hooks for state management
├── services/              # External integrations and APIs
└── utils/                 # Pure utility functions and helpers
```

### Core Components

**Primary Application Components:**
- `TextToMapApp.jsx` - Main orchestrator integrating all features
- `MapCanvas.jsx` - Interactive SVG map with zoom/pan/selection (forwardRef)
- `TextInput.jsx` - Natural language input with example prompts
- `MapControls.jsx` - Toolbar with zoom, search, mode toggles, and tools
- `ClaudeChat.jsx` - AI assistant integration with settings panel
- `AISettingsPanel.jsx` - Multi-provider AI configuration and testing

**Supporting UI Components:**
- `MetadataPanel.jsx` - Element information editor for detailed data
- `MapDataPanel.jsx` - Import/export functionality with JSON support
- `HelpPanel.jsx` - User guidance and syntax examples
- `SearchPanel.jsx` - Element search and filtering interface
- `ValidationPanel.jsx` - Input validation and error reporting
- `ContextMenu.jsx` - Right-click actions for map elements

**Map Rendering Components:**
- `GridPattern.jsx` - SVG grid background pattern
- `ScaleIndicator.jsx` - Distance scale visualization
- `CompassRose.jsx` - Navigation orientation indicator
- `MapLegend.jsx` - Element type and status legend
- `RegionPreview.jsx` - Preview for region creation mode

### Custom Hooks Architecture

**State Management Hooks (Clean Separation of Concerns):**

1. **`useMapData.js`** - Core map data management
   - Manages locations, paths, waterways, and regions state
   - Handles text parsing and coordinate calculation
   - Provides CRUD operations for all map elements
   - Implements undo/redo functionality with action history
   - Processes natural language relationships into coordinates

2. **`useMapInteraction.js`** - User interaction handling
   - Manages zoom, pan, and viewport transformations
   - Controls selection and editing modes (path, waterway, region)
   - Handles context menus and editing states
   - Provides helper functions for mode management and view reset

3. **`useClaudeIntegration.js`** - AI assistant integration
   - Manages chat messages and conversation state
   - Integrates with multi-provider AI system via AIClient
   - Handles map analysis and suggestion features
   - Provides quick action functions for common AI requests

### Service Layer

**`aiProviders.js`** - Multi-provider AI integration service
- **Provider Configuration**: OpenAI, Anthropic, Google, DeepSeek, LM Studio, Kobold
- **AISettings Class**: Persistent configuration management with localStorage
- **AIClient Class**: Unified API client with error handling and retries
- **Provider-specific implementations**: Custom request handlers for each API
- **Response validation**: Ensures consistent data structure across providers

### Utility Modules

**Core Processing Utilities:**
- `textParser.js` - Natural language pattern recognition and parsing
- `mapCalculations.js` - Coordinate transformations and geometric operations
- `validation.js` - Input validation and error handling
- `search.js` - Element search and filtering functionality
- `constants.js` - Shared configuration values and enums

## Data Flow Patterns

### State Architecture
```javascript
// Centralized state via custom hooks
{
  // Map data (useMapData)
  locations: { name: { x, y, type, metadata } },
  paths: [{ id, from, to, type, name?, metadata }],
  waterways: [{ id, from, to, type, name?, metadata }],
  regions: [{ id, name, type, points, color, opacity, metadata }],
  undoStack: [{ action, data }], // 10-action history
  
  // Interaction state (useMapInteraction)
  zoom: number, 
  offset: {x, y}, 
  selectedItem: object,
  modes: { pathMode, waterwayMode, regionMode, selectedNode },
  editingStates: { editingPath, editingWaterway, editingLocation, editingRegion },
  
  // AI integration (useClaudeIntegration)
  chatMessages: array, 
  chatInput: string, 
  isClaudeThinking: boolean
}
```

### Component Communication Patterns
1. **Props Down**: Data flows from TextToMapApp through props
2. **Callbacks Up**: User actions bubble up via callback props
3. **Hook Encapsulation**: Related state and logic grouped in custom hooks
4. **Service Layer**: External integrations isolated in services/
5. **Ref Forwarding**: MapCanvas uses forwardRef for direct DOM access

## Key Technical Decisions

### Coordinate System
- **Reference Point System**: 50px per distance unit for consistent scaling
- **Screen/Map Transformation**: Bidirectional coordinate conversion with zoom/offset
- **SVG Rendering**: Infinite scalability and precision for all map elements

### State Management Strategy
- **Custom Hooks**: Preferred over external state management (Redux/Zustand)
- **Prop Drilling Minimization**: Hooks encapsulate related state and logic
- **Local Storage**: Persistent settings and API configurations
- **Undo/Redo**: Action-based history with 10-action limit

### AI Integration Architecture
- **Provider Agnostic**: Unified interface across multiple AI services
- **Fallback Systems**: Graceful degradation when providers fail
- **Error Boundary**: Comprehensive error handling and user feedback
- **Timeout/Retry**: Network resilience with progressive delays

## Critical Implementation Paths

### Text-to-Map Conversion Flow
1. **Input Processing**: `textParser.js` extracts spatial relationships
2. **Validation**: `validation.js` checks for conflicts and errors
3. **Coordinate Calculation**: `mapCalculations.js` converts to pixel coordinates
4. **State Update**: `useMapData` updates locations/paths/waterways
5. **Rendering**: `MapCanvas` renders updated SVG elements

### AI Provider Integration Flow
1. **Configuration**: `AISettings` manages provider selection and API keys
2. **Request Building**: `AIClient.buildPrompt()` creates context-aware prompts
3. **API Communication**: Provider-specific request handlers with retries
4. **Response Processing**: `parseAIResponse()` validates and normalizes responses
5. **Action Execution**: Chat integration displays results and suggestions

### Interactive Map Creation Flow
1. **Mode Activation**: `MapControls` toggles creation modes (path/waterway/region)
2. **User Interaction**: `MapCanvas` handles click events based on active mode
3. **Visual Feedback**: Real-time indicators show selection state and next steps
4. **Data Creation**: New elements added to state via `useMapData` hooks
5. **Immediate Rendering**: SVG updates reflect changes instantly

## Design Patterns in Use

### React Patterns
- **Custom Hooks**: Encapsulation of related state and logic
- **Compound Components**: Complex UI components with multiple parts
- **Render Props**: Flexible component composition for reusable logic
- **Forward Refs**: Direct DOM access for performance-critical components

### State Patterns
- **Immutable Updates**: All state changes create new objects
- **Action Pattern**: Undo/redo implemented with action history
- **Observer Pattern**: Components subscribe to hook state changes
- **Command Pattern**: AI actions as serializable command objects

### Error Handling Patterns
- **Error Boundaries**: Graceful failure recovery for React components
- **Retry Logic**: Progressive backoff for network requests
- **Fallback Systems**: Degraded functionality when services unavailable
- **User Feedback**: Clear error messages with actionable guidance