import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "Lumina Estate - Premium Real Estate Platform",
  description: "Discover premium real estate opportunities with Lumina Estate. Professional property management, investment solutions, and expert real estate services.",
  keywords: "real estate, property, investment, luxury homes, commercial real estate",
  authors: [{ name: "Lumina Estate" }],
  creator: 'Lumina Estate',
  publisher: 'Lumina Estate',
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: 'Lumina Estate - Premium Real Estate in Georgia',
    description: 'Discover luxury properties in Tbilisi and throughout Georgia.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lumina Estate'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumina Estate - Premium Real Estate in Georgia',
    description: 'Discover luxury properties in Tbilisi and throughout Georgia.'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${archivoBlack.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
        
        {/* Auto-improvement script */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              // Auto-apply image fallbacks
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  const images = document.querySelectorAll('img');
                  images.forEach(img => {
                    if (!img.onerror) {
                      img.onerror = function() {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';
                      };
                    }
                    if (!img.hasAttribute('loading')) {
                      img.setAttribute('loading', 'lazy');
                    }
                    if (!img.hasAttribute('alt') || img.alt === '') {
                      img.setAttribute('alt', 'Image');
                    }
                  });
                }, 500);
              }
            `
          }}
        />
      </body>
    </html>
  );
}
