FROM node:22-bullseye AS builder
WORKDIR /app

# Enable corepack and use pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy sources and install
COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./
COPY . .
RUN pnpm install --frozen-lockfile

# Build frontend and server bundle
RUN pnpm build

FROM node:22-bullseye-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
