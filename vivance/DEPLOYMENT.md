# Deploying Vivance to Cloudflare Pages

This guide covers multiple deployment methods for the Vivance travel platform.

## Prerequisites

- Node.js 20.0.0 or higher
- A Cloudflare account (free tier is fine)
- Git repository (for automatic deployments)

## Method 1: Wrangler CLI (Recommended)

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Build and Deploy

```bash
cd vivance
npm run build
npm run deploy
```

Your site will be live at: `https://vivance.pages.dev`

### Custom Domain

To add a custom domain:

1. Go to your Cloudflare dashboard
2. Navigate to Pages → vivance → Custom domains
3. Click "Set up a custom domain"
4. Follow the DNS configuration steps

## Method 2: GitHub + Cloudflare Pages (Automatic Deployments)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Vivance travel platform"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Authorize GitHub and select your `vivance` repository
5. Configure build settings:
   - **Framework preset**: React
   - **Build command**: `npm run build`
   - **Build output directory**: `build/client`
   - **Node version**: 20
6. Click **Save and Deploy**

### Step 3: Automatic Deployments

- Every push to `main` branch triggers a new deployment
- Pull requests get preview deployments automatically
- View deployments at: `https://<branch>.<project>.pages.dev`

## Method 3: Drag and Drop (Manual)

### Step 1: Build Locally

```bash
npm run build
```

### Step 2: Upload to Cloudflare

1. Go to Cloudflare Dashboard → Pages
2. Click **Create a project**
3. Select **Upload assets**
4. Drag and drop the `build/client` folder
5. Click **Deploy site**

## Environment Variables

Currently, no environment variables are required. If you add backend features, add them in:

- **Cloudflare Dashboard**: Pages → Settings → Environment variables
- **Wrangler**: In `wrangler.toml` under `[vars]`

## Build Configuration

The build is configured in `react-router.config.ts`:

```typescript
{
  ssr: false,              // SPA mode for optimal CF Pages performance
  buildDirectory: "build"  // Output directory
}
```

## Performance Optimization

Cloudflare Pages provides:

- **Global CDN**: < 50ms latency worldwide
- **Automatic HTTPS**: Free SSL certificates
- **DDoS Protection**: Enterprise-grade security
- **Unlimited Bandwidth**: No usage limits
- **100 GB/month**: Free tier limit

### Caching Strategy

Defined in `public/_headers`:

- JS/CSS: 1 year cache (immutable)
- Assets: 1 year cache
- Security headers: Auto-applied

## Monitoring and Analytics

### Enable Web Analytics

1. Go to Cloudflare Dashboard
2. Navigate to Pages → vivance → Analytics
3. Enable **Web Analytics**
4. View metrics: page views, visitors, performance

### Real User Monitoring (RUM)

Add to `app/root.tsx` before `</body>`:

```tsx
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_TOKEN"}'
/>
```

## Rollback Deployments

If something goes wrong:

1. Go to Cloudflare Dashboard → Pages → vivance
2. Click **Deployments**
3. Find the last working deployment
4. Click **⋯** → **Rollback to this deployment**

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: vivance
          directory: build/client
```

## Troubleshooting

### Build Fails on Cloudflare

**Error**: Node version too old
**Solution**: Set `NODE_VERSION` environment variable to `20`

### 404 on Refresh

**Error**: Routes not working after page refresh
**Solution**: Add `_redirects` file:

```bash
echo "/*    /index.html   200" > public/_redirects
```

### Slow Build Times

**Solution**: Enable build cache in Cloudflare Pages settings

### CSS Not Loading

**Error**: Tailwind classes not working
**Solution**: Ensure `@tailwindcss/vite` is in devDependencies

## Production Checklist

Before deploying to production:

- [ ] Update all placeholder images with real Vivance images
- [ ] Configure custom domain
- [ ] Enable Web Analytics
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Add real API endpoints for flight search
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Configure SPF/DKIM for email (if using)
- [ ] Add sitemap.xml and robots.txt
- [ ] Set up monitoring alerts

## Cost Estimate

**Cloudflare Pages Free Tier**:

- Unlimited sites
- Unlimited requests
- 500 builds/month
- 100 GB/month bandwidth

**Paid Plan** ($20/month):

- Everything in Free
- 5,000 builds/month
- Analytics & logs
- Concurrent builds

For a travel platform, the free tier should handle:

- **~3 million page views/month**
- **~100k unique visitors/month**

## Support

For deployment issues:

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [React Router Docs](https://reactrouter.com/)

## Next Steps

After deployment:

1. Test all pages and functionality
2. Monitor performance in Cloudflare Analytics
3. Set up continuous deployment
4. Configure custom domain
5. Add SEO meta tags
6. Implement user feedback collection

---

**Happy Deploying! 🚀**
