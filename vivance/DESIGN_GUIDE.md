# Vivance - Quick Design Reference

## 🎨 Brand Colors

### Primary Colors
```css
Orange (Primary):     #FC6603  /* Blaze Orange - Freedom, Optimism, Creativity, Enthusiasm */
Blue (Secondary):     #043560  /* Trust, Promise, Sincerity */
```

### Shades & Tints

**Orange Palette:**
```css
Light:    #FFE5D4
Base:     #FC6603
Dark:     #C84E02
Black:    #1C1D1C
```

**Blue Palette:**
```css
Light:    #719DBD
Base:     #043560
Dark:     #021C2E
```

### Usage in Code
```tsx
// Tailwind Classes
className="bg-[#FC6603]"           // Orange background
className="text-[#043560]"         // Blue text
className="hover:bg-primary-dark"  // Dark orange on hover
```

## 📝 Typography

### Font Family
```css
font-family: 'Roboto', sans-serif;
```

### Font Weights
- **Thin**: 100
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Bold**: 700
- **Black**: 900

### Usage Examples
```tsx
// Headings
<h1 className="text-4xl font-bold">Title</h1>
<h2 className="text-2xl font-medium">Subtitle</h2>

// Body
<p className="text-base font-normal">Body text</p>
<span className="text-sm font-light">Small text</span>
```

## 🎯 UI Components

### Buttons

**Primary Button (Orange)**
```tsx
<button className="bg-[#FC6603] hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
  Book Now
</button>
```

**Secondary Button (Blue)**
```tsx
<button className="bg-[#043560] hover:bg-[#021C2E] text-white font-medium py-2 px-4 rounded-lg">
  Learn More
</button>
```

**Outline Button**
```tsx
<button className="border-2 border-[#FC6603] text-[#FC6603] hover:bg-[#FC6603] hover:text-white py-2 px-4 rounded-lg transition-all">
  Explore
</button>
```

### Input Fields
```tsx
<input 
  type="text"
  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FC6603] focus:outline-none transition-colors"
  placeholder="Enter city"
/>
```

### Cards
```tsx
<div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6">
  <h3 className="text-xl font-bold text-[#043560] mb-2">Card Title</h3>
  <p className="text-gray-600">Card content...</p>
</div>
```

## 📐 Spacing System

```css
Gap/Padding:  4px, 8px, 12px, 16px, 24px, 32px, 48px
Margin:       Same as gap
Border Radius: 
  - Small:  4px  (rounded)
  - Medium: 8px  (rounded-lg)
  - Large:  16px (rounded-xl)
  - Full:   999px (rounded-full)
```

## 🖼️ Logo Guidelines

### Minimum Size
- Print: 58mm width
- Screen: 238px width

### Versions
- **Horizontal**: Logo + "Vivance Travels" text (primary)
- **Vertical**: Logo above text (mobile, small spaces)
- **Icon Only**: Just the VT square (favicon, app icon)

### Exclusion Zone
- Clear space = height of "V" in logo
- No other elements within this zone

### Don'ts
- ❌ Don't stretch or transform
- ❌ Don't change colors
- ❌ Don't add elements
- ❌ Don't add drop shadows
- ❌ Don't outline the logo

## 📱 Responsive Breakpoints

```css
sm:   640px   /* Tablets */
md:   768px   /* Small laptops */
lg:   1024px  /* Desktops */
xl:   1280px  /* Large screens */
2xl:  1536px  /* Extra large */
```

### Usage
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

## 🎭 Common Patterns

### Hero Section
```tsx
<div className="relative min-h-[500px] bg-linear-to-br from-blue-600 to-cyan-400">
  <div className="absolute inset-0 bg-[url(...)] bg-cover opacity-20"></div>
  <div className="relative max-w-7xl mx-auto px-4 pt-12">
    {/* Content */}
  </div>
</div>
```

### Destination Card
```tsx
<div className="group cursor-pointer">
  <div className="relative h-64 overflow-hidden rounded-xl shadow-lg">
    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
    <div className="absolute inset-0 bg-linear-to-t from-black/70"></div>
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      {/* Card content */}
    </div>
  </div>
</div>
```

### Section Heading
```tsx
<h2 className="text-4xl font-bold text-center mb-12">
  <span className="text-gray-800">SECTION </span>
  <span className="text-[#FC6603]">TITLE</span>
</h2>
```

## 🔍 Icons

Using **Lucide React**:
```tsx
import { Plane, Calendar, Users, Search, MapPin } from "lucide-react";

<Plane className="w-6 h-6 text-[#FC6603]" />
```

### Common Icons
- `Plane` - Flights
- `MapPin` - Destinations
- `Calendar` - Dates
- `Users` - Passengers
- `Search` - Search functionality
- `ArrowRightLeft` - Swap cities
- `Star` - Ratings

## 🌐 SEO Meta Tags

```tsx
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Page Title - Vivance Travels" },
    { name: "description", content: "Page description..." },
    { property: "og:title", content: "Page Title" },
    { property: "og:image", content: "/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
```

## 📊 Performance Targets

- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

## ♿ Accessibility

```tsx
// Always include alt text
<img src="..." alt="Description" />

// Use semantic HTML
<nav>, <main>, <footer>, <article>, <section>

// Keyboard navigation
<button> instead of <div onClick={...}>

// ARIA labels when needed
<button aria-label="Close menu">×</button>
```

## 🔄 Animation Guidelines

```tsx
// Hover transitions
transition-colors   // 150ms
transition-transform // 300ms
transition-all      // Use sparingly

// Scale on hover
group-hover:scale-110

// Fade on hover
hover:opacity-100
```

## 📦 File Organization

```
app/
├── routes/
│   ├── home.tsx           # Landing page
│   ├── flights.tsx        # Flight search results
│   ├── holidays.tsx       # Holiday packages
│   └── booking.tsx        # Booking flow
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SearchForm.tsx
│   └── DestinationCard.tsx
├── lib/
│   ├── api.ts            # API calls
│   └── utils.ts          # Utility functions
└── app.css               # Global styles
```

## 🚀 Quick Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run deploy     # Deploy to Cloudflare
npm run typecheck  # Type checking
```

## 📞 Brand Contact Info

```
Phone: +91 9625582301 (24X7)
Email: 
  - Customer: info@vivancetravels.com
  - Business: business@vivancetravels.com
Websites:
  - www.sukritiwellness.com
  - www.kumbhsukrit.com
```

---

**Keep this guide handy for quick reference during development!** 🎯

