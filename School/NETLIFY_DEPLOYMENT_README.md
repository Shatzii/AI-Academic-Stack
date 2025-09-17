# OpenEdTex - Netlify Deployment Guide

## 🚀 Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/openedtex)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Netlify CLI (optional, for manual deployment)
- GitHub account (for automatic deployments)

## 🛠️ Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/openedtex.git
   cd openedtex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build:netlify
   ```

## 🌐 Netlify Deployment Options

### Option 1: One-Click Deploy (Recommended)

1. Click the "Deploy to Netlify" button above
2. Connect your GitHub account
3. Configure build settings (automatically detected)
4. Deploy!

### Option 2: Manual CLI Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy to preview**
   ```bash
   npm run netlify:preview
   ```

4. **Deploy to production**
   ```bash
   npm run netlify:deploy
   ```

### Option 3: Automated Script

Use the provided deployment script:

```bash
# Deploy to preview
./deploy-netlify.sh

# Deploy to production
./deploy-netlify.sh production

# Build only (no deployment)
./deploy-netlify.sh build-only
```

## ⚙️ Configuration

### Environment Variables

Set these in your Netlify dashboard (`Site settings > Environment variables`):

**Required Variables:**

```bash
VITE_API_URL=https://your-django-backend.herokuapp.com/api
VITE_APP_ENV=production
```

**Optional Variables:**

```bash
VITE_APP_NAME=OpenEdTex
VITE_APP_VERSION=2.1.0
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=your_hotjar_id
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
```

**Important Notes:**

- Replace `https://your-django-backend.herokuapp.com/api` with your actual backend API URL
- `VITE_API_URL` must include the full URL with protocol (https://)
- Environment variables are case-sensitive
- Changes to environment variables require a new deployment

### Build Settings

The `netlify.toml` file contains optimized build settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Node version**: 18
- **Environment**: Production optimizations enabled

### Additional Netlify Settings

- **Base directory**: `School` (directory containing package.json)
- **Package directory**: `School` (directory containing package.json)
- **Deploy log visibility**: Public (anyone with deploy URL can access logs)
- **Build status**: Active (automatic builds on push)
- **Preview Server command**: Not set (uses local settings)
- **Target port**: Not set (auto-detected)
- **Preview Server size**: 1 vCPU, 4 GB RAM, 20 GB Storage

### Redirects & Headers

- SPA routing redirects configured
- Security headers applied
- Static asset caching optimized
- API proxy redirects to backend

## 🔧 Backend API Setup

Since this is a frontend-only deployment, you'll need a separate backend:

### Option 1: Django on Heroku/Railway

1. Deploy your Django backend to Heroku/Railway
2. Update `VITE_API_URL` in Netlify environment variables
3. Update `netlify.toml` redirect rules

### Option 2: Netlify Functions

1. Create serverless functions in `netlify/functions/`
2. Update API calls to use relative paths
3. Functions will be available at `/.netlify/functions/`

## 📊 Performance Optimizations

### Build Optimizations

- ✅ Code splitting by route and component
- ✅ Vendor chunk separation
- ✅ Tree shaking
- ✅ Minification with Terser
- ✅ CSS optimization
- ✅ Asset optimization

### CDN Optimizations

- ✅ Static asset caching (1 year)
- ✅ Gzip compression
- ✅ Brotli compression
- ✅ WebP image optimization
- ✅ Font optimization

### Runtime Optimizations

- ✅ Service Worker for caching
- ✅ Lazy loading for components
- ✅ Image optimization
- ✅ Bundle analysis tools

## 🔍 Testing & Quality Assurance

### Automated Checks

```bash
# Run all quality checks
npm run optimize

# Lint code
npm run lint

# Type checking
npm run type-check

# Build analysis
npm run build:analyze
```

### Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse https://your-netlify-site.netlify.app

# Bundle analyzer
npm run build:analyze
```

## 🚀 Deployment Workflow

### For Development Teams

1. **Feature Branch**: Create feature branch
2. **Development**: Test locally with `npm run dev`
3. **Build Test**: Run `npm run build:netlify`
4. **Deploy Preview**: Push to create Netlify preview
5. **Code Review**: Review changes and performance
6. **Production**: Merge to main branch for auto-deployment

### For Individual Developers

1. **Local Testing**: `npm run dev`
2. **Build Test**: `npm run build:netlify`
3. **Deploy**: `./deploy-netlify.sh production`

## 🔧 Troubleshooting

### Common Issues

#### Build Fails

```bash
# Check build logs
npm run build:netlify

# Clear cache and retry
rm -rf node_modules dist
npm install
npm run build:netlify
```

**Common Build Issues:**

- **Missing build tools**: Ensure `vite` and `@vitejs/plugin-react` are in `dependencies`, not `devDependencies`
- **Prepare script errors**: Remove `prepare` scripts that depend on devDependencies
- **Node version mismatch**: Ensure Node.js 18+ is specified in Netlify settings

#### API Connection Issues

```bash
# Check environment variables
echo $VITE_API_URL

# Test API endpoint
curl https://your-api.com/api/health
```

#### Performance Issues

```bash
# Analyze bundle size
npm run build:analyze

# Run performance audit
npx lighthouse https://your-site.netlify.app
```

### Netlify-Specific Issues

#### Redirects Not Working

- Check `netlify.toml` redirect rules
- Ensure `_redirects` file is in `public/` directory
- Test with `curl -I https://your-site.netlify.app/some-route`

#### Environment Variables Not Loading

- Check Netlify dashboard for variable names
- Ensure variables are set for correct context (production/preview)
- Restart deployment if variables were added after initial deploy

## 📈 Monitoring & Analytics

### Performance Monitoring

- **Netlify Analytics**: Built-in performance metrics
- **Lighthouse**: Automated performance audits
- **Web Vitals**: Core Web Vitals tracking

### Error Tracking

- **Netlify Functions**: Monitor serverless function errors
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API calls and responses

## 🔒 Security Considerations

### Content Security Policy

- Configured in `netlify.toml`
- Allows necessary CDNs and APIs
- Blocks inline scripts for security

#### Environment Variables Security

- Never commit secrets to repository
- Use Netlify's encrypted environment variables
- Rotate API keys regularly

### HTTPS & SSL

- Netlify provides automatic HTTPS
- SSL certificates managed automatically
- HSTS headers configured

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally: `npm run dev`
5. Build test: `npm run build:netlify`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy Deploying! 🎉

For support or questions, please open an issue on GitHub.
