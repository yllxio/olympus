FROM node:22-bookworm-slim
WORKDIR /app
ENV WRANGLER_SEND_METRICS=false
ENV CLOUDFLARE_CF_FETCH_ENABLED=false
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile
COPY . .
RUN corepack pnpm build
EXPOSE 3000
CMD ["node", "scripts/docker-start.mjs"]
