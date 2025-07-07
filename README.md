# Lumina Estate - Real Estate Platform

## 🏠 Overview
Lumina Estate is a modern real estate platform built with Next.js 15, TypeScript, and Tailwind CSS v4. The platform features a beautiful, responsive design with dark mode support, multi-language capabilities (Georgian, English, Russian), and integration with Motiff design system.

## 🚀 Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Dark Mode**: Full dark mode support with manual toggle
- **Multi-language**: Support for Georgian (ka), English (en), and Russian (ru)
- **Property Listings**: Advanced search and filtering capabilities
- **Interactive Maps**: Google Maps integration for property locations
- **Agent Dashboard**: Comprehensive dashboard for real estate agents
- **Investor Portal**: Dedicated section for property investors
- **AI Chat Integration**: Smart property recommendations and assistance

## 🛠️ Tech Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion + GSAP
- **Icons**: Phosphor Icons, React Icons, Lucide
- **Maps**: Google Maps API, Leaflet (fallback)
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/MaGioMusic/Luminia-Estate-Motiff-Edition-Private.git

# Navigate to project directory
cd lumina-estate

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Dark Mode
The application uses a class-based dark mode strategy. Dark mode can be toggled from:
- Settings page (`/settings`)
- Header menu toggle

### Language Support
Languages can be switched from the header menu. Supported languages:
- 🇬🇪 Georgian (ka) - Primary
- 🇬🇧 English (en) - Secondary
- 🇷🇺 Russian (ru) - Tertiary

## 📁 Project Structure

```
lumina-estate/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
│   ├── images/          # Images and icons
│   └── videos/          # Video assets
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.ts       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Lumina Gold (#D4AF37, #B8860B)
- **Secondary**: Deep Blue (#1E3A8A, #3B82F6)
- **Neutral**: Gray Scale (#F8FAFC to #0F172A)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Inter
- **Serif Font**: Georgia (fallback)
- **Display Font**: Archivo Black

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel
```

## 🧪 Testing
```bash
# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📝 License
This project is private and proprietary.

## 👥 Contributors
- MaGioMusic - Project Owner

## 🤝 Contributing
This is a private repository. Please contact the project owner for contribution guidelines.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
