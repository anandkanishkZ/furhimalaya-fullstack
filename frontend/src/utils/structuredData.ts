import { Project } from '@/utils/publicApiClient';

export function generateProjectStructuredData(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "category": project.category,
    "creator": {
      "@type": "Organization",
      "name": "Fur Himalaya",
      "url": "https://furhimalaya.com"
    },
    "dateCreated": project.createdAt,
    "dateModified": project.updatedAt,
    "image": project.imageUrl,
    "url": `/projects/${project.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Fur Himalaya",
      "url": "https://furhimalaya.com"
    }
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fur Himalaya",
    "url": "https://furhimalaya.com",
    "description": "Luxury Pashmina Heritage - Experience the finest authentic Himalayan Pashmina crafted with centuries of traditional techniques.",
    "foundingDate": "2020",
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    },
    "serviceType": [
      "Luxury Pashmina Products",
      "Traditional Handicrafts",
      "Premium Scarves & Shawls",
      "Authentic Cashmere",
      "Custom Textile Services"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-XXXXXXXXX",
      "contactType": "customer service",
      "areaServed": "NP",
      "availableLanguage": ["en", "ne"]
    },
    "sameAs": [
      "https://facebook.com/furhimalaya",
      "https://instagram.com/furhimalaya"
    ]
  };
}

export function generateBreadcrumbStructuredData(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://furhimalaya.com${item.url}`
    }))
  };
}