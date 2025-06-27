# Text-to-Map Generator Project Brief

## Overview
An interactive web application that converts natural language descriptions into visual maps using React and modern AI integration.

## Key Features
- **Natural Language Processing**: Parse text descriptions into map coordinates and relationships
- **Interactive Map Canvas**: SVG-based map rendering with zoom, pan, and drag functionality
- **Multi-Provider AI Integration**: Support for OpenAI, Anthropic, Google Gemini, DeepSeek, LM Studio, and Kobold AI
- **Manual Map Creation**: Click-to-create paths, waterways, and regions with visual feedback
- **Real-time Collaboration**: AI assistant integration for map suggestions and analysis
- **Import/Export**: JSON-based project persistence and sharing

## Architecture
- **Frontend**: React 18.3+ with Vite 6.0+ build system
- **State Management**: Custom React hooks (useMapData, useMapInteraction, useClaudeIntegration)
- **Styling**: Tailwind CSS 3.4+ with responsive design
- **Testing**: Vitest with modern testing utilities
- **Linting**: ESLint 9+ with React and accessibility rules

## Core Components
- `TextToMapApp`: Main application orchestrator
- `MapCanvas`: Interactive SVG map with zoom/pan/selection
- `AISettingsPanel`: Multi-provider AI configuration with API key management
- `MapControls`: Toolbar with creation modes and tools
- `ClaudeChat`: AI assistant chat interface

## AI Integration
- Unified API client supporting multiple providers
- Automatic model fetching and selection
- Connection testing and error handling
- Secure API key storage with show/hide functionality
- Timeout and retry mechanisms for reliability

## Development Status
- ✅ Core mapping functionality complete
- ✅ Multi-provider AI integration implemented
- ✅ Modern build system migration (CRA → Vite)
- ✅ Path/waterway creation functionality fixed
- 🔄 Testing infrastructure setup
- 📋 Performance optimization pending

## Technical Stack
- **Build Tool**: Vite 6.0+ (migrated from Create React App)
- **Runtime**: React 18.3+ with modern hooks
- **Icons**: Lucide React 0.469+
- **Type Safety**: TypeScript 5.7+ support
- **Code Quality**: ESLint 9+ with modern configurations