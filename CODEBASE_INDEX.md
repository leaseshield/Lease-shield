# Lease Shield AI - Codebase Index

## Overview
Lease Shield AI is a comprehensive lease analysis platform that uses Google's Gemini AI to help tenants understand their lease agreements. The application features secure authentication, PDF processing, AI-powered analysis, and interactive dashboards.

## Tech Stack

### Frontend
- **React 18.2.0** - Main UI framework
- **Material-UI (MUI) 5.13.0** - Component library and theming
- **React Router DOM 6.11.1** - Client-side routing
- **Firebase SDK 9.22.0** - Authentication, Firestore, Storage
- **Framer Motion 12.23.6** - Animations
- **React Dropzone 14.3.8** - File upload handling
- **jsPDF 3.0.1** - PDF generation
- **Recharts 2.15.3** - Data visualization
- **React Markdown 9.1.0** - Markdown rendering
- **Three.js 0.178.0** - 3D graphics (with React Three Fiber)

### Backend
- **Flask 2.2.2** - Python web framework
- **Firebase Admin SDK 6.1.0** - Server-side Firebase integration
- **Google Generative AI 0.5.4** - Gemini AI integration
- **PyMuPDF 1.23.7** - PDF text extraction
- **Pillow 9.3.0** - Image processing
- **Flask-CORS 3.0.10** - Cross-origin resource sharing

## Project Structure

### Root Directory
```
Lease-shield/
├── package.json                 # Frontend dependencies and scripts
├── README.md                   # Project documentation
├── requirements.txt            # Backend Python dependencies
├── compress-video.sh          # Video compression script
├── firestore.rules            # Firebase security rules
└── public/                    # Static assets
    ├── images/
    ├── index.html
    └── manifest.json
```

### Frontend (`src/`)
```
src/
├── App.js                     # Main application component with routing
├── index.js                   # Application entry point
├── firebase/
│   └── config.js             # Firebase configuration
├── context/
│   └── UserProfileContext.js  # User profile state management
├── hooks/
│   └── useAuthState.js       # Firebase authentication hook
├── utils/
│   ├── displayUtils.js       # Utility functions
│   └── paymentUtils.js       # Payment processing utilities
├── components/               # Reusable UI components
│   ├── Layout.js            # Main layout wrapper
│   ├── InteractiveClauseAnalyzer.js
│   ├── BentoFeaturesGrid.js
│   ├── EnhancedTestimonials.js
│   ├── FilePreview.js
│   ├── InteractiveComparisonTable.js
│   ├── InteractiveComponents.js
│   ├── PreferencesForm.js
│   ├── ScrollytellingChart.js
│   └── AuthRedirect.js
└── pages/                   # Application pages
    ├── LandingPage.js       # Homepage with marketing content
    ├── Login.js            # Authentication pages
    ├── Register.js
    ├── DashboardPage.js    # User dashboard
    ├── LeaseAnalysis.js    # Core lease analysis functionality
    ├── LeaseCalculator.js  # Lease cost calculator
    ├── LeaseManager.js     # Lease management (paid feature)
    ├── Profile.js         # User profile management
    ├── Pricing.js         # Subscription pricing page
    ├── TrialPage.js       # Free trial experience
    ├── AdminPage.js       # Admin panel
    ├── RealEstateAgentPage.js
    ├── ExpenseScannerPage.js
    ├── PhotoInspectionPage.js
    ├── AIChat.js          # AI chat interface
    ├── NotFound.js        # 404 page
    └── blog/              # Blog content pages
        ├── BlogIndexPage.js
        ├── BlogPostLayout.js
        └── [various blog posts]
```

### Backend (`backend/`)
```
backend/
├── app.py                  # Main Flask application (2094 lines)
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
└── lease-shield-ai-firebase-admin-sdk.json.example
```

### Mock Server (`mock-server/`)
```
mock-server/
├── server.js              # Development mock server
├── package.json
└── package-lock.json
```

## Core Features

### 1. Authentication & User Management
- **Firebase Authentication** - Email/password and social login
- **User Profiles** - Subscription tiers (free, pro, commercial)
- **Protected Routes** - Role-based access control
- **Admin Panel** - User management and analytics

### 2. Lease Analysis Engine
- **PDF Upload & Processing** - Secure file handling
- **AI-Powered Analysis** - Google Gemini AI integration
- **Interactive Results** - Visual clause analysis
- **Risk Assessment** - Lease quality scoring
- **Multi-Document Support** - Batch analysis capabilities

### 3. Additional Tools
- **Lease Calculator** - Cost analysis and comparison
- **Expense Scanner** - Receipt and document analysis
- **Photo Inspection** - Property condition documentation
- **AI Chat** - Interactive lease assistance
- **Real Estate Agent Tools** - Professional features

### 4. Content & Marketing
- **Blog System** - Educational content about leases
- **Landing Page** - Marketing and feature showcase
- **Pricing Tiers** - Subscription management
- **Trial Experience** - Free tier functionality

## Key Components

### Authentication Flow
```javascript
// src/hooks/useAuthState.js - Firebase auth state management
// src/context/UserProfileContext.js - User profile data
// src/App.js - Protected route logic
```

### Lease Analysis Process
```javascript
// src/pages/LeaseAnalysis.js - Main analysis interface
// backend/app.py - AI processing endpoints
// - /api/analyze - Document analysis
// - /api/chat - AI chat functionality
```

### Dashboard & Management
```javascript
// src/pages/DashboardPage.js - User dashboard
// src/pages/LeaseManager.js - Lease management
// src/pages/AdminPage.js - Admin panel
```

## API Endpoints

### Backend Routes (`backend/app.py`)
- `GET /api/ping` - Health check
- `POST /api/analyze` - Document analysis
- `POST /api/chat` - AI chat
- `POST /api/calculate-lease` - Lease cost calculation
- `POST /api/scan-expense` - Expense document processing
- `POST /api/inspect-photos` - Photo inspection
- `POST /api/payid/create-checkout-session` - Payment processing
- `POST /api/maxelpay/webhook` - Payment webhook
- `GET /api/admin/users` - Admin user management
- `POST /api/admin/set-scans` - Admin scan management
- `POST /api/admin/create-commercial` - Commercial user creation

## Data Models

### Firebase Collections
- `users` - User profiles and subscription data
- `leases` - Lease analysis results
- `inspections` - Photo inspection data
- `expenses` - Expense scanning results
- `chats` - AI chat conversations

### User Profile Structure
```javascript
{
  subscriptionTier: 'free' | 'pro' | 'commercial',
  freeScansUsed: number,
  proScansUsed: number,
  commercialScansUsed: number,
  createdAt: timestamp,
  lastLoginAt: timestamp
}
```

## Security & Configuration

### Environment Variables
- `REACT_APP_FIREBASE_API_KEY` - Firebase configuration
- `GEMINI_API_KEY_1/2/3` - Google AI API keys
- `SENTRY_DSN` - Error tracking (optional)

### Firebase Security Rules
- User-specific data access
- Subscription tier restrictions
- Admin-only operations

## Deployment

### Frontend
- React build process
- Firebase Hosting ready
- Environment-specific configurations

### Backend
- Flask application with Gunicorn
- Docker containerization
- Google Cloud Run deployment ready

## Development Setup

### Prerequisites
- Node.js and npm
- Python 3.8+
- Firebase project
- Google AI Studio API key

### Local Development
1. Frontend: `npm start` (port 3000)
2. Backend: `python app.py` (port 8081)
3. Mock Server: `node server.js` (port 8081)

## Key Features by Subscription Tier

### Free Tier
- Limited lease analysis (3 scans/month)
- Basic AI chat
- Educational blog access

### Pro Tier
- Unlimited lease analysis
- Advanced AI features
- Lease calculator
- Expense scanner

### Commercial Tier
- All Pro features
- Multi-user management
- Advanced analytics
- Priority support

## Performance & Monitoring

### Analytics
- Google Analytics 4 integration
- Route change tracking
- User behavior monitoring

### Error Tracking
- Sentry integration (optional)
- Comprehensive error handling
- Backend health monitoring

## Content Strategy

### Blog Topics
- Lease scam prevention
- Common clause explanations
- Negotiation strategies
- Tenant rights overview
- AI tool usage guides
- Industry-specific content

### SEO & Marketing
- React Helmet for meta tags
- Structured content
- Landing page optimization
- Conversion funnel design

This codebase represents a comprehensive SaaS platform for lease analysis, combining modern web technologies with AI capabilities to provide valuable insights for tenants and property managers. 