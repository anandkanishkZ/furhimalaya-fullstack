export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  content: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'sustainable-building-practices',
    title: 'Sustainable Building Practices for Modern Architecture',
    date: 'March 15, 2024',
    author: 'Jane Smith',
    content: `Sustainable building practices are becoming increasingly important in modern architecture. 
    This article explores innovative approaches to eco-friendly construction and design.

    Key Focus Areas:
    • Energy-efficient building materials and insulation
    • Solar panel integration and renewable energy systems
    • Water conservation and rainwater harvesting
    • Green roofing and vertical garden implementations
    • Smart home technology for energy management
    • Waste reduction during construction processes

    Modern sustainable architecture not only reduces environmental impact but also provides long-term cost savings for property owners through reduced utility costs and increased property values.`,
    image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?auto=format&fit=crop&q=80&w=1000'
  },
  {
    slug: 'future-of-urban-design',
    title: 'The Future of Urban Design: Smart Cities',
    date: 'March 18, 2024',
    author: 'John Doe',
    content: `Smart cities represent the convergence of urban planning and cutting-edge technology. 
    This post examines how IoT and AI are reshaping our urban landscapes.

    Smart City Components:
    • Internet of Things (IoT) sensors for traffic management
    • Smart lighting systems that adapt to usage patterns
    • Digital infrastructure for enhanced connectivity
    • Automated waste management systems
    • Real-time air quality monitoring
    • Integrated public transportation networks

    These innovations are creating more efficient, sustainable, and livable urban environments that adapt to residents' needs while optimizing resource usage.`,
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    slug: 'innovative-interior-design',
    title: 'Innovative Interior Design Trends for 2024',
    date: 'March 20, 2024',
    author: 'Sarah Johnson',
    content: `Discover the latest trends in interior design that are transforming living spaces. 
    From biophilic design to smart home integration, we explore what's shaping modern interiors.

    Current Design Trends:
    • Biophilic design incorporating natural elements
    • Smart home automation and voice control systems
    • Sustainable and eco-friendly materials
    • Flexible multi-functional spaces
    • Bold color combinations and statement walls
    • Minimalist designs with maximum functionality

    These trends focus on creating spaces that are not only aesthetically pleasing but also promote well-being and environmental consciousness.`,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000'
  }
];