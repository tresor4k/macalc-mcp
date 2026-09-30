FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
# src first: the "prepare" script checks src/index.js during install
COPY src ./src
RUN npm ci --omit=dev || npm install --omit=dev

COPY README.md LICENSE server.json ./

USER node

ENV NODE_ENV=production

ENTRYPOINT ["node", "src/index.js"]
