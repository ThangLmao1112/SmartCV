# SmartCV — AI Resume Builder

SmartCV is a production-ready fullstack resume builder built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Supabase, and a deployable Docker setup.

## What It Covers

- Authentication with sign up, sign in, sign out, and forgot password.
- Resume dashboard with create, duplicate, edit, delete, and preview flows.
- AI foundation with a mock provider, prompt builder, and generation history storage.
- Supabase schema, RLS policies, and storage bucket rules.
- Responsive marketing page, auth pages, dashboard shell, and resume editor preview.
- Production Dockerfile, docker compose, and VPS-ready standalone build.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, RLS, and Storage
- React Hook Form + Zod
- next-themes + sonner
- Docker + Docker Compose

## Project Structure

```text
app/
components/
components/ui/
components/auth/
components/dashboard/
components/layout/
components/resume/
lib/
services/
schemas/
actions/
supabase/
styles/
types/
```

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create your environment file.

```bash
copy .env.example .env.local
```

3. Apply the Supabase migration in `supabase/migrations/202605280001_init.sql`.

4. Run the app.

```bash
npm run dev
```

## Supabase Setup

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env.local`.
3. Apply the SQL migration from `supabase/migrations/202605280001_init.sql`.
4. Verify the `avatars` storage bucket and RLS policies are created.

The migration creates:

- `profiles`
- `resumes`
- `education`
- `experiences`
- `skills`
- `projects`
- `ai_generations`
- `uploaded_files`

It also adds:

- `updated_at` triggers
- foreign keys with cascade deletes
- indexes for user and resume lookups
- row level security policies for every table
- a public `avatars` storage bucket and object policies

## Docker

Build and run locally:

```bash
docker compose up --build
```

The app listens on port `3000` by default.

### Production Container Notes

- `Dockerfile` uses a multi-stage build.
- Next.js is configured with `output: "standalone"`.
- The final image runs as a non-root `nextjs` user.

## VPS Deployment

1. Push the repository to your server.
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Run Docker Compose.

```bash
docker compose up -d --build
```

4. Put Nginx in front of the container.

Example reverse proxy:

```nginx
server {
	listen 80;
	server_name smartcv.example.com;

	location /.well-known/acme-challenge/ {
		root /var/www/certbot;
	}

	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

5. Issue HTTPS with Let’s Encrypt.

```bash
sudo certbot --nginx -d smartcv.example.com
```

Renewal is typically handled automatically by Certbot on the VPS.

## AI Foundation

The app defaults to the mock AI provider so it works without a live LLM key.

To switch later:

- set `AI_PROVIDER`
- add your real provider implementation in `services/ai/providers/`
- keep the prompt builder and `ai_generations` persistence intact

## Validation

```bash
npm run typecheck
npm run build
```

## Notes

- The dashboard routes live under `/dashboard/*`.
- The auth routes are `/sign-in`, `/sign-up`, and `/forgot-password`.
- The project uses a `proxy.ts` file for session refresh in Next.js 16.
