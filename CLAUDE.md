# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Text-to-Map Generator is a sophisticated React application that converts natural language descriptions into interactive visual maps. The application features production-grade multi-provider AI integration, advanced validation systems, and comprehensive map creation tools. The codebase follows modern React patterns with custom hooks for clean state management.

## Development Commands

- **Start development server**: `npm run dev` (Vite dev server on port 3000)
- **Build for production**: `npm run build` (Vite optimized build to `/build` directory)
- **Preview production build**: `npm run preview` (Vite preview server on port 4173)
- **Run tests**: `npm run test` (Vitest test runner)
- **Test with UI**: `npm run test:ui` (Interactive test interface)
- **Coverage report**: `npm run coverage` (Test coverage analysis)
- **Lint code**: `npm run lint` (Modern ESLint 9 with flat config)
- **Fix lint issues**: `npm run lint:fix`
- **Type checking**: `npm run type-check` (TypeScript validation)
- **Install dependencies**: `npm install`

## Architecture

### Component Structure
The application follows a modular React architecture with 26 components:

**Primary Application Components:**
- **TextToMapApp.jsx**: Main application orchestrator integrating all features
- **MapCanvas.jsx**: Interactive SVG map with zoom/pan/selection (forwardRef for performance)
- **TextInput.jsx**: Natural language input with example prompts and processing modes
- **MapControls.jsx**: Comprehensive toolbar with zoom, search, mode toggles, and cleanup tools
- **ClaudeChat.jsx**: AI assistant integration with multi-provider settings access
- **AISettingsPanel.jsx**: Full AI provider configuration with connection testing

**Advanced UI Components:**
- **MetadataPanel.jsx**: Element information editor for detailed data entry
- **MapDataPanel.jsx**: Import/export functionality with JSON support
- **HelpPanel.jsx**: User guidance and syntax examples
- **ValidationPanel.jsx**: Three-tier validation system (critical/warnings/duplicates)
- **SearchPanel.jsx**: Element search and filtering with focus management
- **RegionModal.jsx**: Sophisticated region creation with color picker (16 presets + custom)
- **ContextMenu.jsx**: Right-click actions for element management (delete, rename)

**Map Rendering Components:**
- **GridPattern.jsx**: SVG grid background pattern for visual reference
- **ScaleIndicator.jsx**: Dynamic distance scale based on zoom level
- **CompassRose.jsx**: Navigation orientation indicator
- **MapLegend.jsx**: Element type and status legend with statistics
- **RegionPreview.jsx**: Real-time preview during region creation mode

### Custom Hooks for State Management
State is managed through three custom hooks for clean separation of concerns:

**useMapData.js**: Core map data management
- Manages locations, paths, waterways, and regions with full CRUD operations
- Handles text parsing and three-tier validation system
- Provides methods for adding, removing, clearing, and modifying map elements
- Implements undo/redo functionality with 10-action history
- Processes natural language relationships into map coordinates
- Includes advanced features: location renaming, region completion, element deletion

**useMapInteraction.js**: User interaction handling  
- Manages zoom, pan, and viewport transformations
- Handles selection and editing modes (path, waterway, region creation)
- Controls context menus and editing states with visual feedback
- Provides helper functions for mode toggling and view reset
- Manages region point collection and creation workflow

**useClaudeIntegration.js**: Production AI assistant integration
- Manages chat messages and conversation state
- Integrates with multi-provider AI system via AIClient (production system)
- Handles map analysis and suggestion features with real API calls
- Provides quick action functions for common AI requests
- Manages AI provider configuration and comprehensive error handling

### Service Layer

**aiProviders.js**: Multi-provider AI integration service
- **6 AI Providers**: OpenAI, Anthropic, Google Gemini, DeepSeek, LM Studio, Kobold AI
- **AISettings Class**: Persistent configuration management with localStorage
- **AIClient Class**: Unified API client with error handling, timeouts, and retries
- **Provider-specific implementations**: Custom request handlers for each API
- **Connection testing**: Real-time API validation with provider-specific tests
- **Model management**: Automatic model fetching and caching capabilities

### Utility Modules

**textParser.js**: Enhanced natural language processing
- Comprehensive regex patterns for 15+ spatial relationship types
- Support for directional, proximity, and between positioning
- Path and waterway creation with naming capabilities
- Location renaming and metadata handling
- Returns structured data for coordinate calculation

**mapCalculations.js**: Coordinate and geometric operations
- Screen/map coordinate transformation functions with zoom/offset
- Directional positioning calculations (50px per unit scale)
- Point-in-polygon detection for region boundaries
- Feature type classification based on naming patterns
- Layout optimization algorithms (circular, grid, organic force-directed)

**validation.js**: Advanced input validation and error handling
- Three-tier validation: critical issues, warnings, duplicates
- Validates parsed text data before map updates
- Checks for duplicate locations and parsing conflicts
- Provides intelligent warnings for unrealistic distances
- Classifies geographic features for appropriate handling

**search.js**: Search and filtering functionality
- Performs text-based search across all map elements
- Supports metadata and type-based filtering
- Provides result focusing and highlighting with navigation
- Handles search result management and clear functionality

**constants.js**: Shared configuration values and enums

### Data Flow and State Structure
```javascript
// Centralized state managed by custom hooks
{
  // Map data (useMapData)
  locations: { name: { x, y, type, metadata } },
  paths: [{ id, from, to, type, name?, metadata }],
  waterways: [{ id, from, to, type, name?, metadata }],
  regions: [{ id, name, type, points, color, opacity, metadata }],
  undoStack: [{ action, data }], // 10-action history
  
  // Interaction state (useMapInteraction)
  zoom: number, offset: {x, y}, selectedItem: object,
  modes: { pathMode, waterwayMode, regionMode, selectedNode },
  editingStates: { editingPath, editingWaterway, editingLocation, editingRegion },
  regionPoints: array, // Live region creation points
  
  // AI integration (useClaudeIntegration)  
  chatMessages: array, chatInput: string, isClaudeThinking: boolean,
  
  // Panel visibility (TextToMapApp)
  showHelp, showMapData, showMetadataPanel, showChatPanel,
  showValidationPanel, showSearchPanel, showRegionModal
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
- **React 18.3+** with latest features (Concurrent Mode, Automatic batching)
- **Vite 6.3+** for lightning-fast development and optimized builds (ES2015 target)
- **Vitest 2.1+** for modern testing with native ES modules and JSDOM
- **ESLint 9.17+** with flat config for modern linting and React rules
- **TypeScript 5.7+** for enhanced type safety (configured but optional)
- **Tailwind CSS 3.4+** for utility-first styling with JIT compilation
- **Lucide React 0.469+** for consistent iconography (tree-shakeable SVG)
- **Custom React hooks** for clean state management (no external state libraries)
- **SVG rendering** for infinite scalability and precision
- **JSX** file extensions for explicit React components

## AI Integration

### Production Multi-Provider System
- **Full API Integration**: Real connections to 6 different AI providers
- **Provider Management**: Complete configuration system with API keys and endpoints
- **Error Handling**: Comprehensive error boundaries with provider-specific messaging
- **Connection Testing**: Real-time API validation with test requests
- **Model Selection**: Automatic model fetching and user selection capabilities
- **Local Model Support**: LM Studio and Kobold AI for local deployment

### Supported Providers
1. **OpenAI**: GPT-4, GPT-4-turbo, GPT-3.5-turbo
2. **Anthropic Claude**: Opus, Sonnet, Haiku
3. **Google Gemini**: 1.5-pro, 1.5-flash, Gemini-pro
4. **DeepSeek**: Chat, Coder models
5. **LM Studio**: Local model support
6. **Kobold AI**: Local model support

## Key Implementation Notes

### Architecture Patterns
- Component composition follows React best practices with prop drilling minimized through custom hooks
- All map coordinates use a reference point system with 50px per distance unit
- Zoom levels span from 0.001x to 20x (representing 10 feet to 1000 miles)
- SVG rendering allows for infinite scalability and precision
- Interactive elements support both mouse and touch interactions

### Advanced Features
- **Three-tier validation system**: Critical issues, warnings, and duplicate detection
- **Sophisticated region creation**: Color picker with 16 preset colors + custom color input
- **Production AI integration**: Real API calls with comprehensive error handling
- **Context menu system**: Right-click actions for element management
- **Undo/redo functionality**: 10-action history with visual indicators
- **Advanced search**: Cross-element search with focus management and navigation

### Data Management
- **Complete state persistence**: JSON export/import with full project data
- **Processing modes**: Batch and incremental text processing options
- **Validation feedback**: Real-time validation with user-friendly error reporting
- **Element relationships**: Automatic coordinate calculation and relationship mapping

### Build Configuration
- **Output directory**: `/build` (configured for deployment)
- **Base path**: `./` (relative paths for flexible deployment)
- **Target**: ES2015 for broad browser compatibility
- **Code splitting**: Vendor and UI chunks for optimized loading
- **Source maps**: Enabled for debugging

## Development Patterns

- Components are kept small and focused on single responsibilities
- Custom hooks encapsulate related state and logic for clean separation of concerns
- Utility functions are pure and testable with comprehensive error handling
- Props are passed explicitly rather than using context (hooks handle complex state)
- Event handlers are defined close to where they're used
- File naming follows component/function naming conventions (.jsx for React components)
- AI integration is production-ready with real API connections and error boundaries
- Validation system provides immediate feedback with three tiers of issue severity
- Region creation includes sophisticated UI with color management and validation

## Memory Bank Integration

This project uses a comprehensive Memory Bank system located in `.kilocode/rules/memory-bank/` with complete documentation of:
- **product.md**: Product definition, user goals, and feature specifications
- **architecture.md**: System architecture, component relationships, and technical patterns  
- **tech.md**: Technology stack, build configuration, and development tools
- **context.md**: Current project state, recent changes, and development priorities
- **brief.md**: Project overview and development status summary

The Memory Bank provides complete context for all development work and should be consulted for comprehensive project understanding.