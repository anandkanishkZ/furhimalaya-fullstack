import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import { SiteSettingsProvider } from '@/hooks/useSiteSettings';
import { generateDynamicMetadata } from '@/utils/dynamicMetadata';
import AnalyticsProvider from '@/components/AnalyticsProvider';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  variable: '--font-poppins',
  preload: true,
  adjustFontFallback: true
});

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicMetadata();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleSearchConsoleVerification = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION;
  
  return (
    <html lang="en">
      <head>
        {/* Preconnect to API domain for faster resource loading */}
        <link rel="preconnect" href="https://api.furhimalaya.com" />
        <link rel="dns-prefetch" href="https://api.furhimalaya.com" />
        
        {/* Preconnect to Unsplash for images */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Google Search Console Verification */}
        {googleSearchConsoleVerification && (
          <meta name="google-site-verification" content={googleSearchConsoleVerification} />
        )}
        
        {/* Favicon - Multiple formats for best compatibility */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/logo.png" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Additional Meta Tags for better SEO */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={poppins.className}>
        <AnalyticsProvider />
        <SiteSettingsProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}