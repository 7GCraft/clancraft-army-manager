FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci

COPY frontend frontend
RUN npm run build -w frontend


FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
RUN npm ci --omit=dev --workspace=clancraft-army-manager-backend --include-workspace-root=false \
  && npm cache clean --force

COPY --chown=node:node backend backend
COPY --from=build --chown=node:node /app/frontend/dist frontend/dist

USER node
EXPOSE 3000

CMD ["node", "backend/index.js"]
