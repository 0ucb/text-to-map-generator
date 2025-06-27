# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Text-to-Map Generator is a modular React application that converts natural language descriptions into interactive visual maps. The codebase has been refactored into clean, reusable components with custom hooks for state management.

## Development Commands

- **Start development server**: `npm run dev` (Vite dev server on port 3000)
- **Build for production**: `npm run build` (Vite optimized build)
- **Preview production build**: `npm run preview` (Vite preview server)
- **Run tests**: `npm run test` (Vitest test runner)
- **Test with UI**: `npm run test:ui` (Interactive test interface)
- **Coverage report**: `npm run coverage` (Test coverage analysis)
- **Lint code**: `npm run lint` (Modern ESLint 9)
- **Fix lint issues**: `npm run lint:fix`
- **Type checking**: `npm run type-check` (TypeScript validation)
- **Install dependencies**: `npm install`

## Architecture

### Component Structure
The application follows a modular React architecture:

**Main Components:**
- **TextToMapApp.jsx**: Main application container that orchestrates all other components
- **MapCanvas.jsx**: Interactive SVG map rendering with zoom/pan, drag-and-drop
- **TextInput.jsx**: Natural language input area with example buttons
- **MapControls.jsx**: Toolbar with zoom, search, mode toggles, and tools
- **ClaudeChat.jsx**: AI assistant integration panel with chat interface
- **MetadataPanel.jsx**: Element information editor for detailed data entry
- **MapDataPanel.jsx**: Import/export functionality with JSON support
- **HelpPanel.jsx**: User guidance and syntax help

### Custom Hooks for State Management
State is managed through three custom hooks for separation of concerns:

**useMapData.js**: Core map data management
- Manages locations, paths, waterways, and regions
- Handles text parsing and validation
- Provides methods for adding, removing, and clearing map elements
- Processes natural language relationships into map coordinates

**useMapInteraction.js**: User interaction handling  
- Manages zoom, pan, and viewport state
- Handles selection and editing modes (path, waterway, region creation)
- Controls context menus and editing states
- Provides helper functions for mode toggling

**useClaudeIntegration.js**: AI assistant integration
- Manages chat messages and conversation state
- Provides mock Claude API integration structure
- Handles map analysis and suggestion features
- Includes quick action functions for common AI requests

### Utility Modules

**textParser.js**: Enhanced natural language processing
- Comprehensive regex patterns for spatial relationships
- Support for directional, proximity, and between positioning
- Path and waterway creation with naming
- Location renaming and metadata handling
- Returns structured data for coordinate calculation

**mapCalculations.js**: Coordinate and geometric operations
- Screen/map coordinate transformation functions with zoom/offset
- Directional positioning calculations (50px per unit scale)
- Point-in-polygon detection for region boundaries
- Feature type classification based on naming patterns
- Layout optimization algorithms (circular, grid, organic force-directed)

**validation.js**: Input validation and error handling
- Validates parsed text data before map updates
- Checks for duplicate locations and parsing errors
- Provides warnings for unrealistic distances
- Classifies geographic features for appropriate handling

**search.js**: Search and filtering functionality
- Performs text-based search across all map elements
- Supports metadata and type-based filtering
- Provides result focusing and highlighting
- Handles search result navigation

**constants.js**: Shared configuration values

### Data Flow and State Structure
```javascript
// Centralized state managed by custom hooks
{
  // Map data (useMapData)
  locations: { name: { x, y, type, metadata } },
  paths: [{ id, from, to, type, name?, metadata }],
  waterways: [{ id, from, to, type, name?, metadata }],
  regions: [{ id, name, type, points, color, opacity, metadata }],
  
  // Interaction state (useMapInteraction)
  zoom: number, offset: {x, y}, selectedItem: object,
  modes: { pathMode, waterwayMode, regionMode, selectedNode },
  editingStates: { editingPath, editingWaterway, editingLocation, editingRegion },
  
  // AI integration (useClaudeIntegration)
  chatMessages: array, chatInput: string, isClaudeThinking: boolean
}
```

### Text Parsing Capabilities
Supports comprehensive natural language patterns:
- **Directional**: "Castle is 5 miles north of Village"
- **Proximity**: "Market is nearby the Church"  
- **Between**: "Well is between Market and Tavern"
- **Connections**: "Road connects Village and Castle"
- **Naming**: "The castle is called Iron Keep"
- **Waterways**: "River flows from Mountain to Sea"
- **Path naming**: "The road between A and B is Main Street"
- **Renaming**: "The village is named Riverside"

### Technology Stack
- **React 18** with latest features (Concurrent Mode, Automatic batching)
- **Vite 6** for lightning-fast development and optimized builds
- **Vitest 2** for modern testing with native ES modules
- **ESLint 9** with flat config for modern linting
- **TypeScript 5** for enhanced type safety
- **Tailwind CSS 3** for utility-first styling
- **Lucide React** for consistent iconography
- **Custom React hooks** for clean state management
- **SVG rendering** for infinite scalability
- **JSX** file extensions for explicit React components

## Key Implementation Notes

- Component composition follows React best practices with prop drilling minimized through custom hooks
- All map coordinates use a reference point system with 50px per distance unit
- Zoom levels span from 0.001x to 20x (representing 10 feet to 1000 miles)
- SVG rendering allows for infinite scalability and precision
- Interactive elements support both mouse and touch interactions
- Mock Claude integration provides structure for real AI API integration
- Search functionality works across all element types and metadata
- Export/import supports full project persistence in JSON format

## Development Patterns

- Components are kept small and focused on single responsibilities
- Custom hooks encapsulate related state and logic
- Utility functions are pure and testable
- Props are passed explicitly rather than using context (except for complex state)
- Event handlers are defined close to where they're used
- File naming follows component/function naming conventions