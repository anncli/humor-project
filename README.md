# Morningside Memes

Where Columbians turn pain into punchlines. Morningside Memes is a student-made meme-ranking feed backed by Supabase and deployed through Vercel.

## What it does

- Fetches meme records from Supabase at request time.
- Renders a carnival-style, responsive ranking board with meme cards, rank, and Roar-ee points.
- Highlights the top three on a podium, with a crown for the #1 meme.
- Uses Row Level Security (RLS) to give visitors read-only access to the feed.
- Displays a one-time import of top public Crackd examples for visualization.

## Run locally

Install dependencies, create a local environment file, and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your project credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_legacy_anon_key
```

Find the Supabase project URL and legacy anon key in **Settings → API Keys**. These names match the client setup in `src/lib/supabase.ts`.

> `.env.local` is ignored by Git. Never commit credentials or use a Supabase `service_role` / secret key in this frontend app.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: connect Supabase MCP to Codex

> **Note:** Supabase MCP's default OAuth setup can be unreliable with Codex and may fail during OAuth client registration with scope-related errors. This project uses a Supabase Personal Access Token passed to Codex as a bearer token instead.

Create a Supabase Personal Access Token, then export it in your terminal:

```bash
export SUPABASE_ACCESS_TOKEN='YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN'
```

Add the Supabase MCP server, replacing `YOUR_PROJECT_REF` with the reference from your Supabase project URL:

```bash
codex mcp add supabase \
  --url 'https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF&features=docs%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching' \
  --bearer-token-env-var SUPABASE_ACCESS_TOKEN
```

Verify the connection, then start Codex in the same terminal session:

```bash
codex mcp get supabase
codex
```

Inside Codex, run `/mcp`; Supabase should appear as connected. The `export` applies only to the current terminal session. To persist it across new sessions, add the export command to your shell configuration (for example, `~/.zshrc`).

> **Important:** Never commit your Supabase Personal Access Token or any other secrets to Git.

## Data model and access

The app reads leaderboard entries from `public.memes`:

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

The leaderboard data lives in the connected Supabase project, not in this repository or its Git history.

### Data flow

1. `src/lib/supabase.ts` creates the shared Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. On each request, the server-rendered home page in `src/app/page.tsx` counts `public.memes` and fetches the top three rows for the podium. The podium and ranking queries order by `upvote_count` descending and `id` ascending, so tied scores keep a stable order.
3. The first three rows are passed to `RankingPodium`, which renders each one as a `MemeCard` in the podium layout. The remaining rows are fetched four at a time with the `?page=` URL parameter and use the same `MemeCard` component in the ranking grid.
4. Each card renders the row's `image_url` with Next.js `Image`, its `caption` as accessible alt text and visible copy, and its `upvote_count` as Roar-ee points. The position in the sorted result becomes the displayed rank.

Visitors can only read the feed through the `Public can view memes` RLS policy. Use a privileged server-side or administrative connection for imports and other writes—never expose those credentials to the browser.

## Sample data source

The current feed contains 23 public Crackd All Time entries, imported once for a class-demo visualization. The page attributes this content with “Based on crackd.ai.” There is no scheduled scraper, crawler, or import script. Any future import should respect the source's terms and preserve appropriate attribution or permissions.

## Project structure

- `src/app/` contains Next.js routes, layouts, and global styles.
- `src/components/` contains reusable UI components.
- `src/config/` contains editable project copy and site-level configuration.
- `src/lib/supabase.ts` creates the shared Supabase client from environment variables.
- `public/` is reserved for static assets used by the app.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Deployment

Import the repository into Vercel; it detects Next.js automatically.

In **Project Settings → Environment Variables**, add these variables for Production and Preview deployments:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Use the same values as `.env.local`, then redeploy. `NEXT_PUBLIC_` variables are included in the browser bundle, so do not add a Supabase service-role or secret key to Vercel for this frontend.
