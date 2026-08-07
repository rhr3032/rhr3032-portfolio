FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 4000

ENV PORT=4000

CMD ["node", "dist/server/server.mjs"]
