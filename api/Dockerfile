FROM node:26-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY scripts ./scripts
COPY seed ./seed

RUN mkdir -p /app/data && chown -R node:node /app/data
USER node

EXPOSE 3000
VOLUME ["/app/data"]
CMD ["node", "src/server.ts"]
