# Copilot Instructions for ESP Web Flasher

## Project Overview
This is an open-source web-based firmware flashing tool built with React, TypeScript, and Vite. The project provides a customized implementation using esp-web-tools to flash firmware developed by our team to ESP32/ESP8266 devices directly from a web browser.

## Technology Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Dependency Injection**: TSyringe with reflect-metadata
- **Styling**: CSS (custom styles)
- **Linting**: ESLint with TypeScript support
- **ESP Integration**: esp-web-tools (for Web Serial API communication)

## Project Structure
```
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx            # Application entry point
│   ├── assets/             # Static assets (logos, images)
│   └── services/           # Service layer for business logic
├── public/                 # Static public assets
├── .github/               # GitHub-specific files
└── Configuration files    # Vite, TypeScript, ESLint configs
```

## Development Guidelines

### Code Style & Patterns
- Use functional components with hooks (React 19 patterns)
- Implement dependency injection using TSyringe decorators
- Follow TypeScript strict mode guidelines
- Use CSS modules or styled-components for component styling
- Implement proper error boundaries for ESP device communication
- **Comments must be written in English** - All code comments, documentation, and inline explanations should be in English to maintain consistency and accessibility for international contributors

### ESP Web Tools Integration
- Utilize Web Serial API through esp-web-tools library
- Handle device connection states (connected, disconnected, flashing)
- Implement progress tracking for firmware upload
- Provide clear user feedback for device compatibility
- Handle browser compatibility checks (Chrome/Edge required for Web Serial)

### Service Architecture
The `services/` directory should contain:
- **FlashingService**: Core firmware flashing logic
- **DeviceService**: ESP device detection and communication
- **FirmwareService**: Firmware file validation and management
- **UIService**: User interface state management

### Key Features to Implement
1. **Device Detection**: Auto-detect compatible ESP devices
2. **Firmware Selection**: Upload and validate firmware files
3. **Flashing Process**: Progress tracking with real-time feedback
4. **Error Handling**: Comprehensive error messages and recovery
5. **Device Information**: Display chip type, MAC address, flash size
6. **Multiple Firmware Support**: Handle different ESP32/ESP8266 variants

### Browser Compatibility
- Primary support: Chrome, Edge (Web Serial API required)
- Graceful fallback for unsupported browsers
- Clear messaging about browser requirements

### Testing Considerations
- Mock Web Serial API for unit tests
- Test firmware validation logic
- Simulate device connection scenarios
- Test error handling and recovery flows

### Security & Safety
- Validate firmware files before flashing
- Implement safeguards against bricking devices
- Provide clear warnings about firmware compatibility
- Never auto-flash without explicit user confirmation

### UI/UX Guidelines
- Clear step-by-step flashing process
- Progress indicators with time estimates
- Intuitive device selection interface
- Helpful error messages with troubleshooting tips
- Responsive design for various screen sizes

## Common Tasks

### Adding New Firmware Support
1. Extend FirmwareService with new device detection
2. Add firmware validation rules
3. Update UI to display new device types
4. Test with actual hardware

### Improving Error Handling
1. Identify common failure points in flashing process
2. Implement specific error types and messages
3. Add retry mechanisms for transient failures
4. Provide actionable troubleshooting steps

### Performance Optimization
1. Optimize firmware upload speed
2. Implement chunked file transfers
3. Add connection pooling for multiple devices
4. Cache device information

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build

## Important Notes
- Always test firmware flashing with actual ESP devices
- Maintain compatibility with latest esp-web-tools versions
- Follow Web Serial API best practices for device communication
- Ensure proper cleanup of device connections on page unload
- Implement proper TypeScript types for all ESP device interactions