# App analysis — per-framework detection & route enumeration

Goal of Phase 1: build an accurate `app-map.md` — the stack, how to run it, every
reachable screen, and every interactive surface with its data/auth prerequisites.
Run `scripts/detect_stack.py <app-root>` first, then read the routing to fill gaps.
**Do not guess** — if a screen needs auth or seed data, record it.

## Where routes live, per framework

| Framework  | Route source | How to enumerate |
|------------|--------------|------------------|
| **Next.js** | `app/` (App Router) or `pages/` (Pages Router); also `src/app`, `src/pages` | Each `page.tsx`/`page.js` (App Router) or file under `pages/` (Pages Router) is a route. `[param]` = dynamic, `[...slug]` = catch-all, `(group)` = layout group (not a URL segment). Note `middleware.ts` for auth gates and `route.ts`/API routes for backend deps. |
| **Nuxt** | `pages/` | File-based routing, same conventions as Next Pages Router. Check `middleware/` for route guards. |
| **Remix** | `app/routes/` | Flat or nested route files; `_` prefixes are pathless layouts, `$param` is dynamic. `loader`/`action` exports reveal data + mutation deps. |
| **SvelteKit** | `src/routes/` | `+page.svelte` = page, `+layout.svelte` = layout, `+server.ts` = endpoint, `[param]` dynamic. `+page.server.ts` `load`/actions reveal deps and auth. |
| **Astro** | `src/pages/` | `.astro`/`.md` files are routes; `[param]` dynamic. Note `client:*` directives — those are the interactive islands worth testing. |
| **Vue (Vue Router)** | `src/router/`, `src/views`, `src/pages` | Read the router config (`createRouter({ routes: [...] })`) for the definitive list, including `meta: { requiresAuth }` guards. |
| **Angular** | `src/app` | Read `*-routing.module.ts` / `provideRouter(...)` for routes and `canActivate` guards. |
| **Plain React SPA** | `src/` | No file routing — read the `<Routes>`/`<Route>` tree (React Router) or the equivalent. Grep for `path=` / `createBrowserRouter`. |
| **Plain SPA / static** | — | Enumerate HTML entry points and the JS that wires up interactivity. |

## What to catalogue on every screen

For each reachable screen, record in `app-map.md`:

- **Route + how to reach it** (URL, and whether it's linked or deep-link-only).
- **Auth boundary** — public, requires-login, requires-role. Note the redirect target when unauthenticated.
- **Data prerequisites** — seed data, an existing record, a prior step's output. If a page 404s without a valid `:id`, say so.
- **Interactive surfaces**, each a testable target:
  - **Forms** — fields, required/optional, validation rules, submit target.
  - **Wizards / multi-step flows** — steps, state carried between them, back/forward behaviour.
  - **Modals / dialogs / drawers** — how opened, focus behaviour, dismiss paths.
  - **Tables / lists** — pagination, sorting, filtering, empty state, large-dataset behaviour.
  - **Uploads** — accepted types/sizes, where the file goes.
  - **Payments / checkout** — test-mode keys, sandbox behaviour (never touch real payment rails).
  - **External / API dependencies** — third-party services, webhooks, auth providers. Note which can be stubbed vs. which need a live sandbox.

## Getting the app runnable

From `detect_stack.py` you get candidate `dev`/`preview`/`build`/`test` commands and
the package manager. Confirm:

- **Env vars** — read `.env.example` / `.env`; note anything required to boot (DB URL, API keys). Missing required env is itself a finding if the app crashes rather than degrading.
- **Services** — does it need a database, Redis, a backend server running alongside? Record how to start them.
- **Build vs. preview** — prefer testing a production-like `preview` build; fall back to `dev` if preview isn't wired up. Note which you used.

Write all of this to `app-map.md` before moving to flow discovery.
