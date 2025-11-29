# Vivance Travels

A modern, beautiful travel booking platform built with React Router 7 and Tailwind CSS, designed for Cloudflare Pages deployment.

## Brand Guidelines

- **Primary Color**: Blaze Orange `#FC6603`
- **Secondary Color**: Blue `#043560`
- **Typography**: Roboto font family
- **Logo**: Square orange icon with "VT" wordmark

## Prerequisites

⚠️ **Important**: This project requires **Node.js 20.0.0 or higher**

Current system has Node v18.16.0 - please upgrade to continue.

### Install Node.js 20+

Using nvm (recommended):

```bash
nvm install 20
nvm use 20
```

Or download from: https://nodejs.org/

## Getting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Run development server**:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

3. **Build for production**:

```bash
npm run build
```

4. **Preview production build locally**:

```bash
npm run preview
```

5. **Deploy to Cloudflare Pages**:

```bash
npm run deploy
```

## Features

### 🎨 Modern UI/UX

- Beautiful hero section with gradient backgrounds
- Interactive flight search with multiple trip types (One Way, Round Trip, Multi City)
- Responsive design that works on all devices
- Smooth animations and transitions

### ✈️ Flight Search

- Departure and destination city selection
- Date pickers for departure and return
- Passenger selection with class options
- Quick swap button for cities

### 🏖️ Holiday Destinations

- Inspirational destination cards with images
- Pricing and duration information
- Star ratings and location details
- Call-to-action buttons

### 📋 Additional Sections

- Exclusive offers showcase
- Popular flight routes
- Newsletter subscription
- Social media integration
- Footer with contact information

## Project Structure

```
vivance/
├── app/
│   ├── routes/
│   │   └── home.tsx         # Main landing page
│   ├── entry.server.tsx     # Server entry point
│   ├── entry.client.tsx     # Client entry point
│   ├── root.tsx             # Root component
│   ├── routes.ts            # Route definitions
│   └── app.css              # Global styles with Vivance brand colors
├── public/
│   └── favicon.ico
├── wrangler.toml            # Cloudflare Workers configuration
├── react-router.config.ts   # React Router configuration
└── package.json
```

## Design System

### Colors

```css
--color-vivance-orange: #fc6603;
--color-vivance-blue: #043560;
--color-vivance-orange-light: #ffe5d4;
--color-vivance-orange-dark: #c84e02;
--color-vivance-blue-light: #719dbd;
--color-vivance-blue-dark: #021c2e;
```

### Typography

- Font Family: 'Roboto', sans-serif
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black)

### Components

- Buttons: Primary (Orange), Secondary (Blue)
- Cards: Rounded corners with shadows
- Inputs: Border focus states with brand colors
- Icons: Lucide React icon library

## Deployment

### Cloudflare Pages

This project is configured for Cloudflare Pages deployment:

1. **Connect your repository** to Cloudflare Pages
2. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `build/client`
3. **Environment variables**: None required
4. Or use **Wrangler CLI**:
   ```bash
   npm run deploy
   ```

## Tech Stack

- **Framework**: React Router 7 (formerly Remix v2)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages
- **Runtime**: Cloudflare Workers
- **Language**: TypeScript

## Development Notes

- The app is configured as a SPA (Single Page Application) for optimal Cloudflare Pages performance
- All images use placeholder URLs from Unsplash - replace with actual Vivance images
- The visitor counter is static - implement backend for real counting
- Add real API integration for flight search functionality

## Future Enhancements

- [ ] Integrate real flight search API
- [ ] Add user authentication
- [ ] Implement booking flow
- [ ] Add payment integration
- [ ] Create admin dashboard
- [ ] Multi-language support
- [ ] Add real-time pricing
- [ ] Implement email notifications

## Contact

For questions or support regarding this frontend demo, please reach out to the development team.

---

**Vivance Travels** - Your gateway to amazing travel experiences! 🌍✈️
