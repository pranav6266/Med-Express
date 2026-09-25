# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=5000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=build /app/dist ./dist
COPY server.js seeder.js ./
COPY controllers ./controllers
COPY data ./data
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY utils ./utils
RUN mkdir -p uploads && chown node:node uploads
USER node
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=3s --retries=6 CMD wget -qO- http://127.0.0.1:5000/ > /dev/null || exit 1
CMD ["node", "server.js"]
