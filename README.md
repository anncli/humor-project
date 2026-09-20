# Meme Rankings

A small Next.js meme-ranking feed backed by Supabase and deployed through Vercel. The home page fetches and ranks memes by upvote count.

## Features

- Fetches meme records from Supabase at request time.
- Renders responsive cards with an image, caption, rank, and upvote total.
- Uses Row Level Security (RLS) to give visitors read-only access to the feed.
- Includes a small, one-time sample dataset of 12 public Crackd examples for visualization.

## Local development

Install dependencies, create a local environment file, and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the following values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_legacy_anon_key
```

Use the Supabase project URL and legacy anon key from **Settings → API Keys**. These names match the client setup in `src/lib/supabase.ts`.

> `.env.local` is ignored by Git. Never commit credentials or use a Supabase `service_role` / secret key in this frontend app.

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase database

The app reads from `public.memes`:

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `bigint` | Generated primary key |
| `image_url` | `text` | Public meme-image URL |
| `caption` | `text` | Meme caption |
| `upvote_count` | `integer` | Ranking score |
| `created_at` | `timestamptz` | Record creation time |

For a new Supabase project, create the table and its read-only public policy with:

```sql
create table public.memes (
  id bigint generated always as identity primary key,
  image_url text not null check (length(btrim(image_url)) > 0),
  caption text not null check (length(btrim(caption)) > 0),
  upvote_count integer not null default 0 check (upvote_count >= 0),
  created_at timestamptz not null default now()
);

alter table public.memes enable row level security;

grant select on table public.memes to anon, authenticated;

create policy "Public can view memes"
on public.memes
for select
to anon, authenticated
using (true);
```

The initial sample data was added directly to the connected Supabase project. It is remote data, so it is not stored in this repository or included in Git commits.

## Sample data source

The current feed contains 12 public Crackd examples, added once for a class-demo visualization. There is no scheduled scraper, crawler, or import script. Any future import should respect the source's terms and preserve appropriate attribution or permissions.

## Project structure

- `src/app/` contains Next.js routes, layouts, and global styles.
- `src/components/` contains reusable UI components.
- `src/config/` contains editable project copy and site-level configuration.
- `src/lib/supabase.ts` creates the shared Supabase client from environment variables.
- `public/` is reserved for static assets used by the app.

## Available scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Deployment

Import this repository into Vercel. Vercel detects the Next.js framework automatically.

In **Project Settings → Environment Variables**, add these variables for Production and Preview deployments:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Use the same values as `.env.local`, then redeploy. The `NEXT_PUBLIC_` variables are included in the browser bundle; the anon key is intended for this public client and is protected by the database's RLS policy. Do not add a Supabase service-role or secret key to Vercel for this frontend.
