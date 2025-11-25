# Fur Himalaya - Frontend

This is the frontend application for Fur Himalaya website built with Next.js 14, React 18, and Tailwind CSS.

## 🚀 Features

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Responsive Design** for all devices
- **SEO Optimized** with structured data
- **Static Site Generation** capability
- **Admin Dashboard** for content management

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (routes)/        # Route groups
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes (if any)
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable React components
│   │   ├── admin/           # Admin-specific components
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── data/                # Static data files
├── public/                  # Static assets
│   ├── images/              # Image assets
│   └── robots.txt           # SEO robots file
├── tailwind.config.ts       # Tailwind CSS configuration
├── next.config.mjs          # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run export` - Export static site

## 🎨 Styling

This project uses Tailwind CSS for styling with custom configurations:

- Custom colors and spacing
- Responsive design utilities
- Component-based styling approach
- Custom animations and transitions

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### API Integration

The frontend communicates with the backend API through:
- `/src/utils/publicApiClient.ts` - Public API client
- `/src/utils/admin/apiClient.ts` - Admin API client

## 📱 Pages

### Public Pages
- `/` - Homepage with hero slider and services
- `/about` - About page
- `/services` - Services listing and details
- `/projects` - Projects showcase
- `/blog` - Blog listing and posts
- `/contact` - Contact form

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/projects` - Project management
- `/admin/services` - Service management
- `/admin/blog` - Blog management
- `/admin/team` - Team management

## 🚀 Deployment

### Static Export
```bash
npm run export
```

### Vercel (Recommended)
```bash
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is proprietary and confidential.