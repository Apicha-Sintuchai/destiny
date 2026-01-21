FROM oven/bun:1.3 AS builder

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY prisma ./prisma
RUN bunx prisma generate

COPY . .

COPY next.config.ts ./next.config.ts

RUN echo "📦 next.config.ts content:" && cat next.config.ts

RUN bun run build

FROM oven/bun:1.3 AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/.env .env
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["bun", "start"]
