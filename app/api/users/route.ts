/**
 * USERS API - /api/users
 * 
 * =============================================================================
 * D1 DATABASE OPERATIONS
 * =============================================================================
 * 
 * This file demonstrates how to:
 *   1. Connect to D1 database
 *   2. Run queries (SELECT, INSERT, UPDATE, DELETE)
 *   3. Handle errors properly
 *   4. Return JSON responses
 * 
 * IMPORTANT CONCEPTS:
 * 
 * D1 Query Methods:
 *   .all()   - Get all matching rows as array
 *   .first() - Get first matching row only
 *   .run()   - Execute query without returning rows (INSERT, UPDATE, DELETE)
 * 
 * Prepared Statements (ALWAYS USE THESE!):
 *   env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId)
 *   - The ? is a placeholder
 *   - .bind() safely inserts values (prevents SQL injection)
 *   - NEVER concatenate user input into SQL strings!
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

// Required for Cloudflare Pages
export const runtime = 'edge';

// =============================================================================
// GET ALL USERS
// =============================================================================
// GET /api/users - Returns all users
// GET /api/users?id=1 - Returns single user by ID
export async function GET(request: Request) {
  const { env } = getRequestContext();
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');

  try {
    if (userId) {
      // -------------------------------------------------------------------------
      // GET SINGLE USER BY ID
      // -------------------------------------------------------------------------
      // .first() returns the first row or null
      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE id = ?'
      )
        .bind(parseInt(userId))
        .first();

      if (!user) {
        return Response.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return Response.json({ user });
    } else {
      // -------------------------------------------------------------------------
      // GET ALL USERS
      // -------------------------------------------------------------------------
      // .all() returns { results: [...], success: true, ... }
      const { results } = await env.DB.prepare(
        'SELECT * FROM users ORDER BY created_at DESC'
      ).all();

      return Response.json({ 
        users: results,
        count: results.length 
      });
    }
  } catch (error) {
    // Handle database errors
    console.error('Database error:', error);
    return Response.json(
      { error: 'Database query failed', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// CREATE NEW USER
// =============================================================================
// POST /api/users
// Body: { "email": "user@example.com", "name": "User Name" }
export async function POST(request: Request) {
  const { env } = getRequestContext();

  try {
    // Parse request body
    const body = await request.json() as { email?: string; name?: string };
    const { email, name } = body;

    // Validate required fields
    if (!email || !name) {
      return Response.json(
        { error: 'Missing required fields: email and name' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // INSERT NEW USER
    // -------------------------------------------------------------------------
    // RETURNING * gives us the inserted row back (D1/SQLite feature)
    const result = await env.DB.prepare(
      'INSERT INTO users (email, name) VALUES (?, ?) RETURNING *'
    )
      .bind(email, name)
      .first();

    return Response.json(
      { message: 'User created successfully', user: result },
      { status: 201 }
    );
  } catch (error) {
    // Check for unique constraint violation (duplicate email)
    if (String(error).includes('UNIQUE constraint failed')) {
      return Response.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to create user', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// UPDATE USER
// =============================================================================
// PUT /api/users
// Body: { "id": 1, "name": "New Name" }
export async function PUT(request: Request) {
  const { env } = getRequestContext();

  try {
    const body = await request.json() as { id?: number; name?: string; email?: string };
    const { id, name, email } = body;

    if (!id) {
      return Response.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // UPDATE USER
    // -------------------------------------------------------------------------
    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) {
      return Response.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Always update the updated_at timestamp
    updates.push("updated_at = datetime('now')");
    values.push(id);

    const result = await env.DB.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ? RETURNING *`
    )
      .bind(...values)
      .first();

    if (!result) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({ message: 'User updated', user: result });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to update user', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE USER
// =============================================================================
// DELETE /api/users?id=1
export async function DELETE(request: Request) {
  const { env } = getRequestContext();
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');

  if (!userId) {
    return Response.json(
      { error: 'Missing required parameter: id' },
      { status: 400 }
    );
  }

  try {
    // -------------------------------------------------------------------------
    // DELETE USER
    // -------------------------------------------------------------------------
    // Check if user exists first
    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE id = ?'
    )
      .bind(parseInt(userId))
      .first();

    if (!existing) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // .run() is for queries that don't return rows
    await env.DB.prepare('DELETE FROM users WHERE id = ?')
      .bind(parseInt(userId))
      .run();

    return Response.json({ 
      message: 'User deleted successfully',
      deletedId: parseInt(userId)
    });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to delete user', details: String(error) },
      { status: 500 }
    );
  }
}
