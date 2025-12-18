FROM node:24-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat curl

# Install dependencies only when needed
FROM base AS builder

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

ENV APP_ROLE=make-movies
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]