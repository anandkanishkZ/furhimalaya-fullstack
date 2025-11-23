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
    const defaultDescription = settings?.seo_meta_description || 'Professional engineering consultancy and construction services for residential and commercial projects.';
    const defaultKeywords = settings?.seo_keywords || 'engineering consultancy, construction services, municipality drawing, interior design, civil engineering';
    const favicon = settings?.site_favicon || '/logo.png';
    const ogImage = settings?.seo_og_image || settings?.seo_google_image || '/logo.png';
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
        creator: settings?.social_twitter || '@forevershine',
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
    
    // Return fallback metadata
    return {
      title: 'Forever Shine Engineering - Professional Engineering & Construction Services',
      description: 'Forever Shine Engineering provides professional engineering consultancy and construction services for residential and commercial projects.',
      keywords: 'engineering consultancy, construction services, municipality drawing, interior design, civil engineering',
      icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
      },
      openGraph: {
        type: 'website',
        siteName: 'Forever Shine Engineering',
        title: 'Forever Shine Engineering - Professional Engineering & Construction Services',
        description: 'Forever Shine Engineering provides professional engineering consultancy and construction services for residential and commercial projects.',
        images: [
          {
            url: '/logo.png',
            width: 1200,
            height: 630,
            alt: 'Forever Shine Engineering Logo',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Forever Shine Engineering - Professional Engineering & Construction Services',
        description: 'Forever Shine Engineering provides professional engineering consultancy and construction services for residential and commercial projects.',
        images: ['/logo.png'],
      },
    };
  }
}