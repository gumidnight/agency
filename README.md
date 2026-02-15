# THE AGENCY Federation Website

Official federation-grade esports website for **THE AGENCY** (Association of Gaming and Educational Nexus of Cyprus), built with Next.js 14 App Router, TypeScript strict mode, Tailwind CSS, JSON content management, and Docker.

<img width="1577" height="1005" alt="image" src="https://github.com/user-attachments/assets/5af8e7f6-39c8-475d-8e0d-8475860be90f" />


## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript (strict)
- Tailwind CSS
- JSON content source (`content/site.json`)
- Docker + Docker Compose
- Cloudflare Tunnel compatible reverse proxy deployment

## Project Structure

- `app/` - App Router pages and global styles
- `components/` - UI sections and shared layout components
- `content/site.json` - all editable website content
- `public/images/` - placeholder assets (replace with real branding/media)
- `Dockerfile` - production multi-stage container build
- `docker-compose.yml` - container orchestration for port `3000`

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Production Build (Local)

```bash
npm run build
npm run start
```

The app runs on `0.0.0.0:3000` in production mode.

## Docker Deployment

1. Build image:

```bash
docker build -t agency2-federation .
```

2. Run container:

```bash
docker run --name agency2-federation -p 3000:3000 --restart unless-stopped agency2-federation
```

## Docker Compose Deployment

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose down
```

## Cloudflare Tunnel Deployment

This project is tunnel-safe because it uses:

- no hardcoded domain names
- app binding to `0.0.0.0`
- configurable reverse proxy target (`localhost:3000`)

Example Cloudflare Tunnel command:

```bash
cloudflared tunnel --url http://localhost:3000
```

If using a named tunnel, point ingress to `http://web:3000` (inside Docker network) or `http://localhost:3000` (host network), depending on your topology.

## Content Editing (JSON CMS-style)

All website content is sourced from:

- `content/site.json`

Edit this file to update:

- organization data
- navigation labels/anchors
- hero copy
- WHO WE ARE content
- vision cards
- journey timeline milestones
- team members
- partner logos
- footer contact/socials
- SEO metadata

No content text is hardcoded in page sections.

## Placeholder Images

Replace these files in `public/images/`:

- `logo-placeholder.png`
- `hero-placeholder.jpg`
- `about-placeholder.jpg`
- `vision-placeholder.jpg`
- `journey-placeholder.jpg`
- `team-placeholder.jpg`
- `partner-placeholder.png`

Keep the same paths or update paths in `content/site.json`.

## Notes

- Team section uses circular portraits with orange accent border and dark cards.
- Header is transparent at top and turns solid on scroll.
- Hero supports full-width cinematic image with overlay and CTA.
- SEO metadata + OpenGraph are generated from JSON content.
