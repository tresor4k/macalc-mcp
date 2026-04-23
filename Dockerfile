FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY src ./src
COPY README.md LICENSE server.json ./

USER node

ENV NODE_ENV=production

ENTRYPOINT ["node", "src/index.js"]
