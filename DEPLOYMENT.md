# 🚀 Cloudflare Pages Deployment Guide

This guide explains how to deploy this Next.js application to Cloudflare Pages using GitHub Actions.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Initial Setup (One-Time)](#initial-setup-one-time)
3. [Creating GitHub Secrets](#creating-github-secrets)
4. [Creating D1 Database](#creating-d1-database)
5. [Creating R2 Bucket](#creating-r2-bucket)
6. [Local Development](#local-development)
7. [Deployment Flow](#deployment-flow)
8. [API Routes](#api-routes)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              YOUR DEVELOPMENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   VS Code  ──────► git push ──────► GitHub Repository                      │
│                                            │                                │
│                                            ▼                                │
│                                    GitHub Actions                           │
│                                    (deploy.yml)                             │
│                                            │                                │
│                                            ▼                                │
│                              ┌─────────────────────────┐                    │
│                              │   Cloudflare Pages      │                    │
│                              │   (Edge Network)        │                    │
│                              │                         │                    │
│                              │  ┌─────────────────┐    │                    │
│                              │  │   Next.js App   │    │                    │
│                              │  │   (Frontend)    │    │                    │
│                              │  └────────┬────────┘    │                    │
│                              │           │             │                    │
│                              │  ┌────────▼────────┐    │                    │
│                              │  │   API Routes    │    │                    │
│                              │  │ (Edge Functions)│    │                    │
│                              │  └────────┬────────┘    │                    │
│                              └───────────┼─────────────┘                    │
│                                          │                                  │
│                     ┌────────────────────┼────────────────────┐            │
│                     ▼                    ▼                    ▼            │
│              ┌───────────┐        ┌───────────┐        ┌───────────┐       │
│              │    D1     │        │    R2     │        │    DNS    │       │
│              │ Database  │        │  Storage  │        │  + SSL    │       │
│              │  (SQL)    │        │ (Files)   │        │           │       │
│              └───────────┘        └───────────┘        └───────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Initial Setup (One-Time)

### Step 1: Create a Cloudflare Account

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up or log in
3. Note your **Account ID** (shown in URL or right sidebar)

### Step 2: Create a Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template OR create custom token with:
   - **Account > Cloudflare Pages** → Edit
   - **Account > D1** → Edit (if using database)
   - **Account > R2 Storage** → Edit (if using file storage)
4. Click **Continue to summary** → **Create Token**
5. **COPY THE TOKEN** (you won't see it again!)

### Step 3: Create Cloudflare Pages Project

**Option A: Via Dashboard (Recommended for first time)**
1. Go to Cloudflare Dashboard → **Pages**
2. Click **Create a project** → **Connect to Git**
3. Select your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.vercel/output/static`
5. Click **Save and Deploy**

**Option B: Via CLI (Subsequent deploys)**
```bash
npx wrangler pages project create agency
```

---

## 🔐 Creating GitHub Secrets

GitHub Secrets store sensitive data for CI/CD. They're encrypted and not visible in logs.

### How to Add Secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Where to Find It |
|-------------|------------------|
| `CLOUDFLARE_API_TOKEN` | The token you created in Step 2 |
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard URL: `dash.cloudflare.com/[THIS_IS_YOUR_ID]` |

---

## 📊 Creating D1 Database

### Step 1: Login to Wrangler

```bash
# Install wrangler globally (optional)
npm install -g wrangler

# Login to Cloudflare
npx wrangler login
```

### Step 2: Create the Database

```bash
# Create a new D1 database
npx wrangler d1 create agency-db
```

**Output:**
```
✅ Successfully created DB 'agency-db'!

Add this to your wrangler.toml:
[[d1_databases]]
binding = "DB"
database_name = "agency-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 3: Update wrangler.toml

Copy the `database_id` from the output and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "agency-db"
database_id = "YOUR_ACTUAL_DATABASE_ID"  # ← Replace this!
```

### Step 4: Run Schema

```bash
# Create tables in production
npx wrangler d1 execute agency-db --file=db/schema.sql --remote

# Create tables locally (for development)
npx wrangler d1 execute agency-db --file=db/schema.sql --local
```

---

## 📦 Creating R2 Bucket

### Step 1: Create the Bucket

```bash
npx wrangler r2 bucket create agency-uploads
```

**Output:**
```
✅ Created bucket 'agency-uploads'
```

### Step 2: Verify wrangler.toml

The bucket is already configured in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "agency-uploads"
```

---

## 💻 Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
# Standard Next.js development (without Cloudflare bindings)
npm run dev

# With Cloudflare bindings (D1, R2, etc.)
npm run preview
```

### Test API Routes Locally

```bash
# Test hello endpoint
curl http://localhost:3000/api/hello

# Test with POST
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex"}'

# Test users API
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

---

## 🚀 Deployment Flow

### Automatic Deployment (CI/CD)

```
1. Make changes in VS Code
           │
           ▼
2. git add . && git commit -m "message"
           │
           ▼
3. git push origin main
           │
           ▼
4. GitHub detects push → triggers workflow
           │
           ▼
5. GitHub Actions:
   ├── Checkout code
   ├── Setup Node.js
   ├── npm ci (install deps)
   ├── npm run pages:build
   └── Deploy to Cloudflare Pages
           │
           ▼
6. Live at: https://agency.pages.dev
```

### Manual Deployment

```bash
# Build and deploy manually
npm run deploy

# Or step by step:
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=agency
```

---

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hello` | GET | Health check, returns edge info |
| `/api/hello` | POST | Echo back JSON body |
| `/api/users` | GET | List all users |
| `/api/users?id=1` | GET | Get user by ID |
| `/api/users` | POST | Create user |
| `/api/users` | PUT | Update user |
| `/api/users?id=1` | DELETE | Delete user |
| `/api/files` | GET | List files in R2 |
| `/api/files?key=...` | GET | Download file |
| `/api/files` | POST | Upload file (multipart) |
| `/api/files?key=...` | DELETE | Delete file |

---

## 🔧 Troubleshooting

### "Database not found" error

```bash
# Check if database exists
npx wrangler d1 list

# Re-run schema
npx wrangler d1 execute agency-db --file=db/schema.sql --remote
```

### Build fails with "edge runtime" error

Make sure all API routes have:
```typescript
export const runtime = 'edge';
```

### Fonts not loading

Google Fonts work on Cloudflare. Make sure `next.config.mjs` has:
```javascript
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
```

### "Too many redirects" error

Check if you're redirecting HTTP to HTTPS properly in Cloudflare DNS settings.

### Local development not finding bindings

Run with `npm run preview` instead of `npm run dev` to simulate Cloudflare environment.

---

## 📁 Project Structure

```
agency/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── app/
│   ├── api/
│   │   ├── hello/
│   │   │   └── route.ts        # Hello endpoint
│   │   ├── users/
│   │   │   └── route.ts        # D1 database CRUD
│   │   └── files/
│   │       └── route.ts        # R2 storage operations
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                  # React components
├── db/
│   └── schema.sql              # D1 database schema
├── lib/
│   ├── cloudflare-env.d.ts     # TypeScript types
│   └── ...
├── public/                      # Static assets
├── wrangler.toml               # Cloudflare configuration
├── next.config.mjs             # Next.js configuration
├── package.json
└── README.md
```

---

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
