# CVForge

CVForge is a production-oriented MVP for building optimized resumes and CVs. It is a mobile-first Next.js App Router application with Supabase Auth, Supabase Postgres, Supabase Storage, bilingual English/Spanish UI, bilingual CV output, guided onboarding, detailed CV section forms, quality scoring, deterministic optimization, optional OpenAI-compatible optimization, three CV templates, and print/PDF export.

## Features

- Email/password authentication with Supabase SSR cookies and protected routes.
- Public landing page, demo, login, signup, auth callback, dashboard, onboarding, builder, preview, settings, and account pages.
- Deep onboarding questionnaire with progress, mobile-friendly steps, and a first CV version created on completion.
- CV builder for contact info, education, experience, projects, achievements, skills, languages, certifications, template choice, target purpose, tone, output language, optional photo, live preview, and section inclusion toggles.
- Three templates: Modern, Classic, and Minimal.
- CV quality scoring across completeness, clarity, impact, ATS friendliness, contact, achievements, skills, and formatting.
- Deterministic summary/bullet optimization plus optional server-side OpenAI API usage via `OPENAI_API_KEY`.
- Supabase Storage profile photo upload to the `profile-photos` bucket with MIME and size policy notes.
- Browser print / Save as PDF fallback with print CSS that hides editor controls.

## Tech Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase Auth/Postgres/Storage/RLS, `@supabase/ssr`, React Hook Form-ready dependencies, Zod, Framer Motion, lucide-react, Sonner, and Vercel.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_APP_URL=
```

Only `NEXT_PUBLIC_*` values are exposed to the browser. Keep `OPENAI_API_KEY` server-side only.

## Supabase Setup

1. Create or select a Supabase project.
2. Run `supabase/migrations/202605220001_initial_schema.sql` in the SQL editor or with the Supabase CLI.
3. Enable Email/Password auth in Supabase Auth.
4. Optional Google OAuth: configure the Google provider and set the callback URL to `<APP_URL>/auth/callback`.
5. Confirm the `profile-photos` storage bucket exists after running the migration.

The migration creates:

- `profiles`
- `cv_versions`
- `education_entries`
- `experience_entries`
- `project_entries`
- `achievement_entries`
- `skill_entries`
- `language_entries`
- `certification_entries`
- `generated_sections`

Every user-owned table has RLS enabled and policies that restrict select/insert/update/delete to `auth.uid()`. Storage policies restrict writes to a user-owned folder prefix.

## Vercel Deployment

1. Push this repo to GitHub.
2. Import it in Vercel as a Next.js project.
3. Add the environment variables above.
4. Set `NEXT_PUBLIC_APP_URL` to the Vercel production URL.
5. Deploy.

The app builds without Supabase variables for preview purposes, but authentication and persistence require Supabase env vars at runtime.

## Usage

1. Sign up.
2. Complete onboarding.
3. Create or open a CV version.
4. Add detailed entries and optimize summary text.
5. Preview and print/save as PDF.

## Known Limitations

- PDF export uses browser print/save as PDF fallback instead of server-side PDF rendering.
- AI optimization uses OpenAI chat completions when `OPENAI_API_KEY` exists; otherwise deterministic rewriting is used.
- Section drag-and-drop reordering is represented by sort order and inclusion toggles, but full drag UI is a future enhancement.
- Hosted Supabase project provisioning and Vercel deployment require account credentials and cost confirmation outside this local build.

## Future Improvements

- Native PDF renderer with pagination controls.
- Full drag-and-drop section and entry ordering.
- Rich manual editing for generated bullets.
- More templates and target-specific CV examples.
- Account deletion flow with explicit confirmation.
