/**
 * HELLO API ENDPOINT - /api/hello
 * 
 * =============================================================================
 * WHAT IS THIS FILE?
 * =============================================================================
 * This is a Next.js API Route that runs on Cloudflare's Edge network.
 * 
 * IMPORTANT CONCEPTS:
 * 
 * 1. FILE PATH = URL PATH
 *    app/api/hello/route.ts  →  https://your-site.pages.dev/api/hello
 *    
 * 2. EXPORT FUNCTIONS = HTTP METHODS
 *    export async function GET()  → handles GET requests
 *    export async function POST() → handles POST requests
 *    export async function PUT()  → handles PUT requests
 *    export async function DELETE() → handles DELETE requests
 *
 * 3. runtime = 'edge'
 *    This tells Next.js to run this code on Cloudflare's edge servers
 *    (200+ data centers worldwide) instead of a central server.
 *    REQUIRED for Cloudflare Pages deployment!
 *
 * =============================================================================
 * HOW FRONTEND CALLS THIS API
 * =============================================================================
 * 
 * From any React component:
 * 
 * ```tsx
 * // In a Client Component ('use client')
 * async function fetchHello() {
 *   const response = await fetch('/api/hello');
 *   const data = await response.json();
 *   console.log(data.message); // "Hello from Cloudflare Edge!"
 * }
 * 
 * // In a Server Component (no 'use client')
 * async function ServerComponent() {
 *   const response = await fetch('http://localhost:3000/api/hello');
 *   const data = await response.json();
 *   return <div>{data.message}</div>;
 * }
 * ```
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

// =============================================================================
// REQUIRED: Tell Next.js this route runs on the edge
// =============================================================================
export const runtime = 'edge';

// =============================================================================
// GET REQUEST HANDLER
// =============================================================================
// Called when someone visits: /api/hello (browser, fetch, curl)
// 
// Test locally: curl http://localhost:3000/api/hello
// Test deployed: curl https://your-site.pages.dev/api/hello
export async function GET(request: Request) {
  // Get Cloudflare context (bindings, env vars, etc.)
  // This gives you access to D1, R2, KV, and environment variables
  const ctx = getRequestContext();
  
  // Access environment variables from wrangler.toml [vars] or secrets
  const environment = ctx.env.ENVIRONMENT || 'development';

  // Get useful info from the request
  const url = new URL(request.url);
  
  // Get Cloudflare request properties (available on deployed site)
  // The 'cf' property contains edge location info, visitor IP country, etc.
  const cfRequest = request as Request & { cf?: CfProperties };
  const cf = cfRequest.cf;
  
  // Return JSON response
  return Response.json({
    // Basic response
    message: 'Hello from Cloudflare Edge! 🚀',
    
    // Show what environment we're in
    environment,
    
    // Request info
    path: url.pathname,
    method: request.method,
    
    // Cloudflare edge info (only populated in production)
    edge: cf ? {
      colo: cf.colo,           // Data center code (e.g., "DFW", "LHR")
      country: cf.country,     // Visitor's country
      city: cf.city,           // Visitor's city
      timezone: cf.timezone    // Visitor's timezone
    } : 'Not available in local dev',
    
    // Timestamp
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// POST REQUEST HANDLER
// =============================================================================
// Called when someone sends a POST request to /api/hello
//
// Test: curl -X POST http://localhost:3000/api/hello \
//         -H "Content-Type: application/json" \
//         -d '{"name": "Alex"}'
export async function POST(request: Request) {
  try {
    // Parse JSON body from request
    const body = await request.json() as { name?: string };
    
    // Validate input
    const name = body.name || 'Anonymous';
    
    return Response.json({
      message: `Hello, ${name}! Your POST request was received.`,
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch {
    // Handle JSON parse errors
    return Response.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }
}
