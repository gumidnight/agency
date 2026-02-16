/**
 * CLOUDFLARE PAGES CONFIGURATION
 * 
 * WHY THESE SETTINGS?
 * 
 * 1. setupDevPlatform() - Only runs in development mode
 *    - Simulates Cloudflare environment locally
 *    - Gives you access to D1, R2, KV bindings during "npm run dev"
 * 
 * 2. images.unoptimized = true (when on Cloudflare)
 *    - Cloudflare Pages doesn't support Next.js Image Optimization API
 *    - Images still work, just not server-side optimized
 *    - Alternative: Use Cloudflare Images service
 */

import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Only run setupDevPlatform in development to simulate Cloudflare bindings
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages - disable built-in image optimization
  images: {
    unoptimized: true,
    remotePatterns: []
  }
};

export default nextConfig;
