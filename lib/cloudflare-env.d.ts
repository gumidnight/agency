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

/**
 * CloudflareEnv represents all bindings available in your Cloudflare Worker.
 * These MUST match what you defined in wrangler.toml!
 */
interface CloudflareEnv {
  // D1 DATABASE - binding from wrangler.toml: [[d1_databases]] binding = "DB"
  DB: D1Database;

  // R2 STORAGE BUCKET - binding from wrangler.toml: [[r2_buckets]] binding = "BUCKET"
  BUCKET: R2Bucket;

  // ENVIRONMENT VARIABLES from wrangler.toml [vars]
  ENVIRONMENT: string;
}

// Augment the @cloudflare/next-on-pages module to use our CloudflareEnv
declare module '@cloudflare/next-on-pages' {
  export function getRequestContext(): {
    env: CloudflareEnv;
    ctx: ExecutionContext;
    cf: CfProperties;
  };
}

// Extend the global type
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT?: string;
    }
  }
}
