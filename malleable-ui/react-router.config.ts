import type { Config } from "@react-router/dev/config";

export default {
  // Disable SSR to use SPA mode - required for Atlaskit compatibility
  // Atlaskit packages have CSS-in-JS that doesn't work with Node.js SSR
  ssr: false,
} satisfies Config;
