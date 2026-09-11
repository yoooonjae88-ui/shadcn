# shadcn-private-registry-next

A private [shadcn registry](https://ui.shadcn.com/docs/registry) built with Next.js. Registry items are served from a token-protected route handler, so nothing is publicly accessible without a bearer token.

## How it works

- Registry items live as source files under [`registry/`](registry/) and are declared in [`registry.json`](registry.json).
- `pnpm registry:build` runs `shadcn build`, which resolves each item (inlining file contents) into per-item JSON files in `.registry/` — deliberately **outside** `public/`, so they are never served statically.
- The route handler [`app/r/[name]/route.ts`](app/r/%5Bname%5D/route.ts) serves `GET /r/{name}.json` after validating the `Authorization: Bearer <token>` header against the `REGISTRY_TOKEN` environment variable.
- `predev`/`prebuild` hooks rebuild the registry automatically before `next dev` / `next build`.

## Setup

```bash
pnpm install
cp .env.example .env.local   # then set REGISTRY_TOKEN to a long random secret
pnpm dev
```

Generate a token, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

## Adding registry items

1. Create the source file(s) under `registry/<item-name>/`.
2. Add an entry to `registry.json` (`name`, `type`, `files`, optional `registryDependencies` / `dependencies`).
3. Run `pnpm registry:build` (or just restart `pnpm dev`).

Supported item types include `registry:component`, `registry:block`, `registry:hook`, `registry:lib`, `registry:ui`, and more — see the [registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json).

## Consuming the registry

In the **consumer** project's `components.json`, add the registry with an auth header:

```jsonc
{
  "registries": {
    "@private": {
      "url": "https://your-registry.example.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Then, with `REGISTRY_TOKEN` set in the consumer's environment (shell or `.env.local`):

```bash
pnpm dlx shadcn@latest add @private/hello-world
```

The CLI fetches the item, installs its files, and resolves any `registryDependencies` (e.g. shadcn's `button`) automatically.

## Verifying auth

```bash
curl -i http://localhost:3000/r/hello-world.json
# -> 401 Unauthorized

curl -i -H "Authorization: Bearer $REGISTRY_TOKEN" http://localhost:3000/r/hello-world.json
# -> 200 with the registry item JSON
```

## Deployment notes

- Set `REGISTRY_TOKEN` in your hosting provider's environment variables.
- `next.config.ts` uses `outputFileTracingIncludes` to bundle `.registry/` into the serverless function so the route handler can read it at runtime.
- This is a single shared token. If you need per-user tokens, revocation, or audit logs, swap the check in `app/r/[name]/route.ts` for a lookup against your auth system.
