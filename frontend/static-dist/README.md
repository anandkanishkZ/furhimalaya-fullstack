# Furhimalaya Frontend - Static Website

##  Pure HTML/CSS/JS Website - No Installation Required!

This folder contains a **completely static version** of the Furhimalaya website that works without any installation or build process.

##  What you get:
-  Pure HTML, CSS, and JavaScript files
-  Works on any web server (Apache, Nginx, IIS, etc.)
-  Can be opened directly in browser for testing
-  Complete Furhimalaya luxury branding
-  Responsive design for all devices
-  Optimized images and assets

##  How to use:

### Option 1: Direct Browser Testing
1. Open `index.html` in any modern web browser
2. Navigate through the website locally

### Option 2: Simple Web Server
1. Copy this entire folder to your web server
2. Point your domain to this folder
3. Website is ready!

### Option 3: Quick Local Server (if you have Python)
```bash
# Navigate to this folder in terminal
cd /path/to/static-dist

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Option 4: Quick Local Server (if you have Node.js)
```bash
# Install simple server (once)
npm install -g http-server

# Navigate to this folder and run
http-server

# Then open the URL shown in terminal
```

##  Pages included:
- Home page with hero slider
- About us
- Services/Collections
- Projects/Gallery  
- Blog/Stories
- Contact
- Privacy Policy
- Terms of Service

##  Features:
- Luxury Furhimalaya branding throughout
- Responsive design (mobile, tablet, desktop)
- Optimized performance
- SEO-friendly structure
- Professional navigation
- Image galleries
- Contact forms (static - needs backend for functionality)

##  Web Server Configuration:
Most servers work out-of-box, but for best results:
- Enable gzip compression
- Set proper cache headers for static assets
- Configure 404 redirects to `404.html`

##  Support:
This is a static website export. For dynamic features (contact forms, admin panels), you need the full application with backend API.

---
**Build Date:** November 24, 2025
**Version:** 1.0.0 Static Export
**Framework:** Next.js 14 (exported as static files)
