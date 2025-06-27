# Text-to-Map Generator

An interactive map creation tool that converts natural language descriptions into visual maps with locations, paths, waterways, and regions. Features AI integration with Claude for intelligent map assistance.

![Text-to-Map Generator Demo](demo.gif)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/text-to-map-generator.git
cd text-to-map-generator

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## ✨ Features

### 🗺️ Core Mapping
- **Natural Language Processing**: Convert text descriptions into map elements
- **Interactive Canvas**: Pan, zoom (10ft to 1000mi scale), and drag elements
- **Multiple Element Types**: Locations, paths/roads, waterways with flow direction, and colored regions
- **Smart Positioning**: Directional relationships (north/south/east/west), proximity, and between positioning

### 🎨 Visual Features
- **Regions**: Create overlapping colored areas for geographic, political, or cultural boundaries
- **Dynamic Metadata**: Automatic tracking of locations within regions
- **Visual Hierarchy**: Different styles for roads, highways, rivers, and streams
- **Search & Filter**: Find any element by name, type, or metadata

### 🤖 AI Integration
- **Claude Assistant**: Built-in chat for map analysis and suggestions
- **Direct Manipulation**: Claude can add, modify, and organize map elements
- **Layout Optimization**: Automatic arrangement algorithms (circular, grid, organic)

## 🔧 Development Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Available Scripts
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint on the source code
- `npm run lint:fix` - Fixes ESLint issues automatically

### Project Structure
```
src/
├── components/           # React components
│   ├── TextToMapApp.jsx     # Main application component
│   ├── MapCanvas.jsx        # Interactive map rendering
│   ├── ClaudeChat.jsx       # AI assistant interface
│   ├── MetadataPanel.jsx    # Element information editor
│   ├── MapControls.jsx      # Map interaction controls
│   ├── TextInput.jsx        # Natural language input
│   ├── HelpPanel.jsx        # User guidance
│   └── MapDataPanel.jsx     # Data import/export
├── hooks/               # Custom React hooks
│   ├── useMapData.js        # Map state management
│   ├── useMapInteraction.js # User interaction handling
│   └── useClaudeIntegration.js # AI integration
├── utils/               # Utility functions
│   ├── textParser.js        # Natural language processing
│   ├── mapCalculations.js   # Coordinate transformations
│   ├── validation.js        # Input validation
│   ├── constants.js         # App constants
│   └── search.js           # Search functionality
└── App.js              # App entry point
```

## 📖 Usage Guide

### Natural Language Syntax

The app understands natural language descriptions to create map elements:

#### 🏰 Locations
```
"The castle is north of the village"
"The forest lies 2 miles east of the castle"
"The market is between the church and the tavern"
"The well is nearby the market"
```

#### 🛣️ Paths and Roads
```
"A road connects the village and the castle"
"Highway runs from City to Airport"
"The road between Village and Castle is called King's Road"
"Interstate 95 connects Miami and Boston"
```

#### 🌊 Waterways
```
"A river flows from the mountains to the sea"
"The river from Mountain to Valley is called Blue River"
"A stream runs from the lake to the village"
```

#### 🏷️ Naming Elements
```
"The castle is named Iron Keep"
"The forest is called Dark Woods"
"The village is named Riverside"
```

### Interactive Features

| Feature | Description | How to Use |
|---------|-------------|------------|
| **Search** | Find any element by name, type, or metadata | Use the search bar in the top-left |
| **Zoom** | Scale from 10ft to 1000mi | Scroll wheel or zoom buttons |
| **Pan** | Move around the map | Click and drag the map canvas |
| **Edit Elements** | Modify locations, paths, or regions | Right-click any element for options |
| **Add Regions** | Create colored areas | Click "Add Regions" and define boundaries |
| **Metadata** | Add detailed information to elements | Click any element to open metadata panel |

### 🤖 Claude Integration

The built-in Claude assistant can help you:

- **Analyze your map layout** and provide insights
- **Add geographic features** like mountains, forests, or cities
- **Optimize element positions** for better visualization
- **Create realistic terrain** based on geographic principles
- **Suggest improvements** for map organization

#### Example Claude Commands
```
"Add a mountain range north of the cities"
"Create a highway system connecting all major locations"
"Organize the map in a circular layout"
"Add some rivers and lakes to make the geography more realistic"
```

## 🎯 Examples

### Fantasy World Map
```
The Dark Castle stands on Shadow Peak. Shadow Peak is 5 miles north of Riverside Village. 
The Enchanted Forest lies east of the castle. A winding path connects the village to the castle. 
The path between the village and castle is called the Merchant's Trail. 
A river flows from Shadow Peak to Riverside Village. The river is named Crystal River.
```

### Modern City Map
```
Downtown is the reference point. The Airport is 15 miles south of Downtown.
The University is 3 miles west of Downtown. The Harbor is 5 miles east of Downtown.
Interstate 95 connects the Airport and Downtown. The subway runs from University to Harbor.
Central Park is between Downtown and University.
```

### Regional Map
```
Capital City is the reference point. Northville is 20 miles north of Capital City.
Eastport is 30 miles east of Capital City. Highway 1 runs from Capital City to Northville.
Route 66 connects Capital City and Eastport. The Great River flows from Northville to Eastport.
```

## 🏗️ Architecture

### Component Structure

The application is built with a modular React architecture:

- **TextToMapApp** - Main application container
- **MapCanvas** - Interactive SVG map rendering with zoom/pan
- **TextInput** - Natural language input with example buttons
- **MapControls** - Zoom, search, mode toggles, and tool buttons  
- **ClaudeChat** - AI assistant integration panel
- **MetadataPanel** - Element information editor
- **MapDataPanel** - Import/export functionality
- **HelpPanel** - User guidance and syntax help

### State Management

The app uses custom React hooks for clean separation of concerns:

- **useMapData** - Manages locations, paths, waterways, regions
- **useMapInteraction** - Handles zoom, pan, selection, editing modes
- **useClaudeIntegration** - AI chat and map manipulation

### Data Structure

```javascript
// Map state structure
{
  locations: {
    "Location Name": {
      x: number,           // Map coordinate X
      y: number,           // Map coordinate Y  
      type: string,        // 'reference', 'positioned', 'nearby', 'between', 'manual'
      metadata: string     // User notes and information
    }
  },
  paths: [{
    id: string,           // Unique identifier
    from: string,         // Source location name
    to: string,           // Destination location name
    type: string,         // 'road', 'highway', 'path', 'trail'
    name?: string,        // Optional path name
    metadata: string      // User notes
  }],
  waterways: [{
    id: string,           // Unique identifier
    from: string,         // Source location (flow origin)
    to: string,           // Destination location (flow destination)
    type: string,         // 'river', 'stream', 'creek', 'brook'
    name?: string,        // Optional waterway name
    metadata: string      // User notes
  }],
  regions: [{
    id: string,           // Unique identifier
    name: string,         // Region name
    type: string,         // 'geographic', 'political', 'cultural', etc.
    points: [{x, y}],     // Polygon boundary points
    color: string,        // Hex color code
    opacity: number,      // 0.1 to 1.0
    metadata: string      // User notes and contained locations
  }]
}
```

## 🔌 Integration

### Claude AI Integration

The app includes a mock Claude integration that demonstrates the API structure. To integrate with the real Claude API:

1. Add your Claude API credentials to environment variables
2. Replace the mock response in `useClaudeIntegration.js` with actual API calls
3. Implement the action execution system for direct map manipulation

### Export Formats

- **JSON** - Complete map data with metadata
- **Natural Language** - Generated descriptions of map contents
- **File Download** - Save and load map projects

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style and patterns
4. **Add tests**: Ensure new features are tested
5. **Update documentation**: Include relevant docs and examples
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**: Describe your changes and their benefits

### Development Guidelines

- Use meaningful component and function names
- Follow the existing file structure and naming conventions
- Add JSDoc comments for complex functions
- Keep components small and focused on single responsibilities
- Use custom hooks for reusable logic

## 🐛 Troubleshooting

### Common Issues

**Map not rendering**
- Check browser console for JavaScript errors
- Ensure SVG support in your browser
- Verify React and dependencies are installed correctly

**Text parsing not working**
- Check that your text follows the supported syntax patterns
- Use the Help panel for syntax examples
- Try simpler descriptions first, then build complexity

**Performance issues with large maps**
- Limit to 50-100 locations for optimal performance
- Use regions to group related elements
- Consider breaking large maps into smaller sections

### Browser Support

- Chrome 80+ (recommended)
- Firefox 75+
- Safari 13+
- Edge 80+

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [SVG Coordinate Systems](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** - UI framework
- **Tailwind CSS** - Styling framework  
- **Lucide React** - Icon library
- **Claude by Anthropic** - AI integration inspiration
- **Create React App** - Development toolchain

---

**Built with ❤️ by the Claude Code Assistant**

For questions, issues, or feature requests, please open an issue on GitHub.
