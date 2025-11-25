import publicApiClient from '@/utils/publicApiClient';

interface MetadataParams {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
}

export async function generateDynamicMetadata(params?: MetadataParams) {
  try {
    const response = await publicApiClient.getPublicSettings();
    const settings = response.success ? (response.data || {}) : {};

    // Get dynamic values from settings with fallbacks
    const companyName = settings?.company_name || 'Fur Himalaya';
    const tagline = settings?.company_tagline || 'Luxury Pashmina Heritage';
    const defaultTitle = settings?.seo_meta_title || `${companyName} - ${tagline}`;
    const defaultDescription = settings?.seo_meta_description || 'Experience the finest authentic Himalayan Pashmina. Each piece represents centuries of traditional craftsmanship and uncompromising quality.';
    const defaultKeywords = settings?.seo_keywords || 'pashmina, luxury scarves, himalayan crafts, premium shawls, authentic cashmere, luxury fashion';
    const favicon = settings?.site_favicon || '/favicon.ico';
    const ogImage = settings?.seo_og_image || settings?.seo_google_image || '/images/logo.png';
    const twitterImage = settings?.seo_twitter_card_image || ogImage;

    // Build final values
    const finalTitle = params?.title ? `${params.title} - ${companyName}` : defaultTitle;
    const finalDescription = params?.description || defaultDescription;
    const finalKeywords = params?.keywords || defaultKeywords;
    const finalImage = params?.image || ogImage;
    
    // Construct absolute URL for images
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const absoluteImageUrl = finalImage.startsWith('http') ? finalImage : `${baseUrl}${finalImage}`;
    const absoluteFaviconUrl = favicon.startsWith('http') ? favicon : `${baseUrl}${favicon}`;
    
    return {
      title: finalTitle,
      description: finalDescription,
      keywords: finalKeywords,
      authors: [{ name: companyName }],
      creator: companyName,
      publisher: companyName,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      },
      icons: {
        icon: absoluteFaviconUrl,
        shortcut: absoluteFaviconUrl,
        apple: absoluteFaviconUrl,
      },
      manifest: '/manifest.json',
      openGraph: {
        type: 'website',
        siteName: companyName,
        title: finalTitle,
        description: finalDescription,
        url: params?.path ? `${baseUrl}${params.path}` : baseUrl,
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: finalTitle,
          },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        site: settings?.social_twitter || '@forevershine',
        creator: settings?.social_twitter || '@furhimalaya',
        title: finalTitle,
        description: finalDescription,
        images: [twitterImage.startsWith('http') ? twitterImage : `${baseUrl}${twitterImage}`],
      },
      alternates: {
        canonical: params?.path ? `${baseUrl}${params.path}` : baseUrl,
      },
      other: {
        'google-site-verification': settings?.google_site_verification || '',
        'msvalidate.01': settings?.bing_site_verification || '',
      },
    };
  } catch (error) {
    console.error('Error generating dynamic metadata:', error);
    
    // Return fallback metadata for Pashmina brand
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const fallbackTitle = params?.title ? `${params.title} - Fur Himalaya` : 'Fur Himalaya - Luxury Pashmina Heritage';
    const fallbackDescription = params?.description || 'Experience the finest authentic Himalayan Pashmina. Each piece represents centuries of traditional craftsmanship and uncompromising quality.';
    
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: params?.keywords || 'pashmina, luxury scarves, himalayan crafts, premium shawls, authentic cashmere, luxury fashion',
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
      },
      openGraph: {
        type: 'website',
        siteName: 'Fur Himalaya',
        title: fallbackTitle,
        description: fallbackDescription,
        images: [
          {
            url: params?.image || `${baseUrl}/images/logo.png`,
            width: 1200,
            height: 630,
            alt: 'Fur Himalaya - Luxury Pashmina Heritage',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: fallbackTitle,
        description: fallbackDescription,
        images: [params?.image || '/images/logo.png'],
      },
    };
  }
}