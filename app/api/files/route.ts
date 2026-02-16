/**
 * FILE STORAGE API - /api/files
 * 
 * =============================================================================
 * R2 OBJECT STORAGE OPERATIONS
 * =============================================================================
 * 
 * R2 is Cloudflare's S3-compatible object storage with ZERO egress fees!
 * 
 * This file demonstrates:
 *   1. Uploading files to R2
 *   2. Downloading files from R2
 *   3. Listing files in a bucket
 *   4. Deleting files
 * 
 * IMPORTANT CONCEPTS:
 * 
 * R2 Methods:
 *   .put(key, data, options)  - Upload file
 *   .get(key)                 - Download file
 *   .head(key)                - Get file metadata without downloading
 *   .delete(key)              - Delete file
 *   .list(options)            - List files in bucket
 * 
 * Keys (paths):
 *   - Keys are like file paths: "images/photo.jpg"
 *   - No actual folders - paths are just string prefixes
 *   - Use '/' to organize: "users/123/profile.jpg"
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

// Required for Cloudflare Pages
export const runtime = 'edge';

// =============================================================================
// LIST FILES / DOWNLOAD FILE
// =============================================================================
// GET /api/files          - List all files
// GET /api/files?key=path - Download specific file
export async function GET(request: Request) {
  const { env } = getRequestContext();
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const prefix = url.searchParams.get('prefix') || '';

  try {
    if (key) {
      // -------------------------------------------------------------------------
      // DOWNLOAD FILE
      // -------------------------------------------------------------------------
      // .get() returns an R2Object with body, or null if not found
      const object = await env.BUCKET.get(key);

      if (!object) {
        return Response.json(
          { error: 'File not found', key },
          { status: 404 }
        );
      }

      // Get file metadata
      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
      headers.set('Content-Length', String(object.size));
      headers.set('ETag', object.httpEtag);
      
      // Optional: Set filename for download
      headers.set('Content-Disposition', `attachment; filename="${key.split('/').pop()}"`);

      // Stream the file directly to the response
      return new Response(object.body, { headers });
    } else {
      // -------------------------------------------------------------------------
      // LIST FILES
      // -------------------------------------------------------------------------
      // .list() returns files matching the prefix
      const listed = await env.BUCKET.list({
        prefix,        // Filter by path prefix (e.g., "images/")
        limit: 100,    // Max files to return
        // cursor: '...'  // For pagination
      });

      // Transform R2Object metadata for JSON response
      const files = listed.objects.map((obj: R2Object) => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded.toISOString(),
        etag: obj.etag,
        // Custom metadata if you set any
        customMetadata: obj.customMetadata
      }));

      return Response.json({
        files,
        count: files.length,
        truncated: listed.truncated,  // true if more files exist
        cursor: listed.truncated ? listed.cursor : undefined  // Use for pagination
      });
    }
  } catch (error) {
    console.error('R2 error:', error);
    return Response.json(
      { error: 'Storage operation failed', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// UPLOAD FILE
// =============================================================================
// POST /api/files
// 
// Method 1: Form data (multipart/form-data)
//   - Use for file uploads from HTML forms
//   - Include 'file' field with the file
//   - Optional 'path' field for custom key
//
// Method 2: Direct body (any content-type)
//   - Set X-File-Key header for the path
//   - Send raw file data as body
export async function POST(request: Request) {
  const { env } = getRequestContext();

  try {
    const contentType = request.headers.get('Content-Type') || '';
    
    let key: string;
    let data: ArrayBuffer | ReadableStream;
    let httpMetadata: { contentType?: string } = {};

    if (contentType.includes('multipart/form-data')) {
      // -------------------------------------------------------------------------
      // FORM DATA UPLOAD
      // -------------------------------------------------------------------------
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        return Response.json(
          { error: 'No file provided. Use "file" field in form data.' },
          { status: 400 }
        );
      }

      // Use custom path or generate from filename
      const customPath = formData.get('path') as string | null;
      key = customPath || `uploads/${Date.now()}-${file.name}`;
      data = await file.arrayBuffer();
      httpMetadata.contentType = file.type;
    } else {
      // -------------------------------------------------------------------------
      // DIRECT UPLOAD (raw body)
      // -------------------------------------------------------------------------
      const customKey = request.headers.get('X-File-Key');
      
      if (!customKey) {
        return Response.json(
          { error: 'Missing X-File-Key header for direct upload' },
          { status: 400 }
        );
      }

      key = customKey;
      data = await request.arrayBuffer();
      httpMetadata.contentType = contentType || 'application/octet-stream';
    }

    // -------------------------------------------------------------------------
    // UPLOAD TO R2
    // -------------------------------------------------------------------------
    const object = await env.BUCKET.put(key, data, {
      httpMetadata,
      // Optional: Add custom metadata
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        // uploadedBy: userId
      }
    });

    return Response.json({
      message: 'File uploaded successfully',
      file: {
        key: object?.key || key,
        size: data instanceof ArrayBuffer ? data.byteLength : 'stream',
        etag: object?.etag
      },
      // Generate public URL if using custom domain
      url: `/api/files?key=${encodeURIComponent(key)}`
    }, { status: 201 });

  } catch (error) {
    console.error('R2 upload error:', error);
    return Response.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE FILE
// =============================================================================
// DELETE /api/files?key=path/to/file.jpg
export async function DELETE(request: Request) {
  const { env } = getRequestContext();
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return Response.json(
      { error: 'Missing required parameter: key' },
      { status: 400 }
    );
  }

  try {
    // -------------------------------------------------------------------------
    // CHECK IF FILE EXISTS
    // -------------------------------------------------------------------------
    // .head() is efficient - doesn't download the file
    const existing = await env.BUCKET.head(key);
    
    if (!existing) {
      return Response.json(
        { error: 'File not found', key },
        { status: 404 }
      );
    }

    // -------------------------------------------------------------------------
    // DELETE FILE
    // -------------------------------------------------------------------------
    await env.BUCKET.delete(key);

    return Response.json({
      message: 'File deleted successfully',
      deletedKey: key
    });
  } catch (error) {
    console.error('R2 delete error:', error);
    return Response.json(
      { error: 'Delete failed', details: String(error) },
      { status: 500 }
    );
  }
}
