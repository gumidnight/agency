# THE AGENCY Federation Website

Official federation-grade esports website for **THE AGENCY** (Association of Gaming and Educational Nexus of Cyprus), built with Next.js, TypeScript, Tailwind CSS, and deployed on Cloudflare Pages.

[![Deploy to Cloudflare Pages](https://github.com/gumidnight/agency/actions/workflows/deploy.yml/badge.svg)](https://github.com/gumidnight/agency/actions/workflows/deploy.yml)

**Live Site:** https://agency-798.pages.dev

<img width="1577" height="1005" alt="image" src="https://github.com/user-attachments/assets/5af8e7f6-39c8-475d-8e0d-8475860be90f" />

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [API Endpoints](#api-endpoints)
- [Database (D1)](#database-d1)
- [File Storage (R2)](#file-storage-r2)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Content Editing](#content-editing)
- [Docker Deployment](#docker-deployment-alternative)
- [Troubleshooting](#troubleshooting)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT                                    │
│                                                                         │
│   VS Code  ───►  git push  ───►  GitHub Repository                     │
│                                         │                               │
│                                         ▼                               │
│                                  GitHub Actions                         │
│                                  (CI/CD Pipeline)                       │
│                                         │                               │
└─────────────────────────────────────────┼───────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE EDGE NETWORK                          │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────────┐     │
│    │                    Cloudflare Pages                          │     │
│    │  ┌─────────────────┐    ┌─────────────────────────────┐     │     │
│    │  │   Next.js App   │    │   Edge Functions (API)      │     │     │
│    │  │   (Frontend)    │    │   /api/hello                │     │     │
│    │  │                 │    │   /api/users                │     │     │
│    │  │                 │    │   /api/files                │     │     │
│    │  └─────────────────┘    └──────────────┬──────────────┘     │     │
│    └────────────────────────────────────────┼────────────────────┘     │
│                                             │                           │
│              ┌──────────────────────────────┼──────────────────┐       │
│              │                              │                  │       │
│              ▼                              ▼                  ▼       │
│    ┌─────────────────┐          ┌─────────────────┐   ┌─────────────┐ │
│    │   D1 Database   │          │   R2 Storage    │   │  DNS + SSL  │ │
│    │   (SQLite)      │          │   (S3-compat)   │   │  (Auto)     │ │
│    │                 │          │                 │   │             │ │
│    │  • users        │          │  • uploads/     │   │  HTTPS ✓    │ │
│    │  • posts        │          │  • images/      │   │             │ │
│    └─────────────────┘          └─────────────────┘   └─────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Cloudflare Pages** | Edge hosting platform |
| **Cloudflare D1** | Serverless SQLite database |
| **Cloudflare R2** | Object storage (S3-compatible) |
| **GitHub Actions** | CI/CD automation |
| **Wrangler** | Cloudflare CLI tool |

---

## Project Structure

```
agency/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── app/
│   ├── api/
│   │   ├── hello/
│   │   │   └── route.ts        # Health check endpoint
│   │   ├── users/
│   │   │   └── route.ts        # D1 database CRUD operations
│   │   └── files/
│   │       └── route.ts        # R2 file storage operations
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   └── ...
├── content/
│   └── site.json               # Site content configuration
├── db/
│   └── schema.sql              # D1 database schema
├── lib/
│   ├── cloudflare-env.d.ts     # Cloudflare TypeScript types
│   ├── site-content.ts         # Content loader
│   └── types.ts                # Type definitions
├── public/
│   ├── icon.png                # Site favicon
│   └── images/                 # Static images
├── wrangler.toml               # Cloudflare configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

---

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm 10+
- Cloudflare account
- GitHub account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gumidnight/agency.git
   cd agency
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up Cloudflare credentials**
   ```bash
   # Set environment variables (PowerShell)
   $env:CLOUDFLARE_API_TOKEN = "your-api-token"
   $env:CLOUDFLARE_ACCOUNT_ID = "your-account-id"
   
   # Set environment variables (Bash)
   export CLOUDFLARE_API_TOKEN="your-api-token"
   export CLOUDFLARE_ACCOUNT_ID="your-account-id"
   ```

4. **Initialize the database**
   ```bash
   npx wrangler d1 execute agency-db --file=db/schema.sql --remote
   ```

---

## Local Development

### Standard Development Server

```bash
npm run dev
```

Opens at http://localhost:3000

### With Cloudflare Bindings (D1, R2)

```bash
npm run preview
```

This simulates the Cloudflare environment locally.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler |
| `npm run pages:build` | Build for Cloudflare Pages |
| `npm run preview` | Preview with Cloudflare bindings |
| `npm run deploy` | Manual deployment |

---

## API Endpoints

### Hello Endpoint

**GET** `/api/hello` - Health check endpoint

```bash
curl https://agency-798.pages.dev/api/hello
```

**POST** `/api/hello` - Echo endpoint

```bash
curl -X POST https://agency-798.pages.dev/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex"}'
```

### Users Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users?id=1` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users` | Update user |
| DELETE | `/api/users?id=1` | Delete user |

### Files Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files` | List all files |
| GET | `/api/files?key=path` | Download file |
| POST | `/api/files` | Upload file (multipart) |
| DELETE | `/api/files?key=path` | Delete file |

---

## Database (D1)

### Schema

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Database Commands

```bash
# Run schema on production
npx wrangler d1 execute agency-db --file=db/schema.sql --remote

# Interactive SQL
npx wrangler d1 execute agency-db --command="SELECT * FROM users" --remote

# List databases
npx wrangler d1 list
```

---

## File Storage (R2)

### Bucket: `agency-uploads`

```bash
# List buckets
npx wrangler r2 bucket list

# List objects
npx wrangler r2 object list agency-uploads

# Upload file
npx wrangler r2 object put agency-uploads/path/file.txt --file=./file.txt
```

---

## Deployment

### Automatic Deployment (CI/CD)

Every push to `main` triggers automatic deployment:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Deployment

```bash
npm run deploy
```

### Deployment Flow

```
git push main → GitHub Actions → Build → Cloudflare Pages → Live
```

---

## Environment Variables

### GitHub Secrets (Required)

Set in: `Repository Settings > Secrets and variables > Actions`

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | API token with Pages, D1, R2 permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### Cloudflare Pages Settings

Configure in: `Cloudflare Dashboard > Pages > agency > Settings > Functions`

| Setting | Value |
|---------|-------|
| Compatibility flags | `nodejs_compat` |
| Compatibility date | `2024-12-01` |

---

## Content Editing

All website content is sourced from `content/site.json`.

Edit this file to update:
- Organization data
- Navigation labels/anchors
- Hero copy
- WHO WE ARE content
- Vision cards
- Journey timeline milestones
- Team members
- Partner logos
- Footer contact/socials
- SEO metadata

### Placeholder Images

Replace files in `public/images/`:
- `logo-placeholder.png`
- `hero-placeholder.jpg`
- `about-placeholder.jpg`
- `vision-placeholder.jpg`
- `team-placeholder.jpg`
- `partner-placeholder.png`

---

## Docker Deployment (Alternative)

### Build and Run

```bash
docker build -t agency-federation .
docker run -p 3000:3000 agency-federation
```

### Docker Compose

```bash
docker compose up -d --build
```

### Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:3000
```

---

## Troubleshooting

### "nodejs_compat" Error

1. Go to Cloudflare Dashboard > Pages > agency > Settings > Functions
2. Add `nodejs_compat` to Compatibility flags
3. Save and redeploy

### Build Fails with Peer Dependency Error

```bash
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

### Database Query Fails

```bash
npx wrangler d1 execute agency-db --file=db/schema.sql --remote
```

### View Logs

```bash
npx wrangler pages deployment tail
```

---

## Notes

- Team section uses circular portraits with orange accent border
- Header is transparent at top and turns solid on scroll
- Hero supports full-width cinematic image with overlay and CTA
- SEO metadata + OpenGraph are generated from JSON content
- All API routes run on Cloudflare's edge network (300+ locations)

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)

---

## License

MIT License
