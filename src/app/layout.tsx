import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { Inter, Archivo_Black, Noto_Sans_Georgian, Noto_Sans } from "next/font/google";
import "./globals.css";
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import ConditionalLayout from './ConditionalLayout';
import { CompareProvider } from '@/contexts/CompareContext';
import GlobalAIChat from '@/app/components/GlobalAIChat';

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: 'swap',
  variable: "--font-inter",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-archivo-black",
});

const notoGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  weight: ["700", "800", "900"],
  display: 'swap',
  variable: "--font-noto-georgian",
});

const notoCyrillic = Noto_Sans({
  subsets: ["cyrillic"],
  weight: ["800", "900"],
  display: 'swap',
  variable: "--font-noto-cyrillic",
});

export const metadata: Metadata = {
  title: "Lumina Estate - Premium Real Estate Platform",
  description: "Discover premium real estate opportunities with Lumina Estate. Professional property management, investment solutions, and expert real estate services.",
  keywords: "real estate, property, investment, luxury homes, commercial real estate",
  authors: [{ name: "Lumina Estate" }],
  creator: 'Lumina Estate',
  publisher: 'Lumina Estate',
  // moved to dedicated viewport export
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('lumina_language')?.value as 'ka' | 'en' | 'ru' | undefined;
  const initialLang = langCookie && ['ka','en','ru'].includes(langCookie) ? langCookie : 'ka';
  return (
    <html lang={initialLang} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GA4_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA4_ID}',{anonymize_ip:true});`,
              }}
            />
          </>
        ) : null}
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Basic SEO */}
        <meta name="description" content="Discover premium real estate opportunities with Lumina Estate." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Lumina Estate',
            url: 'https://lumina-estate.example',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://lumina-estate.example/properties?location={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }} />
      </head>
      <body
        className={`${inter.variable} ${archivoBlack.variable} ${notoGeorgian.variable} ${notoCyrillic.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider initialLanguage={initialLang}>
              <AuthProvider>
                <FavoritesProvider>
                  <CompareProvider>
                    <ConditionalLayout>{children}</ConditionalLayout>
                    <GlobalAIChat />
                  </CompareProvider>
                </FavoritesProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
