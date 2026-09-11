# Adding Components & Deploying to an Air-Gapped Kubernetes Cluster

This document covers two things:

1. [How to add a new component to the registry manually](#part-1--adding-a-new-component-manually)
2. [How to deploy the registry in an air-gapped environment on Kubernetes](#part-2--deploying-to-an-air-gapped-kubernetes-cluster)

---

## Part 1 — Adding a new component manually

The registry pipeline has three stages: **sources** (`registry/`), **build** (`.registry/`, produced by `shadcn build`), and **serving** (`app/r/[name]/route.ts`). Adding a component touches the first two; the serving layer picks new items up automatically.

### Step 1: Create the source files

Create a folder under `registry/` named after the item, and put the source file(s) inside:

```
registry/
└── my-widget/
    └── my-widget.tsx
```

Rules for source files:

- Import shared code through the project aliases, e.g. `@/components/ui/button`, `@/lib/utils`. The shadcn CLI rewrites these paths when a consumer installs the item, so they resolve correctly in *their* project.
- Build on **Base UI** (`@base-ui/react/*`) primitives only. This project was deliberately migrated off Radix — do **not** import `radix-ui` / `@radix-ui/*`.
- A single item may contain multiple files (e.g. a component plus a helper hook); list each one in the manifest below.

Example (`registry/my-widget/my-widget.tsx`):

```tsx
import { Button } from "@/components/ui/button"

export function MyWidget() {
  return <Button>My Widget</Button>
}
```

### Step 2: Declare the item in `registry.json`

Add an entry to the `items` array in the root `registry.json`:

```jsonc
{
  "name": "my-widget",                       // must match the folder name; this is the install name
  "type": "registry:component",              // see type table below
  "title": "My Widget",
  "description": "A short description shown to consumers.",
  "registryDependencies": ["button"],        // other registry items this depends on (optional)
  "dependencies": ["date-fns"],              // npm packages to install in the consumer project (optional)
  "files": [
    {
      "path": "registry/my-widget/my-widget.tsx",
      "type": "registry:component"
    }
  ]
}
```

Common item/file types and where the shadcn CLI installs them in consumer projects:

| Type | Installed to (consumer) | Use for |
|---|---|---|
| `registry:ui` | `components/ui/` | UI primitives (button, tabs, card…) |
| `registry:component` | `components/` | Composed components |
| `registry:hook` | `hooks/` | React hooks |
| `registry:lib` | `lib/` | Utilities |

About `registryDependencies`:

- A bare name like `"button"` resolves against the **public shadcn registry** (`ui.shadcn.com`) using the consumer's configured style. Consumers need internet access for these (see the air-gap note in Part 2).
- To depend on another item from **this** registry, use the namespaced form: `"@private/use-debounce"`.

### Step 3: Register a live preview

Every item should render on the `/preview` page. Create a demo component next to the existing ones:

```tsx
// components/previews/my-widget-demo.tsx
import { MyWidget } from "@/registry/my-widget/my-widget"

export function MyWidgetDemo() {
  return <MyWidget />
}
```

Then register it in the `previews` map in `components/previews/index.tsx`:

```tsx
import { MyWidgetDemo } from "@/components/previews/my-widget-demo"

export const previews: Record<string, React.ComponentType> = {
  // ...existing entries
  "my-widget": MyWidgetDemo,
}
```

Items without a registered preview show a placeholder on `/preview`; the home page (`app/page.tsx`) lists items by reading `registry.json` directly, so it needs no changes.

### Step 4: Build the registry

```bash
pnpm registry:build
```

This runs `shadcn build --output .registry`, which inlines each item's file contents into `.registry/my-widget.json` plus an index at `.registry/registry.json`.

> **Do not change the output directory to `public/`.** The build output deliberately lives in `.registry/` (gitignored) so item JSON can never be fetched without passing the bearer-token check in `app/r/[name]/route.ts`. The `outputFileTracingIncludes` entry in `next.config.ts` bundles `.registry/` into the serverless function — if you ever move the output dir, update that too.

`pnpm dev` and `pnpm build` both rebuild the registry automatically via `predev`/`prebuild`, so in day-to-day dev you usually just restart/run the dev server.

### Step 5: Verify

With `pnpm dev` running and `REGISTRY_TOKEN` set in `.env.local`:

```bash
# Raw fetch — expect the item JSON
curl -H "Authorization: Bearer $REGISTRY_TOKEN" http://localhost:3000/r/my-widget.json

# Without the header — expect 401
curl -i http://localhost:3000/r/my-widget.json
```

End-to-end install test (this project self-consumes its own registry — `components.json` points `@private` at `http://localhost:3000`):

```bash
REGISTRY_TOKEN=<token> pnpm dlx shadcn add @private/my-widget
```

Finally, open `http://localhost:3000/preview` and confirm the demo renders.

### Checklist

- [ ] Source in `registry/<item-name>/`, Base UI only, alias imports
- [ ] Entry added to `registry.json` (name matches folder)
- [ ] Demo created and registered in `components/previews/index.tsx`
- [ ] `pnpm registry:build` succeeds
- [ ] `curl` with bearer token returns the item; without token returns 401
- [ ] Renders on `/preview`

---

## Part 2 — Deploying to an air-gapped Kubernetes cluster

### Strategy

`pnpm install`, `shadcn build`, and `next build` all need things an air-gapped network does not have (the npm registry). So the approach is:

> **Build the container image in a connected environment, transfer the image as an artifact into the air gap, and run it there.** Only the runtime needs to exist inside the air gap, and the runtime makes zero outbound calls.

If your organization instead mirrors npm internally (Verdaccio / Nexus / Artifactory), you *can* build inside the air gap — the app uses only system fonts (no `next/font/google`), so the build makes no outbound font requests. The image-transfer approach below avoids the npm-mirror requirement entirely and is recommended.

### Step 1: Enable standalone output

Add `output: "standalone"` to `next.config.ts` (keep the existing `outputFileTracingIncludes` — it is what pulls `.registry/` into the standalone server bundle):

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/r/[name]": ["./.registry/**/*"],
  },
};

export default nextConfig;
```

`next build` will then emit a self-contained server at `.next/standalone` that runs with `node server.js` and needs no `node_modules` at runtime.

### Step 2: Create the Dockerfile

```dockerfile
# ---- Stage 1: install dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: build (runs `registry:build` automatically via prebuild) ----
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ---- Stage 3: minimal runtime ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Standalone server (includes .registry/ via outputFileTracingIncludes)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets and public files are not copied into standalone automatically
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

Notes:

- `pnpm run build` triggers `prebuild` → `shadcn build --output .registry`, so the registry JSON is always rebuilt from sources inside the image — there is nothing to copy in from outside.
- `REGISTRY_TOKEN` is a **runtime** secret. Do not bake it into the image with `ENV`/`ARG`; it is injected by Kubernetes (Step 5).
- `.npmrc` is copied into the image so `enable-pre-post-scripts=true` applies during the build (it is what makes `prebuild` fire under pnpm).
- Add a `.dockerignore` with at least: `node_modules`, `.next`, `.registry`, `.env*`, `.git`.

Build and smoke-test on the connected machine:

```bash
docker build -t shadcn-private-registry:1.0.0 .
docker run --rm -p 3000:3000 -e REGISTRY_TOKEN=test-token shadcn-private-registry:1.0.0
curl -H "Authorization: Bearer test-token" http://localhost:3000/r/hello-world.json
```

### Step 3: Transfer the image into the air gap

On the connected side, export the image to a tarball:

```bash
docker save shadcn-private-registry:1.0.0 -o shadcn-private-registry_1.0.0.tar
sha256sum shadcn-private-registry_1.0.0.tar > shadcn-private-registry_1.0.0.tar.sha256
```

Move the tarball across the air gap via your approved transfer mechanism (removable media, data diode, transfer station). On the air-gapped side, verify the checksum, then load and push to the **internal** OCI registry the cluster pulls from:

```bash
sha256sum -c shadcn-private-registry_1.0.0.tar.sha256
docker load -i shadcn-private-registry_1.0.0.tar
docker tag shadcn-private-registry:1.0.0 registry.internal.example.com/platform/shadcn-private-registry:1.0.0
docker push registry.internal.example.com/platform/shadcn-private-registry:1.0.0
```

(If you prefer daemonless tooling, `skopeo copy docker-archive:… docker://…` or `crane push` work the same way.)

### Step 4: Create the namespace and token secret

Generate a strong token and store it as a Kubernetes Secret:

```bash
kubectl create namespace shadcn-registry

kubectl -n shadcn-registry create secret generic registry-token \
  --from-literal=REGISTRY_TOKEN="$(openssl rand -hex 32)"
```

Keep a copy of the token in your secrets manager — consumers need it to install components.

### Step 5: Deployment, Service, Ingress

`k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shadcn-registry
  namespace: shadcn-registry
spec:
  replicas: 2
  selector:
    matchLabels:
      app: shadcn-registry
  template:
    metadata:
      labels:
        app: shadcn-registry
    spec:
      containers:
        - name: shadcn-registry
          image: registry.internal.example.com/platform/shadcn-private-registry:1.0.0
          ports:
            - containerPort: 3000
          env:
            - name: REGISTRY_TOKEN
              valueFrom:
                secretKeyRef:
                  name: registry-token
                  key: REGISTRY_TOKEN
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: false   # Next.js writes to .next/cache at runtime
            runAsNonRoot: true
---
apiVersion: v1
kind: Service
metadata:
  name: shadcn-registry
  namespace: shadcn-registry
spec:
  selector:
    app: shadcn-registry
  ports:
    - port: 80
      targetPort: 3000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shadcn-registry
  namespace: shadcn-registry
  annotations:
    # adjust for your ingress controller / internal CA setup
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - registry.internal.example.com
      secretName: shadcn-registry-tls
  rules:
    - host: registry.internal.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: shadcn-registry
                port:
                  number: 80
```

Apply and verify:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl -n shadcn-registry rollout status deploy/shadcn-registry
```

Always serve over **TLS** — the bearer token travels in a header on every request. Inside an air gap that usually means a certificate from your internal CA (or cert-manager with an internal issuer).

### Step 6: Verify from inside the cluster network

```bash
TOKEN=$(kubectl -n shadcn-registry get secret registry-token -o jsonpath='{.data.REGISTRY_TOKEN}' | base64 -d)

# Index of all items
curl -H "Authorization: Bearer $TOKEN" https://registry.internal.example.com/r/registry.json

# A specific item
curl -H "Authorization: Bearer $TOKEN" https://registry.internal.example.com/r/hello-world.json

# No token → must be 401
curl -i https://registry.internal.example.com/r/hello-world.json
```

### Air-gap caveat: `registryDependencies` on public items

Items in this registry may declare `registryDependencies` like `"button"`, which the **consumer's** shadcn CLI resolves against the public `ui.shadcn.com`. Fully air-gapped consumers cannot reach it. Options:

1. **Vendor the dependency**: copy the needed shadcn/Base UI primitives into this registry as `registry:ui` items and reference them as `"@private/button"` instead.
2. **Pre-install**: have consumers install the public primitives once while connected (or from a vendored snapshot), so the dependency already exists and the CLI skips fetching it.

Option 1 makes the registry fully self-contained and is the right long-term answer for a true air gap.

### Operations

- **Releasing changes**: every component change requires a new image (the registry JSON is baked in at build time). Bump the image tag, rebuild, re-transfer, and `kubectl set image` / re-apply. Treat the image tag as the registry version.
- **Token rotation**: update the Secret (`kubectl -n shadcn-registry create secret generic registry-token --from-literal=REGISTRY_TOKEN=<new> --dry-run=client -o yaml | kubectl apply -f -`), restart the deployment (`kubectl -n shadcn-registry rollout restart deploy/shadcn-registry` — env vars from secrets are read at pod start), then distribute the new token to consumers.
- **Note on auth granularity**: there is a single shared token; everyone with it can fetch every item. If you need per-team tokens or audit trails, front the service with your internal API gateway.
