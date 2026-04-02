# MTC Intelligence Engine

This repository contains the MTC marketing site, admin surfaces, product catalog, and supporting API routes for the brokerage intelligence platform.

## What MTC ships

- A deck-driven marketing site for the `MTC Intelligence Engine`
- A module catalog for inventory, lead intelligence, scorecards, heatmaps, and launch paths
- Admin and builder flows used to preview and operate the experience
- Supporting integrations for auth, payments, domains, and data-backed experiences

## Project structure

- `app/**` - Next.js App Router pages and API routes
- `components/**` - shared UI, marketing sections, builder panels, and catalog blocks
- `lib/**` - marketing defaults, brand config, helpers, and server utilities
- `docs/**` - markdown documentation used by the docs routes
- `public/**` - static assets and icons

## Local development

1. Install dependencies

   ```bash
   npm install
   ```

2. Create your environment file

   ```bash
   cp .env.example .env
   ```

3. Start the app

   ```bash
   npm run dev
   ```

The app runs locally on `http://localhost:3000`.

## Inventory ingestion note

Some ingestion flows still rely on a legacy structured inventory source behind the scenes. That compatibility layer is internal and does not affect the public MTC brand.

## Validation commands

- `npm run lint`
- `npm run build`
- `npm run smoke`
- `npm run test:env-safety`
- `npm run test:vercel-env-sanity`
- `npm run test:supabase-chain`

## Deployment notes

- Set `NEXT_PUBLIC_APP_URL` to your canonical deployment URL
- Provide the auth, Firebase, Supabase, and payment variables referenced in `.env.example`
- Run `npm run build` before shipping changes

## Brand references

- Public brand: `MTC` / `MTC Martech`
- Canonical marketing domain: `mtcmartech.com`
- Primary CTA: `DM "INTELLIGENCE"`
