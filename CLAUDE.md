# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

A **private shadcn registry** served by a Next.js 16 (App Router, Turbopack, Tailwind v4) app. It distributes custom components/hooks to consumer projects via `pnpm dlx shadcn add @private/<item>`, gated by a bearer token.

This registry is **offline-first**: consumers install from it in environments with no internet access. Every dependency an item needs must be resolvable from *this* registry — see "Offline rule" below.

Components are built on **Base UI** (`@base-ui/react`), NOT Radix. The project was deliberately migrated off radix (`shadcn init -b base`); do not add `radix-ui` / `@radix-ui/*` dependencies or install radix-based components.

## Commands

- `pnpm dev` — dev server (rebuilds registry first via `predev`)
- `pnpm build` — production build (rebuilds registry first via `prebuild`)
- `pnpm lint` — ESLint
- `pnpm registry:build` — `shadcn build --output .registry`; compiles `registry.json` + `registry/` sources into per-item JSON in `.registry/` (gitignored)

There are no tests.

The project uses **pnpm** (pinned via the `packageManager` field; run it through Corepack). `.npmrc` sets `enable-pre-post-scripts=true` so the `predev`/`prebuild` hooks fire.

## Architecture

The registry pipeline has three stages, and changes usually touch all three:

1. **Sources**: item source files live in `registry/<item-name>/` and are declared in root `registry.json` (name, type, files, registryDependencies). Source files import project aliases like `@/components/ui/button`; the shadcn CLI rewrites these on install in consumer projects.
2. **Build**: `shadcn build` inlines each item's file contents into `.registry/<item>.json` (plus a `registry.json` index). Output goes to `.registry/` — intentionally NOT `public/` — so items can never be fetched without auth. Do not change the output dir to `public/r`, that would bypass the token check.
3. **Serving**: `app/r/[name]/route.ts` handles `GET /r/{name}.json`. It validates `Authorization: Bearer <REGISTRY_TOKEN>` (timing-safe compare), rejects path traversal, and reads from `.registry/`. `next.config.ts` uses `outputFileTracingIncludes` to bundle `.registry/` into the serverless function — if you move the output dir, update that too.

Auth secret is `REGISTRY_TOKEN` in `.env.local` (see `.env.example`). The `registries` entry in `components.json` points at `http://localhost:3000` so this project can self-consume its own registry for testing (`REGISTRY_TOKEN=<token> pnpm dlx shadcn add @private/hello-world` while `pnpm dev` runs).

## Offline rule (registryDependencies)

Because consumers install offline, **every `registryDependencies` entry must resolve from this registry, never from the public shadcn registry.**

- A **bare** name like `"button"` resolves against the public registry (`ui.shadcn.com`) and requires internet — it will break offline installs. Never use bare names.
- Always namespace dependencies that live in this registry: `"@private/button"`.
- If an item depends on a base shadcn primitive (e.g. `button`, `input`) that isn't published here yet, **first publish it as its own item in this registry** (copy the source into `registry/<name>/`, add it to `registry.json`), then reference it as `@private/<name>`. Do not leave it as a bare name.
- `dependencies` (npm packages, e.g. `@base-ui/react`, `class-variance-authority`) is a separate field — list the item's npm deps there. These install from npm, not from this registry.

### Base colors (the non-obvious one)

On **every** install the shadcn CLI also fetches `${REGISTRY_URL}/colors/<baseColor>.json` (e.g. `colors/neutral.json`) to resolve CSS variables. This request is **unnamespaced**, so `@private` does NOT apply — it always hits the default `REGISTRY_URL`, which defaults to `https://ui.shadcn.com/r`. Offline, that 404s/times out even though all your items resolve fine. This is separate from `registryDependencies`.

Two things make it work offline, and both are required:

- **Registry side:** the palettes are committed in `registry-colors/` (neutral, zinc, slate, stone, gray, copied verbatim from the public registry) and served by `app/r/colors/[name]/route.ts`. That route is **intentionally unauthenticated** — the CLI never sends the `@private` Bearer token on the colors request, and palettes aren't proprietary. The item token gate (`app/r/[name]/route.ts`) is unaffected. `next.config.ts` bundles `registry-colors/` for the `/r/colors/[name]` route.
- **Consumer side:** the consumer must set `REGISTRY_URL` to this registry's `/r` base (e.g. `REGISTRY_URL=https://your-registry/r`) so the colors fetch is redirected here instead of `ui.shadcn.com`. Setting it does NOT affect `@private`, which is fully specified in `components.json`.

If a consumer uses a base color not in `registry-colors/`, add that palette's JSON there too.

## Adding a registry item

1. Create source under `registry/<item-name>/`.
2. Add the item entry to `registry.json`. List npm packages in `dependencies`; for `registryDependencies`, use only `@private/<name>` entries (see "Offline rule" — never bare names).
3. Register live examples for it (so it renders on `/preview` and `/components/<name>`) and add a short use-case phrase in `lib/component-blurbs.ts` (the concise description shown on `/components/<name>`). Prefer the **per-example folder** pattern: create one self-contained file per example under `components/previews/<item-name>/` (each is a complete, copy-pasteable snippet — inline any small helper/data it needs rather than sharing across files), export a `PreviewExample[]` from that folder's `index.tsx`, and register it in the `exampleOverrides` map in `components/previews/examples.tsx`. The old single-demo path still works: a `<item-name>-demo.tsx` added to the `previews` map in `components/previews/index.tsx` shows up as one "Preview" example — fine for cohesive single-scenario demos (see `sonner`, `data-grid`).
4. **No hardcoded colors** (see "Conventions"): every color must come from a theme token, never a literal hex/`rgb()`/named Tailwind color (e.g. `text-white`, `bg-green-600`) baked into the component.
5. **Always type-check whenever a component is created or updated**: run `npx tsc --noEmit` and fix any errors before moving on. Do not consider the item done while `tsc` reports errors.
6. `pnpm registry:build`, then verify with `curl -H "Authorization: Bearer $REGISTRY_TOKEN" http://localhost:3000/r/<item-name>.json`. Confirm any `registryDependencies` in the output are all `@private/...`.

The home page (`app/page.tsx`) shows a card grid of items grouped by `meta.group` (order: General, Layout, Data Entry, Data Display, Feedback, then any other groups, Others last — see `lib/registry-groups.ts`), each card rendering the item's demo as a non-interactive preview. Cards link to `/components/<name>`, which shows a sidebar of all items plus the item's examples; each example has a Code drawer displaying its source file. Examples come from `components/previews/examples.tsx` (`examplesFor(name)`): an item listed in the `exampleOverrides` map renders each of its per-example files (self-contained files under `components/previews/<name>/`, exported from that folder's `index.tsx` — see avatar, button, tabs for the pattern); otherwise it falls back to its single `<name>-demo.tsx` from the `previews` map as one "Preview" example. Each example's source is read at build time and shown in a right-hand Code drawer, so per-example files should be standalone (inline their own data/helpers). `/preview` (`app/preview/page.tsx`) renders every item's examples on one page via the same `examplesFor` — items without any registered example show a placeholder.

## Conventions

- shadcn is initialized with **Base UI** (`base-nova` style, `nova` preset), neutral base color, CSS variables (see `components.json`). Components installed via the CLI land in `components/ui/` and import primitives from `@base-ui/react/*`.
- **No borders by default.** Do not add `border`, `border-*`, or any border utility to a component unless the user explicitly asks for it.
- **No hardcoded colors in components.** Whenever a component is created or updated, every color must resolve from a theme token — never a literal hex/`rgb()`, an arbitrary value like `bg-[#334f4e]`, or a named Tailwind palette color like `text-white` / `bg-green-600` embedded in the component. Define a CSS variable in `app/globals.css` (map it under `@theme inline` as `--color-<name>: var(--<name>)`, then set the value in **both** `:root` and `.dark`) and reference it via the generated utility (`bg-<name>`, `text-<name>`, including `hover:` / `group-hover:` / `group-data-[selected]:` variants). For registry items, also declare each token in the item's `cssVars` (`theme`/`light`/`dark`) in `registry.json` so consumers get the variables on install. This keeps the whole palette restyleable from one file. See `conversation-card` for the pattern.
- Next.js 16: `params` in route handlers is a Promise (must be awaited); the middleware convention is `proxy.ts`, not `middleware.ts` (no proxy file currently exists). Bundled docs are in `node_modules/next/dist/docs/`.
