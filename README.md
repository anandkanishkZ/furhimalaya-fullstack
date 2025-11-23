# Forever Shine Engineering - Full Stack Project

A complete web application for Forever Shine Engineering company, featuring a modern Next.js frontend and robust Express.js backend.

## 🚀 Production Deployment - Complete CI/CD Setup

**Ready to deploy to VPS?** This project includes a complete deployment infrastructure:

### 📚 Documentation Guides
- 🎯 **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - **START HERE** - Complete overview
- 📖 **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Full step-by-step deployment guide
- ⚡ **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands cheat sheet
- � **[GITHUB_SECRETS_GUIDE.md](GITHUB_SECRETS_GUIDE.md)** - GitHub Actions secrets setup
- ⚙️ **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)** - All environment variables explained

### ✨ Deployment Features
- ✅ **GitHub Actions CI/CD** - Automated deployment on git push
- ✅ **Nginx Configuration** - Production-ready reverse proxy
- ✅ **SSL/TLS Setup** - Let's Encrypt with auto-renewal
- ✅ **PM2 Process Management** - Cluster mode with auto-restart
- ✅ **Docker Support** - Full containerization option
- ✅ **Database Backups** - Automated PostgreSQL backups
- ✅ **Health Monitoring** - Service health checks
- ✅ **Security Hardening** - UFW firewall, fail2ban, HSTS
- ✅ **Automatic Rollback** - On deployment failure
- ✅ **Zero Downtime** - Blue-green deployment strategy

---

## 🏗️ Project Architecture

This project follows a **monorepo structure** with completely separated frontend and backend applications:

```
project/
├── frontend/           # Next.js React Application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend documentation
├── backend/           # Express.js API Server  
│   ├── src/           # Server source code
│   ├── prisma/        # Database schema & migrations
│   ├── uploads/       # File upload storage
│   ├── package.json   # Backend dependencies
│   └── README.md      # Backend documentation
└── README.md          # This file
```

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Lucide React Icons
- **State Management**: React Hooks
- **Build Tool**: Next.js built-in

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, CORS

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- PostgreSQL database
- npm or yarn package manager

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your DATABASE_URL and other environment variables
npm run db:migrate
npm run db:seed
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database Studio**: http://localhost:5555 (run `npm run db:studio` in backend)

## 📁 Detailed Structure

### Frontend (`/frontend`)
- **Pages**: All routes and page components
- **Components**: Reusable UI components
- **Admin**: Complete admin dashboard
- **Hooks**: Custom React hooks
- **Utils**: Helper functions and API clients
- **Types**: TypeScript definitions

### Backend (`/backend`)
- **Routes**: API endpoint handlers
- **Controllers**: Business logic
- **Middleware**: Authentication, validation, error handling
- **Prisma**: Database schema and migrations
- **Utils**: Helper functions and database client
- **Types**: TypeScript definitions

## 🔌 API Integration

The frontend communicates with the backend through RESTful APIs:

### Public Endpoints
- `GET /api/services` - Get all services
- `GET /api/projects` - Get all projects
- `GET /api/blog` - Get blog posts
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin authentication
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- And more...

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:
- **Users** - Admin authentication
- **Services** - Company services
- **Projects** - Portfolio projects
- **BlogPosts** & **BlogCategories** - Content management
- **TeamMembers** - Team profiles
- **Testimonials** - Client testimonials
- **ContactMessages** - Contact form submissions
- **SiteSettings** - Website configuration

## 🚀 Deployment

### Frontend Deployment Options
1. **Vercel** (Recommended for Next.js)
2. **Netlify**
3. **Static Export** to any web server

### Backend Deployment Options
1. **Railway** or **Heroku** for easy deployment
2. **DigitalOcean** or **AWS** for VPS
3. **Docker** containerization

### Database Hosting
- **Railway PostgreSQL**
- **Supabase**
- **AWS RDS**
- **DigitalOcean Managed Database**

## 🔧 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (`.env`)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/forever_shine"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
```

## 📊 Development Workflow

1. **Backend First**: Set up database, create APIs
2. **Frontend Integration**: Connect frontend to backend APIs
3. **Testing**: Test both applications
4. **Deployment**: Deploy backend first, then frontend

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run type-check
```

## 📈 Performance Considerations

- **Frontend**: Static generation with Next.js
- **Backend**: Database query optimization with Prisma
- **Caching**: API response caching
- **Images**: Optimized image delivery
- **CDN**: Static asset distribution

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Helmet security headers
- Input validation
- File upload restrictions
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- **Email**: support@forevershine.com.np
- **Documentation**: Check individual README files in frontend/ and backend/
- **Issues**: Create GitHub issues for bug reports

## 📄 License

This project is proprietary and confidential to Forever Shine Engineering.