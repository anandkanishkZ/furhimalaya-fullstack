import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/public-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 1 hour to prevent rate limiting
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        // Add cache headers to prevent excessive requests
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      }
    });
  } catch (error) {
    console.error('Error fetching public settings from backend:', error);
    
    // Return fallback settings to prevent app crashes
    const fallbackSettings = {
      success: true,
      data: {
        company_name: 'Fur Himalaya',
        company_tagline: 'Luxury Pashmina Heritage',
        company_description: 'Authentic Himalayan Pashmina crafted with timeless artistry and uncompromising quality.',
        seo_meta_title: 'Fur Himalaya - Luxury Pashmina Heritage',
        seo_meta_description: 'Experience the finest authentic Himalayan Pashmina. Each piece represents centuries of traditional craftsmanship and uncompromising quality.',
        seo_keywords: 'pashmina, luxury scarves, himalayan crafts, premium shawls, authentic cashmere, luxury fashion',
        seo_og_image: '/images/logo.png',
        seo_google_image: '/images/logo.png',
        seo_twitter_card_image: '/images/logo.png',
        site_favicon: '/favicon.ico'
      }
    };
    
    return NextResponse.json(fallbackSettings, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  }
}