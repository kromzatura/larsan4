Fixing DYNAMIC_SERVER_USAGE on Netlify (Next.js App Router)
This note documents a production error we saw on Netlify and the fix we applied.

Symptom
Netlify logs showed:

ERROR: An error occurred in the Server Components render… digest: DYNAMIC_SERVER_USAGE
Only in production builds (Next.js hides the exact message).
Root cause
In frontend/app/[lang]/(main)/[slug]/page.tsx the Server Component read searchParams.
The same file used generateStaticParams to prebuild static pages.
Reading searchParams makes the route dynamic, which conflicts with SSG from generateStaticParams.
In short: the route was both “static” (SSG) and “dynamic” (using searchParams) — not allowed.

Two valid solutions
Split routes (recommended when you truly need dynamic params)

Keep a simple SSG page (no searchParams) for CMS “content pages” like /about.
Create a separate dynamic route (e.g. [...dynamicPage]) that can read searchParams.
Make the existing route fully static

Remove searchParams from the Server Component (and any props passed down) so it can be statically generated.
What we implemented
We applied option 2 for frontend/app/[lang]/(main)/[slug]/page.tsx:

Removed searchParams from the page component props.
Removed the local pageParams Promise.
Stopped passing searchParams into <Blocks /> from this page.
Blocks still conditionally accept searchParams where needed (e.g. product listings). Static CMS pages no longer force dynamic rendering.

File changed:

frontend/app/[lang]/(main)/[slug]/page.tsx
Validation
Typecheck passed (pnpm -w -C frontend typecheck).
Deployed to Netlify; the error disappeared on static CMS pages (e.g. /about).
Best practices to avoid this in future
Treat routes with generateStaticParams as SSG-only; don’t read searchParams there.
If a block needs searchParams (pagination, filters), either:
Render it only from a dynamic route; or
Gate passing searchParams to specific server blocks (as we do in components/blocks/index.tsx).
Keep dynamic concerns isolated from simple content pages.
Quick checklist
Does a Server Component read searchParams? If yes, the route is dynamic.
Are you calling generateStaticParams for that route? If yes, remove searchParams or split routes.
On pages showing the error in production only, check for this conflict first.
