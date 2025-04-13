# HR Employee Management System

## Overview
A modern, feature-rich HR Employee Management System built with Angular 17, featuring employee profile management, advanced search capabilities, and comprehensive analytics.

## Key Features

### 1. Authentication System
- Secure JWT-based authentication
- Login/Registration with email verification
- Password recovery functionality
- Remember me option
- Session management
- Auto logout on token expiration

### 2. Dashboard
- Real-time analytics widgets
- Employee statistics
- Recent searches tracker
- Platform usage metrics
- Interactive charts using Chart.js
- Customizable layout

### 3. Employee Research
- Advanced search functionality
- Real-time search with debouncing
- Multiple filter options
  - Skills
  - Experience
  - Location
  - Platform
- Material Design components
- Loading states and error handling

### 4. Profile Management
- Comprehensive employee profiles
- Profile picture management
- Multiple platform integration
  - LinkedIn
  - GitHub
  - Naukri
- Export functionality
- Bulk actions support

### 5. Search History
- Detailed search tracking
- Timestamp recording
- Filter and sort capabilities
- Export options
- Quick search replay
- History management

### 6. User Settings
- Theme customization (Dark/Light mode)
- Notification preferences
- Profile management
- Password change
- Email preferences
- UI customization

### 7. PWA Features
- Offline functionality
- Install prompts
- Background sync
- Push notifications
- Automatic updates
- Cache management

## Technical Stack

### Frontend
- Angular 17
- Angular Material
- RxJS
- Chart.js
- TypeScript
- SCSS

### State Management
- RxJS BehaviorSubjects
- Local Storage
- Session Storage
- JWT Token Management

### PWA Features
- Service Workers
- Cache API
- IndexedDB
- Web Push API

### UI/UX
- Material Design
- Responsive Layout
- Dark/Light Themes
- Custom Animations
- Loading States
- Error Handling

## Project Structure
```
/src/app/
├── auth/                    # Authentication module
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── dashboard/              # Dashboard module
├── research/              # Employee research module
├── saved-profiles/        # Saved profiles module
├── search-history/        # Search history module
├── user-profile/          # User profile module
├── shared/               # Shared module
│   ├── services/         # Common services
│   ├── models/          # Interfaces
│   ├── guards/          # Route guards
│   ├── interceptors/    # HTTP interceptors
│   └── utils/           # Utilities
```

## Features in Detail

### Authentication System
- JWT token management
- Automatic token refresh
- Session timeout handling
- Secure password reset
- Email verification
- OAuth integration support

### Dashboard Features
- Daily search statistics
- Popular search terms
- Platform usage breakdown
- Recent activity log
- Quick action buttons
- Customizable widgets

### Search Capabilities
- Full-text search
- Advanced filters
- Saved searches
- Export results
- Bulk actions
- Sort options

### Profile Management
- Comprehensive profiles
- Multiple platform links
- Skills management
- Experience tracking
- Location mapping
- Export options

### History Tracking
- Search history
- View history
- Export history
- Filter options
- Sort capabilities
- Bulk delete

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
ng serve
```

4. Build for production:
```bash
ng build --configuration production
```

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement lazy loading
- Write unit tests
- Document components
- Use SCSS for styling

### Best Practices
- Implement error handling
- Add loading states
- Use TypeScript interfaces
- Write clean code
- Follow SOLID principles
- Add proper documentation

### Performance
- Lazy load modules
- Implement PWA
- Use proper caching
- Optimize images
- Minimize bundle size
- Enable compression

## Security Features

### Authentication
- JWT tokens
- HTTP interceptors
- Route guards
- XSS protection
- CSRF protection
- Secure storage

### Data Protection
- Encrypted storage
- Secure transmission
- Token management
- Session handling
- Error masking
- Input validation

## Testing

### Unit Tests
- Component tests
- Service tests
- Guard tests
- Pipe tests
- Directive tests
- Utility tests

### E2E Tests
- Authentication flows
- Search functionality
- Profile management
- History tracking
- Settings management
- Error scenarios

## Deployment

### Production Build
```bash
ng build --configuration production
```

### PWA Setup
```bash
ng add @angular/pwa
```

### Server Requirements
- Node.js 14+
- NPM 6+
- Angular CLI 17+
- Modern browser support
- HTTPS enabled
- Proper CORS setup

## Support

For support, please contact:
- Email: support@hrmanagement.com
- Documentation: [docs-url]
- Issues: [issues-url]
