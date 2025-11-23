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
      "name": "Forever Shine Engineering",
      "url": "https://forevershine.com.np"
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
      "name": "Forever Shine Engineering",
      "url": "https://forevershine.com.np"
    }
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Forever Shine Engineering",
    "url": "https://forevershine.com.np",
    "description": "Professional engineering and construction services provider specializing in residential, commercial, and infrastructure projects.",
    "foundingDate": "2020",
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    },
    "serviceType": [
      "Engineering Services",
      "Construction Services",
      "Infrastructure Development",
      "Building Construction",
      "Project Management"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-XXXXXXXXX",
      "contactType": "customer service",
      "areaServed": "NP",
      "availableLanguage": ["en", "ne"]
    },
    "sameAs": [
      "https://facebook.com/forever-shine-engineering",
      "https://linkedin.com/company/forever-shine-engineering"
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
      "item": `https://forevershine.com.np${item.url}`
    }))
  };
}