# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Malleable UI app to Cloudflare Pages.

## Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (included in devDependencies)
3. Node.js 20+

## Quick Start

### 1. Login to Cloudflare

```bash
yarn cf:login
```

This opens a browser window to authenticate with your Cloudflare account.

### 2. Deploy to Production

```bash
yarn deploy
```

This will:
- Build the app (`yarn build`)
- Deploy to Cloudflare Pages (`wrangler pages deploy build/client`)

### 3. Deploy Preview (for testing)

```bash
yarn deploy:preview
```

Deploys to a preview branch for testing before production.

## Cloudflare Pages Dashboard Setup

### Option A: Connect to Git (Recommended)

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **Create a project** → **Connect to Git**
3. Select your repository
4. Configure build settings:
   - **Framework preset**: None
   - **Build command**: `yarn build`
   - **Build output directory**: `build/client`
   - **Root directory**: `/` (or `malleable-ui` if in a monorepo)
5. Add environment variables if needed
6. Click **Save and Deploy**

### Option B: Direct Upload (via Wrangler)

Use the `yarn deploy` command as described above.

## Build Configuration

| Setting | Value |
|---------|-------|
| Build command | `yarn build` |
| Build output directory | `build/client` |
| Node.js version | 20+ |

## Environment Variables

Add these in Cloudflare Pages dashboard under **Settings → Environment variables**:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_VERSION` | Node.js version (e.g., `20`) | Recommended |

## Custom Domain

1. Go to your project in Cloudflare Pages
2. Click **Custom domains**
3. Add your domain
4. Update DNS records as instructed

## Deployment Scripts

| Command | Description |
|---------|-------------|
| `yarn build` | Build the app for production |
| `yarn deploy` | Build and deploy to production |
| `yarn deploy:preview` | Build and deploy to preview branch |
| `yarn pages:dev` | Run Cloudflare Pages locally (after build) |
| `yarn cf:login` | Login to Cloudflare |

## File Structure

```
malleable-ui/
├── build/
│   └── client/          # Build output (deployed to CF Pages)
├── public/
│   ├── _headers         # Cloudflare headers config
│   ├── _redirects       # SPA routing redirects
│   └── favicon.ico
├── wrangler.toml        # Cloudflare Wrangler config
└── ...
```

## Headers & Caching

The `public/_headers` file configures:
- Security headers (X-Frame-Options, CSP, etc.)
- Asset caching (1 year for static assets)
- No caching for HTML (for instant updates)

## SPA Routing

The `public/_redirects` file handles client-side routing:
```
/*    /index.html   200
```

All routes serve `index.html`, allowing React Router to handle routing.

## Troubleshooting

### Build Fails

1. Ensure Node.js 20+ is used
2. Check `NODE_VERSION` environment variable in CF Pages
3. Run `yarn build` locally to debug

### Routes Return 404

1. Verify `_redirects` file exists in `public/`
2. Check that `build/client/_redirects` exists after build

### Assets Not Loading

1. Check browser console for errors
2. Verify `_headers` caching rules
3. Clear Cloudflare cache: **Caching → Configuration → Purge Everything**

## GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for automated deployments:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --immutable
      
      - name: Build
        run: yarn build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: malleable-ui
          directory: build/client
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Required Secrets

Add these to your GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN`: Create at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- `CLOUDFLARE_ACCOUNT_ID`: Found in Cloudflare dashboard URL

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [React Router Deployment](https://reactrouter.com/start/deploying)

