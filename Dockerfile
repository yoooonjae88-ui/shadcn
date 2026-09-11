# syntax=docker/dockerfile:1

# ---- Install dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ---- Build registry + app ----
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# prebuild runs `shadcn build --output .registry` before `next build`
RUN pnpm run build

# ---- Production runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# The route handler reads .registry/ from process.cwd() at runtime; copy it
# explicitly in case the trace layout changes.
COPY --from=builder /app/.registry ./.registry

USER nextjs

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

# REGISTRY_TOKEN must be provided at runtime (e.g. --env-file .env.local)
CMD ["node", "server.js"]
