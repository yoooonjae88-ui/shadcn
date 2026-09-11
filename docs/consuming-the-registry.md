# Consuming the Private Registry from Another Next.js Application

This guide is for **consumer projects**: Next.js apps that want to install components from the private registry with `pnpm dlx shadcn add @private/<item>`.

It assumes the registry is already deployed and reachable at a public URL — `https://registry.example.com` is used throughout; replace it with your real host. You also need the registry's bearer token (`REGISTRY_TOKEN`), which whoever operates the registry can give you.

## 1. Prerequisites in the consumer app

The registry serves **source files**, not a compiled package — installed components become part of your codebase and must compile in your project. You need:

- A Next.js app with **Tailwind CSS v4** and TypeScript.
- shadcn initialized with the **Base UI** flavor (this registry's components are built on `@base-ui/react`, not Radix):

  ```bash
  pnpm dlx shadcn@latest init -b base
  ```

  This creates `components.json`, sets up CSS variables in your globals, and installs the base dependencies (`@base-ui/react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`).

If your app already has a Radix-based shadcn setup, the registry's components will still install, but you will end up with a mixed Radix/Base UI tree — check with the registry maintainers before doing that.

## 2. Register the `@private` namespace in `components.json`

Add a `registries` block to your `components.json`:

```jsonc
{
  // ...existing config (style, tailwind, aliases, ...)
  "registries": {
    "@private": {
      "url": "https://registry.example.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

- `{name}` is substituted by the CLI with the item name you ask for.
- `${REGISTRY_TOKEN}` is expanded from an environment variable at install time — the token itself never lives in `components.json`, so the file is safe to commit.

## 3. Provide the token

Put the token in your project's `.env.local` (the shadcn CLI reads `.env` / `.env.local` from the project root):

```bash
# .env.local  (gitignored — never commit the token)
REGISTRY_TOKEN=<the token you were given>
```

Alternatively, export it in your shell for one-off use:

```bash
# bash/zsh
export REGISTRY_TOKEN=<token>

# PowerShell
$env:REGISTRY_TOKEN = "<token>"
```

## 4. Browse what's available

The registry index lists every item:

```bash
curl -H "Authorization: Bearer $REGISTRY_TOKEN" https://registry.example.com/r/registry.json
```

You can also inspect a single item before installing it:

```bash
pnpm dlx shadcn@latest view @private/hello-world
```

## 5. Install components

```bash
pnpm dlx shadcn@latest add @private/hello-world
```

Multiple items at once:

```bash
pnpm dlx shadcn@latest add @private/tabs @private/card @private/use-debounce
```

What the CLI does on install:

1. Fetches `https://registry.example.com/r/<item>.json` with your `Authorization` header.
2. Writes the source files into your project according to each file's type, using the aliases from your `components.json`:

   | Item type | Lands in |
   |---|---|
   | `registry:ui` | `components/ui/` |
   | `registry:component` | `components/` |
   | `registry:hook` | `hooks/` |
   | `registry:lib` | `lib/` |

3. Rewrites import paths (`@/components/ui/...`, `@/lib/utils`) to match your aliases.
4. Installs any declared npm `dependencies` into your project.
5. Resolves `registryDependencies` — e.g. installing `@private/hello-world` also pulls in `button`. Bare names like `button` come from the public shadcn registry (`ui.shadcn.com`) in your configured style; `@private/...` names come from this registry.

Then use the component like any local code:

```tsx
import { HelloWorld } from "@/components/hello-world"

export default function Page() {
  return <HelloWorld />
}
```

## 6. Updating components

Installed files are plain source in your repo — there is no automatic update channel. To pull a newer version of an item, re-run the add command and let it overwrite:

```bash
pnpm dlx shadcn@latest add @private/tabs --overwrite
```

If you have local modifications, diff before overwriting (the files are yours — `git diff` after the overwrite and selectively restore your changes).

## 7. CI / teams

- Each developer puts `REGISTRY_TOKEN` in their own `.env.local`. Distribute the token through your secrets manager, not chat.
- In CI, expose it as a secret environment variable (e.g. a GitHub Actions secret) if any pipeline step runs `shadcn add`. Note that *building* the consumer app does **not** need the token — components are vendored into your repo at install time; the registry is only contacted by the CLI.

## 8. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `401 Unauthorized` | `REGISTRY_TOKEN` is missing, wrong, or wasn't expanded. Check it's set in `.env.local` (or exported) in the directory where you run the CLI, with no quotes/whitespace issues. Verify with the `curl` command from section 4. |
| `404 Not Found` | Item name typo, or the item hasn't been published in the deployed registry version yet. List available items via `/r/registry.json`. |
| CLI can't resolve `@private/...` | The `registries` block is missing from `components.json`, or the namespace doesn't match (`@private`). |
| TLS/certificate errors | The registry is behind an internal CA. Point Node at your CA bundle: `export NODE_EXTRA_CA_CERTS=/path/to/internal-ca.pem` before running the CLI. |
| Installed component fails to compile (`@base-ui/react` not found) | Your project wasn't initialized with the Base UI flavor — run `pnpm add @base-ui/react` or re-init with `pnpm dlx shadcn@latest init -b base`. |
| `registryDependencies` fetch fails (no internet) | Bare dependencies like `button` are fetched from `ui.shadcn.com`. If your network can't reach it, ask the registry maintainers to vendor those primitives into the private registry (see the registry's deployment doc). |
