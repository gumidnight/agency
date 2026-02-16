/**
 * CLOUDFLARE ENVIRONMENT TYPE DEFINITIONS
 * 
 * WHY THIS FILE?
 * TypeScript needs to know what Cloudflare bindings are available.
 * This file declares the types for:
 *   - D1 (database)
 *   - R2 (file storage)
 *   - KV (key-value store)
 *   - Any secrets you add
 * 
 * HOW IT WORKS:
 * When you access env.DB or env.BUCKET in your API routes,
 * TypeScript uses these definitions to provide autocomplete
 * and type checking.
 */

// Import Cloudflare Workers types
// These provide the full type definitions for D1Database, R2Bucket, etc.

/**
 * CloudflareEnv represents all bindings available in your Cloudflare Worker.
 * These MUST match what you defined in wrangler.toml!
 */
export interface CloudflareEnv {
  // ==========================================================================
  // D1 DATABASE
  // ==========================================================================
  // Binding name from wrangler.toml: [[d1_databases]] binding = "DB"
  // Usage: const result = await env.DB.prepare("SELECT * FROM users").all();
  DB: D1Database;

  // ==========================================================================
  // R2 STORAGE BUCKET
  // ==========================================================================
  // Binding name from wrangler.toml: [[r2_buckets]] binding = "BUCKET"
  // Usage: await env.BUCKET.put("file.pdf", data);
  BUCKET: R2Bucket;

  // ==========================================================================
  // ENVIRONMENT VARIABLES
  // ==========================================================================
  // From wrangler.toml [vars] section or secrets added via:
  // npx wrangler pages secret put SECRET_NAME
  ENVIRONMENT: string;

  // Add your secrets here (don't commit actual values!)
  // API_KEY?: string;
  // DATABASE_URL?: string;
}

/**
 * HOW TO ACCESS ENV IN NEXT.JS API ROUTES:
 * 
 * In your route.ts files, use getRequestContext():
 * 
 * ```typescript
 * import { getRequestContext } from '@cloudflare/next-on-pages';
 * 
 * export const runtime = 'edge';
 * 
 * export async function GET() {
 *   const { env } = getRequestContext();
 *   
 *   // Now env is typed with CloudflareEnv
 *   const result = await env.DB.prepare("SELECT * FROM users").all();
 *   
 *   return Response.json(result);
 * }
 * ```
 */

// Extend the global type so getRequestContext() returns our CloudflareEnv
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT?: string;
    }
  }
}
