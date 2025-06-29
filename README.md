# Lumina Estate - Real Estate Platform

A modern, multilingual real estate platform built with Next.js, featuring advanced search, AI chat, and interactive maps.

## Features

- 🌍 **Multilingual Support**: Georgian, English, and Russian
- 🗺️ **Interactive Maps**: Real Google Maps integration with property markers
- 🤖 **AI Chat Assistant**: Get property recommendations and answers
- 🔍 **Advanced Search & Filters**: Find properties by location, price, type, and more
- 📱 **Responsive Design**: Works perfectly on all devices
- 🎨 **Modern UI**: Clean, professional interface with dark/light mode
- 🔒 **Security**: Comprehensive security implementation with CSP, input validation, and more

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps JavaScript API with @vis.gl/react-google-maps
- **Validation**: Zod for schema validation
- **Security**: DOMPurify for XSS prevention

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Maps API Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lumina-estate
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Maps API Key:

   a. Go to [Google Cloud Console](https://console.cloud.google.com/)
   
   b. Create a new project or select an existing one
   
   c. Enable the following APIs:
      - Maps JavaScript API
      - Places API (optional, for enhanced search)
   
   d. Create credentials (API Key)
   
   e. Restrict the API key (recommended):
      - Application restrictions: HTTP referrers
      - Add your domain: `http://localhost:3000/*` for development
   
   f. Create a `.env.local` file in the project root:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Google Maps API Key (Required for map functionality)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Example:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Project Structure

```
lumina-estate/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── properties/      # Properties page and components
│   │   └── agents/          # Agents page
│   ├── components/          # Shared components
│   ├── contexts/           # React contexts (Language, Theme)
│   └── lib/                # Utility libraries
├── public/                 # Static assets
└── docs/                  # Documentation
```

## Key Components

### MapView Component
- Real Google Maps integration
- Property markers with custom colors by type
- Interactive info windows
- Zoom controls and legend
- Responsive design

### Language System
- Complete translation system for 3 languages
- Persistent language selection
- Secure localStorage with validation

### Security Features
- Content Security Policy (CSP)
- Input validation with Zod
- XSS prevention with DOMPurify
- Rate limiting for AI chat
- Secure headers implementation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Map Features

The interactive map includes:
- 7 sample properties across Tbilisi districts
- Color-coded markers by property type
- Detailed property information in popups
- Zoom controls and reset functionality
- Property count display
- Type legend

## Security Implementation

This project includes comprehensive security measures:
- CSP headers to prevent XSS attacks
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure localStorage handling
- HTTPS enforcement (production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.

---

**Note**: Make sure to replace the placeholder Google Maps API key with your actual key for the map functionality to work properly.
