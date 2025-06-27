# Technology Stack

## Build System & Development

### Core Build Tools
- **Vite 6.0.3** - Next-generation frontend build tool
  - Lightning-fast HMR and dev server
  - Optimized production builds with Rollup
  - Native ES modules support
  - Target: `baseline-widely-available` (Chrome 107+, Edge 107+, Firefox 104+, Safari 16+)

### Package Management
- **npm** - Package manager with lockfile v3
- **Node.js 20.19+** - Minimum runtime requirement
- **ES Modules** - `"type": "module"` in package.json

## Frontend Framework

### React Ecosystem
- **React 18.3.1** - Latest stable with concurrent features
  - `createRoot` API for React 18 rendering
  - Automatic batching and concurrent mode
  - Modern JSX transform (`jsx: "react-jsx"`)
- **React DOM 18.3.1** - DOM rendering library

### Component Architecture
- **JSX Files** - Explicit `.jsx` extensions for React components
- **Functional Components** - Hooks-based architecture throughout
- **Forward Refs** - Used in MapCanvas for direct DOM access
- **Custom Hooks** - Encapsulated state management patterns

## Styling & UI

### CSS Framework
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
  - JIT compilation for optimized builds
  - Custom design system integration
  - Responsive design utilities
  - Dark mode support capabilities

### Icons & Graphics
- **Lucide React 0.469.0** - Modern icon library
  - Tree-shakeable SVG icons
  - Consistent 24px icon system
  - Accessibility-focused design

### Visual Rendering
- **SVG** - Native browser SVG for map rendering
  - Infinite scalability and precision
  - Hardware-accelerated transformations
  - Direct DOM manipulation via refs

## Development Tools

### Code Quality
- **ESLint 9.17.0** - Modern flat config linting
  - `@eslint/js` base configurations
  - React-specific rules (`eslint-plugin-react`)
  - React Hooks rules (`eslint-plugin-react-hooks`)
  - React Refresh integration (`eslint-plugin-react-refresh`)
  - Global browser environment (`globals`)

### Type Safety
- **TypeScript 5.7.2** - Optional type checking
  - ES2020 target with modern features
  - Bundler module resolution
  - Strict mode enabled for quality
  - JSX support with React 18 transform

### Testing Framework
- **Vitest 2.1.8** - Vite-native testing framework
  - Native ES modules support
  - Jest-compatible API
  - JSX/TSX transformation
  - JSDOM environment for DOM testing
  - Coverage reporting capabilities

### Testing Environment
- **JSDOM 26.0.0** - DOM simulation for testing
- **React Testing Library** patterns (via Vitest)
- **Test Setup** - Global test environment configuration

## Build Configuration

### Vite Configuration (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'baseline-widely-available',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
```

### Development Server
- **Port 3000** - Development server (auto-open browser)
- **Port 4173** - Preview server for production builds
- **HMR** - Hot Module Replacement for instant updates

## External Integrations

### AI Provider APIs
- **OpenAI API** - GPT models via REST API
- **Anthropic API** - Claude models with specific headers
- **Google Gemini API** - Generative AI with token-based auth
- **DeepSeek API** - OpenAI-compatible interface
- **Local Models** - LM Studio and Kobold AI support

### Network & Storage
- **Fetch API** - Modern HTTP client with AbortController
- **LocalStorage** - Persistent settings and API keys
- **JSON** - Data serialization for import/export
- **Base64** - Secure API key encoding patterns

## Development Constraints

### Browser Compatibility
- **Baseline Widely Available** - Features supported across modern browsers
- **ES2020** - Modern JavaScript features enabled
- **Native ES Modules** - No polyfills for older browsers
- **SVG Support** - Required for map rendering

### Performance Considerations
- **Bundle Splitting** - Vendor and UI chunks separated
- **Tree Shaking** - Unused code elimination
- **Sourcemaps** - Available for debugging
- **Lazy Loading** - Components loaded on demand

### Security Implementation
- **API Key Storage** - LocalStorage with show/hide UI
- **XSS Prevention** - React's built-in protections
- **CORS Handling** - Provider-specific configurations
- **Input Sanitization** - Validation before processing

## Development Workflow

### Scripts (package.json)
```json
{
  "dev": "vite",                    // Development server
  "build": "vite build",            // Production build
  "preview": "vite preview",        // Preview production build
  "test": "vitest",                 // Run tests
  "test:ui": "vitest --ui",         // Interactive test interface
  "coverage": "vitest run --coverage", // Coverage reports
  "lint": "eslint . --ext ts,tsx,js,jsx", // Code linting
  "lint:fix": "eslint . --fix",     // Auto-fix lint issues
  "type-check": "tsc --noEmit"      // TypeScript validation
}
```

### File Extensions
- `.jsx` - React components
- `.js` - Utility functions and services
- `.ts/.tsx` - TypeScript files (when needed)
- `.css` - Stylesheets (Tailwind imports)

## Dependencies Overview

### Production Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1", 
  "lucide-react": "^0.469.0"
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.17.0",
  "@types/react": "^18.3.12",
  "@types/react-dom": "^18.3.1",
  "@vitejs/plugin-react": "^4.3.3",
  "autoprefixer": "^10.4.20",
  "eslint": "^9.17.0",
  "globals": "^15.14.0",
  "jsdom": "^26.0.0",
  "postcss": "^8.5.1",
  "tailwindcss": "^3.4.17",
  "typescript": "^5.7.2",
  "vite": "^6.0.3",
  "vitest": "^2.1.8"
}
```

## Migration Notes

### From Create React App
- **Build System** - Migrated from Webpack to Vite
- **Scripts** - Updated from `react-scripts` to Vite commands
- **Entry Point** - Moved from `public/index.html` to root `index.html`
- **Module System** - Native ES modules instead of CommonJS
- **Hot Reload** - Vite HMR instead of Webpack HMR

### Modern Standards Adopted
- **ESLint 9** - Flat config instead of legacy .eslintrc
- **React 18** - Latest stable with concurrent features
- **TypeScript 5** - Modern type system capabilities
- **Vitest** - Native test runner instead of Jest + CRA setup